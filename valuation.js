document.addEventListener("DOMContentLoaded", function () {
  const HERO_CHIPS = [
    "Featured U.S. company presets",
    "S&P 500 auto-estimates",
    "Bull / base / bear outputs",
    "10-year FCFF projection",
    "Editable margin of safety",
    "Browser-only workflow",
  ];

  const FEATURED_COMPANIES = {
    AAPL: {
      symbol: "AAPL",
      name: "Apple Inc.",
      sector: "Technology",
      price: 211.4,
      revenueB: 391.0,
      operatingMargin: 31.1,
      taxRate: 16.0,
      cashB: 67.2,
      debtB: 110.8,
      sharesB: 15.3,
      salesToCapital: 2.7,
      growthStart: 6.2,
      growthMid: 4.3,
      targetOperatingMargin: 31.0,
      wacc: 8.1,
      terminalGrowth: 2.8,
      marginOfSafety: 18,
      description: "High-return consumer ecosystem with mature margins and steady buyback support.",
      sourceType: "featured",
    },
    MSFT: {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      sector: "Technology",
      price: 428.7,
      revenueB: 245.0,
      operatingMargin: 44.0,
      taxRate: 18.0,
      cashB: 80.1,
      debtB: 63.2,
      sharesB: 7.4,
      salesToCapital: 3.2,
      growthStart: 11.0,
      growthMid: 7.8,
      targetOperatingMargin: 45.0,
      wacc: 8.0,
      terminalGrowth: 2.8,
      marginOfSafety: 15,
      description: "Cloud, productivity, and enterprise software mix with very high incremental margins.",
      sourceType: "featured",
    },
    GOOGL: {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      sector: "Communication Services",
      price: 182.6,
      revenueB: 350.0,
      operatingMargin: 33.0,
      taxRate: 16.0,
      cashB: 111.0,
      debtB: 28.0,
      sharesB: 12.2,
      salesToCapital: 2.9,
      growthStart: 10.0,
      growthMid: 7.0,
      targetOperatingMargin: 34.0,
      wacc: 8.4,
      terminalGrowth: 2.9,
      marginOfSafety: 17,
      description: "Advertising, search, and cloud platform with a large net-cash cushion.",
      sourceType: "featured",
    },
    AMZN: {
      symbol: "AMZN",
      name: "Amazon.com, Inc.",
      sector: "Consumer Discretionary",
      price: 194.4,
      revenueB: 638.0,
      operatingMargin: 11.0,
      taxRate: 18.0,
      cashB: 86.0,
      debtB: 67.0,
      sharesB: 10.5,
      salesToCapital: 2.0,
      growthStart: 12.0,
      growthMid: 8.0,
      targetOperatingMargin: 14.0,
      wacc: 8.8,
      terminalGrowth: 2.8,
      marginOfSafety: 20,
      description: "Retail scale plus AWS leverage creates a wide range of plausible margin outcomes.",
      sourceType: "featured",
    },
    META: {
      symbol: "META",
      name: "Meta Platforms, Inc.",
      sector: "Communication Services",
      price: 494.2,
      revenueB: 165.0,
      operatingMargin: 42.0,
      taxRate: 17.0,
      cashB: 65.0,
      debtB: 18.0,
      sharesB: 2.54,
      salesToCapital: 2.5,
      growthStart: 13.0,
      growthMid: 8.5,
      targetOperatingMargin: 41.0,
      wacc: 8.9,
      terminalGrowth: 2.9,
      marginOfSafety: 20,
      description: "Ad-driven business with strong cash generation and significant AI reinvestment optionality.",
      sourceType: "featured",
    },
    NVDA: {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      sector: "Technology",
      price: 823.7,
      revenueB: 130.0,
      operatingMargin: 57.0,
      taxRate: 15.0,
      cashB: 43.0,
      debtB: 13.0,
      sharesB: 24.5,
      salesToCapital: 3.0,
      growthStart: 18.0,
      growthMid: 10.0,
      targetOperatingMargin: 53.0,
      wacc: 9.5,
      terminalGrowth: 3.0,
      marginOfSafety: 25,
      description: "Exceptional current economics, but valuation remains highly sensitive to growth durability.",
      sourceType: "featured",
    },
    AVGO: {
      symbol: "AVGO",
      name: "Broadcom Inc.",
      sector: "Technology",
      price: 170.0,
      revenueB: 51.0,
      operatingMargin: 44.0,
      taxRate: 14.0,
      cashB: 9.0,
      debtB: 72.0,
      sharesB: 4.7,
      salesToCapital: 2.8,
      growthStart: 14.0,
      growthMid: 8.0,
      targetOperatingMargin: 45.0,
      wacc: 8.9,
      terminalGrowth: 2.8,
      marginOfSafety: 20,
      description: "Semiconductor and infrastructure software mix with high margins and meaningful leverage.",
      sourceType: "featured",
    },
    LLY: {
      symbol: "LLY",
      name: "Eli Lilly and Company",
      sector: "Healthcare",
      price: 920.0,
      revenueB: 45.0,
      operatingMargin: 33.0,
      taxRate: 17.0,
      cashB: 8.0,
      debtB: 18.0,
      sharesB: 0.9,
      salesToCapital: 2.7,
      growthStart: 16.0,
      growthMid: 9.0,
      targetOperatingMargin: 38.0,
      wacc: 8.6,
      terminalGrowth: 2.8,
      marginOfSafety: 22,
      description: "Pipeline-driven growth story where terminal assumptions matter less than execution over the next decade.",
      sourceType: "featured",
    },
    COST: {
      symbol: "COST",
      name: "Costco Wholesale",
      sector: "Consumer Staples",
      price: 880.0,
      revenueB: 254.0,
      operatingMargin: 3.7,
      taxRate: 26.0,
      cashB: 13.0,
      debtB: 8.0,
      sharesB: 0.44,
      salesToCapital: 3.3,
      growthStart: 9.0,
      growthMid: 6.5,
      targetOperatingMargin: 4.1,
      wacc: 7.7,
      terminalGrowth: 2.7,
      marginOfSafety: 18,
      description: "Low-margin retail model with unusually strong membership economics and capital efficiency.",
      sourceType: "featured",
    },
    WMT: {
      symbol: "WMT",
      name: "Walmart Inc.",
      sector: "Consumer Staples",
      price: 61.4,
      revenueB: 681.0,
      operatingMargin: 4.3,
      taxRate: 25.0,
      cashB: 10.0,
      debtB: 55.0,
      sharesB: 8.0,
      salesToCapital: 3.1,
      growthStart: 4.5,
      growthMid: 3.5,
      targetOperatingMargin: 4.8,
      wacc: 7.6,
      terminalGrowth: 2.5,
      marginOfSafety: 15,
      description: "Scale retailer where modest margin changes can meaningfully affect fair value.",
      sourceType: "featured",
    },
    KO: {
      symbol: "KO",
      name: "The Coca-Cola Company",
      sector: "Consumer Staples",
      price: 63.0,
      revenueB: 47.0,
      operatingMargin: 30.0,
      taxRate: 19.0,
      cashB: 18.0,
      debtB: 42.0,
      sharesB: 4.3,
      salesToCapital: 1.9,
      growthStart: 5.0,
      growthMid: 4.0,
      targetOperatingMargin: 31.0,
      wacc: 7.4,
      terminalGrowth: 2.5,
      marginOfSafety: 15,
      description: "Brand-heavy cash generator with stable pricing power and slower but resilient growth.",
      sourceType: "featured",
    },
    XOM: {
      symbol: "XOM",
      name: "Exxon Mobil Corp.",
      sector: "Energy",
      price: 116.0,
      revenueB: 339.0,
      operatingMargin: 13.0,
      taxRate: 28.0,
      cashB: 31.0,
      debtB: 40.0,
      sharesB: 3.9,
      salesToCapital: 1.7,
      growthStart: 3.5,
      growthMid: 2.8,
      targetOperatingMargin: 12.5,
      wacc: 8.7,
      terminalGrowth: 2.5,
      marginOfSafety: 20,
      description: "Commodity-linked cash flows make scenario ranges especially important for fair-value work.",
      sourceType: "featured",
    },
  };

  const SECTOR_TEMPLATES = {
    technology: {
      priceToSales: 8.0,
      operatingMargin: 28.0,
      targetMargin: 31.0,
      taxRate: 18.0,
      cashPct: 0.1,
      debtPct: 0.08,
      salesToCapital: 2.9,
      wacc: 8.8,
      terminalGrowth: 2.9,
      growthStart: 10.0,
    },
    "communication services": {
      priceToSales: 6.0,
      operatingMargin: 26.0,
      targetMargin: 28.0,
      taxRate: 18.0,
      cashPct: 0.09,
      debtPct: 0.09,
      salesToCapital: 2.5,
      wacc: 8.6,
      terminalGrowth: 2.8,
      growthStart: 9.0,
    },
    "consumer discretionary": {
      priceToSales: 2.6,
      operatingMargin: 11.0,
      targetMargin: 12.5,
      taxRate: 23.0,
      cashPct: 0.05,
      debtPct: 0.16,
      salesToCapital: 2.1,
      wacc: 9.0,
      terminalGrowth: 2.7,
      growthStart: 8.0,
    },
    "consumer staples": {
      priceToSales: 1.7,
      operatingMargin: 10.0,
      targetMargin: 11.2,
      taxRate: 24.0,
      cashPct: 0.04,
      debtPct: 0.19,
      salesToCapital: 2.6,
      wacc: 7.7,
      terminalGrowth: 2.5,
      growthStart: 4.8,
    },
    healthcare: {
      priceToSales: 5.1,
      operatingMargin: 24.0,
      targetMargin: 27.0,
      taxRate: 18.0,
      cashPct: 0.07,
      debtPct: 0.14,
      salesToCapital: 2.5,
      wacc: 8.5,
      terminalGrowth: 2.8,
      growthStart: 9.0,
    },
    industrials: {
      priceToSales: 2.2,
      operatingMargin: 14.0,
      targetMargin: 15.0,
      taxRate: 22.0,
      cashPct: 0.04,
      debtPct: 0.18,
      salesToCapital: 1.9,
      wacc: 8.3,
      terminalGrowth: 2.5,
      growthStart: 5.5,
    },
    energy: {
      priceToSales: 1.3,
      operatingMargin: 12.0,
      targetMargin: 13.0,
      taxRate: 26.0,
      cashPct: 0.08,
      debtPct: 0.12,
      salesToCapital: 1.6,
      wacc: 8.7,
      terminalGrowth: 2.5,
      growthStart: 3.5,
    },
    utilities: {
      priceToSales: 2.0,
      operatingMargin: 19.0,
      targetMargin: 20.0,
      taxRate: 23.0,
      cashPct: 0.02,
      debtPct: 0.3,
      salesToCapital: 1.3,
      wacc: 7.1,
      terminalGrowth: 2.2,
      growthStart: 3.5,
    },
    materials: {
      priceToSales: 1.8,
      operatingMargin: 14.0,
      targetMargin: 15.0,
      taxRate: 23.0,
      cashPct: 0.03,
      debtPct: 0.18,
      salesToCapital: 1.8,
      wacc: 8.4,
      terminalGrowth: 2.4,
      growthStart: 5.0,
    },
    financials: {
      priceToSales: 2.5,
      operatingMargin: 26.0,
      targetMargin: 27.0,
      taxRate: 21.0,
      cashPct: 0.02,
      debtPct: 0.45,
      salesToCapital: 1.2,
      wacc: 9.4,
      terminalGrowth: 2.4,
      growthStart: 4.0,
    },
    "real estate": {
      priceToSales: 6.0,
      operatingMargin: 27.0,
      targetMargin: 28.0,
      taxRate: 20.0,
      cashPct: 0.03,
      debtPct: 0.38,
      salesToCapital: 1.4,
      wacc: 8.2,
      terminalGrowth: 2.2,
      growthStart: 4.0,
    },
    default: {
      priceToSales: 2.5,
      operatingMargin: 16.0,
      targetMargin: 17.0,
      taxRate: 22.0,
      cashPct: 0.05,
      debtPct: 0.18,
      salesToCapital: 2.0,
      wacc: 8.5,
      terminalGrowth: 2.5,
      growthStart: 5.5,
    },
  };

  const dom = {
    themeToggle: document.getElementById("themeToggle"),
    heroChips: document.getElementById("heroChips"),
    companySearch: document.getElementById("companySearch"),
    searchCompanyBtn: document.getElementById("searchCompanyBtn"),
    companySelect: document.getElementById("companySelect"),
    companySummary: document.getElementById("companySummary"),
    refreshQuoteBtn: document.getElementById("refreshQuoteBtn"),
    resetAssumptionsBtn: document.getElementById("resetAssumptionsBtn"),
    quoteStatus: document.getElementById("quoteStatus"),
    currentPrice: document.getElementById("currentPrice"),
    revenueB: document.getElementById("revenueB"),
    operatingMargin: document.getElementById("operatingMargin"),
    taxRate: document.getElementById("taxRate"),
    cashB: document.getElementById("cashB"),
    debtB: document.getElementById("debtB"),
    sharesB: document.getElementById("sharesB"),
    salesToCapital: document.getElementById("salesToCapital"),
    growthStart: document.getElementById("growthStart"),
    growthMid: document.getElementById("growthMid"),
    targetOperatingMargin: document.getElementById("targetOperatingMargin"),
    wacc: document.getElementById("wacc"),
    terminalGrowth: document.getElementById("terminalGrowth"),
    marginOfSafety: document.getElementById("marginOfSafety"),
    metricCurrentPrice: document.getElementById("metricCurrentPrice"),
    metricIntrinsicValue: document.getElementById("metricIntrinsicValue"),
    metricBuyBelow: document.getElementById("metricBuyBelow"),
    metricUpside: document.getElementById("metricUpside"),
    scenarioGrid: document.getElementById("scenarioGrid"),
    valuationStatus: document.getElementById("valuationStatus"),
    bridgeGrid: document.getElementById("bridgeGrid"),
    assumptionStrip: document.getElementById("assumptionStrip"),
    projectionTableBody: document.getElementById("projectionTableBody"),
    warningStack: document.getElementById("warningStack"),
  };

  const INPUT_IDS = [
    "currentPrice",
    "revenueB",
    "operatingMargin",
    "taxRate",
    "cashB",
    "debtB",
    "sharesB",
    "salesToCapital",
    "growthStart",
    "growthMid",
    "targetOperatingMargin",
    "wacc",
    "terminalGrowth",
    "marginOfSafety",
  ];

  const state = {
    catalog: [],
    universeMap: new Map(),
    selectedSymbol: "AAPL",
    baseProfile: null,
  };

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

  function toNumber(value) {
    if (value == null) return null;
    if (typeof value === "string" && value.trim() === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function setQuoteStatus(message, tone) {
    if (!dom.quoteStatus) return;
    dom.quoteStatus.textContent = message;
    dom.quoteStatus.classList.remove("error", "success");
    if (tone === "error" || tone === "success") {
      dom.quoteStatus.classList.add(tone);
    }
  }

  function formatNumber(value, digits) {
    if (!Number.isFinite(value)) return "-";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: digits == null ? 1 : digits,
      maximumFractionDigits: digits == null ? 1 : digits,
    });
  }

  function formatCurrency(value, digits) {
    if (!Number.isFinite(value)) return "-";
    return "$" + value.toLocaleString("en-US", {
      minimumFractionDigits: digits == null ? 2 : digits,
      maximumFractionDigits: digits == null ? 2 : digits,
    });
  }

  function formatCurrencyBillions(value) {
    if (!Number.isFinite(value)) return "-";
    return "$" + formatNumber(value, Math.abs(value) >= 100 ? 0 : 1) + "B";
  }

  function formatPercent(value, digits) {
    if (!Number.isFinite(value)) return "-";
    return formatNumber(value, digits == null ? 1 : digits) + "%";
  }

  function formatSignedPercent(value) {
    if (!Number.isFinite(value)) return "-";
    const prefix = value > 0 ? "+" : "";
    return prefix + formatPercent(value, 1);
  }

  function formatMultiple(value) {
    if (!Number.isFinite(value)) return "-";
    return formatNumber(value, 1) + "x";
  }

  function inputValue(value, digits) {
    const numeric = toNumber(value);
    if (numeric == null) return "";
    return numeric.toFixed(digits == null ? 2 : digits);
  }

  function normalizeSector(sector) {
    const value = String(sector || "").trim().toLowerCase();
    if (!value) return "default";
    if (value.includes("tech")) return "technology";
    if (value.includes("communication")) return "communication services";
    if (value.includes("consumer discretionary") || value.includes("automobile")) return "consumer discretionary";
    if (value.includes("consumer staples")) return "consumer staples";
    if (value.includes("health")) return "healthcare";
    if (value.includes("industrial") || value.includes("capital goods")) return "industrials";
    if (value.includes("energy")) return "energy";
    if (value.includes("utility")) return "utilities";
    if (value.includes("material")) return "materials";
    if (value.includes("real estate")) return "real estate";
    if (value.includes("financial") || value.includes("bank") || value.includes("insurance")) return "financials";
    return value in SECTOR_TEMPLATES ? value : "default";
  }

  function buildUniverseMap() {
    const map = new Map();
    const rows = Array.isArray(window.SP500_UNIVERSE) ? window.SP500_UNIVERSE : [];
    rows.forEach(function (row) {
      if (!Array.isArray(row) || !row.length) return;
      map.set(String(row[0] || "").toUpperCase(), {
        symbol: String(row[0] || "").toUpperCase(),
        name: row[1] || row[0] || "Unknown Company",
        sector: row[2] || "Unknown",
        fundamentals: row[3] || {},
      });
    });
    return map;
  }

  function buildCatalog() {
    const featuredSymbols = Object.keys(FEATURED_COMPANIES);
    const featured = featuredSymbols.map(function (symbol) {
      const base = FEATURED_COMPANIES[symbol];
      return {
        symbol: base.symbol,
        name: base.name,
        sector: base.sector,
        featured: true,
      };
    });

    const remaining = Array.from(state.universeMap.values())
      .filter(function (row) {
        return !FEATURED_COMPANIES[row.symbol];
      })
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })
      .map(function (row) {
        return {
          symbol: row.symbol,
          name: row.name,
          sector: row.sector,
          featured: false,
        };
      });

    return featured.concat(remaining);
  }

  function renderHeroChips() {
    if (!dom.heroChips) return;
    dom.heroChips.innerHTML = HERO_CHIPS.map(function (chip) {
      return '<span class="hero-chip">' + chip + "</span>";
    }).join("");
  }

  function populateCompanySelect() {
    if (!dom.companySelect) return;

    const featured = state.catalog.filter(function (item) {
      return item.featured;
    });
    const estimated = state.catalog.filter(function (item) {
      return !item.featured;
    });

    const featuredOptions = featured
      .map(function (item) {
        return (
          '<option value="' +
          item.symbol +
          '">' +
          item.symbol +
          " - " +
          item.name +
          "</option>"
        );
      })
      .join("");

    const estimatedOptions = estimated
      .map(function (item) {
        return (
          '<option value="' +
          item.symbol +
          '">' +
          item.symbol +
          " - " +
          item.name +
          " (" +
          item.sector +
          ")</option>"
        );
      })
      .join("");

    dom.companySelect.innerHTML =
      '<optgroup label="Featured models">' +
      featuredOptions +
      "</optgroup>" +
      (estimatedOptions
        ? '<optgroup label="S&amp;P 500 auto-estimates">' + estimatedOptions + "</optgroup>"
        : "");
  }

  function enrichFeaturedProfile(profile, marketRow) {
    const next = Object.assign({}, profile);
    if (marketRow) {
      next.name = marketRow.name || next.name;
      next.sector = marketRow.sector || next.sector;
      if (toNumber(marketRow.fundamentals.price) != null) {
        next.price = toNumber(marketRow.fundamentals.price);
      }
    }
    return next;
  }

  function estimateProfileFromUniverse(marketRow) {
    const templateKey = normalizeSector(marketRow && marketRow.sector);
    const template = SECTOR_TEMPLATES[templateKey] || SECTOR_TEMPLATES.default;
    const fundamentals = (marketRow && marketRow.fundamentals) || {};
    const price = toNumber(fundamentals.price) != null ? toNumber(fundamentals.price) : 100;
    const marketCapB =
      toNumber(fundamentals.mcap) != null ? toNumber(fundamentals.mcap) / 1000 : clamp(price * 1.8, 8, 250);
    const sharesB = price > 0 ? marketCapB / price : clamp(marketCapB / 80, 0.15, 15);
    const revenueGrowthHint = toNumber(fundamentals.sg);
    const earningsGrowthHint = toNumber(fundamentals.eg);
    let growthHint = template.growthStart;
    if (revenueGrowthHint != null && earningsGrowthHint != null) {
      growthHint = (revenueGrowthHint + earningsGrowthHint * 0.5) / 1.5;
    } else if (revenueGrowthHint != null) {
      growthHint = revenueGrowthHint;
    } else if (earningsGrowthHint != null) {
      growthHint = earningsGrowthHint * 0.75;
    }
    growthHint = clamp(growthHint, -2, 20);

    const revenueB = clamp(marketCapB / template.priceToSales, 1.5, 1200);
    const growthMid = clamp(Math.max(template.terminalGrowth + 0.6, growthHint * 0.6), -1, 12);

    return {
      symbol: marketRow.symbol,
      name: marketRow.name,
      sector: marketRow.sector,
      price: price,
      revenueB: revenueB,
      operatingMargin: template.operatingMargin,
      taxRate: template.taxRate,
      cashB: marketCapB * template.cashPct,
      debtB: marketCapB * template.debtPct,
      sharesB: sharesB,
      salesToCapital: template.salesToCapital,
      growthStart: growthHint,
      growthMid: growthMid,
      targetOperatingMargin: template.targetMargin,
      wacc: template.wacc,
      terminalGrowth: template.terminalGrowth,
      marginOfSafety: 20,
      description:
        "Heuristic starting point built from the local S&P 500 snapshot, sector averages, and current price / market cap inputs.",
      sourceType: "estimated",
    };
  }

  function getProfileForSymbol(symbol) {
    const upper = String(symbol || "").toUpperCase();
    const marketRow = state.universeMap.get(upper);

    if (FEATURED_COMPANIES[upper]) {
      return enrichFeaturedProfile(FEATURED_COMPANIES[upper], marketRow);
    }

    if (marketRow) {
      return estimateProfileFromUniverse(marketRow);
    }

    return enrichFeaturedProfile(FEATURED_COMPANIES.AAPL, null);
  }

  function fillInputs(profile) {
    dom.currentPrice.value = inputValue(profile.price, 2);
    dom.revenueB.value = inputValue(profile.revenueB, 1);
    dom.operatingMargin.value = inputValue(profile.operatingMargin, 1);
    dom.taxRate.value = inputValue(profile.taxRate, 1);
    dom.cashB.value = inputValue(profile.cashB, 1);
    dom.debtB.value = inputValue(profile.debtB, 1);
    dom.sharesB.value = inputValue(profile.sharesB, 2);
    dom.salesToCapital.value = inputValue(profile.salesToCapital, 1);
    dom.growthStart.value = inputValue(profile.growthStart, 1);
    dom.growthMid.value = inputValue(profile.growthMid, 1);
    dom.targetOperatingMargin.value = inputValue(profile.targetOperatingMargin, 1);
    dom.wacc.value = inputValue(profile.wacc, 1);
    dom.terminalGrowth.value = inputValue(profile.terminalGrowth, 1);
    dom.marginOfSafety.value = inputValue(profile.marginOfSafety, 0);
  }

  function readProfileFromInputs() {
    const base = state.baseProfile || getProfileForSymbol(state.selectedSymbol);
    return {
      symbol: base.symbol,
      name: base.name,
      sector: base.sector,
      description: base.description,
      sourceType: base.sourceType,
      price: toNumber(dom.currentPrice.value) || 0,
      revenueB: toNumber(dom.revenueB.value) || 0,
      operatingMargin: toNumber(dom.operatingMargin.value) || 0,
      taxRate: toNumber(dom.taxRate.value) || 0,
      cashB: toNumber(dom.cashB.value) || 0,
      debtB: toNumber(dom.debtB.value) || 0,
      sharesB: toNumber(dom.sharesB.value) || 0,
      salesToCapital: toNumber(dom.salesToCapital.value) || 0,
      growthStart: toNumber(dom.growthStart.value) || 0,
      growthMid: toNumber(dom.growthMid.value) || 0,
      targetOperatingMargin: toNumber(dom.targetOperatingMargin.value) || 0,
      wacc: toNumber(dom.wacc.value) || 0,
      terminalGrowth: toNumber(dom.terminalGrowth.value) || 0,
      marginOfSafety: toNumber(dom.marginOfSafety.value) || 0,
    };
  }

  function growthForYear(year, profile) {
    if (year <= 5) {
      return lerp(profile.growthStart, profile.growthMid, (year - 1) / 4);
    }
    return lerp(profile.growthMid, profile.terminalGrowth, (year - 6) / 4);
  }

  function validateProfile(profile) {
    const errors = [];
    if (profile.price <= 0) errors.push("Current price must be above zero.");
    if (profile.revenueB <= 0) errors.push("Revenue must be above zero.");
    if (profile.sharesB <= 0) errors.push("Shares outstanding must be above zero.");
    if (profile.salesToCapital <= 0) errors.push("Sales / capital must be above zero.");
    if (profile.wacc <= profile.terminalGrowth + 0.2) errors.push("WACC should stay comfortably above terminal growth.");
    if (profile.targetOperatingMargin < -20 || profile.targetOperatingMargin > 70) {
      errors.push("Target operating margin looks out of range.");
    }
    return errors;
  }

  function runValuation(profile) {
    const rows = [];
    let revenue = profile.revenueB;
    const waccDecimal = profile.wacc / 100;
    const taxKeep = 1 - profile.taxRate / 100;

    for (let year = 1; year <= 10; year += 1) {
      const growth = growthForYear(year, profile);
      const nextRevenue = revenue * (1 + growth / 100);
      const margin = lerp(profile.operatingMargin, profile.targetOperatingMargin, year / 10);
      const ebit = nextRevenue * (margin / 100);
      const nopat = ebit * taxKeep;
      const reinvestment = (nextRevenue - revenue) / profile.salesToCapital;
      const fcff = nopat - reinvestment;
      const pvFactor = 1 / Math.pow(1 + waccDecimal, year);
      const pvFcff = fcff * pvFactor;

      rows.push({
        year: year,
        growth: growth,
        revenue: nextRevenue,
        margin: margin,
        ebit: ebit,
        reinvestment: reinvestment,
        fcff: fcff,
        pvFactor: pvFactor,
        pvFcff: pvFcff,
      });

      revenue = nextRevenue;
    }

    const revenue11 = revenue * (1 + profile.terminalGrowth / 100);
    const ebit11 = revenue11 * (profile.targetOperatingMargin / 100);
    const nopat11 = ebit11 * taxKeep;
    const reinvestment11 = (revenue11 - revenue) / profile.salesToCapital;
    const fcff11 = nopat11 - reinvestment11;
    const terminalValue = fcff11 / ((profile.wacc - profile.terminalGrowth) / 100);
    const pvTerminal = terminalValue * (1 / Math.pow(1 + waccDecimal, 10));
    const pvForecast = rows.reduce(function (sum, row) {
      return sum + row.pvFcff;
    }, 0);
    const enterpriseValue = pvForecast + pvTerminal;
    const netCash = profile.cashB - profile.debtB;
    const equityValue = enterpriseValue + netCash;
    const intrinsicValuePerShare = equityValue / profile.sharesB;
    const buyBelow = intrinsicValuePerShare * (1 - profile.marginOfSafety / 100);
    const upside = profile.price > 0 ? (intrinsicValuePerShare / profile.price - 1) * 100 : 0;
    const terminalWeight = enterpriseValue !== 0 ? (pvTerminal / enterpriseValue) * 100 : 0;

    return {
      rows: rows,
      fcff11: fcff11,
      pvForecast: pvForecast,
      pvTerminal: pvTerminal,
      enterpriseValue: enterpriseValue,
      equityValue: equityValue,
      netCash: netCash,
      intrinsicValuePerShare: intrinsicValuePerShare,
      buyBelow: buyBelow,
      upside: upside,
      terminalWeight: terminalWeight,
    };
  }

  function buildScenarioProfile(profile, variant) {
    let nextProfile;
    if (variant === "bear") {
      nextProfile = Object.assign({}, profile, {
        growthStart: clamp(profile.growthStart - 3, -10, 30),
        growthMid: clamp(profile.growthMid - 2, -5, 20),
        targetOperatingMargin: clamp(profile.targetOperatingMargin - 2, -10, 70),
        wacc: clamp(profile.wacc + 1.2, 3, 20),
        terminalGrowth: clamp(profile.terminalGrowth - 0.6, 0, 5),
      });
    } else if (variant === "bull") {
      nextProfile = Object.assign({}, profile, {
        growthStart: clamp(profile.growthStart + 2.5, -10, 35),
        growthMid: clamp(profile.growthMid + 1.5, -5, 25),
        targetOperatingMargin: clamp(profile.targetOperatingMargin + 1.5, -10, 70),
        wacc: clamp(profile.wacc - 0.8, 3, 20),
        terminalGrowth: clamp(profile.terminalGrowth + 0.4, 0, 5),
      });
    } else {
      nextProfile = Object.assign({}, profile);
    }

    if (nextProfile.terminalGrowth >= nextProfile.wacc - 0.3) {
      nextProfile.terminalGrowth = clamp(nextProfile.wacc - 0.6, 0, 5);
    }
    return nextProfile;
  }

  function marketCapB(profile) {
    return profile.price * profile.sharesB;
  }

  function renderCompanySummary(profile) {
    if (!dom.companySummary) return;
    const sourceLabel = profile.sourceType === "featured" ? "Featured model" : "Auto-estimated";
    const sourceClass = profile.sourceType === "featured" ? "featured" : "estimated";
    dom.companySummary.innerHTML =
      '<div class="company-summary-head">' +
      '<div>' +
      '<h3 class="company-summary-title">' +
      profile.name +
      "</h3>" +
      '<p class="company-summary-meta">' +
      profile.symbol +
      " | " +
      profile.sector +
      "</p>" +
      "</div>" +
      '<span class="source-pill ' +
      sourceClass +
      '">' +
      sourceLabel +
      "</span>" +
      "</div>" +
      "<p>" +
      profile.description +
      "</p>" +
      '<div class="summary-stat-grid">' +
      '<div class="summary-stat"><span>Market Cap (USD B)</span><strong>' +
      formatCurrencyBillions(marketCapB(profile)) +
      "</strong></div>" +
      '<div class="summary-stat"><span>Net Cash / Debt (USD B)</span><strong>' +
      formatCurrencyBillions(profile.cashB - profile.debtB) +
      "</strong></div>" +
      '<div class="summary-stat"><span>Start Margin</span><strong>' +
      formatPercent(profile.operatingMargin, 1) +
      "</strong></div>" +
      '<div class="summary-stat"><span>Growth Path</span><strong>' +
      formatPercent(profile.growthStart, 1) +
      " to " +
      formatPercent(profile.growthMid, 1) +
      "</strong></div>" +
      "</div>";
  }

  function renderMetrics(profile, result) {
    dom.metricCurrentPrice.textContent = formatCurrency(profile.price, 2);
    dom.metricIntrinsicValue.textContent = formatCurrency(result.intrinsicValuePerShare, 2);
    dom.metricBuyBelow.textContent = formatCurrency(result.buyBelow, 2);
    dom.metricUpside.textContent = formatSignedPercent(result.upside);
    dom.metricUpside.classList.remove("is-positive", "is-negative");
    dom.metricUpside.classList.add(result.upside >= 0 ? "is-positive" : "is-negative");
  }

  function renderScenarioGrid(profile) {
    const scenarios = [
      { key: "bear", title: "Bear Case", badge: "Defensive", profile: buildScenarioProfile(profile, "bear") },
      { key: "base", title: "Base Case", badge: "Working", profile: buildScenarioProfile(profile, "base") },
      { key: "bull", title: "Bull Case", badge: "Upside", profile: buildScenarioProfile(profile, "bull") },
    ];

    dom.scenarioGrid.innerHTML = scenarios
      .map(function (scenario) {
        const result = runValuation(scenario.profile);
        const upsideClass = result.upside >= 0 ? "is-positive" : "is-negative";
        return (
          '<article class="scenario-card ' +
          scenario.key +
          '">' +
          '<div class="scenario-head"><h3>' +
          scenario.title +
          '</h3><span class="scenario-badge">' +
          scenario.badge +
          "</span></div>" +
          '<strong class="scenario-value ' +
          upsideClass +
          '">' +
          formatCurrency(result.intrinsicValuePerShare, 2) +
          "</strong>" +
          '<div class="scenario-meta"><span>Upside ' +
          formatSignedPercent(result.upside) +
          "</span><span>WACC " +
          formatPercent(scenario.profile.wacc, 1) +
          "</span><span>Terminal " +
          formatPercent(scenario.profile.terminalGrowth, 1) +
          "</span></div>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderBridge(result) {
    const items = [
      { label: "Explicit cash flows (USD B)", value: result.pvForecast, fill: "forecast" },
      { label: "Terminal value (USD B)", value: result.pvTerminal, fill: "terminal" },
      { label: "Net cash / debt (USD B)", value: result.netCash, fill: result.netCash >= 0 ? "equity" : "debt" },
      { label: "Equity value (USD B)", value: result.equityValue, fill: "equity" },
    ];

    const maxAbs = items.reduce(function (max, item) {
      return Math.max(max, Math.abs(item.value));
    }, 1);

    dom.bridgeGrid.innerHTML = items
      .map(function (item) {
        const width = clamp((Math.abs(item.value) / maxAbs) * 100, 6, 100);
        return (
          '<article class="bridge-card">' +
          "<span>" +
          item.label +
          "</span>" +
          "<strong>" +
          formatCurrencyBillions(item.value) +
          "</strong>" +
          '<div class="bridge-bar"><span class="bridge-fill ' +
          item.fill +
          '" style="width:' +
          width +
          '%"></span></div>' +
          "</article>"
        );
      })
      .join("");

    dom.valuationStatus.textContent =
      "Terminal value contributes " +
      formatPercent(result.terminalWeight, 1) +
      " of enterprise value. Explicit forecast PV totals " +
      formatCurrencyBillions(result.pvForecast) +
      ".";
  }

  function renderAssumptionStrip(profile, result) {
    const chips = [
      "Growth Y1 " + formatPercent(profile.growthStart, 1),
      "Growth Y5 " + formatPercent(profile.growthMid, 1),
      "Target margin " + formatPercent(profile.targetOperatingMargin, 1),
      "WACC " + formatPercent(profile.wacc, 1),
      "Terminal growth " + formatPercent(profile.terminalGrowth, 1),
      "Sales / capital " + formatMultiple(profile.salesToCapital),
      "Year 11 FCFF " + formatCurrencyBillions(result.fcff11),
      "Buy below " + formatCurrency(result.buyBelow, 2),
    ];

    dom.assumptionStrip.innerHTML = chips
      .map(function (chip) {
        return '<span class="assumption-chip">' + chip + "</span>";
      })
      .join("");
  }

  function renderProjectionTable(result) {
    dom.projectionTableBody.innerHTML = result.rows
      .map(function (row) {
        return (
          "<tr>" +
          "<td>Year " +
          row.year +
          "</td>" +
          "<td>" +
          formatPercent(row.growth, 1) +
          "</td>" +
          "<td>" +
          formatNumber(row.revenue, 1) +
          "</td>" +
          "<td>" +
          formatPercent(row.margin, 1) +
          "</td>" +
          "<td>" +
          formatNumber(row.ebit, 1) +
          "</td>" +
          "<td>" +
          formatNumber(row.reinvestment, 1) +
          "</td>" +
          "<td>" +
          formatNumber(row.fcff, 1) +
          "</td>" +
          "<td>" +
          formatMultiple(row.pvFactor) +
          "</td>" +
          "<td>" +
          formatNumber(row.pvFcff, 1) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function renderWarnings(profile, result) {
    const warnings = [];

    if (profile.sourceType === "estimated") {
      warnings.push({
        tone: "info",
        title: "Estimated starting snapshot",
        body: "This company profile is auto-generated from the baked S&P 500 snapshot plus sector heuristics. Treat it as a fast draft, not a filing-accurate model.",
      });
    }

    if (/financial|bank|insurance/i.test(profile.sector)) {
      warnings.push({
        tone: "warning",
        title: "FCFF fit is weaker here",
        body: "For banks and insurers, dividend, excess-return, or book-value based approaches usually tell a cleaner story than an operating DCF.",
      });
    }

    if (/real estate/i.test(profile.sector)) {
      warnings.push({
        tone: "warning",
        title: "REIT-style cash flow caution",
        body: "Real-estate businesses are often better valued with AFFO, NAV, or dividend frameworks than a standard FCFF model.",
      });
    }

    if (result.terminalWeight > 75) {
      warnings.push({
        tone: "warning",
        title: "High terminal-value dependence",
        body: "More than three quarters of enterprise value is coming from terminal value. Tighten your WACC, terminal growth, and margin assumptions to pressure-test the output.",
      });
    }

    if (result.rows.some(function (row) { return row.fcff < 0; })) {
      warnings.push({
        tone: "info",
        title: "Negative FCFF appears in the forecast",
        body: "That can be reasonable for reinvestment-heavy periods, but it usually means fair value will be extra sensitive to your sales-to-capital and margin path.",
      });
    }

    dom.warningStack.innerHTML = warnings
      .map(function (item) {
        return (
          '<article class="notice-card ' +
          item.tone +
          '"><p><strong>' +
          item.title +
          ".</strong> " +
          item.body +
          "</p></article>"
        );
      })
      .join("");
  }

  function renderInvalidState(profile, errors) {
    renderCompanySummary(profile);
    dom.metricCurrentPrice.textContent = formatCurrency(profile.price, 2);
    dom.metricIntrinsicValue.textContent = "-";
    dom.metricBuyBelow.textContent = "-";
    dom.metricUpside.textContent = "Check inputs";
    dom.metricUpside.classList.remove("is-positive", "is-negative");
    dom.scenarioGrid.innerHTML = "";
    dom.bridgeGrid.innerHTML = "";
    dom.assumptionStrip.innerHTML = "";
    dom.projectionTableBody.innerHTML =
      '<tr><td colspan="9">Update the inputs above to resolve: ' + errors.join(" ") + "</td></tr>";
    dom.warningStack.innerHTML = errors
      .map(function (error) {
        return '<article class="notice-card warning"><p><strong>Model issue.</strong> ' + error + "</p></article>";
      })
      .join("");
    dom.valuationStatus.textContent = "The model needs a few valid inputs before it can compute a DCF.";
  }

  function renderAll() {
    const profile = readProfileFromInputs();
    const errors = validateProfile(profile);
    if (errors.length) {
      renderInvalidState(profile, errors);
      return;
    }

    const result = runValuation(profile);
    renderCompanySummary(profile);
    renderMetrics(profile, result);
    renderScenarioGrid(profile);
    renderBridge(result);
    renderAssumptionStrip(profile, result);
    renderProjectionTable(result);
    renderWarnings(profile, result);
  }

  function loadCompany(symbol) {
    const nextProfile = getProfileForSymbol(symbol);
    state.selectedSymbol = nextProfile.symbol;
    state.baseProfile = nextProfile;
    if (dom.companySelect) {
      dom.companySelect.value = nextProfile.symbol;
    }
    fillInputs(nextProfile);
    renderAll();

    try {
      localStorage.setItem("tsl-dcf-selected", nextProfile.symbol);
    } catch (err) {
      void err;
    }
  }

  function findBestMatch(query) {
    const normalized = String(query || "").trim().toLowerCase();
    if (!normalized) return null;

    let best = state.catalog.find(function (item) {
      return item.symbol.toLowerCase() === normalized;
    });
    if (best) return best;

    best = state.catalog.find(function (item) {
      return item.symbol.toLowerCase().startsWith(normalized);
    });
    if (best) return best;

    return state.catalog.find(function (item) {
      return item.name.toLowerCase().includes(normalized);
    }) || null;
  }

  async function fetchText(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    return await response.text();
  }

  async function fetchJsonWithFallback(url) {
    const attempts = [];
    const isFileProtocol = window.location && window.location.protocol === "file:";

    if (!isFileProtocol) {
      attempts.push({ name: "direct", url: url });
    }
    attempts.push({ name: "allorigins", url: "https://api.allorigins.win/raw?url=" + encodeURIComponent(url) });
    attempts.push({ name: "corsproxy", url: "https://corsproxy.io/?" + encodeURIComponent(url) });
    attempts.push({ name: "codetabs", url: "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(url) });

    const errors = [];
    for (let i = 0; i < attempts.length; i += 1) {
      const attempt = attempts[i];
      try {
        const text = await fetchText(attempt.url);
        return JSON.parse(text);
      } catch (err) {
        errors.push(attempt.name + ": " + (err && err.message ? err.message : "failed"));
      }
    }

    throw new Error(errors.join(" | "));
  }

  function toYahooSymbol(symbol) {
    return String(symbol || "")
      .trim()
      .toUpperCase()
      .replace(/\./g, "-");
  }

  async function refreshLiveQuote() {
    if (!state.selectedSymbol) return;
    if (dom.refreshQuoteBtn) dom.refreshQuoteBtn.disabled = true;
    setQuoteStatus("Refreshing live quote for " + state.selectedSymbol + "...");

    try {
      const payload = await fetchJsonWithFallback(
        "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" + encodeURIComponent(toYahooSymbol(state.selectedSymbol))
      );
      const quote = payload && payload.quoteResponse && payload.quoteResponse.result && payload.quoteResponse.result[0];
      const price = quote && toNumber(quote.regularMarketPrice);
      if (price == null) {
        throw new Error("No live price returned");
      }

      dom.currentPrice.value = inputValue(price, 2);
      renderAll();
      setQuoteStatus("Live price refreshed for " + state.selectedSymbol + ": " + formatCurrency(price, 2), "success");
    } catch (err) {
      const message = err && err.message ? err.message : "Unknown quote error";
      setQuoteStatus("Live quote refresh failed. " + message + ". You can still value the company with manual inputs.", "error");
    } finally {
      if (dom.refreshQuoteBtn) dom.refreshQuoteBtn.disabled = false;
    }
  }

  function bindEvents() {
    if (dom.companySelect) {
      dom.companySelect.addEventListener("change", function () {
        loadCompany(dom.companySelect.value);
      });
    }

    if (dom.searchCompanyBtn) {
      dom.searchCompanyBtn.addEventListener("click", function () {
        const match = findBestMatch(dom.companySearch.value);
        if (!match) {
          setQuoteStatus("No matching company found in the local catalog. Try another ticker or company name.", "error");
          return;
        }
        loadCompany(match.symbol);
        setQuoteStatus("Loaded " + match.symbol + " from the local catalog.", "success");
      });
    }

    if (dom.companySearch) {
      dom.companySearch.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          dom.searchCompanyBtn.click();
        }
      });
    }

    if (dom.resetAssumptionsBtn) {
      dom.resetAssumptionsBtn.addEventListener("click", function () {
        loadCompany(state.selectedSymbol);
        setQuoteStatus("Reset assumptions back to the selected company snapshot.", "success");
      });
    }

    if (dom.refreshQuoteBtn) {
      dom.refreshQuoteBtn.addEventListener("click", function () {
        void refreshLiveQuote();
      });
    }

    INPUT_IDS.forEach(function (id) {
      const element = dom[id];
      if (!element) return;
      element.addEventListener("input", function () {
        renderAll();
      });
    });
  }

  function initialize() {
    initializeTheme();
    state.universeMap = buildUniverseMap();
    state.catalog = buildCatalog();
    renderHeroChips();
    populateCompanySelect();
    bindEvents();

    let initialSymbol = "AAPL";
    try {
      initialSymbol = localStorage.getItem("tsl-dcf-selected") || "AAPL";
    } catch (err) {
      void err;
    }
    if (!getProfileForSymbol(initialSymbol)) {
      initialSymbol = "AAPL";
    }

    loadCompany(initialSymbol);
  }

  initialize();
});
