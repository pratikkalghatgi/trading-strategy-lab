(function () {
  const cacheStore = new WeakMap();

  function getLocalCache(candles) {
    let bucket = cacheStore.get(candles);
    if (!bucket) {
      bucket = new Map();
      cacheStore.set(candles, bucket);
    }
    return bucket;
  }

  function cached(candles, key, compute) {
    const bucket = getLocalCache(candles);
    if (bucket.has(key)) return bucket.get(key);
    const value = compute();
    bucket.set(key, value);
    return value;
  }

  function toNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function normalizePeriod(value, fallback) {
    return Math.max(1, Math.round(toNumber(value, fallback)));
  }

  function source(candles, field) {
    return cached(candles, "src:" + field, function computeSource() {
      return candles.map(function mapField(candle) {
        return candle[field];
      });
    });
  }

  function smaArray(values, period) {
    const n = values.length;
    const out = new Array(n).fill(null);
    if (n === 0 || period <= 0) return out;

    let sum = 0;
    for (let i = 0; i < n; i += 1) {
      sum += values[i];
      if (i >= period) sum -= values[i - period];
      if (i >= period - 1) out[i] = sum / period;
    }
    return out;
  }

  function smaNullable(values, period) {
    const n = values.length;
    const out = new Array(n).fill(null);
    if (period <= 0) return out;

    let sum = 0;
    let count = 0;

    for (let i = 0; i < n; i += 1) {
      const current = values[i];
      if (current !== null && Number.isFinite(current)) {
        sum += current;
        count += 1;
      }

      if (i >= period) {
        const removed = values[i - period];
        if (removed !== null && Number.isFinite(removed)) {
          sum -= removed;
          count -= 1;
        }
      }

      if (i >= period - 1 && count === period) {
        out[i] = sum / period;
      }
    }

    return out;
  }

  function emaArray(values, period) {
    const n = values.length;
    const out = new Array(n).fill(null);
    if (n < period || period <= 0) return out;

    let seed = 0;
    for (let i = 0; i < period; i += 1) seed += values[i];

    const alpha = 2 / (period + 1);
    let prev = seed / period;
    out[period - 1] = prev;

    for (let i = period; i < n; i += 1) {
      prev = values[i] * alpha + prev * (1 - alpha);
      out[i] = prev;
    }

    return out;
  }

  function emaNullable(values, period) {
    const n = values.length;
    const out = new Array(n).fill(null);
    const cleanValues = [];
    const cleanIndices = [];

    for (let i = 0; i < n; i += 1) {
      const value = values[i];
      if (value !== null && Number.isFinite(value)) {
        cleanValues.push(value);
        cleanIndices.push(i);
      }
    }

    const cleanEma = emaArray(cleanValues, period);
    for (let i = 0; i < cleanIndices.length; i += 1) {
      out[cleanIndices[i]] = cleanEma[i];
    }

    return out;
  }

  function rsi(candles, period, field) {
    const lookback = normalizePeriod(period, 14);
    const srcField = field || "close";
    return cached(candles, "rsi:" + srcField + ":" + lookback, function computeRSI() {
      const closes = source(candles, srcField);
      const n = closes.length;
      const out = new Array(n).fill(null);
      if (n <= lookback) return out;

      let gainSum = 0;
      let lossSum = 0;

      for (let i = 1; i <= lookback; i += 1) {
        const delta = closes[i] - closes[i - 1];
        if (delta >= 0) gainSum += delta;
        else lossSum += -delta;
      }

      let avgGain = gainSum / lookback;
      let avgLoss = lossSum / lookback;
      out[lookback] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

      for (let i = lookback + 1; i < n; i += 1) {
        const delta = closes[i] - closes[i - 1];
        const gain = delta > 0 ? delta : 0;
        const loss = delta < 0 ? -delta : 0;

        avgGain = (avgGain * (lookback - 1) + gain) / lookback;
        avgLoss = (avgLoss * (lookback - 1) + loss) / lookback;

        out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
      }

      return out;
    });
  }

  function atr(candles, period) {
    const lookback = normalizePeriod(period, 14);
    return cached(candles, "atr:" + lookback, function computeATR() {
      const highs = source(candles, "high");
      const lows = source(candles, "low");
      const closes = source(candles, "close");
      const n = candles.length;
      const out = new Array(n).fill(null);
      if (n <= lookback) return out;

      const tr = new Array(n).fill(null);
      tr[0] = highs[0] - lows[0];
      for (let i = 1; i < n; i += 1) {
        const range1 = highs[i] - lows[i];
        const range2 = Math.abs(highs[i] - closes[i - 1]);
        const range3 = Math.abs(lows[i] - closes[i - 1]);
        tr[i] = Math.max(range1, range2, range3);
      }

      let trSum = 0;
      for (let i = 1; i <= lookback; i += 1) trSum += tr[i];
      let prevAtr = trSum / lookback;
      out[lookback] = prevAtr;

      for (let i = lookback + 1; i < n; i += 1) {
        prevAtr = (prevAtr * (lookback - 1) + tr[i]) / lookback;
        out[i] = prevAtr;
      }

      return out;
    });
  }

  function stochastic(candles, options) {
    const opts = options || {};
    const kPeriod = normalizePeriod(opts.kPeriod, 14);
    const dPeriod = normalizePeriod(opts.dPeriod, 3);
    const smoothK = normalizePeriod(opts.smoothK, 3);

    return cached(
      candles,
      "stoch:" + kPeriod + ":" + dPeriod + ":" + smoothK,
      function computeStochastic() {
        const highs = source(candles, "high");
        const lows = source(candles, "low");
        const closes = source(candles, "close");
        const n = candles.length;

        const rawK = new Array(n).fill(null);
        for (let i = kPeriod - 1; i < n; i += 1) {
          let highest = -Infinity;
          let lowest = Infinity;
          for (let j = i - kPeriod + 1; j <= i; j += 1) {
            if (highs[j] > highest) highest = highs[j];
            if (lows[j] < lowest) lowest = lows[j];
          }

          const range = highest - lowest;
          rawK[i] = range === 0 ? 50 : ((closes[i] - lowest) / range) * 100;
        }

        const k = smaNullable(rawK, smoothK);
        const d = smaNullable(k, dPeriod);

        return {
          rawK,
          k,
          d,
        };
      }
    );
  }

  function bollinger(candles, period, stdMultiplier, field) {
    const lookback = normalizePeriod(period, 20);
    const mult = toNumber(stdMultiplier, 2);
    const srcField = field || "close";

    return cached(
      candles,
      "bb:" + srcField + ":" + lookback + ":" + mult,
      function computeBollinger() {
        const values = source(candles, srcField);
        const n = values.length;
        const middle = new Array(n).fill(null);
        const upper = new Array(n).fill(null);
        const lower = new Array(n).fill(null);

        let sum = 0;
        let sumSq = 0;

        for (let i = 0; i < n; i += 1) {
          sum += values[i];
          sumSq += values[i] * values[i];

          if (i >= lookback) {
            const removed = values[i - lookback];
            sum -= removed;
            sumSq -= removed * removed;
          }

          if (i >= lookback - 1) {
            const mean = sum / lookback;
            const variance = Math.max(0, sumSq / lookback - mean * mean);
            const stdDev = Math.sqrt(variance);
            middle[i] = mean;
            upper[i] = mean + mult * stdDev;
            lower[i] = mean - mult * stdDev;
          }
        }

        return {
          middle,
          upper,
          lower,
          bandwidth: middle.map(function mapBandwidth(value, i) {
            if (value === null || value === 0 || upper[i] === null || lower[i] === null) return null;
            return (upper[i] - lower[i]) / value;
          }),
        };
      }
    );
  }

  function macd(candles, fastPeriod, slowPeriod, signalPeriod, field) {
    const fast = normalizePeriod(fastPeriod, 12);
    const slow = normalizePeriod(slowPeriod, 26);
    const signalLen = normalizePeriod(signalPeriod, 9);
    const srcField = field || "close";

    return cached(
      candles,
      "macd:" + srcField + ":" + fast + ":" + slow + ":" + signalLen,
      function computeMACD() {
        const values = source(candles, srcField);
        const fastEma = emaArray(values, fast);
        const slowEma = emaArray(values, slow);

        const line = values.map(function mapLine(_, i) {
          if (fastEma[i] === null || slowEma[i] === null) return null;
          return fastEma[i] - slowEma[i];
        });

        const signal = emaNullable(line, signalLen);
        const histogram = line.map(function mapHistogram(value, i) {
          if (value === null || signal[i] === null) return null;
          return value - signal[i];
        });

        return {
          line,
          signal,
          histogram,
        };
      }
    );
  }

  function adx(candles, period) {
    const lookback = normalizePeriod(period, 14);

    return cached(candles, "adx:" + lookback, function computeADX() {
      const highs = source(candles, "high");
      const lows = source(candles, "low");
      const closes = source(candles, "close");
      const n = candles.length;

      const plusDI = new Array(n).fill(null);
      const minusDI = new Array(n).fill(null);
      const dx = new Array(n).fill(null);
      const adxOut = new Array(n).fill(null);

      if (n <= lookback * 2) {
        return { plusDI, minusDI, dx, adx: adxOut };
      }

      const tr = new Array(n).fill(0);
      const plusDM = new Array(n).fill(0);
      const minusDM = new Array(n).fill(0);

      for (let i = 1; i < n; i += 1) {
        const upMove = highs[i] - highs[i - 1];
        const downMove = lows[i - 1] - lows[i];

        plusDM[i] = upMove > downMove && upMove > 0 ? upMove : 0;
        minusDM[i] = downMove > upMove && downMove > 0 ? downMove : 0;

        const range1 = highs[i] - lows[i];
        const range2 = Math.abs(highs[i] - closes[i - 1]);
        const range3 = Math.abs(lows[i] - closes[i - 1]);
        tr[i] = Math.max(range1, range2, range3);
      }

      let trSmooth = 0;
      let plusSmooth = 0;
      let minusSmooth = 0;

      for (let i = 1; i <= lookback; i += 1) {
        trSmooth += tr[i];
        plusSmooth += plusDM[i];
        minusSmooth += minusDM[i];
      }

      plusDI[lookback] = trSmooth === 0 ? 0 : (100 * plusSmooth) / trSmooth;
      minusDI[lookback] = trSmooth === 0 ? 0 : (100 * minusSmooth) / trSmooth;
      dx[lookback] =
        plusDI[lookback] + minusDI[lookback] === 0
          ? 0
          : (100 * Math.abs(plusDI[lookback] - minusDI[lookback])) / (plusDI[lookback] + minusDI[lookback]);

      for (let i = lookback + 1; i < n; i += 1) {
        trSmooth = trSmooth - trSmooth / lookback + tr[i];
        plusSmooth = plusSmooth - plusSmooth / lookback + plusDM[i];
        minusSmooth = minusSmooth - minusSmooth / lookback + minusDM[i];

        plusDI[i] = trSmooth === 0 ? 0 : (100 * plusSmooth) / trSmooth;
        minusDI[i] = trSmooth === 0 ? 0 : (100 * minusSmooth) / trSmooth;

        const diSum = plusDI[i] + minusDI[i];
        dx[i] = diSum === 0 ? 0 : (100 * Math.abs(plusDI[i] - minusDI[i])) / diSum;
      }

      let dxSeed = 0;
      for (let i = lookback; i < lookback * 2; i += 1) dxSeed += dx[i] || 0;

      adxOut[lookback * 2 - 1] = dxSeed / lookback;

      for (let i = lookback * 2; i < n; i += 1) {
        adxOut[i] = ((adxOut[i - 1] * (lookback - 1)) + (dx[i] || 0)) / lookback;
      }

      return {
        plusDI,
        minusDI,
        dx,
        adx: adxOut,
      };
    });
  }

  function vwap(candles) {
    return cached(candles, "vwap", function computeVWAP() {
      const out = new Array(candles.length).fill(null);
      let cumulativeVolume = 0;
      let cumulativePV = 0;

      for (let i = 0; i < candles.length; i += 1) {
        const typical = (candles[i].high + candles[i].low + candles[i].close) / 3;
        cumulativeVolume += candles[i].volume;
        cumulativePV += typical * candles[i].volume;
        out[i] = cumulativeVolume === 0 ? null : cumulativePV / cumulativeVolume;
      }

      return out;
    });
  }

  function anchoredVwap(candles, anchorIndex) {
    const anchor = Math.max(0, Math.min(candles.length - 1, Math.round(toNumber(anchorIndex, 0))));
    return cached(candles, "avwap:" + anchor, function computeAnchoredVWAP() {
      const out = new Array(candles.length).fill(null);
      let cumulativeVolume = 0;
      let cumulativePV = 0;

      for (let i = anchor; i < candles.length; i += 1) {
        const typical = (candles[i].high + candles[i].low + candles[i].close) / 3;
        cumulativeVolume += candles[i].volume;
        cumulativePV += typical * candles[i].volume;
        out[i] = cumulativeVolume === 0 ? null : cumulativePV / cumulativeVolume;
      }

      return out;
    });
  }

  function donchian(candles, period) {
    const lookback = normalizePeriod(period, 20);

    return cached(candles, "donchian:" + lookback, function computeDonchian() {
      const highs = source(candles, "high");
      const lows = source(candles, "low");
      const n = candles.length;

      const upper = new Array(n).fill(null);
      const lower = new Array(n).fill(null);
      const middle = new Array(n).fill(null);

      for (let i = lookback - 1; i < n; i += 1) {
        let highMax = -Infinity;
        let lowMin = Infinity;

        for (let j = i - lookback + 1; j <= i; j += 1) {
          if (highs[j] > highMax) highMax = highs[j];
          if (lows[j] < lowMin) lowMin = lows[j];
        }

        upper[i] = highMax;
        lower[i] = lowMin;
        middle[i] = (highMax + lowMin) / 2;
      }

      return { upper, lower, middle };
    });
  }

  function supertrend(candles, period, multiplier) {
    const lookback = normalizePeriod(period, 10);
    const mult = toNumber(multiplier, 3);

    return cached(
      candles,
      "supertrend:" + lookback + ":" + mult,
      function computeSupertrend() {
        const highs = source(candles, "high");
        const lows = source(candles, "low");
        const closes = source(candles, "close");
        const atrValues = atr(candles, lookback);

        const n = candles.length;
        const upperBand = new Array(n).fill(null);
        const lowerBand = new Array(n).fill(null);
        const line = new Array(n).fill(null);
        const trend = new Array(n).fill(0);

        let start = -1;
        for (let i = 0; i < n; i += 1) {
          if (atrValues[i] !== null) {
            start = i;
            break;
          }
        }

        if (start === -1) return { upperBand, lowerBand, line, trend };

        for (let i = start; i < n; i += 1) {
          const hl2 = (highs[i] + lows[i]) / 2;
          const basicUpper = hl2 + mult * atrValues[i];
          const basicLower = hl2 - mult * atrValues[i];

          if (i === start) {
            upperBand[i] = basicUpper;
            lowerBand[i] = basicLower;
            line[i] = closes[i] <= basicUpper ? basicUpper : basicLower;
            trend[i] = closes[i] >= line[i] ? 1 : -1;
            continue;
          }

          upperBand[i] =
            basicUpper < upperBand[i - 1] || closes[i - 1] > upperBand[i - 1]
              ? basicUpper
              : upperBand[i - 1];

          lowerBand[i] =
            basicLower > lowerBand[i - 1] || closes[i - 1] < lowerBand[i - 1]
              ? basicLower
              : lowerBand[i - 1];

          const prevLine = line[i - 1];

          if (prevLine === upperBand[i - 1]) {
            line[i] = closes[i] <= upperBand[i] ? upperBand[i] : lowerBand[i];
          } else {
            line[i] = closes[i] >= lowerBand[i] ? lowerBand[i] : upperBand[i];
          }

          trend[i] = closes[i] >= line[i] ? 1 : -1;
        }

        return {
          upperBand,
          lowerBand,
          line,
          trend,
        };
      }
    );
  }

  function parabolicSAR(candles, step, maxStep) {
    const afStep = toNumber(step, 0.02);
    const afMax = toNumber(maxStep, 0.2);

    return cached(candles, "psar:" + afStep + ":" + afMax, function computePSAR() {
      const highs = source(candles, "high");
      const lows = source(candles, "low");
      const closes = source(candles, "close");
      const n = candles.length;

      const sar = new Array(n).fill(null);
      const trend = new Array(n).fill(0);

      if (n < 3) return { sar, trend };

      let isUp = closes[1] >= closes[0];
      let ep = isUp ? Math.max(highs[0], highs[1]) : Math.min(lows[0], lows[1]);
      let af = afStep;
      sar[1] = isUp ? Math.min(lows[0], lows[1]) : Math.max(highs[0], highs[1]);
      trend[1] = isUp ? 1 : -1;

      for (let i = 2; i < n; i += 1) {
        let nextSar = sar[i - 1] + af * (ep - sar[i - 1]);

        if (isUp) {
          nextSar = Math.min(nextSar, lows[i - 1], lows[i - 2]);

          if (lows[i] < nextSar) {
            isUp = false;
            nextSar = ep;
            ep = lows[i];
            af = afStep;
          } else {
            if (highs[i] > ep) {
              ep = highs[i];
              af = Math.min(af + afStep, afMax);
            }
          }
        } else {
          nextSar = Math.max(nextSar, highs[i - 1], highs[i - 2]);

          if (highs[i] > nextSar) {
            isUp = true;
            nextSar = ep;
            ep = highs[i];
            af = afStep;
          } else {
            if (lows[i] < ep) {
              ep = lows[i];
              af = Math.min(af + afStep, afMax);
            }
          }
        }

        sar[i] = nextSar;
        trend[i] = isUp ? 1 : -1;
      }

      return { sar, trend };
    });
  }

  function ichimoku(candles, conversionPeriod, basePeriod, spanBPeriod) {
    const conv = normalizePeriod(conversionPeriod, 9);
    const base = normalizePeriod(basePeriod, 26);
    const spanB = normalizePeriod(spanBPeriod, 52);

    return cached(candles, "ichimoku:" + conv + ":" + base + ":" + spanB, function computeIchimoku() {
      const highs = source(candles, "high");
      const lows = source(candles, "low");
      const n = candles.length;

      const tenkan = new Array(n).fill(null);
      const kijun = new Array(n).fill(null);
      const spanA = new Array(n).fill(null);
      const spanBOut = new Array(n).fill(null);

      function highestHigh(from, to) {
        let max = -Infinity;
        for (let i = from; i <= to; i += 1) {
          if (highs[i] > max) max = highs[i];
        }
        return max;
      }

      function lowestLow(from, to) {
        let min = Infinity;
        for (let i = from; i <= to; i += 1) {
          if (lows[i] < min) min = lows[i];
        }
        return min;
      }

      for (let i = conv - 1; i < n; i += 1) {
        tenkan[i] = (highestHigh(i - conv + 1, i) + lowestLow(i - conv + 1, i)) / 2;
      }

      for (let i = base - 1; i < n; i += 1) {
        kijun[i] = (highestHigh(i - base + 1, i) + lowestLow(i - base + 1, i)) / 2;
      }

      for (let i = 0; i < n; i += 1) {
        if (tenkan[i] !== null && kijun[i] !== null) {
          spanA[i] = (tenkan[i] + kijun[i]) / 2;
        }
      }

      for (let i = spanB - 1; i < n; i += 1) {
        spanBOut[i] = (highestHigh(i - spanB + 1, i) + lowestLow(i - spanB + 1, i)) / 2;
      }

      return {
        tenkan,
        kijun,
        spanA,
        spanB: spanBOut,
      };
    });
  }

  function sma(candles, period, field) {
    const lookback = normalizePeriod(period, 20);
    const srcField = field || "close";
    return cached(candles, "sma:" + srcField + ":" + lookback, function computeSMA() {
      return smaArray(source(candles, srcField), lookback);
    });
  }

  function ema(candles, period, field) {
    const lookback = normalizePeriod(period, 20);
    const srcField = field || "close";
    return cached(candles, "ema:" + srcField + ":" + lookback, function computeEMA() {
      return emaArray(source(candles, srcField), lookback);
    });
  }

  window.IndicatorEngine = {
    cacheStore,
    cached,
    source,
    sma,
    ema,
    rsi,
    atr,
    stochastic,
    bollinger,
    macd,
    adx,
    vwap,
    anchoredVwap,
    donchian,
    supertrend,
    parabolicSAR,
    ichimoku,
    utils: {
      smaArray,
      smaNullable,
      emaArray,
      emaNullable,
      toNumber,
      normalizePeriod,
    },
  };
})();
