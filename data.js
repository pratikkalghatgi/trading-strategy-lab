(function () {
  const BASE_INTERVAL_SECONDS = 15 * 60;
  const START_TIME_UNIX = Math.floor(Date.UTC(2024, 0, 1, 0, 0, 0) / 1000);

  function mulberry32(seed) {
    let t = seed >>> 0;
    return function random() {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function round(value, digits) {
    const factor = Math.pow(10, digits || 4);
    return Math.round(value * factor) / factor;
  }

  function generateSyntheticOHLCV(count) {
    const random = mulberry32(93751021);
    const candles = [];
    let lastClose = 100;

    let regime = "trend_up";
    let regimeCandlesLeft = 140;

    for (let i = 0; i < count; i += 1) {
      if (regimeCandlesLeft <= 0) {
        const regimeRoll = random();
        if (regimeRoll < 0.36) regime = "trend_up";
        else if (regimeRoll < 0.68) regime = "trend_down";
        else regime = "range";

        regimeCandlesLeft = Math.floor(80 + random() * 180);
      }

      regimeCandlesLeft -= 1;

      let drift;
      let volScale;

      if (regime === "trend_up") {
        drift = 0.00075 + random() * 0.00095;
        volScale = 0.008 + random() * 0.004;
      } else if (regime === "trend_down") {
        drift = -(0.00075 + random() * 0.00095);
        volScale = 0.008 + random() * 0.004;
      } else {
        drift = (random() - 0.5) * 0.00065;
        volScale = 0.005 + random() * 0.003;
      }

      const open = Math.max(2, lastClose * (1 + (random() - 0.5) * 0.003));
      const impulse = (random() - 0.5) * volScale;
      const close = Math.max(2, open * (1 + drift + impulse));

      const bodyMax = Math.max(open, close);
      const bodyMin = Math.min(open, close);
      const wickTop = Math.abs((random() - 0.2) * volScale * open * 0.95);
      const wickBottom = Math.abs((random() - 0.2) * volScale * open * 0.95);
      const high = Math.max(bodyMax + wickTop, bodyMax * 1.0002);
      const low = Math.max(0.5, Math.min(bodyMin - wickBottom, bodyMin * 0.9998));

      const baseVolume = 900 + random() * 1400;
      const trendVolumeBoost = regime === "range" ? 0.9 : 1.15;
      const volatilityBoost = 1 + Math.min(2.5, Math.abs(close - open) / Math.max(0.01, open) * 12);
      const spike = random() > 0.95 ? 1.6 + random() * 2.2 : 1;
      const volume = Math.max(120, Math.round(baseVolume * trendVolumeBoost * volatilityBoost * spike));

      candles.push({
        time: START_TIME_UNIX + i * BASE_INTERVAL_SECONDS,
        open: round(open, 4),
        high: round(Math.max(open, close, high), 4),
        low: round(Math.min(open, close, low), 4),
        close: round(close, 4),
        volume,
      });

      lastClose = close;
    }

    return candles;
  }

  function aggregateCandles(source, candlesPerBar) {
    const aggregated = [];

    for (let i = 0; i < source.length; i += candlesPerBar) {
      const chunk = source.slice(i, i + candlesPerBar);
      if (chunk.length < candlesPerBar) break;

      const open = chunk[0].open;
      const close = chunk[chunk.length - 1].close;
      let high = -Infinity;
      let low = Infinity;
      let volume = 0;

      for (let j = 0; j < chunk.length; j += 1) {
        if (chunk[j].high > high) high = chunk[j].high;
        if (chunk[j].low < low) low = chunk[j].low;
        volume += chunk[j].volume;
      }

      aggregated.push({
        time: chunk[0].time,
        open,
        high,
        low,
        close,
        volume,
      });
    }

    return aggregated;
  }

  const candles15m = generateSyntheticOHLCV(12000);

  const candleSets = {
    "15m": candles15m,
    "1h": aggregateCandles(candles15m, 4),
    "4h": aggregateCandles(candles15m, 16),
    "1D": aggregateCandles(candles15m, 96),
  };

  window.TradingData = {
    candleSets,
    timeframes: ["15m", "1h", "4h", "1D"],
    getCandles: function getCandles(label) {
      return candleSets[label] || candleSets["1h"];
    },
  };
})();
