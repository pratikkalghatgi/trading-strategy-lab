#!/usr/bin/env python3
"""
Run this once to fetch yesterday's EOD prices and bake them into sp500_data.js

Requirements: pip install yfinance requests
Usage:        python3 fetch_prices.py

Place this script in the same folder as sp500_data.js and run it.
It will overwrite sp500_data.js with live prices baked in.
"""

import json, re, time, sys
from datetime import date, timedelta
from pathlib import Path

# ── 1. Read current sp500_data.js ────────────────────────────────────────────
here = Path(__file__).parent
data_file = here / "sp500_data.js"
if not data_file.exists():
    print("ERROR: sp500_data.js not found. Place this script in the same folder.")
    sys.exit(1)

raw = data_file.read_text()
# Parse the JS array
match = re.search(r'window\.SP500_UNIVERSE\s*=\s*(\[[\s\S]+\]);', raw)
if not match:
    print("ERROR: Could not parse SP500_UNIVERSE from sp500_data.js")
    sys.exit(1)

universe = json.loads(match.group(1))
symbols = [row[0] for row in universe]
print(f"Loaded {len(symbols)} symbols from sp500_data.js")

# ── 2. Fetch prices ──────────────────────────────────────────────────────────
try:
    import yfinance as yf
    USE_YFINANCE = True
except ImportError:
    USE_YFINANCE = False

prices = {}   # symbol -> {price, pe, pb, market_cap_m, div_yield}

if USE_YFINANCE:
    print("Fetching prices via yfinance (batched)...")
    chunk_size = 100
    for i in range(0, len(symbols), chunk_size):
        chunk = symbols[i:i+chunk_size]
        # yfinance uses - instead of . for BRK.B etc
        yf_syms = [s.replace(".", "-") for s in chunk]
        try:
            tickers = yf.Tickers(" ".join(yf_syms))
            hist = yf.download(
                " ".join(yf_syms),
                period="5d", interval="1d",
                group_by="ticker", auto_adjust=True,
                progress=False, threads=True
            )
            for sym, ysym in zip(chunk, yf_syms):
                try:
                    if len(chunk) == 1:
                        close_col = hist["Close"]
                    else:
                        close_col = hist[ysym]["Close"] if ysym in hist.columns.get_level_values(0) else None
                    if close_col is not None:
                        last_price = float(close_col.dropna().iloc[-1])
                        prices[sym] = {"price": round(last_price, 2)}
                except Exception:
                    pass
            # Also get fundamentals from info
            for sym, ysym in zip(chunk, yf_syms):
                try:
                    info = tickers.tickers[ysym].fast_info
                    p = prices.get(sym, {})
                    p["price"] = p.get("price") or round(float(info.last_price or 0), 2)
                    p["market_cap_m"] = round(float(info.market_cap or 0) / 1e6, 0)
                    prices[sym] = p
                except Exception:
                    pass
                try:
                    info2 = tickers.tickers[ysym].info
                    p = prices.get(sym, {})
                    p["pe"] = info2.get("trailingPE") or info2.get("forwardPE")
                    p["pb"] = info2.get("priceToBook")
                    p["div_yield"] = info2.get("trailingAnnualDividendYield", 0)
                    if p["div_yield"]: p["div_yield"] = round(p["div_yield"] * 100, 2)
                    prices[sym] = p
                except Exception:
                    pass
        except Exception as e:
            print(f"  Batch {i//chunk_size + 1} error: {e}")
        print(f"  Done {min(i+chunk_size, len(symbols))}/{len(symbols)}")
        time.sleep(0.5)
else:
    print("yfinance not installed. Trying requests fallback...")
    try:
        import requests
        chunk_size = 100
        for i in range(0, len(symbols), chunk_size):
            chunk = symbols[i:i+chunk_size]
            yf_syms = [s.replace(".", "-") for s in chunk]
            url = (
                "https://query1.finance.yahoo.com/v7/finance/quote?symbols="
                + "%2C".join(yf_syms)
            )
            try:
                r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
                data = r.json()
                for q in data.get("quoteResponse", {}).get("result", []):
                    raw_sym = q.get("symbol", "").replace("-", ".")
                    prices[raw_sym] = {
                        "price": round(q.get("regularMarketPrice", 0), 2),
                        "pe": q.get("trailingPE"),
                        "pb": q.get("priceToBook"),
                        "market_cap_m": round((q.get("marketCap") or 0) / 1e6, 0),
                        "div_yield": round((q.get("trailingAnnualDividendYield") or 0) * 100, 2),
                    }
            except Exception as e:
                print(f"  Batch error: {e}")
            print(f"  Done {min(i+chunk_size, len(symbols))}/{len(symbols)}")
            time.sleep(0.3)
    except ImportError:
        print("ERROR: Neither yfinance nor requests is installed.")
        print("Run: pip install yfinance requests")
        sys.exit(1)

print(f"Prices fetched for {len(prices)}/{len(symbols)} symbols")

# ── 3. Merge prices back into universe ───────────────────────────────────────
today = date.today()
prev_bd = today - timedelta(days=1)
if prev_bd.weekday() >= 5:  # weekend
    prev_bd = today - timedelta(days=today.weekday() - 4 if today.weekday() >= 5 else 3)
as_of = prev_bd.strftime("%Y-%m-%d")

for row in universe:
    sym = row[0]
    p = prices.get(sym, {})
    if len(row) < 4:
        row.append({})
    f = row[3]
    if p.get("price"):       f["price"]  = p["price"]
    if p.get("pe"):          f["pe"]     = round(float(p["pe"]), 1)
    if p.get("pb"):          f["pb"]     = round(float(p["pb"]), 2)
    if p.get("market_cap_m"): f["mcap"]  = p["market_cap_m"]
    if p.get("div_yield") is not None: f["div"] = p["div_yield"]

# ── 4. Write updated sp500_data.js ───────────────────────────────────────────
lines = [f"// S&P 500 universe — prices as of {as_of} — {len(universe)} stocks"]
lines.append("// Auto-generated by fetch_prices.py — do not edit manually")
lines.append("window.SP500_UNIVERSE = [")
for i, row in enumerate(universe):
    comma = "," if i < len(universe) - 1 else ""
    lines.append(json.dumps(row, separators=(',', ':')) + comma)
lines.append("];")

data_file.write_text("\n".join(lines))
priced = sum(1 for row in universe if row[3].get("price"))
print(f"\nDone! sp500_data.js updated:")
print(f"  Stocks: {len(universe)}")
print(f"  Priced: {priced}")
print(f"  As of:  {as_of}")
print(f"\nRefresh fundamental.html in your browser.")
