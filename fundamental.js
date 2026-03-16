document.addEventListener("DOMContentLoaded", function () {
  const SAMPLE_COMPANY_DATA = [
    {
      symbol: "AAPL",
      name: "Apple Inc",
      sector: "Technology",
      price: 211.4,
      marketCapCr: 3742000,
      pe: 31.2,
      pb: 44.5,
      roe: 149.2,
      roce: 54.6,
      debtEquity: 1.6,
      salesGrowth3Y: 6.8,
      epsGrowth3Y: 8.9,
      dividendYield: 0.5,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp",
      sector: "Technology",
      price: 428.7,
      marketCapCr: 3180000,
      pe: 35.1,
      pb: 12.6,
      roe: 35.5,
      roce: 31.2,
      debtEquity: 0.3,
      salesGrowth3Y: 14.4,
      epsGrowth3Y: 16.1,
      dividendYield: 0.7,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc",
      sector: "Communication Services",
      price: 182.6,
      marketCapCr: 2240000,
      pe: 24.8,
      pb: 6.2,
      roe: 27.4,
      roce: 29.1,
      debtEquity: 0.1,
      salesGrowth3Y: 11.5,
      epsGrowth3Y: 17.6,
      dividendYield: 0.0,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com",
      sector: "Consumer Discretionary",
      price: 194.4,
      marketCapCr: 2050000,
      pe: 47.2,
      pb: 8.6,
      roe: 22.8,
      roce: 16.9,
      debtEquity: 0.5,
      salesGrowth3Y: 11.2,
      epsGrowth3Y: 31.7,
      dividendYield: 0.0,
    },
    {
      symbol: "META",
      name: "Meta Platforms",
      sector: "Communication Services",
      price: 494.2,
      marketCapCr: 1580000,
      pe: 27.4,
      pb: 8.3,
      roe: 31.5,
      roce: 29.7,
      debtEquity: 0.2,
      salesGrowth3Y: 13.9,
      epsGrowth3Y: 21.2,
      dividendYield: 0.4,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp",
      sector: "Technology",
      price: 823.7,
      marketCapCr: 2890000,
      pe: 54.6,
      pb: 45.2,
      roe: 72.8,
      roce: 65.5,
      debtEquity: 0.2,
      salesGrowth3Y: 52.1,
      epsGrowth3Y: 86.4,
      dividendYield: 0.1,
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc",
      sector: "Consumer Discretionary",
      price: 183.6,
      marketCapCr: 560000,
      pe: 62.9,
      pb: 8.7,
      roe: 13.4,
      roce: 11.9,
      debtEquity: 0.1,
      salesGrowth3Y: 22.5,
      epsGrowth3Y: 14.6,
      dividendYield: 0.0,
    },
    {
      symbol: "WMT",
      name: "Walmart Inc",
      sector: "Consumer Staples",
      price: 61.4,
      marketCapCr: 500000,
      pe: 32.8,
      pb: 6.9,
      roe: 21.9,
      roce: 15.4,
      debtEquity: 0.7,
      salesGrowth3Y: 5.8,
      epsGrowth3Y: 7.4,
      dividendYield: 1.4,
    },
    {
      symbol: "BRK.B",
      name: "Berkshire Hathaway",
      sector: "Financials",
      price: 468.2,
      marketCapCr: 951000,
      pe: 16.9,
      pb: 1.6,
      roe: 10.1,
      roce: 11.3,
      debtEquity: 0.2,
      salesGrowth3Y: 8.4,
      epsGrowth3Y: 9.1,
      dividendYield: 0.0,
    },
    {
      symbol: "JPM",
      name: "JPMorgan Chase",
      sector: "Financials",
      price: 232.5,
      marketCapCr: 665000,
      pe: 13.5,
      pb: 2.1,
      roe: 17.8,
      roce: 8.8,
      debtEquity: 1.5,
      salesGrowth3Y: 9.6,
      epsGrowth3Y: 13.2,
      dividendYield: 1.9,
    },
    {
      symbol: "XOM",
      name: "Exxon Mobil",
      sector: "Energy",
      price: 116.0,
      marketCapCr: 510000,
      pe: 13.8,
      pb: 2.0,
      roe: 15.2,
      roce: 12.7,
      debtEquity: 0.2,
      salesGrowth3Y: 6.1,
      epsGrowth3Y: 8.9,
      dividendYield: 3.2,
    },
    {
      symbol: "AVGO",
      name: "Broadcom",
      sector: "Technology",
      price: 170.0,
      marketCapCr: 800000,
      pe: 39.2,
      pb: 12.1,
      roe: 27.4,
      roce: 23.6,
      debtEquity: 1.1,
      salesGrowth3Y: 16.2,
      epsGrowth3Y: 20.3,
      dividendYield: 1.3,
    },
    {
      symbol: "LLY",
      name: "Eli Lilly",
      sector: "Healthcare",
      price: 920.0,
      marketCapCr: 840000,
      pe: 74.0,
      pb: 38.5,
      roe: 58.1,
      roce: 33.5,
      debtEquity: 1.8,
      salesGrowth3Y: 21.1,
      epsGrowth3Y: 28.4,
      dividendYield: 0.6,
    },
    {
      symbol: "COST",
      name: "Costco Wholesale",
      sector: "Consumer Staples",
      price: 880.0,
      marketCapCr: 395000,
      pe: 52.6,
      pb: 16.3,
      roe: 28.4,
      roce: 24.1,
      debtEquity: 0.3,
      salesGrowth3Y: 10.1,
      epsGrowth3Y: 11.7,
      dividendYield: 0.5,
    },
    {
      symbol: "UNH",
      name: "UnitedHealth Group",
      sector: "Healthcare",
      price: 510.0,
      marketCapCr: 470000,
      pe: 22.1,
      pb: 5.4,
      roe: 25.3,
      roce: 16.0,
      debtEquity: 0.8,
      salesGrowth3Y: 11.3,
      epsGrowth3Y: 12.9,
      dividendYield: 1.4,
    },
    {
      symbol: "HD",
      name: "Home Depot",
      sector: "Consumer Discretionary",
      price: 390.0,
      marketCapCr: 385000,
      pe: 25.8,
      pb: 72.0,
      roe: 320.0,
      roce: 38.4,
      debtEquity: 25.0,
      salesGrowth3Y: 4.4,
      epsGrowth3Y: 6.8,
      dividendYield: 2.3,
    },
    {
      symbol: "PG",
      name: "Procter & Gamble",
      sector: "Consumer Staples",
      price: 171.0,
      marketCapCr: 400000,
      pe: 28.4,
      pb: 7.9,
      roe: 31.1,
      roce: 21.6,
      debtEquity: 0.6,
      salesGrowth3Y: 4.8,
      epsGrowth3Y: 6.1,
      dividendYield: 2.4,
    },
    {
      symbol: "JNJ",
      name: "Johnson & Johnson",
      sector: "Healthcare",
      price: 162.0,
      marketCapCr: 390000,
      pe: 15.7,
      pb: 5.2,
      roe: 34.0,
      roce: 18.1,
      debtEquity: 0.5,
      salesGrowth3Y: 4.2,
      epsGrowth3Y: 5.5,
      dividendYield: 3.1,
    },
  ];

  const PRESETS = [
    { key: "all", label: "All Companies", filters: {} },
    {
      key: "quality",
      label: "Quality Compounders",
      filters: { maxPe: 45, minRoe: 18, minRoce: 18, maxDebtEquity: 0.6, minSalesGrowth: 10, minEpsGrowth: 10 },
    },
    {
      key: "value",
      label: "Reasonable Value",
      filters: { maxPe: 25, minRoe: 14, maxDebtEquity: 1, minMarketCap: 100000, minDividendYield: 0.5 },
    },
    {
      key: "growth",
      label: "High Growth",
      filters: { minSalesGrowth: 15, minEpsGrowth: 18, minRoe: 12, maxDebtEquity: 1.5 },
    },
    {
      key: "income",
      label: "Dividend Focus",
      filters: { minDividendYield: 1.2, minRoe: 12, maxDebtEquity: 1.2, minMarketCap: 50000 },
    },
  ];

  const CACHE_KEY_PREFIX = "tsl-market-universe-v2";
  const MARKET_MODE_STORAGE = "tsl-market-mode";
  const LEGACY_CACHE_KEY = "tsl-us-universe-v1";


  const dom = {
    themeToggle: document.getElementById("themeToggle"),
    presetButtons: document.getElementById("presetButtons"),
    queryPreview: document.getElementById("queryPreview"),
    searchInput: document.getElementById("searchInput"),
    sectorSelect: document.getElementById("sectorSelect"),
    minMarketCap: document.getElementById("minMarketCap"),
    maxPe: document.getElementById("maxPe"),
    minRoe: document.getElementById("minRoe"),
    minRoce: document.getElementById("minRoce"),
    maxDebtEquity: document.getElementById("maxDebtEquity"),
    minSalesGrowth: document.getElementById("minSalesGrowth"),
    minEpsGrowth: document.getElementById("minEpsGrowth"),
    minDividendYield: document.getElementById("minDividendYield"),
    applyFiltersBtn: document.getElementById("applyFiltersBtn"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn"),
    loadUsStocksBtn: document.getElementById("loadUsStocksBtn"),
    clearCacheBtn: document.getElementById("clearCacheBtn"),
    usApiKey: document.getElementById("usApiKey"),
    dataStatus: document.getElementById("dataStatus"),
    resultTableBody: document.getElementById("resultTableBody"),
    metricCount: document.getElementById("metricCount"),
    metricAvgPe: document.getElementById("metricAvgPe"),
    metricAvgRoe: document.getElementById("metricAvgRoe"),
    metricAvgDebt: document.getElementById("metricAvgDebt"),
    emptyState: document.getElementById("emptyState"),
    sortButtons: Array.from(document.querySelectorAll(".sort-btn")),
  };

  function buildUniverseFromBaked() {
    var snap = window.SP500_UNIVERSE;
    if (Array.isArray(snap) && snap.length > 10) {
      return snap.map(function(item) {
        var f = item[3] || {};
        return normalizeCompanyRow({
          symbol:       item[0],
          name:         item[1],
          sector:       item[2],
          price:        f.price  != null ? f.price  : null,
          marketCapCr:  f.mcap   != null ? f.mcap   : null,
          pe:           f.pe     != null ? f.pe     : null,
          pb:           f.pb     != null ? f.pb     : null,
          roe:          f.roe    != null ? f.roe    : null,
          roce:         f.roce   != null ? f.roce   : null,
          debtEquity:   f.de     != null ? f.de     : null,
          salesGrowth3Y: f.sg    != null ? f.sg     : null,
          epsGrowth3Y:  f.eg     != null ? f.eg     : null,
          dividendYield: f.div   != null ? f.div    : null,
        });
      });
    }
    return SAMPLE_COMPANY_DATA.map(normalizeCompanyRow);
  }

  const state = {
    activePreset: "all",
    sortKey: "score",
    sortDir: "desc",
    filters: defaultFilters(),
    universeData: buildUniverseFromBaked(),
    isLoading: false,
    quoteFetchMode: "auto",
    marketMode: "sp500_eod",
    textFetchMode: "auto",
  };

  function defaultFilters() {
    return {
      search: "",
      sector: "All Sectors",
      minMarketCap: null,
      maxPe: null,
      minRoe: null,
      minRoce: null,
      maxDebtEquity: null,
      minSalesGrowth: null,
      minEpsGrowth: null,
      minDividendYield: null,
    };
  }

  function currentMarketMode() {
    return "sp500_eod";
  }

  function cacheKeyForMode(mode) {
    return CACHE_KEY_PREFIX + "-" + (mode || currentMarketMode());
  }

  function marketModeLabel(mode) {
    return "S&P 500 (467 stocks)";
  }

  function updateMarketModeUI() {
    if (!dom.marketMode) return;
    const mode = currentMarketMode();
    state.marketMode = mode;
    dom.marketMode.value = mode;
  }

  function setDataStatus(message, tone) {
    if (!dom.dataStatus) return;
    dom.dataStatus.textContent = message;
    dom.dataStatus.classList.remove("error", "success");
    if (tone === "error" || tone === "success") dom.dataStatus.classList.add(tone);
  }

  function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.body.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("tsl-theme", nextTheme);
    } catch (err) {
      void err;
    }
    if (dom.themeToggle) {
      dom.themeToggle.textContent = nextTheme === "dark" ? "Light mode" : "Dark mode";
    }
  }

  function initializeTheme() {
    let stored = "light";
    try {
      stored = localStorage.getItem("tsl-theme") || "light";
    } catch (err) {
      void err;
    }
    applyTheme(stored);
    if (!dom.themeToggle) return;
    dom.themeToggle.addEventListener("click", function () {
      const current = document.body.getAttribute("data-theme") || "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  function parseNumber(value) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function toNumber(value) {
    if (value == null) return null;
    if (typeof value === "string" && value.trim() === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function normalizePercent(value) {
    const parsed = toNumber(value);
    if (parsed == null) return null;
    if (Math.abs(parsed) <= 1.5) return parsed * 100;
    return parsed;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function pickFirstNumber(source, keys) {
    if (!source) return null;
    for (let i = 0; i < keys.length; i += 1) {
      const value = toNumber(source[keys[i]]);
      if (value != null) return value;
    }
    return null;
  }

  function scoreBandLowGood(value, best, worst) {
    const t = (worst - value) / (worst - best);
    return clamp(t, 0, 1);
  }

  function scoreBandHighGood(value, worst, best) {
    const t = (value - worst) / (best - worst);
    return clamp(t, 0, 1);
  }

  function normalizeCompanyRow(row) {
    const marketCapCr = toNumber(row.marketCapCr);
    return {
      symbol: (row.symbol || "").toString().toUpperCase(),
      name: row.name || row.companyName || row.symbol || "Unknown",
      sector: row.sector || row.exchange || "Unknown",
      price: toNumber(row.price),
      marketCapCr: marketCapCr,
      pe: toNumber(row.pe),
      pb: toNumber(row.pb),
      roe: toNumber(row.roe),
      roce: toNumber(row.roce),
      debtEquity: toNumber(row.debtEquity),
      salesGrowth3Y: toNumber(row.salesGrowth3Y),
      epsGrowth3Y: toNumber(row.epsGrowth3Y),
      dividendYield: toNumber(row.dividendYield),
    };
  }

  function computeScore(company) {
    const pe = company.pe == null ? 35 : company.pe;
    const debtEquity = company.debtEquity == null ? 1.2 : company.debtEquity;
    const roe = company.roe == null ? 15 : company.roe;
    const roce = company.roce == null ? 14 : company.roce;
    const salesGrowth3Y = company.salesGrowth3Y == null ? 8 : company.salesGrowth3Y;
    const epsGrowth3Y = company.epsGrowth3Y == null ? 8 : company.epsGrowth3Y;
    const dividendYield = company.dividendYield == null ? 0.5 : company.dividendYield;

    const peScore = scoreBandLowGood(pe, 12, 80) * 0.2;
    const debtScore = scoreBandLowGood(debtEquity, 0, 3) * 0.16;
    const roeScore = scoreBandHighGood(roe, 5, 35) * 0.18;
    const roceScore = scoreBandHighGood(roce, 5, 35) * 0.14;
    const salesScore = scoreBandHighGood(salesGrowth3Y, 0, 25) * 0.14;
    const epsScore = scoreBandHighGood(epsGrowth3Y, 0, 30) * 0.14;
    const dividendScore = scoreBandHighGood(dividendYield, 0, 3.5) * 0.04;
    return Math.round((peScore + debtScore + roeScore + roceScore + salesScore + epsScore + dividendScore) * 100);
  }

  function withScores(data) {
    return data.map(function (company) {
      return Object.assign({ score: computeScore(company) }, company);
    });
  }

  function formatNumber(value, digits) {
    if (!Number.isFinite(value)) return "-";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: digits == null ? 2 : digits,
      maximumFractionDigits: digits == null ? 2 : digits,
    });
  }

  function formatCompactCr(value) {
    if (!Number.isFinite(value)) return "-";
    if (value >= 1000000) return (value / 1000000).toFixed(2) + "T";
    if (value >= 1000) return (value / 1000).toFixed(2) + "B";
    return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }

  function setFiltersFromForm() {
    state.filters.search = (dom.searchInput.value || "").trim().toLowerCase();
    state.filters.sector = dom.sectorSelect.value || "All Sectors";
    state.filters.minMarketCap = parseNumber(dom.minMarketCap.value);
    state.filters.maxPe = parseNumber(dom.maxPe.value);
    state.filters.minRoe = parseNumber(dom.minRoe.value);
    state.filters.minRoce = parseNumber(dom.minRoce.value);
    state.filters.maxDebtEquity = parseNumber(dom.maxDebtEquity.value);
    state.filters.minSalesGrowth = parseNumber(dom.minSalesGrowth.value);
    state.filters.minEpsGrowth = parseNumber(dom.minEpsGrowth.value);
    state.filters.minDividendYield = parseNumber(dom.minDividendYield.value);
  }

  function fillFormFromState() {
    dom.searchInput.value = state.filters.search || "";
    dom.sectorSelect.value = state.filters.sector || "All Sectors";
    dom.minMarketCap.value = state.filters.minMarketCap == null ? "" : String(state.filters.minMarketCap);
    dom.maxPe.value = state.filters.maxPe == null ? "" : String(state.filters.maxPe);
    dom.minRoe.value = state.filters.minRoe == null ? "" : String(state.filters.minRoe);
    dom.minRoce.value = state.filters.minRoce == null ? "" : String(state.filters.minRoce);
    dom.maxDebtEquity.value = state.filters.maxDebtEquity == null ? "" : String(state.filters.maxDebtEquity);
    dom.minSalesGrowth.value = state.filters.minSalesGrowth == null ? "" : String(state.filters.minSalesGrowth);
    dom.minEpsGrowth.value = state.filters.minEpsGrowth == null ? "" : String(state.filters.minEpsGrowth);
    dom.minDividendYield.value = state.filters.minDividendYield == null ? "" : String(state.filters.minDividendYield);
  }

  function buildQueryPreview(filters) {
    const clauses = [];

    if (filters.sector && filters.sector !== "All Sectors") clauses.push("sector = '" + filters.sector + "'");
    if (filters.minMarketCap != null) clauses.push("market_cap_cr > " + filters.minMarketCap);
    if (filters.maxPe != null) clauses.push("pe < " + filters.maxPe);
    if (filters.minRoe != null) clauses.push("roe > " + filters.minRoe);
    if (filters.minRoce != null) clauses.push("roce > " + filters.minRoce);
    if (filters.maxDebtEquity != null) clauses.push("debt_to_equity < " + filters.maxDebtEquity);
    if (filters.minSalesGrowth != null) clauses.push("sales_growth_3y > " + filters.minSalesGrowth);
    if (filters.minEpsGrowth != null) clauses.push("eps_growth_3y > " + filters.minEpsGrowth);
    if (filters.minDividendYield != null) clauses.push("dividend_yield > " + filters.minDividendYield);
    if (filters.search) clauses.push("name contains '" + filters.search + "'");

    if (!clauses.length) return "SELECT * FROM companies\nORDER BY quality_score DESC";
    return "SELECT * FROM companies\nWHERE " + clauses.join("\n  AND ") + "\nORDER BY quality_score DESC";
  }

  function matchesFilters(company, filters) {
    if (filters.search) {
      const haystack = (company.name + " " + company.symbol + " " + company.sector).toLowerCase();
      if (!haystack.includes(filters.search)) return false;
    }
    if (filters.sector !== "All Sectors" && company.sector !== filters.sector) return false;
    if (filters.minMarketCap != null && (company.marketCapCr == null || company.marketCapCr < filters.minMarketCap)) return false;
    if (filters.maxPe != null && (company.pe == null || company.pe > filters.maxPe)) return false;
    if (filters.minRoe != null && (company.roe == null || company.roe < filters.minRoe)) return false;
    if (filters.minRoce != null && (company.roce == null || company.roce < filters.minRoce)) return false;
    if (filters.maxDebtEquity != null && (company.debtEquity == null || company.debtEquity > filters.maxDebtEquity)) return false;
    if (filters.minSalesGrowth != null && (company.salesGrowth3Y == null || company.salesGrowth3Y < filters.minSalesGrowth)) return false;
    if (filters.minEpsGrowth != null && (company.epsGrowth3Y == null || company.epsGrowth3Y < filters.minEpsGrowth)) return false;
    if (filters.minDividendYield != null && (company.dividendYield == null || company.dividendYield < filters.minDividendYield)) return false;
    return true;
  }

  function sortRows(rows) {
    const key = state.sortKey;
    const direction = state.sortDir === "asc" ? 1 : -1;

    return rows.slice().sort(function (a, b) {
      const av = a[key];
      const bv = b[key];

      if (typeof av === "string" || typeof bv === "string") {
        return String(av || "").localeCompare(String(bv || "")) * direction;
      }

      const aMissing = av == null || Number.isNaN(av);
      const bMissing = bv == null || Number.isNaN(bv);
      if (aMissing && bMissing) return 0;
      if (aMissing) return 1;
      if (bMissing) return -1;
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * direction;
    });
  }

  function numericClass(value) {
    if (!Number.isFinite(value)) return "";
    if (value > 0) return "value-positive";
    if (value < 0) return "value-negative";
    return "";
  }

  function scoreClass(score) {
    if (score >= 75) return "value-positive";
    if (score < 45) return "value-negative";
    return "";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildTechnicalHref(row) {
    const symbol = String(row.symbol || "").toUpperCase();
    const name = String(row.name || symbol || "Stock");
    return (
      "technical.html?symbol=" +
      encodeURIComponent(symbol) +
      "&name=" +
      encodeURIComponent(name) +
      "&timeframe=1D"
    );
  }

  function average(rows, key) {
    let sum = 0;
    let count = 0;
    rows.forEach(function (row) {
      if (Number.isFinite(row[key])) {
        sum += row[key];
        count += 1;
      }
    });
    return count ? sum / count : null;
  }

  function renderMetrics(rows) {
    const avgPe = average(rows, "pe");
    const avgRoe = average(rows, "roe");
    const avgDebt = average(rows, "debtEquity");

    dom.metricCount.textContent = String(rows.length);
    dom.metricAvgPe.textContent = avgPe == null ? "-" : formatNumber(avgPe, 1);
    dom.metricAvgRoe.textContent = avgRoe == null ? "-" : formatNumber(avgRoe, 1) + "%";
    dom.metricAvgDebt.textContent = avgDebt == null ? "-" : formatNumber(avgDebt, 2);
  }

  function renderTable(rows) {
    dom.resultTableBody.innerHTML = "";
    dom.emptyState.hidden = rows.length > 0;

    rows.forEach(function (row) {
      const tr = document.createElement("tr");
      const technicalHref = buildTechnicalHref(row);
      tr.innerHTML =
        '<td><div class="company-cell"><span class="company-name">' +
        escapeHtml(row.name) +
        '</span><span class="company-symbol">' +
        escapeHtml(row.symbol) +
        "</span></div></td>" +
        "<td>" +
        escapeHtml(row.sector) +
        "</td>" +
        "<td>" +
        formatNumber(row.price, 2) +
        "</td>" +
        "<td>" +
        formatCompactCr(row.marketCapCr) +
        "</td>" +
        "<td>" +
        formatNumber(row.pe, 1) +
        "</td>" +
        "<td>" +
        formatNumber(row.pb, 1) +
        "</td>" +
        '<td class="' +
        numericClass(row.roe) +
        '">' +
        formatNumber(row.roe, 1) +
        "</td>" +
        '<td class="' +
        numericClass(row.roce) +
        '">' +
        formatNumber(row.roce, 1) +
        "</td>" +
        "<td>" +
        formatNumber(row.debtEquity, 2) +
        "</td>" +
        '<td class="' +
        numericClass(row.salesGrowth3Y) +
        '">' +
        formatNumber(row.salesGrowth3Y, 1) +
        "</td>" +
        '<td class="' +
        numericClass(row.epsGrowth3Y) +
        '">' +
        formatNumber(row.epsGrowth3Y, 1) +
        "</td>" +
        "<td>" +
        formatNumber(row.dividendYield, 1) +
        "</td>" +
        '<td><span class="score-pill ' +
        scoreClass(row.score) +
        '">' +
        row.score +
        '</span></td><td><a class="play-link" href="' +
        technicalHref +
        '">Play</a></td>';
      dom.resultTableBody.appendChild(tr);
    });
  }

  function renderSortState() {
    dom.sortButtons.forEach(function (button) {
      const isActive = button.dataset.sort === state.sortKey;
      button.classList.toggle("active", isActive);
      if (isActive) {
        button.textContent = button.textContent.replace(/ [↑↓]$/, "") + (state.sortDir === "asc" ? " ↑" : " ↓");
      } else {
        button.textContent = button.textContent.replace(/ [↑↓]$/, "");
      }
    });
  }

  function renderPresetButtons() {
    dom.presetButtons.innerHTML = "";
    PRESETS.forEach(function (preset) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "preset-btn" + (preset.key === state.activePreset ? " active" : "");
      button.textContent = preset.label;
      button.addEventListener("click", function () {
        state.activePreset = preset.key;
        state.filters = Object.assign(defaultFilters(), preset.filters);
        fillFormFromState();
        renderPresetButtons();
        applyAndRender();
      });
      dom.presetButtons.appendChild(button);
    });
  }

  function populateSectors() {
    const sectors = Array.from(
      new Set(
        state.universeData.map(function (company) {
          return company.sector || "Unknown";
        })
      )
    ).sort();

    dom.sectorSelect.innerHTML = "";
    ["All Sectors"].concat(sectors).forEach(function (sector) {
      const option = document.createElement("option");
      option.value = sector;
      option.textContent = sector;
      dom.sectorSelect.appendChild(option);
    });

    if (!sectors.includes(state.filters.sector)) {
      state.filters.sector = "All Sectors";
    }
  }

  function applyAndRender() {
    setFiltersFromForm();
    dom.queryPreview.textContent = buildQueryPreview(state.filters);

    const scored = withScores(state.universeData);
    const filtered = scored.filter(function (company) {
      return matchesFilters(company, state.filters);
    });
    const sorted = sortRows(filtered);

    renderMetrics(sorted);
    renderTable(sorted);
    renderSortState();
  }

  function resetFilters() {
    state.activePreset = "all";
    state.filters = defaultFilters();
    fillFormFromState();
    renderPresetButtons();
    applyAndRender();
  }

  function readCache(mode) {
    try {
      const raw = localStorage.getItem(cacheKeyForMode(mode));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.companies) || !parsed.companies.length) return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function writeCache(mode, payload) {
    try {
      localStorage.setItem(cacheKeyForMode(mode), JSON.stringify(payload));
      return true;
    } catch (err) {
      return false;
    }
  }

  function dedupeBySymbol(rows) {
    const map = new Map();
    rows.forEach(function (row) {
      const normalized = normalizeCompanyRow(row);
      if (!normalized.symbol) return;
      const previous = map.get(normalized.symbol);
      if (!previous) {
        map.set(normalized.symbol, normalized);
        return;
      }

      map.set(normalized.symbol, {
        symbol: normalized.symbol,
        name: normalized.name || previous.name,
        sector: normalized.sector || previous.sector,
        price: normalized.price == null ? previous.price : normalized.price,
        marketCapCr: normalized.marketCapCr == null ? previous.marketCapCr : normalized.marketCapCr,
        pe: normalized.pe == null ? previous.pe : normalized.pe,
        pb: normalized.pb == null ? previous.pb : normalized.pb,
        roe: normalized.roe == null ? previous.roe : normalized.roe,
        roce: normalized.roce == null ? previous.roce : normalized.roce,
        debtEquity: normalized.debtEquity == null ? previous.debtEquity : normalized.debtEquity,
        salesGrowth3Y: normalized.salesGrowth3Y == null ? previous.salesGrowth3Y : normalized.salesGrowth3Y,
        epsGrowth3Y: normalized.epsGrowth3Y == null ? previous.epsGrowth3Y : normalized.epsGrowth3Y,
        dividendYield: normalized.dividendYield == null ? previous.dividendYield : normalized.dividendYield,
      });
    });
    return Array.from(map.values());
  }

  async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP " + response.status + " while loading " + url);
    }
    return await response.json();
  }

  async function fetchText(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP " + response.status + " while loading " + url);
    }
    return await response.text();
  }

  async function fetchTextWithCorsFallback(url) {
    const attempts = [];

    function addAttempt(name, loader) {
      attempts.push({ name: name, loader: loader });
    }

    if (state.textFetchMode === "direct") {
      addAttempt("direct", function () {
        return fetchText(url);
      });
    } else if (state.textFetchMode === "allorigins") {
      addAttempt("allorigins", function () {
        return fetchText("https://api.allorigins.win/raw?url=" + encodeURIComponent(url));
      });
    } else if (state.textFetchMode === "corsproxy") {
      addAttempt("corsproxy", function () {
        return fetchText("https://corsproxy.io/?" + encodeURIComponent(url));
      });
    } else {
      if (!IS_FILE_PROTOCOL) {
        addAttempt("direct", function () {
          return fetchText(url);
        });
      }
      addAttempt("allorigins", function () {
        return fetchText("https://api.allorigins.win/raw?url=" + encodeURIComponent(url));
      });
      addAttempt("corsproxy", function () {
        return fetchText("https://corsproxy.io/?" + encodeURIComponent(url));
      });
      addAttempt("codetabs", function () {
        return fetchText("https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(url));
      });
    }

    const errors = [];
    for (let i = 0; i < attempts.length; i += 1) {
      const attempt = attempts[i];
      try {
        const text = await attempt.loader();
        state.textFetchMode = attempt.name;
        return text;
      } catch (err) {
        errors.push(attempt.name + ": " + (err && err.message ? err.message : "failed"));
      }
    }

    throw new Error("Text fetch failed (" + errors.join(" | ") + ")");
  }

  function safeJsonParse(text, context) {
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error("Invalid JSON from " + context);
    }
  }

  async function fetchJsonWithCorsFallback(url) {
    var IS_FILE = (typeof window !== "undefined" && window.location && window.location.protocol === "file:");
    const proxies = [
      { name: "allorigins", wrap: function(u) { return "https://api.allorigins.win/raw?url=" + encodeURIComponent(u); } },
      { name: "corsproxy",  wrap: function(u) { return "https://corsproxy.io/?" + encodeURIComponent(u); } },
      { name: "codetabs",   wrap: function(u) { return "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(u); } },
      { name: "thingproxy", wrap: function(u) { return "https://thingproxy.freeboard.io/fetch/" + u; } },
    ];

    const errors = [];

    // Try direct first (only if not file://)
    if (!IS_FILE && state.quoteFetchMode !== "proxy") {
      try {
        const payload = await fetchJson(url);
        state.quoteFetchMode = "direct";
        return payload;
      } catch(e) {
        errors.push("direct: " + (e && e.message ? e.message : "failed"));
      }
    }

    // Try each proxy
    for (var i = 0; i < proxies.length; i++) {
      var p = proxies[i];
      try {
        const text = await fetchText(p.wrap(url));
        if (!text || text.trim() === "") throw new Error("empty response");
        const parsed = safeJsonParse(text, p.name);
        state.quoteFetchMode = "proxy";
        return parsed;
      } catch(e) {
        errors.push(p.name + ": " + (e && e.message ? e.message : "failed"));
        await new Promise(function(r) { setTimeout(r, 200); });
      }
    }

    throw new Error("All proxies failed: " + errors.join(" | "));
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  async function fetchExchangeUniverse(exchange, apiKey) {
    const rows = [];
    const pageSize = 1000;
    const maxPages = 25;

    for (let page = 0; page < maxPages; page += 1) {
      const url =
        "https://financialmodelingprep.com/api/v3/stock-screener?exchange=" +
        encodeURIComponent(exchange) +
        "&isActivelyTrading=true&limit=" +
        pageSize +
        "&page=" +
        page +
        "&apikey=" +
        encodeURIComponent(apiKey);

      const batch = await fetchJson(url);
      if (!Array.isArray(batch) || !batch.length) break;

      rows.push.apply(rows, batch);
      setDataStatus("Loaded " + rows.length.toLocaleString("en-US") + " rows from " + exchange + "...");

      if (batch.length < pageSize) break;
    }

    return rows;
  }

  function isLikelyUsExchange(exchangeName) {
    if (!exchangeName) return false;
    const text = String(exchangeName).toLowerCase();
    if (text.indexOf("otc") !== -1 || text.indexOf("pink") !== -1) return false;
    return (
      text.indexOf("nasdaq") !== -1 ||
      text.indexOf("nyse") !== -1 ||
      text.indexOf("amex") !== -1 ||
      text.indexOf("arca") !== -1 ||
      text.indexOf("cboe") !== -1
    );
  }

  function extractSecRows(payload) {
    if (!payload) return [];

    if (Array.isArray(payload.data) && Array.isArray(payload.fields)) {
      const tickerIndex = payload.fields.indexOf("ticker");
      const nameIndex = payload.fields.indexOf("name");
      const exchangeIndex = payload.fields.indexOf("exchange");
      if (tickerIndex === -1 || nameIndex === -1) return [];

      return payload.data
        .map(function (row) {
          if (!Array.isArray(row)) return null;
          return {
            symbol: row[tickerIndex],
            name: row[nameIndex],
            exchange: exchangeIndex === -1 ? "Unknown" : row[exchangeIndex],
          };
        })
        .filter(Boolean);
    }

    if (Array.isArray(payload)) {
      return payload.map(function (row) {
        return {
          symbol: row.ticker || row.symbol,
          name: row.name || row.title,
          exchange: row.exchange || "Unknown",
        };
      });
    }

    if (typeof payload === "object") {
      return Object.keys(payload)
        .map(function (key) {
          const row = payload[key];
          if (!row || typeof row !== "object") return null;
          return {
            symbol: row.ticker || row.symbol,
            name: row.name || row.title,
            exchange: row.exchange || "Unknown",
          };
        })
        .filter(Boolean);
    }

    return [];
  }

  function mapAnySymbolRows(rawRows, sourceName) {
    if (!Array.isArray(rawRows) || !rawRows.length) return [];

    const mapped = rawRows
      .map(function (row) {
        if (typeof row === "string") {
          return normalizeCompanyRow({
            symbol: row,
            name: row,
            exchange: sourceName || "US",
          });
        }

        if (!row || typeof row !== "object") return null;

        const symbol = row.symbol || row.ticker || row.code;
        const name = row.name || row.title || symbol;
        const exchange = row.exchange || row.market || row.mic || sourceName || "US";

        if (!symbol) return null;
        if (exchange && !isLikelyUsExchange(exchange) && sourceName === "SEC") return null;

        return normalizeCompanyRow({
          symbol: symbol,
          name: name,
          exchange: exchange,
        });
      })
      .filter(Boolean);

    return dedupeBySymbol(mapped);
  }

  function parseCsvLine(line) {
    const out = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      const next = i + 1 < line.length ? line[i + 1] : "";

      if (ch === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i += 1;
          continue;
        }
        inQuotes = !inQuotes;
        continue;
      }

      if (ch === "," && !inQuotes) {
        out.push(current);
        current = "";
        continue;
      }

      current += ch;
    }

    out.push(current);
    return out;
  }

  function parseSp500Csv(csvText) {
    const lines = String(csvText || "")
      .split(/\r?\n/)
      .map(function (line) {
        return line.trim();
      })
      .filter(Boolean);
    if (!lines.length) return [];

    const headers = parseCsvLine(lines[0]).map(function (h) {
      return h.trim().toLowerCase();
    });

    const symIdx = headers.indexOf("symbol");
    const nameIdx = headers.indexOf("name");
    const secIdx = headers.indexOf("sector");
    if (symIdx === -1 || nameIdx === -1) return [];

    return lines
      .slice(1)
      .map(function (line) {
        const cols = parseCsvLine(line);
        return normalizeCompanyRow({
          symbol: cols[symIdx],
          name: cols[nameIdx],
          sector: secIdx >= 0 ? cols[secIdx] : "US",
        });
      })
      .filter(function (row) {
        return row && row.symbol;
      });
  }

  var IS_FILE_PROTOCOL = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');

  // (fetchSp500Constituents removed — using baked sp500_data.js instead)
  // Placeholder kept for enrichWithStooqEod/Yahoo which are still used
  async function _unused_fetchSp500Constituents() {
    const sources = [
      "https://raw.githubusercontent.com/datasets/s-and-p-500-companies/master/data/constituents.csv",
      "https://raw.githubusercontent.com/plotly/datasets/master/s-and-p-500-companies.csv",
    ];

    const errors = [];
    for (let i = 0; i < sources.length; i += 1) {
      const source = sources[i];
      try {
        setDataStatus("Loading S&P 500 constituents...");
        const csvText = await fetchTextWithCorsFallback(source);
        const rows = parseSp500Csv(csvText);
        if (rows.length >= 450) return { rows: dedupeBySymbol(rows), source: source };
        errors.push("too few rows from source " + (i + 1) + " (" + rows.length + ")");
      } catch (err) {
        errors.push(err && err.message ? err.message : "source " + (i + 1) + " failed");
      }
    }

    return { rows: rowsFromTupleList(SP500_FALLBACK_LIST), source: "fallback" };
  }

  function rowsFromTupleList(tupleList) {
    return tupleList.map(function (item) {
      return normalizeCompanyRow({
        symbol: item[0],
        name: item[1],
        sector: item[2],
      });
    });
  }

  function toStooqSymbol(symbol, marketHint) {
    let value = String(symbol || "")
      .trim()
      .toLowerCase();
    value = value.replace(/\.ns$/i, "").replace(/\.bo$/i, "");
    value = value.replace(/\./g, "-");

    if (marketHint === "in") return value + ".in";
    return value + ".us";
  }

  function parseStooqCsv(text) {
    const lines = String(text || "")
      .trim()
      .split(/\r?\n/)
      .filter(Boolean);
    if (!lines.length) return [];

    const header = lines[0].split(",").map(function (h) {
      return h.trim().toLowerCase();
    });

    function idx(name) {
      return header.indexOf(name);
    }

    const symbolIdx = idx("symbol");
    const closeIdx = idx("close");
    const volumeIdx = idx("volume");

    return lines.slice(1).map(function (line) {
      const parts = line.split(",");
      const symbol = symbolIdx >= 0 ? parts[symbolIdx] : null;
      const closeRaw = closeIdx >= 0 ? parts[closeIdx] : null;
      const volumeRaw = volumeIdx >= 0 ? parts[volumeIdx] : null;

      const close = closeRaw === "N/D" ? null : toNumber(closeRaw);
      const volume = volumeRaw === "N/D" ? null : toNumber(volumeRaw);

      return {
        symbol: symbol ? String(symbol).toUpperCase() : "",
        close: close,
        volume: volume,
      };
    });
  }

  async function fetchStooqBatch(stooqSymbols) {
    if (!stooqSymbols.length) return [];
    const url =
      "https://stooq.com/q/l/?s=" +
      encodeURIComponent(stooqSymbols.join(",")) +
      "&f=sd2t2ohlcv&h&e=csv";
    const csvText = await fetchTextWithCorsFallback(url);
    return parseStooqCsv(csvText);
  }

  async function enrichWithStooqEod(baseRows, marketHint) {
    const rows = baseRows.slice();
    const codeToIndices = new Map();

    rows.forEach(function (row, index) {
      const code = toStooqSymbol(row.symbol, marketHint).toUpperCase();
      if (!codeToIndices.has(code)) codeToIndices.set(code, []);
      codeToIndices.get(code).push(index);
    });

    const codes = Array.from(codeToIndices.keys());
    const chunkSize = 70;
    let pricedCount = 0;

    for (let i = 0; i < codes.length; i += chunkSize) {
      const chunk = codes.slice(i, i + chunkSize);
      setDataStatus(
        "Loading delayed quotes " +
          Math.min(i + chunk.length, codes.length).toLocaleString("en-US") +
          "/" +
          codes.length.toLocaleString("en-US") +
          "..."
      );

      let quoteRows = [];
      try {
        quoteRows = await fetchStooqBatch(chunk);
      } catch (err) {
        continue;
      }

      quoteRows.forEach(function (quote) {
        const indices = codeToIndices.get(String(quote.symbol || "").toUpperCase());
        if (!indices || !indices.length) return;

        indices.forEach(function (idx) {
          const current = rows[idx];
          if (!current) return;
          if (quote.close != null) pricedCount += 1;
          rows[idx] = normalizeCompanyRow({
            symbol: current.symbol,
            name: current.name,
            sector: current.sector,
            price: quote.close != null ? quote.close : current.price,
            marketCapCr: current.marketCapCr,
            pe: current.pe,
            pb: current.pb,
            roe: current.roe,
            roce: current.roce,
            debtEquity: current.debtEquity,
            salesGrowth3Y: current.salesGrowth3Y,
            epsGrowth3Y: current.epsGrowth3Y,
            dividendYield: current.dividendYield,
          });
        });
      });
    }

    const uniquePriced = rows.filter(function (row) {
      return row.price != null;
    }).length;
    return { rows: rows, pricedCount: Math.max(pricedCount, uniquePriced) };
  }

  async function fetchUsSymbolsFromPublicFeeds() {
    const attempts = [
      {
        name: "SEC",
        kind: "json",
        url: "https://www.sec.gov/files/company_tickers_exchange.json",
        parse: function (payload) {
          return mapAnySymbolRows(extractSecRows(payload), "SEC");
        },
      },
      {
        name: "SEC via AllOrigins",
        kind: "json",
        url:
          "https://api.allorigins.win/raw?url=" +
          encodeURIComponent("https://www.sec.gov/files/company_tickers_exchange.json"),
        parse: function (payload) {
          return mapAnySymbolRows(extractSecRows(payload), "SEC");
        },
      },
      {
        name: "GitHub US tickers (all)",
        kind: "json",
        url: "https://raw.githubusercontent.com/rreichel3/US-Stock-Symbols/main/all/all_tickers.json",
        parse: function (payload) {
          return mapAnySymbolRows(payload, "US");
        },
      },
      {
        name: "GitHub US tickers (txt)",
        kind: "text",
        url: "https://raw.githubusercontent.com/rreichel3/US-Stock-Symbols/main/all/all_tickers.txt",
        parse: function (textPayload) {
          const rows = String(textPayload)
            .split(/\r?\n/)
            .map(function (line) {
              return line.trim();
            })
            .filter(Boolean);
          return mapAnySymbolRows(rows, "US");
        },
      },
    ];

    const errors = [];
    for (let i = 0; i < attempts.length; i += 1) {
      const attempt = attempts[i];
      try {
        setDataStatus("Loading US symbols from " + attempt.name + "...");
        const payload =
          attempt.kind === "text"
            ? await fetchTextWithCorsFallback(attempt.url)
            : safeJsonParse(await fetchTextWithCorsFallback(attempt.url), attempt.name);
        const mapped = attempt.parse(payload);
        if (mapped.length >= 2000) {
          return { rows: mapped, source: attempt.name };
        }
        errors.push(attempt.name + " returned too few rows (" + mapped.length + ")");
      } catch (err) {
        errors.push(attempt.name + ": " + (err && err.message ? err.message : "Unknown error"));
      }
    }

    throw new Error("All public symbol feeds failed. " + errors.join(" | "));
  }

  function toYahooSymbol(symbol) {
    const value = String(symbol || "")
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "");

    if (value.endsWith(".NS") || value.endsWith(".BO")) return value;

    return value.replace(/\./g, "-");
  }

  function fromYahooSymbol(symbol) {
    const value = String(symbol || "")
      .trim()
      .toUpperCase();

    if (value.endsWith(".NS") || value.endsWith(".BO")) return value;

    return value.replace(/-/g, ".");
  }

  async function fetchYahooQuoteBatch(symbols) {
    var symsStr = encodeURIComponent(symbols.join(","));
    // Try multiple Yahoo endpoints — some work better through proxies
    var endpoints = [
      "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" + symsStr,
      "https://query2.finance.yahoo.com/v7/finance/quote?symbols=" + symsStr,
      "https://query1.finance.yahoo.com/v8/finance/chart/" + encodeURIComponent(symbols[0]) + "?interval=1d&range=1d",
    ];

    var lastErr = null;
    for (var ei = 0; ei < (symbols.length > 1 ? 2 : endpoints.length); ei++) {
      try {
        const payload = await fetchJsonWithCorsFallback(endpoints[ei]);
        if (payload && payload.quoteResponse && Array.isArray(payload.quoteResponse.result)) {
          return payload.quoteResponse.result;
        }
        // v8 chart response format (single symbol fallback)
        if (payload && payload.chart && payload.chart.result) {
          var r = payload.chart.result[0];
          if (r && r.meta) {
            return [{ symbol: r.meta.symbol, regularMarketPrice: r.meta.regularMarketPrice,
              marketCap: r.meta.marketCap, trailingPE: r.meta.trailingPE }];
          }
        }
      } catch(e) {
        lastErr = e;
      }
    }
    if (lastErr) throw lastErr;
    return [];
  }

  async function enrichWithYahooQuotes(baseRows) {
    const rows = baseRows.slice();
    if (!rows.length) return { rows: rows, pricedCount: 0 };

    const symbolToIndex = new Map();
    rows.forEach(function (row, idx) {
      symbolToIndex.set(String(row.symbol || "").toUpperCase(), idx);
    });

    const yahooSymbols = Array.from(
      new Set(
        rows
          .map(function (row) {
            return toYahooSymbol(row.symbol);
          })
          .filter(Boolean)
      )
    );

    const chunkSize = 80;
    let pricedCount = 0;

    for (let i = 0; i < yahooSymbols.length; i += chunkSize) {
      const chunk = yahooSymbols.slice(i, i + chunkSize);
      setDataStatus(
        "Loading live quotes " +
          Math.min(i + chunk.length, yahooSymbols.length).toLocaleString("en-US") +
          "/" +
          yahooSymbols.length.toLocaleString("en-US") +
          "..."
      );

      let quoteRows = [];
      try {
        quoteRows = await fetchYahooQuoteBatch(chunk);
      } catch (err) {
        continue;
      }

      quoteRows.forEach(function (quote) {
        const qSymbol = String(quote.symbol || "").toUpperCase();
        const localSymbol = fromYahooSymbol(qSymbol);
        const index =
          symbolToIndex.get(localSymbol) != null
            ? symbolToIndex.get(localSymbol)
            : symbolToIndex.get(localSymbol.replace(".WS", ""));
        if (index == null) return;

        const current = rows[index];
        if (!current) return;

        const marketCap = pickFirstNumber(quote, ["marketCap"]);
        const price = pickFirstNumber(quote, ["regularMarketPrice", "postMarketPrice", "preMarketPrice"]);
        if (price != null) pricedCount += 1;

        rows[index] = normalizeCompanyRow({
          symbol: current.symbol,
          name: current.name || quote.longName || quote.shortName || current.symbol,
          sector: current.sector || quote.fullExchangeName || quote.exchange || "US",
          price: price != null ? price : current.price,
          marketCapCr: marketCap != null ? marketCap / 10000000 : current.marketCapCr,
          pe: pickFirstNumber(quote, ["trailingPE", "forwardPE"]) != null ? pickFirstNumber(quote, ["trailingPE", "forwardPE"]) : current.pe,
          pb: pickFirstNumber(quote, ["priceToBook"]) != null ? pickFirstNumber(quote, ["priceToBook"]) : current.pb,
          roe: current.roe,
          roce: current.roce,
          debtEquity: current.debtEquity,
          salesGrowth3Y: current.salesGrowth3Y,
          epsGrowth3Y: current.epsGrowth3Y,
          dividendYield:
            normalizePercent(pickFirstNumber(quote, ["trailingAnnualDividendYield", "dividendYield"])) != null
              ? normalizePercent(pickFirstNumber(quote, ["trailingAnnualDividendYield", "dividendYield"]))
              : current.dividendYield,
        });
      });

      if (state.quoteFetchMode !== "direct") {
        await sleep(140);
      }
    }

    const uniquePriced = rows.filter(function (row) {
      return row.price != null;
    }).length;
    return { rows: rows, pricedCount: Math.max(pricedCount, uniquePriced) };
  }

  function updateUniverse(rows) {
    state.universeData = dedupeBySymbol(rows);
    state.activePreset = "all";
    state.filters = defaultFilters();
    populateSectors();
    fillFormFromState();
    renderPresetButtons();
    applyAndRender();
  }

  function hashString(input) {
    const text = String(input || "");
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = (hash * 16777619) >>> 0;
    }
    return hash >>> 0;
  }

  function previousBusinessDayISO() {
    const now = new Date();
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    let back = 1;
    while (back < 8) {
      const d = new Date(date);
      d.setUTCDate(d.getUTCDate() - back);
      const day = d.getUTCDay();
      if (day !== 0 && day !== 6) {
        return d.toISOString().slice(0, 10);
      }
      back += 1;
    }
    return date.toISOString().slice(0, 10);
  }


  // ── LOAD PIPELINE ──────────────────────────────────────────────────────────
  // Uses baked SP500_UNIVERSE for fundamentals, Yahoo Finance for live prices

  async function enrichWithYahooEod(baseRows) {
    var rows = baseRows.slice();
    var symbolToIdx = {};
    rows.forEach(function(row, i) {
      symbolToIdx[String(row.symbol || "").toUpperCase()] = i;
    });

    var symbols = rows.map(function(r) { return toYahooSymbol(r.symbol); }).filter(Boolean);
    var chunkSize = 100;
    var pricedCount = 0;

    for (var i = 0; i < symbols.length; i += chunkSize) {
      var chunk = symbols.slice(i, i + chunkSize);
      setDataStatus(
        "Fetching live prices " + Math.min(i + chunk.length, symbols.length) + " / " + symbols.length + "..."
      );

      var quoteRows = [];
      try { quoteRows = await fetchYahooQuoteBatch(chunk); } catch(e) { await sleep(300); continue; }

      quoteRows.forEach(function(q) {
        var ySym = String(q.symbol || "").toUpperCase();
        var localSym = fromYahooSymbol(ySym);
        var idx = symbolToIdx[localSym];
        if (idx == null) idx = symbolToIdx[localSym.replace(".WS","")];
        if (idx == null) return;

        var cur = rows[idx];
        var price = pickFirstNumber(q, ["regularMarketPrice","postMarketPrice","preMarketPrice"]);
        var mcap  = pickFirstNumber(q, ["marketCap"]);
        var pe    = pickFirstNumber(q, ["trailingPE","forwardPE"]);
        var pb    = pickFirstNumber(q, ["priceToBook"]);
        var div   = normalizePercent(pickFirstNumber(q, ["trailingAnnualDividendYield","dividendYield"]));

        if (price != null) pricedCount++;

        rows[idx] = normalizeCompanyRow({
          symbol: cur.symbol,
          name: cur.name || q.longName || q.shortName || cur.symbol,
          sector: cur.sector,
          price:        price != null ? price : cur.price,
          marketCapCr:  mcap  != null ? mcap / 1000000 : cur.marketCapCr,
          pe:           pe    != null ? pe   : cur.pe,
          pb:           pb    != null ? pb   : cur.pb,
          roe:          cur.roe,
          roce:         cur.roce,
          debtEquity:   cur.debtEquity,
          salesGrowth3Y: cur.salesGrowth3Y,
          epsGrowth3Y:  cur.epsGrowth3Y,
          dividendYield: div  != null ? div  : cur.dividendYield,
        });
      });

      if (i + chunkSize < symbols.length) await sleep(120);
    }

    return { rows: rows, pricedCount: pricedCount };
  }

  async function loadUSUniverse() {
    if (state.isLoading) return;
    state.isLoading = true;
    if (dom.loadUsStocksBtn) dom.loadUsStocksBtn.disabled = true;

    var asOf = previousBusinessDayISO();
    setDataStatus("Fetching live EOD prices for " + state.universeData.length + " stocks...");

    try {
      var result = await enrichWithYahooEod(state.universeData);
      updateUniverse(result.rows);

      try {
        localStorage.setItem("tsl-market-universe-v2-sp500_eod", JSON.stringify({
          source: "sp500-baked+yahoo",
          fetchedAt: Date.now(),
          asOfDate: asOf,
          count: result.rows.length,
          companies: result.rows,
        }));
      } catch(e) {}

      setDataStatus(
        "✓ " + result.rows.length + " S&P 500 stocks | Live prices: " +
        result.pricedCount + "/" + result.rows.length +
        " | Fundamentals: baked-in | As of: " + asOf + " | Cached.",
        "success"
      );
    } catch(err) {
      var msg = err && err.message ? err.message : "unknown error";
      setDataStatus("Price fetch failed: " + msg + " | Open DevTools Console (F12) for details. Fundamentals still work — use filters normally.", "error");
      console.error("TSL fetch error:", err);
    } finally {
      state.isLoading = false;
      if (dom.loadUsStocksBtn) dom.loadUsStocksBtn.disabled = false;
    }
  }

  function bindEvents() {
    dom.applyFiltersBtn.addEventListener("click", function () {
      state.activePreset = "all";
      renderPresetButtons();
      applyAndRender();
    });

    dom.resetFiltersBtn.addEventListener("click", resetFilters);

    if (dom.loadUsStocksBtn) {
      dom.loadUsStocksBtn.addEventListener("click", function () {
        void loadUSUniverse();
      });
    }

    if (dom.clearCacheBtn) {
      dom.clearCacheBtn.addEventListener("click", function () {
        try {
          localStorage.removeItem(LEGACY_CACHE_KEY);
          localStorage.removeItem("tsl-market-universe-v2-sp500_eod");
          for (let i = localStorage.length - 1; i >= 0; i -= 1) {
            const key = localStorage.key(i);
            if (key && key.indexOf(CACHE_KEY_PREFIX + "-") === 0) {
              localStorage.removeItem(key);
            }
          }
        } catch (err) { void err; }
        state.universeData = buildUniverseFromBaked();
        populateSectors();
        applyAndRender();
        setDataStatus("Cache cleared. " + state.universeData.length + " stocks reloaded from baked data.");
      });
    }

    dom.sortButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const key = button.dataset.sort;
        if (state.sortKey === key) {
          state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
        } else {
          state.sortKey = key;
          state.sortDir = key === "name" || key === "sector" ? "asc" : "desc";
        }
        applyAndRender();
      });
    });

    [
      dom.searchInput, dom.sectorSelect, dom.minMarketCap, dom.maxPe,
      dom.minRoe, dom.minRoce, dom.maxDebtEquity, dom.minSalesGrowth,
      dom.minEpsGrowth, dom.minDividendYield,
    ].forEach(function (el) {
      if (!el) return;
      el.addEventListener("change", function () {
        state.activePreset = "all";
        renderPresetButtons();
        applyAndRender();
      });
      el.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          state.activePreset = "all";
          renderPresetButtons();
          applyAndRender();
        }
      });
    });
  }

  function hydrateFromCache() {
    // Try to load previously cached prices
    var cached = null;
    try {
      var raw = localStorage.getItem("tsl-market-universe-v2-sp500_eod");
      if (raw) cached = JSON.parse(raw);
    } catch(e) {}

    if (cached && Array.isArray(cached.companies) && cached.companies.length > 100) {
      state.universeData = dedupeBySymbol(cached.companies);
      var when = cached.fetchedAt ? new Date(cached.fetchedAt).toLocaleString() : "unknown";
      setDataStatus(
        "✓ " + state.universeData.length + " stocks loaded from cache (prices as of " + when + "). Click Fetch to refresh.",
        "success"
      );
    } else {
      // No cache — baked fundamentals already in state.universeData from buildUniverseFromBaked()
      setDataStatus(
        "\u2713 " + state.universeData.length + " S&P 500 stocks ready. Prices ~2026-03-04 baked in. Click Fetch Live Prices to refresh.",
        ""
      );
    }
  }

  function boot() {
    initializeTheme();
    hydrateFromCache();
    populateSectors();
    fillFormFromState();
    renderPresetButtons();
    bindEvents();
    applyAndRender();
  }

  boot();
});
