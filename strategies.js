(function () {
  const I = window.IndicatorEngine;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, digits) {
    const precision = Math.pow(10, digits || 4);
    return Math.round(value * precision) / precision;
  }

  function fmt(value, digits) {
    if (!Number.isFinite(value)) return "n/a";
    return value.toFixed(digits || 2);
  }

  function crossedAbove(a, b, i) {
    if (i <= 0) return false;
    const currA = a[i];
    const currB = b[i];
    const prevA = a[i - 1];
    const prevB = b[i - 1];
    if (![currA, currB, prevA, prevB].every(Number.isFinite)) return false;
    return prevA <= prevB && currA > currB;
  }

  function crossedBelow(a, b, i) {
    if (i <= 0) return false;
    const currA = a[i];
    const currB = b[i];
    const prevA = a[i - 1];
    const prevB = b[i - 1];
    if (![currA, currB, prevA, prevB].every(Number.isFinite)) return false;
    return prevA >= prevB && currA < currB;
  }

  function windowHigh(candles, index, lookback) {
    let high = -Infinity;
    const from = Math.max(0, index - lookback + 1);
    for (let i = from; i <= index; i += 1) {
      if (candles[i].high > high) high = candles[i].high;
    }
    return high;
  }

  function windowLow(candles, index, lookback) {
    let low = Infinity;
    const from = Math.max(0, index - lookback + 1);
    for (let i = from; i <= index; i += 1) {
      if (candles[i].low < low) low = candles[i].low;
    }
    return low;
  }

  function slope(values, index, lookback) {
    const lb = Math.max(1, lookback || 3);
    if (index - lb < 0) return 0;
    if (!Number.isFinite(values[index]) || !Number.isFinite(values[index - lb])) return 0;
    return (values[index] - values[index - lb]) / lb;
  }

  function closestSwingLow(candles, index, lookback) {
    return windowLow(candles, index, lookback || 10);
  }

  function closestSwingHigh(candles, index, lookback) {
    return windowHigh(candles, index, lookback || 10);
  }

  function recentRange(candles, index, lookback) {
    const hi = windowHigh(candles, index, lookback || 20);
    const lo = windowLow(candles, index, lookback || 20);
    return {
      high: hi,
      low: lo,
      size: hi - lo,
    };
  }

  function buildSignal(index, direction, reason, values) {
    return {
      id: direction + "-" + index + "-" + Math.random().toString(36).slice(2, 8),
      index,
      direction,
      reason,
      values: values || {},
    };
  }

  function riskTarget(entry, stop, rr, direction) {
    const risk = Math.max(0.0001, Math.abs(entry - stop));
    if (direction === "long") return entry + risk * rr;
    return entry - risk * rr;
  }

  function sanitizeDirectionLevels(direction, entry, stop, target) {
    let safeStop = stop;
    let safeTarget = target;

    if (!Number.isFinite(safeStop)) {
      safeStop = direction === "long" ? entry * 0.99 : entry * 1.01;
    }

    if (!Number.isFinite(safeTarget)) {
      safeTarget = direction === "long" ? entry * 1.02 : entry * 0.98;
    }

    if (direction === "long") {
      if (safeStop >= entry) safeStop = entry * 0.995;
      if (safeTarget <= entry) safeTarget = entry + Math.abs(entry - safeStop) * 2;
    } else {
      if (safeStop <= entry) safeStop = entry * 1.005;
      if (safeTarget >= entry) safeTarget = entry - Math.abs(entry - safeStop) * 2;
    }

    return {
      stop: safeStop,
      target: safeTarget,
    };
  }

  function chooseAnchorIndex(candles, lookback) {
    const lb = Math.max(10, lookback || 180);
    const start = Math.max(0, candles.length - lb);
    let anchor = start;
    let maxVolume = -Infinity;
    for (let i = start; i < candles.length; i += 1) {
      if (candles[i].volume > maxVolume) {
        maxVolume = candles[i].volume;
        anchor = i;
      }
    }
    return anchor;
  }

  function defaultParams(strategy) {
    const params = {};
    const schema = strategy.parameters || {};
    Object.keys(schema).forEach(function eachKey(key) {
      params[key] = schema[key].default;
    });
    return params;
  }

  function validateParams(strategy, incoming) {
    const schema = strategy.parameters || {};
    const validated = {};

    Object.keys(schema).forEach(function eachParam(key) {
      const config = schema[key];
      const fallback = config.default;
      let value = Number(incoming && incoming[key]);
      if (!Number.isFinite(value)) value = fallback;

      if (Number.isFinite(config.min)) value = Math.max(config.min, value);
      if (Number.isFinite(config.max)) value = Math.min(config.max, value);

      if (config.type === "int") value = Math.round(value);
      if (typeof config.transform === "function") value = config.transform(value);

      validated[key] = value;
    });

    return validated;
  }

  function lineOverlay(id, label, values, color, width, style) {
    return {
      id,
      label,
      type: "line",
      values,
      color,
      lineWidth: width || 2,
      lineStyle: style || "solid",
    };
  }

  function getMACDStochAlignment(stoch, i, direction, windowSize) {
    const window = Math.max(1, windowSize || 3);
    for (let j = Math.max(1, i - window); j <= i; j += 1) {
      if (direction === "long" && crossedAbove(stoch.k, stoch.d, j)) return true;
      if (direction === "short" && crossedBelow(stoch.k, stoch.d, j)) return true;
    }
    return false;
  }

  const strategies = [
    {
      id: "s01",
      name: "200 EMA Trend Filter plus Stochastic Crossover",
      description:
        "Trend-following setup that uses a long-term EMA filter and stochastic timing for entries after momentum resets.",
      marketCondition: "Trending market",
      setup:
        "Daily chart trend is bullish when price is above 200 EMA, bearish when below",
      trigger:
        "On 1 hour chart, Stochastic crosses below 20 then turns up for longs, above 80 then turns down for shorts",
      confirmation:
        "Higher timeframe trend agrees, structure support or resistance nearby",
      stopText:
        "Below the recent 1 hour swing low for longs, above swing high for shorts",
      targetText:
        "Prior swing high or low, or trail with a short moving average",
      bestTimeframe: "Daily for bias, 1 hour for entries",
      parameters: {
        trendEma: { label: "Trend EMA", type: "int", min: 100, max: 300, step: 1, default: 200 },
        stochLength: { label: "Stochastic Length", type: "int", min: 5, max: 30, step: 1, default: 14 },
        stochSignal: { label: "Stochastic Signal", type: "int", min: 2, max: 10, step: 1, default: 3 },
        swingLookback: { label: "Swing Lookback", type: "int", min: 4, max: 40, step: 1, default: 10 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const candles = ctx.candles;
        const p = ctx.params;
        const emaTrend = I.ema(candles, p.trendEma, "close");
        const stoch = I.stochastic(candles, {
          kPeriod: p.stochLength,
          dPeriod: p.stochSignal,
          smoothK: 3,
        });
        const out = [];

        for (let i = 2; i < candles.length - 1; i += 1) {
          const price = candles[i].close;
          const trend = emaTrend[i];
          const k = stoch.k[i];
          const d = stoch.d[i];
          if (![price, trend, k, d].every(Number.isFinite)) continue;

          const longSignal =
            price > trend && crossedAbove(stoch.k, stoch.d, i) && stoch.k[i - 1] < 20;
          const shortSignal =
            price < trend && crossedBelow(stoch.k, stoch.d, i) && stoch.k[i - 1] > 80;

          if (longSignal) {
            out.push(
              buildSignal(
                i,
                "long",
                "Price above EMA " + fmt(trend) + "; Stoch K/D bullish crossover at " + fmt(k, 1) + "/" + fmt(d, 1),
                { ema: trend, stochK: k, stochD: d }
              )
            );
          }

          if (shortSignal) {
            out.push(
              buildSignal(
                i,
                "short",
                "Price below EMA " + fmt(trend) + "; Stoch K/D bearish crossover at " + fmt(k, 1) + "/" + fmt(d, 1),
                { ema: trend, stochK: k, stochD: d }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const p = ctx.params;
        const i = signalObj.index;
        if (signalObj.direction === "long") {
          return closestSwingLow(ctx.candles, i, p.swingLookback) * 0.998;
        }
        return closestSwingHigh(ctx.candles, i, p.swingLookback) * 1.002;
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        return riskTarget(entryPrice, stopPrice, ctx.params.rr, signalObj.direction);
      },
      overlay: function overlay(ctx) {
        const emaTrend = I.ema(ctx.candles, ctx.params.trendEma, "close");
        return [lineOverlay("emaTrend", "EMA " + ctx.params.trendEma, emaTrend, "#2f9e8f", 2)];
      },
    },
    {
      id: "s02",
      name: "Bollinger Band Squeeze plus RSI Exhaustion",
      description:
        "Looks for low-volatility squeezes that resolve with expansion while RSI confirms directional participation.",
      marketCondition: "Low volatility compression, expecting expansion",
      setup: "Bands narrow and price consolidates",
      trigger:
        "Candle closes outside upper band for long or lower band for short",
      confirmation: "RSI aligns with the move and recent structure breaks",
      stopText: "Inside the squeeze range on the opposite side",
      targetText:
        "Measured move based on prior range height, or next major level",
      bestTimeframe: "1 hour to daily",
      parameters: {
        bbLength: { label: "BB Length", type: "int", min: 10, max: 60, step: 1, default: 20 },
        bbStd: { label: "BB Std Dev", type: "float", min: 1, max: 4, step: 0.1, default: 2 },
        rsiPeriod: { label: "RSI Period", type: "int", min: 5, max: 30, step: 1, default: 14 },
        squeezeThreshold: {
          label: "Squeeze Threshold",
          type: "float",
          min: 0.01,
          max: 0.2,
          step: 0.005,
          default: 0.045,
        },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const p = ctx.params;
        const candles = ctx.candles;
        const bb = I.bollinger(candles, p.bbLength, p.bbStd, "close");
        const rsi = I.rsi(candles, p.rsiPeriod, "close");
        const out = [];

        for (let i = p.bbLength; i < candles.length - 1; i += 1) {
          if (![bb.upper[i], bb.lower[i], bb.bandwidth[i], rsi[i]].every(Number.isFinite)) continue;

          const squeeze = bb.bandwidth[i] <= p.squeezeThreshold;
          const close = candles[i].close;

          if (squeeze && close > bb.upper[i] && rsi[i] > 55) {
            out.push(
              buildSignal(
                i,
                "long",
                "BB squeeze bandwidth " + fmt(bb.bandwidth[i], 4) + " and close broke upper band; RSI " + fmt(rsi[i], 1),
                { bandwidth: bb.bandwidth[i], rsi: rsi[i], upper: bb.upper[i] }
              )
            );
          }

          if (squeeze && close < bb.lower[i] && rsi[i] < 45) {
            out.push(
              buildSignal(
                i,
                "short",
                "BB squeeze bandwidth " + fmt(bb.bandwidth[i], 4) + " and close broke lower band; RSI " + fmt(rsi[i], 1),
                { bandwidth: bb.bandwidth[i], rsi: rsi[i], lower: bb.lower[i] }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const p = ctx.params;
        const bb = I.bollinger(ctx.candles, p.bbLength, p.bbStd, "close");
        const i = signalObj.index;
        if (signalObj.direction === "long") {
          return Math.min(bb.middle[i] || Infinity, closestSwingLow(ctx.candles, i, p.bbLength / 2));
        }
        return Math.max(bb.middle[i] || -Infinity, closestSwingHigh(ctx.candles, i, p.bbLength / 2));
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        const p = ctx.params;
        const bb = I.bollinger(ctx.candles, p.bbLength, p.bbStd, "close");
        const i = signalObj.index;
        const range = Number.isFinite(bb.upper[i]) && Number.isFinite(bb.lower[i]) ? bb.upper[i] - bb.lower[i] : Math.abs(entryPrice - stopPrice);
        const projected = signalObj.direction === "long" ? entryPrice + range : entryPrice - range;
        const rrTarget = riskTarget(entryPrice, stopPrice, p.rr, signalObj.direction);
        if (signalObj.direction === "long") return Math.max(projected, rrTarget);
        return Math.min(projected, rrTarget);
      },
      overlay: function overlay(ctx) {
        const p = ctx.params;
        const bb = I.bollinger(ctx.candles, p.bbLength, p.bbStd, "close");
        return [
          lineOverlay("bbUpper", "BB Upper", bb.upper, "#ff8c42", 1),
          lineOverlay("bbMiddle", "BB Middle", bb.middle, "#4f6d7a", 1),
          lineOverlay("bbLower", "BB Lower", bb.lower, "#ff8c42", 1),
        ];
      },
    },
    {
      id: "s03",
      name: "Anchored VWAP Rejection plus Volume Spike",
      description:
        "Finds rejection entries around anchored VWAP where a volume expansion confirms participation.",
      marketCondition: "Mean reversion to a key anchored level",
      setup: "Anchor VWAP to a major swing high or low",
      trigger:
        "Price retests anchored VWAP and prints a rejection candle",
      confirmation:
        "Volume on the rejection candle is higher than recent average",
      stopText:
        "Beyond the rejection candle wick and beyond the VWAP zone",
      targetText: "Prior swing level, or trail partial position",
      bestTimeframe: "5 minute to 1 hour for entries, daily for context",
      parameters: {
        anchorLookback: { label: "Anchor Lookback", type: "int", min: 60, max: 800, step: 10, default: 220 },
        volPeriod: { label: "Volume SMA", type: "int", min: 5, max: 80, step: 1, default: 20 },
        volSpike: { label: "Volume Spike x", type: "float", min: 1, max: 4, step: 0.1, default: 1.3 },
        atrPeriod: { label: "ATR Period", type: "int", min: 5, max: 50, step: 1, default: 14 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const p = ctx.params;
        const candles = ctx.candles;
        const anchorIndex = chooseAnchorIndex(candles, p.anchorLookback);
        const avwap = I.anchoredVwap(candles, anchorIndex);
        const dayVwap = I.vwap(candles);
        const volSma = I.sma(candles, p.volPeriod, "volume");
        const out = [];

        for (let i = Math.max(anchorIndex + 2, p.volPeriod); i < candles.length - 1; i += 1) {
          if (![avwap[i], avwap[i - 1], volSma[i]].every(Number.isFinite)) continue;

          const candle = candles[i];
          const volumeSpike = candle.volume > volSma[i] * p.volSpike;
          const body = Math.abs(candle.close - candle.open);
          const lowerWick = Math.min(candle.open, candle.close) - candle.low;
          const upperWick = candle.high - Math.max(candle.open, candle.close);

          const longRejection =
            candles[i - 1].close <= avwap[i - 1] &&
            candle.close > avwap[i] &&
            lowerWick > body * 0.9 &&
            volumeSpike;

          const shortRejection =
            candles[i - 1].close >= avwap[i - 1] &&
            candle.close < avwap[i] &&
            upperWick > body * 0.9 &&
            volumeSpike;

          if (longRejection) {
            out.push(
              buildSignal(
                i,
                "long",
                "Anchored VWAP rejection at " + fmt(avwap[i]) + "; volume " + candle.volume + " vs avg " + Math.round(volSma[i]),
                { avwap: avwap[i], vwap: dayVwap[i], volume: candle.volume, volAvg: volSma[i], anchorIndex: anchorIndex }
              )
            );
          }

          if (shortRejection) {
            out.push(
              buildSignal(
                i,
                "short",
                "Anchored VWAP rejection at " + fmt(avwap[i]) + "; volume " + candle.volume + " vs avg " + Math.round(volSma[i]),
                { avwap: avwap[i], vwap: dayVwap[i], volume: candle.volume, volAvg: volSma[i], anchorIndex: anchorIndex }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const p = ctx.params;
        const atrValues = I.atr(ctx.candles, p.atrPeriod);
        const i = signalObj.index;
        const pad = (atrValues[i] || 0) * 0.2;
        if (signalObj.direction === "long") return ctx.candles[i].low - pad;
        return ctx.candles[i].high + pad;
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        const p = ctx.params;
        const swingLookback = 30;
        const swingTarget =
          signalObj.direction === "long"
            ? closestSwingHigh(ctx.candles, signalObj.index, swingLookback)
            : closestSwingLow(ctx.candles, signalObj.index, swingLookback);
        const rrTarget = riskTarget(entryPrice, stopPrice, p.rr, signalObj.direction);
        if (signalObj.direction === "long") return Math.max(swingTarget, rrTarget);
        return Math.min(swingTarget, rrTarget);
      },
      overlay: function overlay(ctx) {
        const p = ctx.params;
        const anchorIndex = chooseAnchorIndex(ctx.candles, p.anchorLookback);
        const avwap = I.anchoredVwap(ctx.candles, anchorIndex);
        const vwap = I.vwap(ctx.candles);
        return [
          lineOverlay("anchoredVwap", "Anchored VWAP", avwap, "#f77f00", 2),
          lineOverlay("sessionVwap", "VWAP", vwap, "#33658a", 1),
        ];
      },
    },
    {
      id: "s04",
      name: "ATR Volatility Breakout plus Supertrend Direction",
      description:
        "Combines ATR breakout force with supertrend direction to focus on continuation entries.",
      marketCondition: "Trend continuation breakout",
      setup: "Supertrend shows trend direction and price consolidates",
      trigger:
        "Break above consolidation by at least 1.5 times ATR in trend direction",
      confirmation:
        "Close outside the range plus follow through on next candle",
      stopText:
        "Back inside the consolidation range or below Supertrend line for longs",
      targetText: "Next major level, or trail with Supertrend",
      bestTimeframe: "15 minute to 4 hour",
      parameters: {
        atrPeriod: { label: "ATR Period", type: "int", min: 5, max: 50, step: 1, default: 14 },
        breakoutAtrMult: { label: "Breakout ATR x", type: "float", min: 0.5, max: 3, step: 0.1, default: 1.5 },
        stPeriod: { label: "Supertrend ATR", type: "int", min: 5, max: 50, step: 1, default: 10 },
        stMult: { label: "Supertrend Mult", type: "float", min: 1, max: 6, step: 0.1, default: 3 },
        rangeLookback: { label: "Range Lookback", type: "int", min: 5, max: 60, step: 1, default: 20 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const p = ctx.params;
        const candles = ctx.candles;
        const atrValues = I.atr(candles, p.atrPeriod);
        const st = I.supertrend(candles, p.stPeriod, p.stMult);
        const out = [];

        for (let i = Math.max(p.rangeLookback + 2, p.atrPeriod + 2); i < candles.length - 1; i += 1) {
          const atrNow = atrValues[i];
          if (!Number.isFinite(atrNow) || st.trend[i] === 0) continue;

          const range = recentRange(candles, i - 1, p.rangeLookback);
          const close = candles[i].close;

          const longSignal =
            st.trend[i] === 1 &&
            close > range.high + p.breakoutAtrMult * atrNow &&
            candles[i - 1].close <= range.high;

          const shortSignal =
            st.trend[i] === -1 &&
            close < range.low - p.breakoutAtrMult * atrNow &&
            candles[i - 1].close >= range.low;

          if (longSignal) {
            out.push(
              buildSignal(
                i,
                "long",
                "Supertrend bullish and close exceeded range by " + fmt((close - range.high) / atrNow, 2) + " ATR",
                { atr: atrNow, supertrend: st.line[i], rangeHigh: range.high, rangeLow: range.low }
              )
            );
          }

          if (shortSignal) {
            out.push(
              buildSignal(
                i,
                "short",
                "Supertrend bearish and close exceeded range by " + fmt((range.low - close) / atrNow, 2) + " ATR",
                { atr: atrNow, supertrend: st.line[i], rangeHigh: range.high, rangeLow: range.low }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const p = ctx.params;
        const st = I.supertrend(ctx.candles, p.stPeriod, p.stMult);
        const i = signalObj.index;
        const range = recentRange(ctx.candles, i, p.rangeLookback);
        if (signalObj.direction === "long") {
          return Math.min(st.line[i] || Infinity, range.low);
        }
        return Math.max(st.line[i] || -Infinity, range.high);
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        return riskTarget(entryPrice, stopPrice, ctx.params.rr, signalObj.direction);
      },
      overlay: function overlay(ctx) {
        const p = ctx.params;
        const st = I.supertrend(ctx.candles, p.stPeriod, p.stMult);
        return [lineOverlay("supertrend", "Supertrend", st.line, "#00a7a7", 2)];
      },
    },
    {
      id: "s05",
      name: "Fibonacci 61.8 Retracement plus 20 EMA Confluence",
      description:
        "Uses pullbacks into Fibonacci 61.8% near a fast trend EMA to time continuation entries.",
      marketCondition: "Strong impulse move followed by pullback",
      setup: "Draw fib on the impulse leg and mark 20 EMA",
      trigger: "Price tags 61.8 area and 20 EMA zone and holds",
      confirmation:
        "Bullish or bearish candle close in direction of trend",
      stopText:
        "Beyond the swing low or swing high that defines the pullback",
      targetText:
        "Retest of the impulse high for longs or impulse low for shorts",
      bestTimeframe: "1 hour to daily",
      parameters: {
        emaPeriod: { label: "EMA Period", type: "int", min: 5, max: 80, step: 1, default: 20 },
        fibLookback: { label: "Fib Lookback", type: "int", min: 20, max: 120, step: 1, default: 40 },
        atrPeriod: { label: "ATR Period", type: "int", min: 5, max: 50, step: 1, default: 14 },
        confluenceAtr: { label: "Confluence ATR", type: "float", min: 0.1, max: 1, step: 0.05, default: 0.4 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const candles = ctx.candles;
        const p = ctx.params;
        const ema = I.ema(candles, p.emaPeriod, "close");
        const atrValues = I.atr(candles, p.atrPeriod);
        const out = [];

        for (let i = p.fibLookback; i < candles.length - 1; i += 1) {
          if (![ema[i], atrValues[i]].every(Number.isFinite)) continue;

          const range = recentRange(candles, i, p.fibLookback);
          const fibLong = range.high - (range.high - range.low) * 0.618;
          const fibShort = range.low + (range.high - range.low) * 0.618;
          const tolerance = atrValues[i] * p.confluenceAtr;

          const bullishBias = candles[i].close > ema[i] && slope(ema, i, 3) > 0;
          const bearishBias = candles[i].close < ema[i] && slope(ema, i, 3) < 0;

          const longConfluence =
            bullishBias &&
            Math.abs(candles[i].low - fibLong) <= tolerance &&
            Math.abs(candles[i].close - ema[i]) <= tolerance;

          const shortConfluence =
            bearishBias &&
            Math.abs(candles[i].high - fibShort) <= tolerance &&
            Math.abs(candles[i].close - ema[i]) <= tolerance;

          if (longConfluence) {
            out.push(
              buildSignal(
                i,
                "long",
                "Price pulled into Fib 61.8 " + fmt(fibLong) + " + EMA confluence " + fmt(ema[i]),
                { fib: fibLong, ema: ema[i], atr: atrValues[i], rangeHigh: range.high, rangeLow: range.low }
              )
            );
          }

          if (shortConfluence) {
            out.push(
              buildSignal(
                i,
                "short",
                "Price pulled into Fib 61.8 " + fmt(fibShort) + " + EMA confluence " + fmt(ema[i]),
                { fib: fibShort, ema: ema[i], atr: atrValues[i], rangeHigh: range.high, rangeLow: range.low }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const i = signalObj.index;
        const lookback = Math.max(10, Math.round(ctx.params.fibLookback / 2));
        if (signalObj.direction === "long") {
          return closestSwingLow(ctx.candles, i, lookback) * 0.998;
        }
        return closestSwingHigh(ctx.candles, i, lookback) * 1.002;
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        const range = recentRange(ctx.candles, signalObj.index, ctx.params.fibLookback);
        const rrTarget = riskTarget(entryPrice, stopPrice, ctx.params.rr, signalObj.direction);
        if (signalObj.direction === "long") return Math.max(rrTarget, range.high);
        return Math.min(rrTarget, range.low);
      },
      overlay: function overlay(ctx) {
        const ema = I.ema(ctx.candles, ctx.params.emaPeriod, "close");
        return [lineOverlay("emaConfluence", "EMA " + ctx.params.emaPeriod, ema, "#2e86ab", 2)];
      },
    },
    {
      id: "s06",
      name: "Parabolic SAR Trend Shift plus ADX Strength Filter",
      description:
        "Captures early trend shifts from PSAR while filtering weak conditions using ADX strength.",
      marketCondition: "New trend start, avoid chop",
      setup: "ADX above 25 to confirm strength",
      trigger: "Parabolic SAR flips to the new side of price",
      confirmation:
        "Structure break in the same direction, like higher high for longs",
      stopText: "On the other side of the SAR, or beyond the last swing",
      targetText: "Trail using SAR until flip back",
      bestTimeframe: "30 minute to daily",
      parameters: {
        psarStep: { label: "PSAR Step", type: "float", min: 0.01, max: 0.08, step: 0.01, default: 0.02 },
        psarMax: { label: "PSAR Max", type: "float", min: 0.1, max: 0.5, step: 0.01, default: 0.2 },
        adxPeriod: { label: "ADX Period", type: "int", min: 5, max: 40, step: 1, default: 14 },
        adxThreshold: { label: "ADX Threshold", type: "float", min: 10, max: 50, step: 1, default: 25 },
        swingLookback: { label: "Swing Lookback", type: "int", min: 4, max: 30, step: 1, default: 8 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const p = ctx.params;
        const candles = ctx.candles;
        const psar = I.parabolicSAR(candles, p.psarStep, p.psarMax);
        const adx = I.adx(candles, p.adxPeriod);
        const out = [];

        for (let i = 2; i < candles.length - 1; i += 1) {
          const adxNow = adx.adx[i];
          if (!Number.isFinite(adxNow) || adxNow < p.adxThreshold) continue;

          const longFlip = psar.trend[i] === 1 && psar.trend[i - 1] === -1;
          const shortFlip = psar.trend[i] === -1 && psar.trend[i - 1] === 1;

          if (longFlip) {
            out.push(
              buildSignal(
                i,
                "long",
                "PSAR flipped bullish with ADX " + fmt(adxNow, 1),
                { psar: psar.sar[i], adx: adxNow }
              )
            );
          }

          if (shortFlip) {
            out.push(
              buildSignal(
                i,
                "short",
                "PSAR flipped bearish with ADX " + fmt(adxNow, 1),
                { psar: psar.sar[i], adx: adxNow }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const p = ctx.params;
        const psar = I.parabolicSAR(ctx.candles, p.psarStep, p.psarMax);
        const i = signalObj.index;
        if (signalObj.direction === "long") {
          return Math.min(psar.sar[i] || Infinity, closestSwingLow(ctx.candles, i, p.swingLookback));
        }
        return Math.max(psar.sar[i] || -Infinity, closestSwingHigh(ctx.candles, i, p.swingLookback));
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        return riskTarget(entryPrice, stopPrice, ctx.params.rr, signalObj.direction);
      },
      overlay: function overlay(ctx) {
        const psar = I.parabolicSAR(ctx.candles, ctx.params.psarStep, ctx.params.psarMax);
        return [lineOverlay("psar", "Parabolic SAR", psar.sar, "#c44536", 1)];
      },
    },
    {
      id: "s07",
      name: "Donchian Channel Breakout plus Midline Trail",
      description:
        "Classic range breakout model using Donchian channel boundaries and a midline management approach.",
      marketCondition: "Breakout from range into trend",
      setup: "Apply Donchian channel, choose lookback like 20",
      trigger: "Close above upper band for long, below lower band for short",
      confirmation: "Higher volume or a second close beyond the band",
      stopText:
        "Back inside the channel, or beyond the opposite band for wider risk",
      targetText:
        "Trail using the middle band, or previous major swing target",
      bestTimeframe: "1 hour to daily",
      parameters: {
        lookback: { label: "Donchian Lookback", type: "int", min: 5, max: 80, step: 1, default: 20 },
        volPeriod: { label: "Volume SMA", type: "int", min: 5, max: 60, step: 1, default: 20 },
        volBoost: { label: "Volume Filter x", type: "float", min: 0.8, max: 3, step: 0.1, default: 1.0 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const candles = ctx.candles;
        const p = ctx.params;
        const dc = I.donchian(candles, p.lookback);
        const volSma = I.sma(candles, p.volPeriod, "volume");
        const out = [];

        for (let i = p.lookback + 1; i < candles.length - 1; i += 1) {
          if (![dc.upper[i - 1], dc.lower[i - 1], volSma[i]].every(Number.isFinite)) continue;

          const volumePass = candles[i].volume >= volSma[i] * p.volBoost;
          const longSignal = candles[i].close > dc.upper[i - 1] && volumePass;
          const shortSignal = candles[i].close < dc.lower[i - 1] && volumePass;

          if (longSignal) {
            out.push(
              buildSignal(
                i,
                "long",
                "Donchian upper breakout at " + fmt(dc.upper[i - 1]) + "; volume filter passed",
                { upper: dc.upper[i - 1], middle: dc.middle[i], lower: dc.lower[i] }
              )
            );
          }

          if (shortSignal) {
            out.push(
              buildSignal(
                i,
                "short",
                "Donchian lower breakout at " + fmt(dc.lower[i - 1]) + "; volume filter passed",
                { upper: dc.upper[i], middle: dc.middle[i], lower: dc.lower[i - 1] }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const dc = I.donchian(ctx.candles, ctx.params.lookback);
        const i = signalObj.index;
        if (signalObj.direction === "long") {
          return Math.min(dc.middle[i] || Infinity, dc.lower[i] || Infinity);
        }
        return Math.max(dc.middle[i] || -Infinity, dc.upper[i] || -Infinity);
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        return riskTarget(entryPrice, stopPrice, ctx.params.rr, signalObj.direction);
      },
      overlay: function overlay(ctx) {
        const dc = I.donchian(ctx.candles, ctx.params.lookback);
        return [
          lineOverlay("donchianUpper", "Donchian Upper", dc.upper, "#2f4858", 1),
          lineOverlay("donchianMiddle", "Donchian Mid", dc.middle, "#5fa8d3", 1),
          lineOverlay("donchianLower", "Donchian Lower", dc.lower, "#2f4858", 1),
        ];
      },
    },
    {
      id: "s08",
      name: "Ichimoku Cloud Trend Break plus Tenkan Kijun",
      description:
        "Uses cloud bias and Tenkan/Kijun crosses for directional entries aligned with broader trend context.",
      marketCondition: "Trend follow",
      setup: "Price above cloud for bullish bias, below cloud for bearish bias",
      trigger: "Tenkan crosses Kijun in the direction of the bias",
      confirmation:
        "Price holds above cloud for longs or below cloud for shorts",
      stopText: "Back into the cloud, or beyond the last swing",
      targetText: "Prior swing levels, or trail with Kijun line",
      bestTimeframe: "1 hour to daily",
      parameters: {
        conversion: { label: "Tenkan", type: "int", min: 5, max: 20, step: 1, default: 9 },
        base: { label: "Kijun", type: "int", min: 10, max: 60, step: 1, default: 26 },
        spanB: { label: "Span B", type: "int", min: 20, max: 120, step: 1, default: 52 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const p = ctx.params;
        const candles = ctx.candles;
        const ichi = I.ichimoku(candles, p.conversion, p.base, p.spanB);
        const out = [];

        for (let i = p.spanB; i < candles.length - 1; i += 1) {
          if (![ichi.tenkan[i], ichi.kijun[i], ichi.spanA[i], ichi.spanB[i]].every(Number.isFinite)) continue;

          const cloudTop = Math.max(ichi.spanA[i], ichi.spanB[i]);
          const cloudBottom = Math.min(ichi.spanA[i], ichi.spanB[i]);
          const close = candles[i].close;

          const bullishBias = close > cloudTop;
          const bearishBias = close < cloudBottom;

          if (bullishBias && crossedAbove(ichi.tenkan, ichi.kijun, i)) {
            out.push(
              buildSignal(
                i,
                "long",
                "Tenkan crossed above Kijun above cloud; Tenkan/Kijun " + fmt(ichi.tenkan[i]) + "/" + fmt(ichi.kijun[i]),
                { tenkan: ichi.tenkan[i], kijun: ichi.kijun[i], spanA: ichi.spanA[i], spanB: ichi.spanB[i] }
              )
            );
          }

          if (bearishBias && crossedBelow(ichi.tenkan, ichi.kijun, i)) {
            out.push(
              buildSignal(
                i,
                "short",
                "Tenkan crossed below Kijun below cloud; Tenkan/Kijun " + fmt(ichi.tenkan[i]) + "/" + fmt(ichi.kijun[i]),
                { tenkan: ichi.tenkan[i], kijun: ichi.kijun[i], spanA: ichi.spanA[i], spanB: ichi.spanB[i] }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const p = ctx.params;
        const ichi = I.ichimoku(ctx.candles, p.conversion, p.base, p.spanB);
        const i = signalObj.index;
        const cloudTop = Math.max(ichi.spanA[i] || -Infinity, ichi.spanB[i] || -Infinity);
        const cloudBottom = Math.min(ichi.spanA[i] || Infinity, ichi.spanB[i] || Infinity);
        if (signalObj.direction === "long") {
          return Math.min(cloudBottom, closestSwingLow(ctx.candles, i, 12));
        }
        return Math.max(cloudTop, closestSwingHigh(ctx.candles, i, 12));
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        return riskTarget(entryPrice, stopPrice, ctx.params.rr, signalObj.direction);
      },
      overlay: function overlay(ctx) {
        const p = ctx.params;
        const ichi = I.ichimoku(ctx.candles, p.conversion, p.base, p.spanB);
        return [
          lineOverlay("tenkan", "Tenkan", ichi.tenkan, "#e76f51", 1),
          lineOverlay("kijun", "Kijun", ichi.kijun, "#264653", 1),
          lineOverlay("spanA", "Cloud A", ichi.spanA, "#4caf50", 1),
          lineOverlay("spanB", "Cloud B", ichi.spanB, "#f4a261", 1),
        ];
      },
    },
    {
      id: "s09",
      name: "Supertrend Flip Signal with ATR Adaptive Line",
      description:
        "Uses supertrend color/side flips to detect trend changes and continuation opportunities.",
      marketCondition: "Trend change or continuation",
      setup: "Use Supertrend settings that fit your timeframe",
      trigger:
        "Price closes and flips Supertrend from red to green for long, green to red for short",
      confirmation:
        "Break of structure, plus clean candle close in new direction",
      stopText: "On the other side of the Supertrend line",
      targetText: "Trail using Supertrend until it flips back",
      bestTimeframe: "15 minute to daily",
      parameters: {
        stPeriod: { label: "Supertrend ATR", type: "int", min: 5, max: 50, step: 1, default: 10 },
        stMult: { label: "Supertrend Mult", type: "float", min: 1, max: 6, step: 0.1, default: 3 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const st = I.supertrend(ctx.candles, ctx.params.stPeriod, ctx.params.stMult);
        const out = [];

        for (let i = 2; i < ctx.candles.length - 1; i += 1) {
          if (!Number.isFinite(st.line[i])) continue;

          if (st.trend[i] === 1 && st.trend[i - 1] === -1) {
            out.push(
              buildSignal(
                i,
                "long",
                "Supertrend flipped bullish at " + fmt(st.line[i]),
                { supertrend: st.line[i] }
              )
            );
          }

          if (st.trend[i] === -1 && st.trend[i - 1] === 1) {
            out.push(
              buildSignal(
                i,
                "short",
                "Supertrend flipped bearish at " + fmt(st.line[i]),
                { supertrend: st.line[i] }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const st = I.supertrend(ctx.candles, ctx.params.stPeriod, ctx.params.stMult);
        return st.line[signalObj.index];
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        return riskTarget(entryPrice, stopPrice, ctx.params.rr, signalObj.direction);
      },
      overlay: function overlay(ctx) {
        const st = I.supertrend(ctx.candles, ctx.params.stPeriod, ctx.params.stMult);
        return [lineOverlay("supertrendFlip", "Supertrend", st.line, "#2a9d8f", 2)];
      },
    },
    {
      id: "s10",
      name: "Parabolic SAR Flip plus ADX Above 25",
      description:
        "Trend filter variant that requires ADX strength and PSAR flip with structure continuation.",
      marketCondition: "Trend trading with strength filter",
      setup: "ADX above 25",
      trigger: "SAR dots flip to the new side of price",
      confirmation:
        "Price closes beyond recent structure in the same direction",
      stopText: "Just beyond SAR line or last swing",
      targetText: "Trail using SAR until reversal signal",
      bestTimeframe: "30 minute to daily",
      parameters: {
        psarStep: { label: "PSAR Step", type: "float", min: 0.01, max: 0.08, step: 0.01, default: 0.02 },
        psarMax: { label: "PSAR Max", type: "float", min: 0.1, max: 0.5, step: 0.01, default: 0.2 },
        adxPeriod: { label: "ADX Period", type: "int", min: 5, max: 40, step: 1, default: 14 },
        adxThreshold: { label: "ADX Threshold", type: "float", min: 15, max: 50, step: 1, default: 25 },
        structureLookback: { label: "Structure Lookback", type: "int", min: 3, max: 20, step: 1, default: 6 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const p = ctx.params;
        const candles = ctx.candles;
        const psar = I.parabolicSAR(candles, p.psarStep, p.psarMax);
        const adx = I.adx(candles, p.adxPeriod);
        const out = [];

        for (let i = p.structureLookback + 2; i < candles.length - 1; i += 1) {
          const adxNow = adx.adx[i];
          if (!Number.isFinite(adxNow) || adxNow < p.adxThreshold) continue;

          const recentHigh = windowHigh(candles, i - 1, p.structureLookback);
          const recentLow = windowLow(candles, i - 1, p.structureLookback);

          const longSignal =
            psar.trend[i] === 1 && psar.trend[i - 1] === -1 && candles[i].close > recentHigh;
          const shortSignal =
            psar.trend[i] === -1 && psar.trend[i - 1] === 1 && candles[i].close < recentLow;

          if (longSignal) {
            out.push(
              buildSignal(
                i,
                "long",
                "PSAR bullish flip + structure break above " + fmt(recentHigh) + "; ADX " + fmt(adxNow, 1),
                { psar: psar.sar[i], adx: adxNow, structure: recentHigh }
              )
            );
          }

          if (shortSignal) {
            out.push(
              buildSignal(
                i,
                "short",
                "PSAR bearish flip + structure break below " + fmt(recentLow) + "; ADX " + fmt(adxNow, 1),
                { psar: psar.sar[i], adx: adxNow, structure: recentLow }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const p = ctx.params;
        const psar = I.parabolicSAR(ctx.candles, p.psarStep, p.psarMax);
        const i = signalObj.index;
        if (signalObj.direction === "long") {
          return Math.min(psar.sar[i] || Infinity, closestSwingLow(ctx.candles, i, p.structureLookback));
        }
        return Math.max(psar.sar[i] || -Infinity, closestSwingHigh(ctx.candles, i, p.structureLookback));
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        return riskTarget(entryPrice, stopPrice, ctx.params.rr, signalObj.direction);
      },
      overlay: function overlay(ctx) {
        const psar = I.parabolicSAR(ctx.candles, ctx.params.psarStep, ctx.params.psarMax);
        return [lineOverlay("psar25", "Parabolic SAR", psar.sar, "#8d5a97", 1)];
      },
    },
    {
      id: "s11",
      name: "Bollinger Squeeze Breakout with Direction Filter",
      description:
        "Compression breakout strategy that requires a directional filter so trades align with trend bias.",
      marketCondition: "Compression then expansion",
      setup: "Bands tight plus a clear consolidation box",
      trigger: "Close outside the box and outside the band",
      confirmation:
        "Use a trend filter like 20 EMA slope or higher timeframe bias",
      stopText: "Inside the consolidation box",
      targetText:
        "Range height projection or next major support resistance",
      bestTimeframe: "15 minute to 4 hour",
      parameters: {
        bbLength: { label: "BB Length", type: "int", min: 10, max: 60, step: 1, default: 20 },
        bbStd: { label: "BB Std Dev", type: "float", min: 1, max: 4, step: 0.1, default: 2 },
        squeezeThreshold: {
          label: "Squeeze Threshold",
          type: "float",
          min: 0.01,
          max: 0.2,
          step: 0.005,
          default: 0.05,
        },
        emaFilter: { label: "EMA Filter", type: "int", min: 5, max: 60, step: 1, default: 20 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const p = ctx.params;
        const candles = ctx.candles;
        const bb = I.bollinger(candles, p.bbLength, p.bbStd, "close");
        const ema = I.ema(candles, p.emaFilter, "close");
        const out = [];

        for (let i = p.bbLength + 2; i < candles.length - 1; i += 1) {
          if (![bb.bandwidth[i], bb.upper[i], bb.lower[i], ema[i]].every(Number.isFinite)) continue;

          const squeeze = bb.bandwidth[i] <= p.squeezeThreshold;
          const trendSlope = slope(ema, i, 3);
          const box = recentRange(candles, i - 1, p.bbLength);

          const longSignal =
            squeeze && candles[i].close > Math.max(bb.upper[i], box.high) && trendSlope > 0;
          const shortSignal =
            squeeze && candles[i].close < Math.min(bb.lower[i], box.low) && trendSlope < 0;

          if (longSignal) {
            out.push(
              buildSignal(
                i,
                "long",
                "Squeeze breakout long with EMA slope filter; bandwidth " + fmt(bb.bandwidth[i], 4),
                { bandwidth: bb.bandwidth[i], ema: ema[i], upper: bb.upper[i], boxHigh: box.high }
              )
            );
          }

          if (shortSignal) {
            out.push(
              buildSignal(
                i,
                "short",
                "Squeeze breakout short with EMA slope filter; bandwidth " + fmt(bb.bandwidth[i], 4),
                { bandwidth: bb.bandwidth[i], ema: ema[i], lower: bb.lower[i], boxLow: box.low }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const box = recentRange(ctx.candles, signalObj.index, ctx.params.bbLength);
        if (signalObj.direction === "long") return box.low;
        return box.high;
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        const p = ctx.params;
        const box = recentRange(ctx.candles, signalObj.index, p.bbLength);
        const projection = signalObj.direction === "long" ? entryPrice + box.size : entryPrice - box.size;
        const rrTarget = riskTarget(entryPrice, stopPrice, p.rr, signalObj.direction);
        if (signalObj.direction === "long") return Math.max(projection, rrTarget);
        return Math.min(projection, rrTarget);
      },
      overlay: function overlay(ctx) {
        const p = ctx.params;
        const bb = I.bollinger(ctx.candles, p.bbLength, p.bbStd, "close");
        const ema = I.ema(ctx.candles, p.emaFilter, "close");
        return [
          lineOverlay("bbUpper11", "BB Upper", bb.upper, "#ff7f51", 1),
          lineOverlay("bbMiddle11", "BB Middle", bb.middle, "#4c6983", 1),
          lineOverlay("bbLower11", "BB Lower", bb.lower, "#ff7f51", 1),
          lineOverlay("emaFilter11", "EMA " + p.emaFilter, ema, "#2a9d8f", 1),
        ];
      },
    },
    {
      id: "s12",
      name: "RSI plus Bollinger Band Mean Reversion",
      description:
        "Range-market setup that fades outer band extremes when RSI re-enters from overextended zones.",
      marketCondition: "Range bound markets",
      setup: "Price tags outer band and RSI is stretched",
      trigger: "Reversal candle back inside the band",
      confirmation:
        "RSI crosses back from extreme zone and structure holds",
      stopText:
        "Beyond the band extreme and beyond the reversal wick",
      targetText:
        "Middle band, then opposite band for second target",
      bestTimeframe: "15 minute to daily",
      parameters: {
        rsiPeriod: { label: "RSI Period", type: "int", min: 5, max: 30, step: 1, default: 14 },
        bbLength: { label: "BB Length", type: "int", min: 10, max: 60, step: 1, default: 20 },
        bbStd: { label: "BB Std Dev", type: "float", min: 1, max: 4, step: 0.1, default: 2 },
        adxPeriod: { label: "ADX Period", type: "int", min: 5, max: 40, step: 1, default: 14 },
        adxMax: { label: "Max ADX", type: "float", min: 10, max: 40, step: 1, default: 22 },
      },
      signal: function signal(ctx) {
        const p = ctx.params;
        const candles = ctx.candles;
        const rsi = I.rsi(candles, p.rsiPeriod, "close");
        const bb = I.bollinger(candles, p.bbLength, p.bbStd, "close");
        const adx = I.adx(candles, p.adxPeriod);
        const out = [];

        for (let i = p.bbLength + 1; i < candles.length - 1; i += 1) {
          if (![rsi[i], rsi[i - 1], bb.lower[i], bb.upper[i], bb.middle[i], adx.adx[i]].every(Number.isFinite)) continue;
          if (adx.adx[i] > p.adxMax) continue;

          const longSignal =
            candles[i - 1].close < bb.lower[i - 1] &&
            candles[i].close > bb.lower[i] &&
            rsi[i - 1] < 30 &&
            rsi[i] > 30;

          const shortSignal =
            candles[i - 1].close > bb.upper[i - 1] &&
            candles[i].close < bb.upper[i] &&
            rsi[i - 1] > 70 &&
            rsi[i] < 70;

          if (longSignal) {
            out.push(
              buildSignal(
                i,
                "long",
                "Mean reversion long: RSI recovered from oversold " + fmt(rsi[i], 1) + ", close back inside lower band",
                { rsi: rsi[i], band: bb.lower[i], middle: bb.middle[i], adx: adx.adx[i] }
              )
            );
          }

          if (shortSignal) {
            out.push(
              buildSignal(
                i,
                "short",
                "Mean reversion short: RSI cooled from overbought " + fmt(rsi[i], 1) + ", close back inside upper band",
                { rsi: rsi[i], band: bb.upper[i], middle: bb.middle[i], adx: adx.adx[i] }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const i = signalObj.index;
        const atr = I.atr(ctx.candles, 14);
        const pad = (atr[i] || 0) * 0.2;
        if (signalObj.direction === "long") return ctx.candles[i].low - pad;
        return ctx.candles[i].high + pad;
      },
      target: function target(ctx, signalObj) {
        const bb = I.bollinger(ctx.candles, ctx.params.bbLength, ctx.params.bbStd, "close");
        return bb.middle[signalObj.index];
      },
      overlay: function overlay(ctx) {
        const p = ctx.params;
        const bb = I.bollinger(ctx.candles, p.bbLength, p.bbStd, "close");
        return [
          lineOverlay("bbUpper12", "BB Upper", bb.upper, "#f77f00", 1),
          lineOverlay("bbMiddle12", "BB Middle", bb.middle, "#1d3557", 1),
          lineOverlay("bbLower12", "BB Lower", bb.lower, "#f77f00", 1),
        ];
      },
    },
    {
      id: "s13",
      name: "EMA Crossover plus Stochastic Filter",
      description:
        "Momentum continuation entry using EMA crossovers with stochastic reset confirmation.",
      marketCondition: "Trend entry after momentum reset",
      setup: "Fast EMA crosses above slow EMA for long bias",
      trigger: "Stochastic resets then crosses up from oversold for longs",
      confirmation: "Price holds above the EMAs after the signal",
      stopText: "Below the slow EMA or last swing low",
      targetText:
        "Trail using fast EMA, or take profit at major levels",
      bestTimeframe: "1 hour to daily",
      parameters: {
        fastEma: { label: "Fast EMA", type: "int", min: 5, max: 50, step: 1, default: 21 },
        slowEma: { label: "Slow EMA", type: "int", min: 20, max: 120, step: 1, default: 55 },
        stochLength: { label: "Stochastic Length", type: "int", min: 5, max: 30, step: 1, default: 14 },
        stochSignal: { label: "Stochastic Signal", type: "int", min: 2, max: 10, step: 1, default: 3 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const p = ctx.params;
        const candles = ctx.candles;
        const fast = I.ema(candles, p.fastEma, "close");
        const slow = I.ema(candles, p.slowEma, "close");
        const stoch = I.stochastic(candles, {
          kPeriod: p.stochLength,
          dPeriod: p.stochSignal,
          smoothK: 3,
        });
        const out = [];

        for (let i = Math.max(p.slowEma, p.stochLength) + 2; i < candles.length - 1; i += 1) {
          if (![fast[i], slow[i], stoch.k[i], stoch.d[i]].every(Number.isFinite)) continue;

          const longSignal =
            crossedAbove(fast, slow, i) && crossedAbove(stoch.k, stoch.d, i) && stoch.k[i] < 45;
          const shortSignal =
            crossedBelow(fast, slow, i) && crossedBelow(stoch.k, stoch.d, i) && stoch.k[i] > 55;

          if (longSignal) {
            out.push(
              buildSignal(
                i,
                "long",
                "EMA bullish crossover with Stochastic confirmation at " + fmt(stoch.k[i], 1),
                { fastEma: fast[i], slowEma: slow[i], stochK: stoch.k[i], stochD: stoch.d[i] }
              )
            );
          }

          if (shortSignal) {
            out.push(
              buildSignal(
                i,
                "short",
                "EMA bearish crossover with Stochastic confirmation at " + fmt(stoch.k[i], 1),
                { fastEma: fast[i], slowEma: slow[i], stochK: stoch.k[i], stochD: stoch.d[i] }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const p = ctx.params;
        const slow = I.ema(ctx.candles, p.slowEma, "close");
        const i = signalObj.index;
        if (signalObj.direction === "long") {
          return Math.min(slow[i] || Infinity, closestSwingLow(ctx.candles, i, 8));
        }
        return Math.max(slow[i] || -Infinity, closestSwingHigh(ctx.candles, i, 8));
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        return riskTarget(entryPrice, stopPrice, ctx.params.rr, signalObj.direction);
      },
      overlay: function overlay(ctx) {
        const p = ctx.params;
        const fast = I.ema(ctx.candles, p.fastEma, "close");
        const slow = I.ema(ctx.candles, p.slowEma, "close");
        return [
          lineOverlay("emaFast13", "EMA " + p.fastEma, fast, "#3a86ff", 2),
          lineOverlay("emaSlow13", "EMA " + p.slowEma, slow, "#ff006e", 2),
        ];
      },
    },
    {
      id: "s14",
      name: "MACD plus Stochastic Double Confirmation",
      description:
        "Requires dual momentum confirmation from MACD and stochastic before taking directional entries.",
      marketCondition: "Momentum shift with extra confirmation",
      setup: "Wait for MACD to start turning and Stochastic to reset",
      trigger:
        "MACD crossover and Stochastic crossover occur close together",
      confirmation:
        "Break of a local high or low, or close beyond a key level",
      stopText: "Beyond recent swing opposite the direction",
      targetText:
        "Next major swing level, or trail with a moving average",
      bestTimeframe: "15 minute to daily",
      parameters: {
        macdFast: { label: "MACD Fast", type: "int", min: 5, max: 20, step: 1, default: 12 },
        macdSlow: { label: "MACD Slow", type: "int", min: 15, max: 40, step: 1, default: 26 },
        macdSignal: { label: "MACD Signal", type: "int", min: 4, max: 20, step: 1, default: 9 },
        stochLength: { label: "Stochastic Length", type: "int", min: 5, max: 30, step: 1, default: 14 },
        stochSignal: { label: "Stochastic Signal", type: "int", min: 2, max: 10, step: 1, default: 3 },
        alignWindow: { label: "Align Window", type: "int", min: 1, max: 6, step: 1, default: 3 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const p = ctx.params;
        const candles = ctx.candles;
        const macd = I.macd(candles, p.macdFast, p.macdSlow, p.macdSignal, "close");
        const stoch = I.stochastic(candles, {
          kPeriod: p.stochLength,
          dPeriod: p.stochSignal,
          smoothK: 3,
        });
        const out = [];

        for (let i = Math.max(p.macdSlow, p.stochLength) + 2; i < candles.length - 1; i += 1) {
          if (![macd.line[i], macd.signal[i], stoch.k[i], stoch.d[i]].every(Number.isFinite)) continue;

          const longCross = crossedAbove(macd.line, macd.signal, i);
          const shortCross = crossedBelow(macd.line, macd.signal, i);
          const stochLongAligned = getMACDStochAlignment(stoch, i, "long", p.alignWindow);
          const stochShortAligned = getMACDStochAlignment(stoch, i, "short", p.alignWindow);

          const structHigh = windowHigh(candles, i - 1, 4);
          const structLow = windowLow(candles, i - 1, 4);

          if (longCross && stochLongAligned && candles[i].close > structHigh) {
            out.push(
              buildSignal(
                i,
                "long",
                "MACD bullish cross + Stoch confirmation with structure break above " + fmt(structHigh),
                {
                  macd: macd.line[i],
                  macdSignal: macd.signal[i],
                  stochK: stoch.k[i],
                  stochD: stoch.d[i],
                }
              )
            );
          }

          if (shortCross && stochShortAligned && candles[i].close < structLow) {
            out.push(
              buildSignal(
                i,
                "short",
                "MACD bearish cross + Stoch confirmation with structure break below " + fmt(structLow),
                {
                  macd: macd.line[i],
                  macdSignal: macd.signal[i],
                  stochK: stoch.k[i],
                  stochD: stoch.d[i],
                }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const i = signalObj.index;
        if (signalObj.direction === "long") return closestSwingLow(ctx.candles, i, 8) * 0.999;
        return closestSwingHigh(ctx.candles, i, 8) * 1.001;
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        return riskTarget(entryPrice, stopPrice, ctx.params.rr, signalObj.direction);
      },
      overlay: function overlay(ctx) {
        const ema = I.ema(ctx.candles, 20, "close");
        return [lineOverlay("ema14", "EMA 20", ema, "#457b9d", 1)];
      },
    },
    {
      id: "s15",
      name: "VWAP Trend Bias Filter with Pullback Entry",
      description:
        "Intraday pullback model that uses VWAP slope and bias to locate continuation entries.",
      marketCondition: "Intraday trend or day swing",
      setup: "Bias bullish when price holds above VWAP, bearish when below",
      trigger: "Enter on pullback to VWAP with a rejection candle",
      confirmation: "VWAP slope agrees and structure supports the entry",
      stopText:
        "Beyond the pullback low for long or pullback high for short",
      targetText: "Prior high or low, or partials plus trail",
      bestTimeframe: "1 minute to 1 hour",
      parameters: {
        slopeLookback: { label: "VWAP Slope Lookback", type: "int", min: 1, max: 20, step: 1, default: 5 },
        pullbackLookback: { label: "Pullback Lookback", type: "int", min: 2, max: 20, step: 1, default: 6 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const candles = ctx.candles;
        const p = ctx.params;
        const vwap = I.vwap(candles);
        const out = [];

        for (let i = p.pullbackLookback + p.slopeLookback + 1; i < candles.length - 1; i += 1) {
          if (![vwap[i], vwap[i - 1], vwap[i - p.slopeLookback]].every(Number.isFinite)) continue;

          const vwSlope = slope(vwap, i, p.slopeLookback);
          const c = candles[i];

          const longSignal =
            c.close > vwap[i] &&
            vwSlope > 0 &&
            c.low <= vwap[i] &&
            c.close > c.open;

          const shortSignal =
            c.close < vwap[i] &&
            vwSlope < 0 &&
            c.high >= vwap[i] &&
            c.close < c.open;

          if (longSignal) {
            out.push(
              buildSignal(
                i,
                "long",
                "VWAP pullback rejection long; VWAP slope " + fmt(vwSlope, 4),
                { vwap: vwap[i], slope: vwSlope }
              )
            );
          }

          if (shortSignal) {
            out.push(
              buildSignal(
                i,
                "short",
                "VWAP pullback rejection short; VWAP slope " + fmt(vwSlope, 4),
                { vwap: vwap[i], slope: vwSlope }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const lb = ctx.params.pullbackLookback;
        if (signalObj.direction === "long") return closestSwingLow(ctx.candles, signalObj.index, lb) * 0.999;
        return closestSwingHigh(ctx.candles, signalObj.index, lb) * 1.001;
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        const swing = signalObj.direction === "long"
          ? closestSwingHigh(ctx.candles, signalObj.index, 20)
          : closestSwingLow(ctx.candles, signalObj.index, 20);
        const rrTarget = riskTarget(entryPrice, stopPrice, ctx.params.rr, signalObj.direction);
        if (signalObj.direction === "long") return Math.max(rrTarget, swing);
        return Math.min(rrTarget, swing);
      },
      overlay: function overlay(ctx) {
        const vwap = I.vwap(ctx.candles);
        return [lineOverlay("vwap15", "VWAP", vwap, "#118ab2", 2)];
      },
    },
    {
      id: "s16",
      name: "Moving Average Pullback plus Fibonacci Confluence",
      description:
        "Targets trend pullbacks where Fibonacci zone and moving average support/resistance overlap.",
      marketCondition: "Trending market with healthy pullbacks",
      setup: "Identify impulse leg and key moving average zone",
      trigger: "Price pulls back into fib level plus moving average zone",
      confirmation:
        "Reversal candle close plus continuation on next candle",
      stopText: "Beyond the pullback swing extreme",
      targetText:
        "Retest of impulse extreme, then extension targets",
      bestTimeframe: "1 hour to daily",
      parameters: {
        maPeriod: { label: "MA Period", type: "int", min: 10, max: 150, step: 1, default: 50 },
        fibLookback: { label: "Fib Lookback", type: "int", min: 20, max: 150, step: 1, default: 55 },
        zoneTolerance: { label: "Zone Tolerance", type: "float", min: 0.001, max: 0.02, step: 0.001, default: 0.004 },
        rr: { label: "Risk-Reward", type: "float", min: 1, max: 5, step: 0.1, default: 2 },
      },
      signal: function signal(ctx) {
        const p = ctx.params;
        const candles = ctx.candles;
        const ma = I.ema(candles, p.maPeriod, "close");
        const out = [];

        for (let i = p.fibLookback + 2; i < candles.length - 1; i += 1) {
          if (!Number.isFinite(ma[i])) continue;

          const range = recentRange(candles, i, p.fibLookback);
          const size = range.size;
          if (!Number.isFinite(size) || size <= 0) continue;

          const bullish = candles[i].close > ma[i] && slope(ma, i, 4) > 0;
          const bearish = candles[i].close < ma[i] && slope(ma, i, 4) < 0;

          const fib50Bull = range.high - size * 0.5;
          const fib618Bull = range.high - size * 0.618;
          const fib50Bear = range.low + size * 0.5;
          const fib618Bear = range.low + size * 0.618;

          const close = candles[i].close;
          const toleranceAbs = close * p.zoneTolerance;

          const longConfluence =
            bullish &&
            candles[i].low <= fib50Bull &&
            candles[i].high >= fib618Bull &&
            Math.abs(close - ma[i]) <= toleranceAbs;

          const shortConfluence =
            bearish &&
            candles[i].high >= fib50Bear &&
            candles[i].low <= fib618Bear &&
            Math.abs(close - ma[i]) <= toleranceAbs;

          if (longConfluence) {
            out.push(
              buildSignal(
                i,
                "long",
                "MA + Fib pullback confluence in 50-61.8 zone; MA " + fmt(ma[i]),
                {
                  ma: ma[i],
                  fib50: fib50Bull,
                  fib618: fib618Bull,
                  rangeHigh: range.high,
                  rangeLow: range.low,
                }
              )
            );
          }

          if (shortConfluence) {
            out.push(
              buildSignal(
                i,
                "short",
                "MA + Fib pullback confluence in 50-61.8 zone; MA " + fmt(ma[i]),
                {
                  ma: ma[i],
                  fib50: fib50Bear,
                  fib618: fib618Bear,
                  rangeHigh: range.high,
                  rangeLow: range.low,
                }
              )
            );
          }
        }

        return out;
      },
      stop: function stop(ctx, signalObj) {
        const lookback = Math.max(8, Math.round(ctx.params.fibLookback / 2));
        if (signalObj.direction === "long") return closestSwingLow(ctx.candles, signalObj.index, lookback) * 0.998;
        return closestSwingHigh(ctx.candles, signalObj.index, lookback) * 1.002;
      },
      target: function target(ctx, signalObj, entryIndex, entryPrice, stopPrice) {
        const range = recentRange(ctx.candles, signalObj.index, ctx.params.fibLookback);
        const rrTarget = riskTarget(entryPrice, stopPrice, ctx.params.rr, signalObj.direction);
        if (signalObj.direction === "long") return Math.max(rrTarget, range.high);
        return Math.min(rrTarget, range.low);
      },
      overlay: function overlay(ctx) {
        const ma = I.ema(ctx.candles, ctx.params.maPeriod, "close");
        return [lineOverlay("ma16", "EMA " + ctx.params.maPeriod, ma, "#1982c4", 2)];
      },
    },
  ];

  strategies.forEach(function addHelpers(strategy) {
    strategy.getDefaultParams = function getDefaultParams() {
      return defaultParams(strategy);
    };
    strategy.validateParams = function strategyValidateParams(raw) {
      return validateParams(strategy, raw);
    };
    strategy.sanitizeLevels = sanitizeDirectionLevels;
  });

  const byId = {};
  strategies.forEach(function buildById(strategy) {
    byId[strategy.id] = strategy;
  });

  window.TradingStrategies = {
    list: strategies,
    byId,
    defaultParams,
    validateParams,
    utils: {
      clamp,
      round,
      fmt,
      crossedAbove,
      crossedBelow,
      windowHigh,
      windowLow,
      slope,
      sanitizeDirectionLevels,
    },
  };
})();
