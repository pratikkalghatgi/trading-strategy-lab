document.addEventListener("DOMContentLoaded", function () {
  const TIMEFRAMES = [
    { value: "1m", label: "1m", yahooInterval: "1m", yahooRange: "7d", seconds: 60, minCandles: 200, cacheLimit: 12000 },
    { value: "5m", label: "5m", yahooInterval: "5m", yahooRange: "60d", seconds: 5 * 60, minCandles: 200, cacheLimit: 12000 },
    { value: "15m", label: "15min", yahooInterval: "15m", yahooRange: "60d", seconds: 15 * 60, minCandles: 200, cacheLimit: 12000 },
    { value: "30m", label: "30min", yahooInterval: "30m", yahooRange: "60d", seconds: 30 * 60, minCandles: 200, cacheLimit: 12000 },
    { value: "1D", label: "1 day", yahooInterval: "1d", yahooRange: "max", seconds: 24 * 60 * 60, minCandles: 200, cacheLimit: 6000 },
  ];

  const TIMEFRAME_MAP = TIMEFRAMES.reduce(function (acc, tf) {
    acc[tf.value] = tf;
    return acc;
  }, {});

  const ASSETS = [
    { id: "mmm", label: "3M", yahoo: "MMM", stooq: "mmm.us" },
    { id: "aos", label: "A.O. Smith", yahoo: "AOS", stooq: "aos.us" },
    { id: "abt", label: "Abbott", yahoo: "ABT", stooq: "abt.us" },
    { id: "abbv", label: "AbbVie", yahoo: "ABBV", stooq: "abbv.us" },
    { id: "acn", label: "Accenture", yahoo: "ACN", stooq: "acn.us" },
    { id: "adbe", label: "Adobe", yahoo: "ADBE", stooq: "adbe.us" },
    { id: "adm", label: "Archer-Daniels", yahoo: "ADM", stooq: "adm.us" },
    { id: "adp", label: "ADP", yahoo: "ADP", stooq: "adp.us" },
    { id: "aes", label: "AES Corp", yahoo: "AES", stooq: "aes.us" },
    { id: "afl", label: "Aflac", yahoo: "AFL", stooq: "afl.us" },
    { id: "a", label: "Agilent Technologies", yahoo: "A", stooq: "a.us" },
    { id: "aig", label: "AIG", yahoo: "AIG", stooq: "aig.us" },
    { id: "aiz", label: "Assurant", yahoo: "AIZ", stooq: "aiz.us" },
    { id: "ajg", label: "Arthur Gallagher", yahoo: "AJG", stooq: "ajg.us" },
    { id: "akam", label: "Akamai", yahoo: "AKAM", stooq: "akam.us" },
    { id: "alb", label: "Albemarle", yahoo: "ALB", stooq: "alb.us" },
    { id: "are", label: "Alexandria RE", yahoo: "ARE", stooq: "are.us" },
    { id: "algn", label: "Align Tech", yahoo: "ALGN", stooq: "algn.us" },
    { id: "all", label: "Allstate", yahoo: "ALL", stooq: "all.us" },
    { id: "googl", label: "Alphabet A", yahoo: "GOOGL", stooq: "googl.us" },
    { id: "goog", label: "Alphabet C", yahoo: "GOOG", stooq: "goog.us" },
    { id: "mo", label: "Altria Group", yahoo: "MO", stooq: "mo.us" },
    { id: "amzn", label: "Amazon", yahoo: "AMZN", stooq: "amzn.us" },
    { id: "amcr", label: "Amcor", yahoo: "AMCR", stooq: "amcr.us" },
    { id: "amd", label: "AMD", yahoo: "AMD", stooq: "amd.us" },
    { id: "aee", label: "Ameren", yahoo: "AEE", stooq: "aee.us" },
    { id: "aal", label: "American Airlines", yahoo: "AAL", stooq: "aal.us" },
    { id: "aep", label: "AEP", yahoo: "AEP", stooq: "aep.us" },
    { id: "axp", label: "Amex", yahoo: "AXP", stooq: "axp.us" },
    { id: "aig", label: "AIG", yahoo: "AIG", stooq: "aig.us" },
    { id: "amt", label: "American Tower", yahoo: "AMT", stooq: "amt.us" },
    { id: "awk", label: "American Water", yahoo: "AWK", stooq: "awk.us" },
    { id: "amp", label: "Ameriprise", yahoo: "AMP", stooq: "amp.us" },
    { id: "ame", label: "AMETEK", yahoo: "AME", stooq: "ame.us" },
    { id: "amgn", label: "Amgen", yahoo: "AMGN", stooq: "amgn.us" },
    { id: "aph", label: "Amphenol", yahoo: "APH", stooq: "aph.us" },
    { id: "adi", label: "Analog Devices", yahoo: "ADI", stooq: "adi.us" },
    { id: "anss", label: "ANSYS", yahoo: "ANSS", stooq: "anss.us" },
    { id: "aon", label: "Aon", yahoo: "AON", stooq: "aon.us" },
    { id: "apa", label: "APA Corp", yahoo: "APA", stooq: "apa.us" },
    { id: "aapl", label: "Apple", yahoo: "AAPL", stooq: "aapl.us" },
    { id: "amat", label: "Applied Materials", yahoo: "AMAT", stooq: "amat.us" },
    { id: "aptv", label: "Aptiv", yahoo: "APTV", stooq: "aptv.us" },
    { id: "acgl", label: "Arch Capital", yahoo: "ACGL", stooq: "acgl.us" },
    { id: "adm", label: "Archer-Daniels", yahoo: "ADM", stooq: "adm.us" },
    { id: "anet", label: "Arista Networks", yahoo: "ANET", stooq: "anet.us" },
    { id: "ajg", label: "Arthur Gallagher", yahoo: "AJG", stooq: "ajg.us" },
    { id: "aiz", label: "Assurant", yahoo: "AIZ", stooq: "aiz.us" },
    { id: "t", label: "AT&T", yahoo: "T", stooq: "t.us" },
    { id: "ato", label: "Atmos Energy", yahoo: "ATO", stooq: "ato.us" },
    { id: "adsk", label: "Autodesk", yahoo: "ADSK", stooq: "adsk.us" },
    { id: "azo", label: "AutoZone", yahoo: "AZO", stooq: "azo.us" },
    { id: "avb", label: "AvalonBay", yahoo: "AVB", stooq: "avb.us" },
    { id: "avy", label: "Avery Dennison", yahoo: "AVY", stooq: "avy.us" },
    { id: "axon", label: "Axon", yahoo: "AXON", stooq: "axon.us" },
    { id: "bkr", label: "Baker Hughes", yahoo: "BKR", stooq: "bkr.us" },
    { id: "ball", label: "Ball Corp", yahoo: "BALL", stooq: "ball.us" },
    { id: "bac", label: "Bank of America", yahoo: "BAC", stooq: "bac.us" },
    { id: "bk", label: "BNY Mellon", yahoo: "BK", stooq: "bk.us" },
    { id: "bbwi", label: "Bath & Body Works", yahoo: "BBWI", stooq: "bbwi.us" },
    { id: "bax", label: "Baxter", yahoo: "BAX", stooq: "bax.us" },
    { id: "bdx", label: "Becton Dickinson", yahoo: "BDX", stooq: "bdx.us" },
    { id: "brk_b", label: "Berkshire B", yahoo: "BRK.B", stooq: "brk-b.us" },
    { id: "bby", label: "Best Buy", yahoo: "BBY", stooq: "bby.us" },
    { id: "bio", label: "Bio-Rad", yahoo: "BIO", stooq: "bio.us" },
    { id: "biib", label: "Biogen", yahoo: "BIIB", stooq: "biib.us" },
    { id: "blk", label: "BlackRock", yahoo: "BLK", stooq: "blk.us" },
    { id: "bx", label: "Blackstone", yahoo: "BX", stooq: "bx.us" },
    { id: "ba", label: "Boeing", yahoo: "BA", stooq: "ba.us" },
    { id: "bkng", label: "Booking Holdings", yahoo: "BKNG", stooq: "bkng.us" },
    { id: "bwa", label: "BorgWarner", yahoo: "BWA", stooq: "bwa.us" },
    { id: "bsx", label: "Boston Scientific", yahoo: "BSX", stooq: "bsx.us" },
    { id: "bmy", label: "Bristol-Myers", yahoo: "BMY", stooq: "bmy.us" },
    { id: "avgo", label: "Broadcom", yahoo: "AVGO", stooq: "avgo.us" },
    { id: "br", label: "Broadridge", yahoo: "BR", stooq: "br.us" },
    { id: "bro", label: "Brown & Brown", yahoo: "BRO", stooq: "bro.us" },
    { id: "bf_b", label: "Brown-Forman", yahoo: "BF.B", stooq: "bf-b.us" },
    { id: "bg", label: "Bunge", yahoo: "BG", stooq: "bg.us" },
    { id: "cdns", label: "Cadence", yahoo: "CDNS", stooq: "cdns.us" },
    { id: "czr", label: "Caesars Entertainment", yahoo: "CZR", stooq: "czr.us" },
    { id: "cpt", label: "Camden Property", yahoo: "CPT", stooq: "cpt.us" },
    { id: "cpb", label: "Campbell Soup", yahoo: "CPB", stooq: "cpb.us" },
    { id: "cof", label: "Capital One", yahoo: "COF", stooq: "cof.us" },
    { id: "cah", label: "Cardinal Health", yahoo: "CAH", stooq: "cah.us" },
    { id: "kmx", label: "CarMax", yahoo: "KMX", stooq: "kmx.us" },
    { id: "ccl", label: "Carnival", yahoo: "CCL", stooq: "ccl.us" },
    { id: "carr", label: "Carrier Global", yahoo: "CARR", stooq: "carr.us" },
    { id: "cat", label: "Caterpillar", yahoo: "CAT", stooq: "cat.us" },
    { id: "cboe", label: "Cboe", yahoo: "CBOE", stooq: "cboe.us" },
    { id: "cbre", label: "CBRE Group", yahoo: "CBRE", stooq: "cbre.us" },
    { id: "cdw", label: "CDW Corp", yahoo: "CDW", stooq: "cdw.us" },
    { id: "ce", label: "Celanese", yahoo: "CE", stooq: "ce.us" },
    { id: "cor", label: "Cencora", yahoo: "COR", stooq: "cor.us" },
    { id: "cnc", label: "Centene", yahoo: "CNC", stooq: "cnc.us" },
    { id: "cnp", label: "CenterPoint", yahoo: "CNP", stooq: "cnp.us" },
    { id: "cf", label: "CF Industries", yahoo: "CF", stooq: "cf.us" },
    { id: "crl", label: "Charles River", yahoo: "CRL", stooq: "crl.us" },
    { id: "schw", label: "Charles Schwab", yahoo: "SCHW", stooq: "schw.us" },
    { id: "chtr", label: "Charter Comms", yahoo: "CHTR", stooq: "chtr.us" },
    { id: "cvx", label: "Chevron", yahoo: "CVX", stooq: "cvx.us" },
    { id: "cmg", label: "Chipotle", yahoo: "CMG", stooq: "cmg.us" },
    { id: "cb", label: "Chubb", yahoo: "CB", stooq: "cb.us" },
    { id: "ci", label: "Cigna", yahoo: "CI", stooq: "ci.us" },
    { id: "cinf", label: "Cincinnati Fin", yahoo: "CINF", stooq: "cinf.us" },
    { id: "ctas", label: "Cintas", yahoo: "CTAS", stooq: "ctas.us" },
    { id: "csco", label: "Cisco", yahoo: "CSCO", stooq: "csco.us" },
    { id: "c", label: "Citigroup", yahoo: "C", stooq: "c.us" },
    { id: "cfg", label: "Citizens Financial", yahoo: "CFG", stooq: "cfg.us" },
    { id: "clf", label: "Cleveland-Cliffs", yahoo: "CLF", stooq: "clf.us" },
    { id: "clx", label: "Clorox", yahoo: "CLX", stooq: "clx.us" },
    { id: "cme", label: "CME Group", yahoo: "CME", stooq: "cme.us" },
    { id: "cms", label: "CMS Energy", yahoo: "CMS", stooq: "cms.us" },
    { id: "ko", label: "Coca-Cola", yahoo: "KO", stooq: "ko.us" },
    { id: "ctsh", label: "Cognizant", yahoo: "CTSH", stooq: "ctsh.us" },
    { id: "cl", label: "Colgate", yahoo: "CL", stooq: "cl.us" },
    { id: "cmcsa", label: "Comcast", yahoo: "CMCSA", stooq: "cmcsa.us" },
    { id: "cag", label: "Conagra Brands", yahoo: "CAG", stooq: "cag.us" },
    { id: "cop", label: "ConocoPhillips", yahoo: "COP", stooq: "cop.us" },
    { id: "ed", label: "Con Edison", yahoo: "ED", stooq: "ed.us" },
    { id: "stz", label: "Constellation Brands", yahoo: "STZ", stooq: "stz.us" },
    { id: "ceg", label: "Constellation Energy", yahoo: "CEG", stooq: "ceg.us" },
    { id: "coo", label: "Cooper Cos", yahoo: "COO", stooq: "coo.us" },
    { id: "cprt", label: "Copart", yahoo: "CPRT", stooq: "cprt.us" },
    { id: "glw", label: "Corning", yahoo: "GLW", stooq: "glw.us" },
    { id: "cpay", label: "Corpay", yahoo: "CPAY", stooq: "cpay.us" },
    { id: "cost", label: "Costco", yahoo: "COST", stooq: "cost.us" },
    { id: "ctra", label: "Coterra Energy", yahoo: "CTRA", stooq: "ctra.us" },
    { id: "crwd", label: "CrowdStrike", yahoo: "CRWD", stooq: "crwd.us" },
    { id: "cci", label: "Crown Castle", yahoo: "CCI", stooq: "cci.us" },
    { id: "csx", label: "CSX Corp", yahoo: "CSX", stooq: "csx.us" },
    { id: "cmi", label: "Cummins", yahoo: "CMI", stooq: "cmi.us" },
    { id: "cvs", label: "CVS Health", yahoo: "CVS", stooq: "cvs.us" },
    { id: "dhi", label: "D.R. Horton", yahoo: "DHI", stooq: "dhi.us" },
    { id: "dhr", label: "Danaher", yahoo: "DHR", stooq: "dhr.us" },
    { id: "dri", label: "Darden", yahoo: "DRI", stooq: "dri.us" },
    { id: "dva", label: "DaVita", yahoo: "DVA", stooq: "dva.us" },
    { id: "dxcm", label: "DexCom", yahoo: "DXCM", stooq: "dxcm.us" },
    { id: "fang", label: "Diamondback Energy", yahoo: "FANG", stooq: "fang.us" },
    { id: "dlr", label: "Digital Realty", yahoo: "DLR", stooq: "dlr.us" },
    { id: "dfs", label: "Discover", yahoo: "DFS", stooq: "dfs.us" },
    { id: "dg", label: "Dollar General", yahoo: "DG", stooq: "dg.us" },
    { id: "dltr", label: "Dollar Tree", yahoo: "DLTR", stooq: "dltr.us" },
    { id: "d", label: "Dominion Energy", yahoo: "D", stooq: "d.us" },
    { id: "dpz", label: "Domino's", yahoo: "DPZ", stooq: "dpz.us" },
    { id: "dov", label: "Dover", yahoo: "DOV", stooq: "dov.us" },
    { id: "dow", label: "Dow Inc", yahoo: "DOW", stooq: "dow.us" },
    { id: "dte", label: "DTE Energy", yahoo: "DTE", stooq: "dte.us" },
    { id: "duk", label: "Duke Energy", yahoo: "DUK", stooq: "duk.us" },
    { id: "dd", label: "DuPont", yahoo: "DD", stooq: "dd.us" },
    { id: "emn", label: "Eastman Chemical", yahoo: "EMN", stooq: "emn.us" },
    { id: "etn", label: "Eaton", yahoo: "ETN", stooq: "etn.us" },
    { id: "ebay", label: "eBay", yahoo: "EBAY", stooq: "ebay.us" },
    { id: "ecl", label: "Ecolab", yahoo: "ECL", stooq: "ecl.us" },
    { id: "eix", label: "Edison Intl", yahoo: "EIX", stooq: "eix.us" },
    { id: "ew", label: "Edwards Lifesciences", yahoo: "EW", stooq: "ew.us" },
    { id: "ea", label: "Electronic Arts", yahoo: "EA", stooq: "ea.us" },
    { id: "elv", label: "Elevance Health", yahoo: "ELV", stooq: "elv.us" },
    { id: "lly", label: "Eli Lilly", yahoo: "LLY", stooq: "lly.us" },
    { id: "emr", label: "Emerson", yahoo: "EMR", stooq: "emr.us" },
    { id: "enph", label: "Enphase Energy", yahoo: "ENPH", stooq: "enph.us" },
    { id: "enb", label: "Enbridge", yahoo: "ENB", stooq: "enb.us" },
    { id: "etr", label: "Entergy", yahoo: "ETR", stooq: "etr.us" },
    { id: "eog", label: "EOG Resources", yahoo: "EOG", stooq: "eog.us" },
    { id: "evrg", label: "Evergy", yahoo: "EVRG", stooq: "evrg.us" },
    { id: "es", label: "Eversource", yahoo: "ES", stooq: "es.us" },
    { id: "exc", label: "Exelon", yahoo: "EXC", stooq: "exc.us" },
    { id: "expe", label: "Expedia", yahoo: "EXPE", stooq: "expe.us" },
    { id: "expd", label: "Expeditors", yahoo: "EXPD", stooq: "expd.us" },
    { id: "exr", label: "Extra Space", yahoo: "EXR", stooq: "exr.us" },
    { id: "xom", label: "Exxon Mobil", yahoo: "XOM", stooq: "xom.us" },
    { id: "ffiv", label: "F5 Inc", yahoo: "FFIV", stooq: "ffiv.us" },
    { id: "fds", label: "FactSet", yahoo: "FDS", stooq: "fds.us" },
    { id: "fico", label: "Fair Isaac", yahoo: "FICO", stooq: "fico.us" },
    { id: "fast", label: "Fastenal", yahoo: "FAST", stooq: "fast.us" },
    { id: "frt", label: "Federal Realty", yahoo: "FRT", stooq: "frt.us" },
    { id: "fdx", label: "FedEx", yahoo: "FDX", stooq: "fdx.us" },
    { id: "fis", label: "Fidelity NI", yahoo: "FIS", stooq: "fis.us" },
    { id: "fitb", label: "Fifth Third", yahoo: "FITB", stooq: "fitb.us" },
    { id: "fslr", label: "First Solar", yahoo: "FSLR", stooq: "fslr.us" },
    { id: "fe", label: "FirstEnergy", yahoo: "FE", stooq: "fe.us" },
    { id: "fi", label: "Fiserv", yahoo: "FI", stooq: "fi.us" },
    { id: "fmc", label: "FMC Corp", yahoo: "FMC", stooq: "fmc.us" },
    { id: "f", label: "Ford", yahoo: "F", stooq: "f.us" },
    { id: "ftnt", label: "Fortinet", yahoo: "FTNT", stooq: "ftnt.us" },
    { id: "ftv", label: "Fortive", yahoo: "FTV", stooq: "ftv.us" },
    { id: "fcx", label: "Freeport-McMoRan", yahoo: "FCX", stooq: "fcx.us" },
    { id: "grmn", label: "Garmin", yahoo: "GRMN", stooq: "grmn.us" },
    { id: "it", label: "Gartner", yahoo: "IT", stooq: "it.us" },
    { id: "ge", label: "GE Aerospace", yahoo: "GE", stooq: "ge.us" },
    { id: "gehc", label: "GE HealthCare", yahoo: "GEHC", stooq: "gehc.us" },
    { id: "gev", label: "GE Vernova", yahoo: "GEV", stooq: "gev.us" },
    { id: "gen", label: "Gen Digital", yahoo: "GEN", stooq: "gen.us" },
    { id: "gnrc", label: "Generac", yahoo: "GNRC", stooq: "gnrc.us" },
    { id: "gd", label: "General Dynamics", yahoo: "GD", stooq: "gd.us" },
    { id: "gis", label: "General Mills", yahoo: "GIS", stooq: "gis.us" },
    { id: "gm", label: "General Motors", yahoo: "GM", stooq: "gm.us" },
    { id: "gpc", label: "Genuine Parts", yahoo: "GPC", stooq: "gpc.us" },
    { id: "gild", label: "Gilead", yahoo: "GILD", stooq: "gild.us" },
    { id: "gpn", label: "Global Payments", yahoo: "GPN", stooq: "gpn.us" },
    { id: "gl", label: "Globe Life", yahoo: "GL", stooq: "gl.us" },
    { id: "gs", label: "Goldman Sachs", yahoo: "GS", stooq: "gs.us" },
    { id: "hal", label: "Halliburton", yahoo: "HAL", stooq: "hal.us" },
    { id: "hig", label: "Hartford", yahoo: "HIG", stooq: "hig.us" },
    { id: "has", label: "Hasbro", yahoo: "HAS", stooq: "has.us" },
    { id: "hca", label: "HCA Healthcare", yahoo: "HCA", stooq: "hca.us" },
    { id: "doc", label: "Healthpeak", yahoo: "DOC", stooq: "doc.us" },
    { id: "hsic", label: "Henry Schein", yahoo: "HSIC", stooq: "hsic.us" },
    { id: "hsy", label: "Hershey", yahoo: "HSY", stooq: "hsy.us" },
    { id: "hes", label: "Hess Corp", yahoo: "HES", stooq: "hes.us" },
    { id: "hpe", label: "HP Enterprise", yahoo: "HPE", stooq: "hpe.us" },
    { id: "hlt", label: "Hilton", yahoo: "HLT", stooq: "hlt.us" },
    { id: "holx", label: "Hologic", yahoo: "HOLX", stooq: "holx.us" },
    { id: "hd", label: "Home Depot", yahoo: "HD", stooq: "hd.us" },
    { id: "hon", label: "Honeywell", yahoo: "HON", stooq: "hon.us" },
    { id: "hrl", label: "Hormel", yahoo: "HRL", stooq: "hrl.us" },
    { id: "hst", label: "Host Hotels", yahoo: "HST", stooq: "hst.us" },
    { id: "hwm", label: "Howmet Aerospace", yahoo: "HWM", stooq: "hwm.us" },
    { id: "hpq", label: "HP Inc", yahoo: "HPQ", stooq: "hpq.us" },
    { id: "hubb", label: "Hubbell", yahoo: "HUBB", stooq: "hubb.us" },
    { id: "hum", label: "Humana", yahoo: "HUM", stooq: "hum.us" },
    { id: "hban", label: "Huntington Bancshares", yahoo: "HBAN", stooq: "hban.us" },
    { id: "hii", label: "Huntington Ingalls", yahoo: "HII", stooq: "hii.us" },
    { id: "ibm", label: "IBM", yahoo: "IBM", stooq: "ibm.us" },
    { id: "iex", label: "IDEX Corp", yahoo: "IEX", stooq: "iex.us" },
    { id: "idxx", label: "IDEXX Labs", yahoo: "IDXX", stooq: "idxx.us" },
    { id: "itw", label: "Illinois Tool", yahoo: "ITW", stooq: "itw.us" },
    { id: "incy", label: "Incyte", yahoo: "INCY", stooq: "incy.us" },
    { id: "ir", label: "Ingersoll Rand", yahoo: "IR", stooq: "ir.us" },
    { id: "podd", label: "Insulet", yahoo: "PODD", stooq: "podd.us" },
    { id: "intc", label: "Intel", yahoo: "INTC", stooq: "intc.us" },
    { id: "ice", label: "ICE", yahoo: "ICE", stooq: "ice.us" },
    { id: "iff", label: "IFF", yahoo: "IFF", stooq: "iff.us" },
    { id: "ip", label: "Intl Paper", yahoo: "IP", stooq: "ip.us" },
    { id: "ipg", label: "Interpublic", yahoo: "IPG", stooq: "ipg.us" },
    { id: "intu", label: "Intuit", yahoo: "INTU", stooq: "intu.us" },
    { id: "isrg", label: "Intuitive Surgical", yahoo: "ISRG", stooq: "isrg.us" },
    { id: "ivz", label: "Invesco", yahoo: "IVZ", stooq: "ivz.us" },
    { id: "invh", label: "Invitation Homes", yahoo: "INVH", stooq: "invh.us" },
    { id: "iqv", label: "IQVIA", yahoo: "IQV", stooq: "iqv.us" },
    { id: "irm", label: "Iron Mountain", yahoo: "IRM", stooq: "irm.us" },
    { id: "jbal", label: "J.B. Hunt", yahoo: "JBAL", stooq: "jbal.us" },
    { id: "jkhy", label: "Jack Henry", yahoo: "JKHY", stooq: "jkhy.us" },
    { id: "j", label: "Jacobs Solutions", yahoo: "J", stooq: "j.us" },
    { id: "jnj", label: "Johnson & Johnson", yahoo: "JNJ", stooq: "jnj.us" },
    { id: "jci", label: "Johnson Controls", yahoo: "JCI", stooq: "jci.us" },
    { id: "jpm", label: "JPMorgan", yahoo: "JPM", stooq: "jpm.us" },
    { id: "jnpr", label: "Juniper Networks", yahoo: "JNPR", stooq: "jnpr.us" },
    { id: "k", label: "Kellanova", yahoo: "K", stooq: "k.us" },
    { id: "kvue", label: "Kenvue", yahoo: "KVUE", stooq: "kvue.us" },
    { id: "key", label: "KeyCorp", yahoo: "KEY", stooq: "key.us" },
    { id: "keys", label: "Keysight", yahoo: "KEYS", stooq: "keys.us" },
    { id: "kmb", label: "Kimberly-Clark", yahoo: "KMB", stooq: "kmb.us" },
    { id: "kim", label: "Kimco Realty", yahoo: "KIM", stooq: "kim.us" },
    { id: "kmi", label: "Kinder Morgan", yahoo: "KMI", stooq: "kmi.us" },
    { id: "klac", label: "KLA Corp", yahoo: "KLAC", stooq: "klac.us" },
    { id: "khc", label: "Kraft Heinz", yahoo: "KHC", stooq: "khc.us" },
    { id: "kr", label: "Kroger", yahoo: "KR", stooq: "kr.us" },
    { id: "lhx", label: "L3Harris", yahoo: "LHX", stooq: "lhx.us" },
    { id: "lh", label: "LabCorp", yahoo: "LH", stooq: "lh.us" },
    { id: "lrcx", label: "Lam Research", yahoo: "LRCX", stooq: "lrcx.us" },
    { id: "lw", label: "Lamb Weston", yahoo: "LW", stooq: "lw.us" },
    { id: "lvs", label: "Las Vegas Sands", yahoo: "LVS", stooq: "lvs.us" },
    { id: "ldos", label: "Leidos", yahoo: "LDOS", stooq: "ldos.us" },
    { id: "len", label: "Lennar", yahoo: "LEN", stooq: "len.us" },
    { id: "lin", label: "Linde", yahoo: "LIN", stooq: "lin.us" },
    { id: "lmt", label: "Lockheed Martin", yahoo: "LMT", stooq: "lmt.us" },
    { id: "l", label: "Loews", yahoo: "L", stooq: "l.us" },
    { id: "low", label: "Lowe's", yahoo: "LOW", stooq: "low.us" },
    { id: "lulu", label: "lululemon", yahoo: "LULU", stooq: "lulu.us" },
    { id: "lyv", label: "Live Nation", yahoo: "LYV", stooq: "lyv.us" },
    { id: "lyb", label: "LyondellBasell", yahoo: "LYB", stooq: "lyb.us" },
    { id: "mtb", label: "M&T Bank", yahoo: "MTB", stooq: "mtb.us" },
    { id: "mro", label: "Marathon Oil", yahoo: "MRO", stooq: "mro.us" },
    { id: "mpc", label: "Marathon Petroleum", yahoo: "MPC", stooq: "mpc.us" },
    { id: "mktx", label: "MarketAxess", yahoo: "MKTX", stooq: "mktx.us" },
    { id: "mar", label: "Marriott", yahoo: "MAR", stooq: "mar.us" },
    { id: "mmc", label: "Marsh McLennan", yahoo: "MMC", stooq: "mmc.us" },
    { id: "mlm", label: "Martin Marietta", yahoo: "MLM", stooq: "mlm.us" },
    { id: "mas", label: "Masco", yahoo: "MAS", stooq: "mas.us" },
    { id: "ma", label: "Mastercard", yahoo: "MA", stooq: "ma.us" },
    { id: "mtch", label: "Match Group", yahoo: "MTCH", stooq: "mtch.us" },
    { id: "mkc", label: "McCormick", yahoo: "MKC", stooq: "mkc.us" },
    { id: "mcd", label: "McDonald's", yahoo: "MCD", stooq: "mcd.us" },
    { id: "mck", label: "McKesson", yahoo: "MCK", stooq: "mck.us" },
    { id: "mdt", label: "Medtronic", yahoo: "MDT", stooq: "mdt.us" },
    { id: "mrk", label: "Merck", yahoo: "MRK", stooq: "mrk.us" },
    { id: "meta", label: "Meta", yahoo: "META", stooq: "meta.us" },
    { id: "met", label: "MetLife", yahoo: "MET", stooq: "met.us" },
    { id: "mtd", label: "Mettler-Toledo", yahoo: "MTD", stooq: "mtd.us" },
    { id: "mgm", label: "MGM Resorts", yahoo: "MGM", stooq: "mgm.us" },
    { id: "mchp", label: "Microchip Tech", yahoo: "MCHP", stooq: "mchp.us" },
    { id: "mu", label: "Micron", yahoo: "MU", stooq: "mu.us" },
    { id: "msft", label: "Microsoft", yahoo: "MSFT", stooq: "msft.us" },
    { id: "maa", label: "Mid-America Apt", yahoo: "MAA", stooq: "maa.us" },
    { id: "mrna", label: "Moderna", yahoo: "MRNA", stooq: "mrna.us" },
    { id: "mhk", label: "Mohawk Ind", yahoo: "MHK", stooq: "mhk.us" },
    { id: "moh", label: "Molina Healthcare", yahoo: "MOH", stooq: "moh.us" },
    { id: "tap", label: "Molson Coors", yahoo: "TAP", stooq: "tap.us" },
    { id: "mdlz", label: "Mondelez", yahoo: "MDLZ", stooq: "mdlz.us" },
    { id: "mpwr", label: "Monolithic Power", yahoo: "MPWR", stooq: "mpwr.us" },
    { id: "mnst", label: "Monster Beverage", yahoo: "MNST", stooq: "mnst.us" },
    { id: "mco", label: "Moody's", yahoo: "MCO", stooq: "mco.us" },
    { id: "ms", label: "Morgan Stanley", yahoo: "MS", stooq: "ms.us" },
    { id: "mos", label: "Mosaic", yahoo: "MOS", stooq: "mos.us" },
    { id: "msi", label: "Motorola Solutions", yahoo: "MSI", stooq: "msi.us" },
    { id: "msci", label: "MSCI", yahoo: "MSCI", stooq: "msci.us" },
    { id: "ndaq", label: "Nasdaq", yahoo: "NDAQ", stooq: "ndaq.us" },
    { id: "ntap", label: "NetApp", yahoo: "NTAP", stooq: "ntap.us" },
    { id: "nflx", label: "Netflix", yahoo: "NFLX", stooq: "nflx.us" },
    { id: "nem", label: "Newmont", yahoo: "NEM", stooq: "nem.us" },
    { id: "nwsa", label: "News Corp A", yahoo: "NWSA", stooq: "nwsa.us" },
    { id: "nws", label: "News Corp B", yahoo: "NWS", stooq: "nws.us" },
    { id: "nee", label: "NextEra", yahoo: "NEE", stooq: "nee.us" },
    { id: "nke", label: "Nike", yahoo: "NKE", stooq: "nke.us" },
    { id: "ni", label: "NiSource", yahoo: "NI", stooq: "ni.us" },
    { id: "ndsn", label: "Nordson", yahoo: "NDSN", stooq: "ndsn.us" },
    { id: "nsc", label: "Norfolk Southern", yahoo: "NSC", stooq: "nsc.us" },
    { id: "noc", label: "Northrop Grumman", yahoo: "NOC", stooq: "noc.us" },
    { id: "nclh", label: "Norwegian Cruise", yahoo: "NCLH", stooq: "nclh.us" },
    { id: "nrg", label: "NRG Energy", yahoo: "NRG", stooq: "nrg.us" },
    { id: "nue", label: "Nucor", yahoo: "NUE", stooq: "nue.us" },
    { id: "nvda", label: "NVIDIA", yahoo: "NVDA", stooq: "nvda.us" },
    { id: "nvr", label: "NVR Inc", yahoo: "NVR", stooq: "nvr.us" },
    { id: "nxpi", label: "NXP Semi", yahoo: "NXPI", stooq: "nxpi.us" },
    { id: "orly", label: "O'Reilly Auto", yahoo: "ORLY", stooq: "orly.us" },
    { id: "oxy", label: "Occidental", yahoo: "OXY", stooq: "oxy.us" },
    { id: "odfl", label: "Old Dominion Freight", yahoo: "ODFL", stooq: "odfl.us" },
    { id: "omc", label: "Omnicom", yahoo: "OMC", stooq: "omc.us" },
    { id: "on", label: "ON Semi", yahoo: "ON", stooq: "on.us" },
    { id: "oke", label: "ONEOK", yahoo: "OKE", stooq: "oke.us" },
    { id: "orcl", label: "Oracle", yahoo: "ORCL", stooq: "orcl.us" },
    { id: "otis", label: "Otis Worldwide", yahoo: "OTIS", stooq: "otis.us" },
    { id: "pcar", label: "PACCAR", yahoo: "PCAR", stooq: "pcar.us" },
    { id: "pkg", label: "Packaging Corp", yahoo: "PKG", stooq: "pkg.us" },
    { id: "panw", label: "Palo Alto Networks", yahoo: "PANW", stooq: "panw.us" },
    { id: "para", label: "Paramount", yahoo: "PARA", stooq: "para.us" },
    { id: "ph", label: "Parker Hannifin", yahoo: "PH", stooq: "ph.us" },
    { id: "payx", label: "Paychex", yahoo: "PAYX", stooq: "payx.us" },
    { id: "payc", label: "Paycom", yahoo: "PAYC", stooq: "payc.us" },
    { id: "pypl", label: "PayPal", yahoo: "PYPL", stooq: "pypl.us" },
    { id: "pnr", label: "Pentair", yahoo: "PNR", stooq: "pnr.us" },
    { id: "pep", label: "PepsiCo", yahoo: "PEP", stooq: "pep.us" },
    { id: "pfe", label: "Pfizer", yahoo: "PFE", stooq: "pfe.us" },
    { id: "pcg", label: "PG&E", yahoo: "PCG", stooq: "pcg.us" },
    { id: "pm", label: "Philip Morris", yahoo: "PM", stooq: "pm.us" },
    { id: "psx", label: "Phillips 66", yahoo: "PSX", stooq: "psx.us" },
    { id: "pnw", label: "Pinnacle West", yahoo: "PNW", stooq: "pnw.us" },
    { id: "pnc", label: "PNC Financial", yahoo: "PNC", stooq: "pnc.us" },
    { id: "pool", label: "Pool Corp", yahoo: "POOL", stooq: "pool.us" },
    { id: "ppg", label: "PPG Industries", yahoo: "PPG", stooq: "ppg.us" },
    { id: "ppl", label: "PPL Corp", yahoo: "PPL", stooq: "ppl.us" },
    { id: "pfg", label: "Principal", yahoo: "PFG", stooq: "pfg.us" },
    { id: "pg", label: "P&G", yahoo: "PG", stooq: "pg.us" },
    { id: "pgr", label: "Progressive", yahoo: "PGR", stooq: "pgr.us" },
    { id: "pld", label: "Prologis", yahoo: "PLD", stooq: "pld.us" },
    { id: "pru", label: "Prudential", yahoo: "PRU", stooq: "pru.us" },
    { id: "peg", label: "PSEG", yahoo: "PEG", stooq: "peg.us" },
    { id: "pypl", label: "PayPal", yahoo: "PYPL", stooq: "pypl.us" },
    { id: "pwr", label: "Quanta Services", yahoo: "PWR", stooq: "pwr.us" },
    { id: "qcom", label: "Qualcomm", yahoo: "QCOM", stooq: "qcom.us" },
    { id: "dgx", label: "Quest Diagnostics", yahoo: "DGX", stooq: "dgx.us" },
    { id: "rl", label: "Ralph Lauren", yahoo: "RL", stooq: "rl.us" },
    { id: "rjf", label: "Raymond James", yahoo: "RJF", stooq: "rjf.us" },
    { id: "rtx", label: "RTX Corp", yahoo: "RTX", stooq: "rtx.us" },
    { id: "o", label: "Realty Income", yahoo: "O", stooq: "o.us" },
    { id: "reg", label: "Regency Centers", yahoo: "REG", stooq: "reg.us" },
    { id: "regn", label: "Regeneron", yahoo: "REGN", stooq: "regn.us" },
    { id: "rf", label: "Regions Financial", yahoo: "RF", stooq: "rf.us" },
    { id: "rsg", label: "Republic Services", yahoo: "RSG", stooq: "rsg.us" },
    { id: "rmd", label: "ResMed", yahoo: "RMD", stooq: "rmd.us" },
    { id: "rvty", label: "Revvity", yahoo: "RVTY", stooq: "rvty.us" },
    { id: "rok", label: "Rockwell Auto", yahoo: "ROK", stooq: "rok.us" },
    { id: "rol", label: "Rollins", yahoo: "ROL", stooq: "rol.us" },
    { id: "rop", label: "Roper Tech", yahoo: "ROP", stooq: "rop.us" },
    { id: "rost", label: "Ross Stores", yahoo: "ROST", stooq: "rost.us" },
    { id: "rcl", label: "Royal Caribbean", yahoo: "RCL", stooq: "rcl.us" },
    { id: "spgi", label: "S&P Global", yahoo: "SPGI", stooq: "spgi.us" },
    { id: "crm", label: "Salesforce", yahoo: "CRM", stooq: "crm.us" },
    { id: "sbac", label: "SBA Comms", yahoo: "SBAC", stooq: "sbac.us" },
    { id: "slb", label: "SLB", yahoo: "SLB", stooq: "slb.us" },
    { id: "stx", label: "Seagate", yahoo: "STX", stooq: "stx.us" },
    { id: "sre", label: "Sempra", yahoo: "SRE", stooq: "sre.us" },
    { id: "now", label: "ServiceNow", yahoo: "NOW", stooq: "now.us" },
    { id: "shw", label: "Sherwin-Williams", yahoo: "SHW", stooq: "shw.us" },
    { id: "spg", label: "Simon Property", yahoo: "SPG", stooq: "spg.us" },
    { id: "swks", label: "Skyworks Solutions", yahoo: "SWKS", stooq: "swks.us" },
    { id: "sna", label: "Snap-on", yahoo: "SNA", stooq: "sna.us" },
    { id: "solv", label: "Solventum", yahoo: "SOLV", stooq: "solv.us" },
    { id: "so", label: "Southern Co", yahoo: "SO", stooq: "so.us" },
    { id: "luv", label: "Southwest", yahoo: "LUV", stooq: "luv.us" },
    { id: "swk", label: "Stanley Black & Decker", yahoo: "SWK", stooq: "swk.us" },
    { id: "sbux", label: "Starbucks", yahoo: "SBUX", stooq: "sbux.us" },
    { id: "stt", label: "State Street", yahoo: "STT", stooq: "stt.us" },
    { id: "stld", label: "Steel Dynamics", yahoo: "STLD", stooq: "stld.us" },
    { id: "ste", label: "Steris", yahoo: "STE", stooq: "ste.us" },
    { id: "syk", label: "Stryker", yahoo: "SYK", stooq: "syk.us" },
    { id: "syf", label: "Synchrony", yahoo: "SYF", stooq: "syf.us" },
    { id: "snps", label: "Synopsys", yahoo: "SNPS", stooq: "snps.us" },
    { id: "syy", label: "Sysco", yahoo: "SYY", stooq: "syy.us" },
    { id: "tmus", label: "T-Mobile", yahoo: "TMUS", stooq: "tmus.us" },
    { id: "trow", label: "T. Rowe Price", yahoo: "TROW", stooq: "trow.us" },
    { id: "ttwo", label: "Take-Two", yahoo: "TTWO", stooq: "ttwo.us" },
    { id: "tpr", label: "Tapestry", yahoo: "TPR", stooq: "tpr.us" },
    { id: "trgp", label: "Targa Resources", yahoo: "TRGP", stooq: "trgp.us" },
    { id: "tgt", label: "Target", yahoo: "TGT", stooq: "tgt.us" },
    { id: "tel", label: "TE Connectivity", yahoo: "TEL", stooq: "tel.us" },
    { id: "tdy", label: "Teledyne", yahoo: "TDY", stooq: "tdy.us" },
    { id: "tfx", label: "Teleflex", yahoo: "TFX", stooq: "tfx.us" },
    { id: "ter", label: "Teradyne", yahoo: "TER", stooq: "ter.us" },
    { id: "tsla", label: "Tesla", yahoo: "TSLA", stooq: "tsla.us" },
    { id: "txn", label: "Texas Instruments", yahoo: "TXN", stooq: "txn.us" },
    { id: "tmo", label: "Thermo Fisher", yahoo: "TMO", stooq: "tmo.us" },
    { id: "tjx", label: "TJX Cos", yahoo: "TJX", stooq: "tjx.us" },
    { id: "tsco", label: "Tractor Supply", yahoo: "TSCO", stooq: "tsco.us" },
    { id: "tt", label: "Trane Tech", yahoo: "TT", stooq: "tt.us" },
    { id: "tdg", label: "TransDigm", yahoo: "TDG", stooq: "tdg.us" },
    { id: "trv", label: "Travelers", yahoo: "TRV", stooq: "trv.us" },
    { id: "trmb", label: "Trimble", yahoo: "TRMB", stooq: "trmb.us" },
    { id: "tfc", label: "Truist Financial", yahoo: "TFC", stooq: "tfc.us" },
    { id: "tyl", label: "Tyler Tech", yahoo: "TYL", stooq: "tyl.us" },
    { id: "tsn", label: "Tyson Foods", yahoo: "TSN", stooq: "tsn.us" },
    { id: "usb", label: "US Bancorp", yahoo: "USB", stooq: "usb.us" },
    { id: "uber", label: "Uber", yahoo: "UBER", stooq: "uber.us" },
    { id: "udr", label: "UDR", yahoo: "UDR", stooq: "udr.us" },
    { id: "ulta", label: "Ulta Beauty", yahoo: "ULTA", stooq: "ulta.us" },
    { id: "unp", label: "Union Pacific", yahoo: "UNP", stooq: "unp.us" },
    { id: "ups", label: "UPS", yahoo: "UPS", stooq: "ups.us" },
    { id: "uri", label: "United Rentals", yahoo: "URI", stooq: "uri.us" },
    { id: "unh", label: "UnitedHealth", yahoo: "UNH", stooq: "unh.us" },
    { id: "uhs", label: "Universal Health", yahoo: "UHS", stooq: "uhs.us" },
    { id: "vlo", label: "Valero Energy", yahoo: "VLO", stooq: "vlo.us" },
    { id: "vtr", label: "Ventas", yahoo: "VTR", stooq: "vtr.us" },
    { id: "vlto", label: "Veralto", yahoo: "VLTO", stooq: "vlto.us" },
    { id: "vrsn", label: "VeriSign", yahoo: "VRSN", stooq: "vrsn.us" },
    { id: "vrsk", label: "Verisk", yahoo: "VRSK", stooq: "vrsk.us" },
    { id: "vz", label: "Verizon", yahoo: "VZ", stooq: "vz.us" },
    { id: "vrtx", label: "Vertex Pharma", yahoo: "VRTX", stooq: "vrtx.us" },
    { id: "vtrs", label: "Viatris", yahoo: "VTRS", stooq: "vtrs.us" },
    { id: "vici", label: "VICI Properties", yahoo: "VICI", stooq: "vici.us" },
    { id: "v", label: "Visa", yahoo: "V", stooq: "v.us" },
    { id: "vst", label: "Vistra", yahoo: "VST", stooq: "vst.us" },
    { id: "vmc", label: "Vulcan Materials", yahoo: "VMC", stooq: "vmc.us" },
    { id: "wab", label: "Wabtec", yahoo: "WAB", stooq: "wab.us" },
    { id: "wba", label: "Walgreens", yahoo: "WBA", stooq: "wba.us" },
    { id: "wmt", label: "Walmart", yahoo: "WMT", stooq: "wmt.us" },
    { id: "dis", label: "Disney", yahoo: "DIS", stooq: "dis.us" },
    { id: "wbd", label: "Warner Bros", yahoo: "WBD", stooq: "wbd.us" },
    { id: "wrb", label: "W.R. Berkley", yahoo: "WRB", stooq: "wrb.us" },
    { id: "gww", label: "W.W. Grainger", yahoo: "GWW", stooq: "gww.us" },
    { id: "wat", label: "Waters Corporation", yahoo: "WAT", stooq: "wat.us" },
    { id: "wec", label: "WEC Energy", yahoo: "WEC", stooq: "wec.us" },
    { id: "wfc", label: "Wells Fargo", yahoo: "WFC", stooq: "wfc.us" },
    { id: "well", label: "Welltower", yahoo: "WELL", stooq: "well.us" },
    { id: "wst", label: "West Pharmaceutical Se", yahoo: "WST", stooq: "wst.us" },
    { id: "wdc", label: "Western Digital", yahoo: "WDC", stooq: "wdc.us" },
    { id: "wrk", label: "WestRock", yahoo: "WRK", stooq: "wrk.us" },
    { id: "wy", label: "Weyerhaeuser", yahoo: "WY", stooq: "wy.us" },
    { id: "whr", label: "Whirlpool", yahoo: "WHR", stooq: "whr.us" },
    { id: "wmb", label: "Williams Cos", yahoo: "WMB", stooq: "wmb.us" },
    { id: "wtw", label: "Willis Towers", yahoo: "WTW", stooq: "wtw.us" },
    { id: "wynn", label: "Wynn Resorts", yahoo: "WYNN", stooq: "wynn.us" },
    { id: "xel", label: "Xcel Energy", yahoo: "XEL", stooq: "xel.us" },
    { id: "xyl", label: "Xylem", yahoo: "XYL", stooq: "xyl.us" },
    { id: "yum", label: "Yum! Brands", yahoo: "YUM", stooq: "yum.us" },
    { id: "zbra", label: "Zebra Tech", yahoo: "ZBRA", stooq: "zbra.us" },
    { id: "zbh", label: "Zimmer Biomet", yahoo: "ZBH", stooq: "zbh.us" },
    { id: "zts", label: "Zoetis", yahoo: "ZTS", stooq: "zts.us" }
  ];

  const dom = {
    sectionButtons: Array.from(document.querySelectorAll(".nav-tab")),
    sections: Array.from(document.querySelectorAll(".app-section")),
    themeToggle: document.getElementById("themeToggle"),
    strategySearch: document.getElementById("strategySearch"),
    strategyList: document.getElementById("strategyList"),
    strategyDetail: document.getElementById("strategyDetail"),
    simStrategy: document.getElementById("simStrategy"),
    simTimeframe: document.getElementById("simTimeframe"),
    allowMultiple: document.getElementById("allowMultiple"),
    sidebarRun: document.getElementById("runSimulation"),

    strategySelect: document.getElementById("strategySelect"),
    stockSelect: document.getElementById("stockSelect"),
    stockColumns: document.getElementById("stockColumns"),
    stockSearch: document.getElementById("stockSearch"),
    stockSearchCount: document.getElementById("stockSearchCount"),
    chart: document.getElementById("chart"),
    macdChart: document.getElementById("macdChart"),
    chartError: document.getElementById("chartError"),

    runBtn: document.getElementById("runBtn"),
    resetBtn: document.getElementById("resetBtn"),
    nextBtn: document.getElementById("nextBtn"),
    playBtn: document.getElementById("playBtn"),
    pauseBtn: document.getElementById("pauseBtn"),

    nextBtnBottom: document.getElementById("nextCandle"),
    playBtnBottom: document.getElementById("playSimulation"),
    pauseBtnBottom: document.getElementById("pauseSimulation"),
    resetBtnBottom: document.getElementById("resetSimulation"),

    statusPanel: document.getElementById("statusPanel"),
    explanationPanel: document.getElementById("explanationPanel"),

    metricTrades: document.getElementById("metricTrades"),
    metricWinRate: document.getElementById("metricWinRate"),
    metricAvgReturn: document.getElementById("metricAvgReturn"),
    metricDrawdown: document.getElementById("metricDrawdown"),

    toggleSma50: document.getElementById("toggleSma50"),
    toggleSma200: document.getElementById("toggleSma200"),
    toggleBb: document.getElementById("toggleBb"),
    toggleVwap: document.getElementById("toggleVwap"),
  };

  const state = {
    strategyRecords: [],
    selectedStrategyName: "",
    selectedAssetId: ASSETS[0].id,
    selectedTimeframe: "1D",

    chart: null,
    macdChart: null,
    candleSeries: null,
    sma50Series: null,
    sma200Series: null,
    bbUpperSeries: null,
    bbMiddleSeries: null,
    bbLowerSeries: null,
    vwapSeries: null,
    macdLineSeries: null,
    macdSignalSeries: null,
    macdHistSeries: null,

    candles: [],
    indicatorData: null,
    markers: [],
    trades: [],
    strategySignals: [],
    strategyEvents: new Map(),
    metrics: { count: 0, winRate: 0, avgReturn: 0, maxDrawdown: 0 },

    currentIndex: 0,
    initialIndex: 0,
    playTimer: null,

    assetDataCache: new Map(),
    assetLoadPromises: new Map(),
    assetStats: new Map(),
  };

  const INDICATOR_COLORS = {
    sma50: "#1d4ed8",
    sma200: "#7c3aed",
    bb: "#f59e0b",
    bbMiddle: "#64748b",
    vwap: "#06b6d4",
    macd: "#0ea5e9",
    macdSignal: "#f97316",
    histUp: "#16a34a",
    histDown: "#dc2626",
  };

  const strategyFallbackNames = [
    "200 EMA Trend Filter plus Stochastic Crossover",
    "Bollinger Band Squeeze plus RSI Exhaustion",
    "Anchored VWAP Rejection plus Volume Spike",
    "ATR Volatility Breakout plus Supertrend Direction",
    "Fibonacci 61.8 Retracement plus 20 EMA Confluence",
    "Parabolic SAR Trend Shift plus ADX Strength Filter",
    "Donchian Channel Breakout plus Midline Trail",
    "Ichimoku Cloud Trend Break plus Tenkan Kijun",
    "Supertrend Flip Signal with ATR Adaptive Line",
    "Parabolic SAR Flip plus ADX Above 25",
    "Bollinger Squeeze Breakout with Direction Filter",
    "RSI plus Bollinger Band Mean Reversion",
    "EMA Crossover plus Stochastic Filter",
    "MACD plus Stochastic Double Confirmation",
    "VWAP Trend Bias Filter with Pullback Entry",
    "Moving Average Pullback plus Fibonacci Confluence",
  ];

  function cssVar(name) {
    return getComputedStyle(document.body).getPropertyValue(name).trim();
  }

  function chartThemeOptions() {
    return {
      layout: {
        background: { type: "solid", color: cssVar("--panel") || "#ffffff" },
        textColor: cssVar("--muted") || "#4a5568",
      },
      grid: {
        vertLines: { color: cssVar("--grid") || "rgba(148,163,184,0.2)" },
        horzLines: { color: cssVar("--grid") || "rgba(148,163,184,0.2)" },
      },
      rightPriceScale: { borderColor: cssVar("--grid") || "rgba(148,163,184,0.35)" },
      timeScale: {
        borderColor: cssVar("--grid") || "rgba(148,163,184,0.35)",
        rightOffset: 8,
        barSpacing: 4,
      },
      crosshair: {
        vertLine: { color: cssVar("--accent-soft") || "rgba(11,114,133,0.28)" },
        horzLine: { color: cssVar("--accent-soft") || "rgba(11,114,133,0.28)" },
      },
    };
  }

  function normalizeTimeframe(timeframe) {
    if (!timeframe) return "1D";
    const raw = String(timeframe).trim();
    if (TIMEFRAME_MAP[raw]) return raw;
    const lowered = raw.toLowerCase();
    if (lowered === "1d" || lowered === "day" || lowered === "1day") return "1D";
    if (lowered === "15min") return "15m";
    if (lowered === "30min") return "30m";
    if (TIMEFRAME_MAP[lowered]) return lowered;
    return "1D";
  }

  function currentTimeframe() {
    const uiValue = dom.simTimeframe ? dom.simTimeframe.value : null;
    return normalizeTimeframe(uiValue || state.selectedTimeframe);
  }

  function timeframeConfig(timeframe) {
    return TIMEFRAME_MAP[normalizeTimeframe(timeframe)];
  }

  function assetTimeframeKey(assetId, timeframe) {
    return assetId + "|" + normalizeTimeframe(timeframe);
  }

  function normalizeSymbol(value) {
    return String(value || "").trim().toUpperCase();
  }

  function normalizeAssetId(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function toStooqSymbolFromYahoo(symbol) {
    const normalized = normalizeSymbol(symbol);
    if (!normalized) return "";
    if (normalized.endsWith(".NS") || normalized.endsWith(".BO")) {
      return normalized.replace(/\.(NS|BO)$/i, "").toLowerCase() + ".in";
    }
    return normalized.replace(/\./g, "-").toLowerCase() + ".us";
  }

  function resolveAssetBySymbol(symbol) {
    const normalized = normalizeSymbol(symbol);
    if (!normalized) return null;
    for (let i = 0; i < ASSETS.length; i += 1) {
      const asset = ASSETS[i];
      if (normalizeSymbol(asset.yahoo) === normalized || normalizeSymbol(asset.id) === normalized) {
        return asset;
      }
    }
    return null;
  }

  function applyUrlAssetSelection() {
    if (typeof window.URLSearchParams === "undefined") return;
    const params = new URLSearchParams(window.location.search || "");
    const symbol = normalizeSymbol(params.get("symbol") || params.get("ticker"));
    const name = String(params.get("name") || "").trim();
    const timeframe = params.get("timeframe");

    if (timeframe) {
      state.selectedTimeframe = normalizeTimeframe(timeframe);
    }

    if (!symbol) return;

    let asset = resolveAssetBySymbol(symbol);
    if (!asset) {
      const fallbackIdBase = "ext_" + normalizeAssetId(symbol);
      let fallbackId = fallbackIdBase || "ext_symbol";
      let suffix = 1;
      while (
        ASSETS.some(function (item) {
          return item.id === fallbackId;
        })
      ) {
        suffix += 1;
        fallbackId = fallbackIdBase + "_" + suffix;
      }

      asset = {
        id: fallbackId,
        label: name || symbol,
        yahoo: symbol,
        stooq: toStooqSymbolFromYahoo(symbol),
      };
      ASSETS.unshift(asset);
    }

    state.selectedAssetId = asset.id;
  }

  function getAssetAnchor(assetId) {
    if (assetId === "btc") return 35000;
    if (assetId === "xauusd") return 1900;
    if (assetId === "usdinr") return 82;
    if (assetId === "nvda") return 450;
    return 120;
  }

  function setActiveSection(sectionId) {
    dom.sectionButtons.forEach(function (button) {
      button.classList.toggle("active", button.dataset.section === sectionId);
    });

    dom.sections.forEach(function (section) {
      section.classList.toggle("active", section.id === sectionId);
    });
  }

  function setupTabs() {
    dom.sectionButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setActiveSection(button.dataset.section);
      });
    });
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

    if (state.chart) state.chart.applyOptions(chartThemeOptions());
    if (state.macdChart) state.macdChart.applyOptions(chartThemeOptions());
  }

  function initializeTheme() {
    let stored = "light";
    try {
      stored = localStorage.getItem("tsl-theme") || "light";
    } catch (err) {
      void err;
    }

    applyTheme(stored);

    if (dom.themeToggle) {
      dom.themeToggle.addEventListener("click", function () {
        const current = document.body.getAttribute("data-theme") || "light";
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }
  }

  function getStrategyRecords() {
    if (window.TradingStrategies && Array.isArray(window.TradingStrategies.list) && window.TradingStrategies.list.length) {
      return window.TradingStrategies.list;
    }

    return strategyFallbackNames.map(function (name) {
      return {
        name: name,
        description: "Educational placeholder strategy entry.",
        marketCondition: "Mixed market conditions",
        setup: "Review setup conditions before taking signals.",
        trigger: "Wait for trigger confirmation.",
        confirmation: "Confirm direction and structure.",
        stopText: "Use structured risk management.",
        targetText: "Define realistic target zones.",
        bestTimeframe: "1D",
      };
    });
  }

  function findStrategyByName(name) {
    for (let i = 0; i < state.strategyRecords.length; i += 1) {
      if (state.strategyRecords[i].name === name) return state.strategyRecords[i];
    }
    return state.strategyRecords[0] || null;
  }

  function detailRow(label, value) {
    return (
      '<div class="check-row">' +
      '<div class="check-index">+</div>' +
      '<div class="check-body"><h5>' +
      label +
      "</h5><p>" +
      (value || "n/a") +
      "</p></div>" +
      "</div>"
    );
  }

  function renderStrategyDetail(strategy) {
    if (!dom.strategyDetail || !strategy) return;

    dom.strategyDetail.innerHTML =
      "<h3>" +
      strategy.name +
      "</h3>" +
      "<p>" +
      (strategy.description || "No description available.") +
      "</p>" +
      '<div class="detail-grid">' +
      '<div class="detail-card"><h4>Market condition</h4><p>' +
      (strategy.marketCondition || "n/a") +
      "</p></div>" +
      '<div class="detail-card"><h4>Best timeframe</h4><p>' +
      (strategy.bestTimeframe || "n/a") +
      "</p></div>" +
      "</div>" +
      '<div class="checklist">' +
      detailRow("Setup", strategy.setup) +
      detailRow("Trigger", strategy.trigger) +
      detailRow("Confirmation", strategy.confirmation) +
      detailRow("Stop", strategy.stopText) +
      detailRow("Target", strategy.targetText) +
      "</div>";
  }

  function renderStrategyList(filterText) {
    if (!dom.strategyList) return;

    const term = (filterText || "").trim().toLowerCase();
    const filtered = state.strategyRecords.filter(function (strategy) {
      return !term || strategy.name.toLowerCase().includes(term);
    });

    dom.strategyList.innerHTML = "";

    filtered.forEach(function (strategy) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "strategy-item" + (strategy.name === state.selectedStrategyName ? " active" : "");
      button.innerHTML =
        '<span class="strategy-item-title">' +
        strategy.name +
        "</span>" +
        '<span class="strategy-item-sub">' +
        (strategy.marketCondition || "Educational strategy") +
        "</span>";

      button.addEventListener("click", function () {
        setSelectedStrategy(strategy.name, false);
      });

      dom.strategyList.appendChild(button);
    });

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "No strategies matched your search.";
      dom.strategyList.appendChild(empty);
    }
  }

  function populateStrategyDropdowns() {
    const selects = [dom.strategySelect, dom.simStrategy].filter(Boolean);
    selects.forEach(function (select) {
      select.innerHTML = "";
      state.strategyRecords.forEach(function (strategy) {
        const option = document.createElement("option");
        option.value = strategy.name;
        option.textContent = strategy.name;
        select.appendChild(option);
      });
    });

    if (dom.simTimeframe) {
      dom.simTimeframe.innerHTML = "";
      TIMEFRAMES.forEach(function (tf) {
        const option = document.createElement("option");
        option.value = tf.value;
        option.textContent = tf.label;
        dom.simTimeframe.appendChild(option);
      });
      dom.simTimeframe.value = state.selectedTimeframe;
    }
  }

  function setSelectedStrategy(name, rerun) {
    const strategy = findStrategyByName(name);
    if (!strategy) return;

    state.selectedStrategyName = strategy.name;
    if (dom.strategySelect) dom.strategySelect.value = strategy.name;
    if (dom.simStrategy) dom.simStrategy.value = strategy.name;

    renderStrategyList(dom.strategySearch ? dom.strategySearch.value : "");
    renderStrategyDetail(strategy);

    if (rerun && state.candles.length) {
      runSimulation();
    }
  }

  function populateStocks() {
    if (!dom.stockSelect) return;
    dom.stockSelect.innerHTML = "";
    ASSETS.forEach(function (asset) {
      const option = document.createElement("option");
      option.value = asset.id;
      option.textContent = asset.label;
      dom.stockSelect.appendChild(option);
    });
    dom.stockSelect.value = state.selectedAssetId;
  }

  function formatNumber(value, digits) {
    if (!Number.isFinite(value)) return "n/a";
    return value.toFixed(digits == null ? 2 : digits);
  }

  function renderStockColumns(filterText) {
    if (!dom.stockColumns) return;
    dom.stockColumns.innerHTML = "";

    var query = (filterText || (dom.stockSearch ? dom.stockSearch.value : "") || "").toLowerCase().trim();
    var filtered = query
      ? ASSETS.filter(function(a) {
          return a.label.toLowerCase().includes(query) || a.yahoo.toLowerCase().includes(query);
        })
      : ASSETS;

    if (dom.stockSearchCount) {
      dom.stockSearchCount.textContent = query ? filtered.length + " of " + ASSETS.length : ASSETS.length + " stocks";
    }

    // Show max 60 cards at a time when not searching (performance)
    var toShow = (query || filtered.length <= 60) ? filtered : filtered.slice(0, 60);

    toShow.forEach(function (asset) {
      const statKey = assetTimeframeKey(asset.id, currentTimeframe());
      const stat = state.assetStats.get(statKey) || { status: "loading" };
      const card = document.createElement("button");
      card.type = "button";
      card.className = "stock-col" + (asset.id === state.selectedAssetId ? " active" : "");

      const changeClass =
        Number.isFinite(stat.changePct) && stat.changePct !== 0
          ? stat.changePct > 0
            ? "positive"
            : "negative"
          : "";

      card.innerHTML =
        '<div class="stock-col-symbol">' +
        asset.label +
        "</div>" +
        '<div class="stock-col-meta">' +
        "Last: " +
        (Number.isFinite(stat.lastClose) ? formatNumber(stat.lastClose, 2) : stat.status || "loading") +
        "</div>" +
        '<div class="stock-col-meta stock-col-change ' +
        changeClass +
        '">' +
        "Change: " +
        (Number.isFinite(stat.changePct) ? formatNumber(stat.changePct, 2) + "%" : "n/a") +
        "</div>" +
        '<div class="stock-col-meta">Candles: ' +
        (Number.isFinite(stat.count) ? stat.count : "...") +
        "</div>";

      card.addEventListener("click", function () {
        void setActiveAsset(asset.id, true);
      });

      dom.stockColumns.appendChild(card);
    });
  }

  function buildAssetStat(candles, status) {
    const last = candles[candles.length - 1];
    const prev = candles[candles.length - 2];
    const changePct = last && prev && prev.close !== 0 ? ((last.close - prev.close) / prev.close) * 100 : null;

    return {
      status: status || "ready",
      lastClose: last ? last.close : null,
      changePct: Number.isFinite(changePct) ? changePct : null,
      count: candles.length,
    };
  }

  function getCacheKey(assetId, timeframe) {
    return "tsl-candles-" + assetId + "-" + normalizeTimeframe(timeframe);
  }

  function readCachedCandles(assetId, timeframe) {
    try {
      const raw = localStorage.getItem(getCacheKey(assetId, timeframe));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length < 200) return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function writeCachedCandles(assetId, timeframe, candles) {
    const tf = timeframeConfig(timeframe);
    try {
      localStorage.setItem(getCacheKey(assetId, timeframe), JSON.stringify(candles.slice(-(tf ? tf.cacheLimit : 6000))));
    } catch (err) {
      void err;
    }
  }

  function normalizeCandles(candles) {
    const out = [];
    for (let i = 0; i < candles.length; i += 1) {
      const c = candles[i];
      if (!c) continue;
      const time = Math.floor(Number(c.time));
      const open = Number(c.open);
      const high = Number(c.high);
      const low = Number(c.low);
      const close = Number(c.close);
      const volume = Number(c.volume);
      if (![time, open, high, low, close].every(Number.isFinite)) continue;
      out.push({
        time: time,
        open: open,
        high: high,
        low: low,
        close: close,
        volume: Number.isFinite(volume) && volume > 0 ? volume : 1,
      });
    }

    out.sort(function (a, b) {
      return a.time - b.time;
    });

    const deduped = [];
    let prevTime = -1;
    for (let i = 0; i < out.length; i += 1) {
      if (out[i].time === prevTime) continue;
      deduped.push(out[i]);
      prevTime = out[i].time;
    }

    return deduped;
  }

  async function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timeout = setTimeout(function () {
      controller.abort();
    }, timeoutMs || 15000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      return response;
    } finally {
      clearTimeout(timeout);
    }
  }

  function parseYahooCandles(payload) {
    const result = payload && payload.chart && payload.chart.result && payload.chart.result[0];
    if (!result) return [];

    const timestamps = result.timestamp || [];
    const quote = (result.indicators && result.indicators.quote && result.indicators.quote[0]) || {};

    const opens = quote.open || [];
    const highs = quote.high || [];
    const lows = quote.low || [];
    const closes = quote.close || [];
    const volumes = quote.volume || [];

    const candles = [];
    for (let i = 0; i < timestamps.length; i += 1) {
      if (![opens[i], highs[i], lows[i], closes[i], timestamps[i]].every(Number.isFinite)) continue;
      candles.push({
        time: Number(timestamps[i]),
        open: Number(opens[i]),
        high: Number(highs[i]),
        low: Number(lows[i]),
        close: Number(closes[i]),
        volume: Number.isFinite(volumes[i]) && volumes[i] > 0 ? Number(volumes[i]) : 1,
      });
    }

    return normalizeCandles(candles);
  }

  async function fetchYahooAsset(yahooSymbol, timeframe) {
    const tf = timeframeConfig(timeframe);
    const url =
      "https://query1.finance.yahoo.com/v8/finance/chart/" +
      encodeURIComponent(yahooSymbol) +
      "?range=" +
      encodeURIComponent(tf.yahooRange) +
      "&interval=" +
      encodeURIComponent(tf.yahooInterval) +
      "&includePrePost=false&events=div%2Csplits";

    const response = await fetchWithTimeout(url, 15000);
    if (!response.ok) throw new Error("Yahoo request failed");
    const json = await response.json();
    const candles = parseYahooCandles(json);
    if (candles.length < tf.minCandles) throw new Error("Yahoo data insufficient");
    return candles;
  }

  function parseStooqCsv(csvText) {
    if (!csvText) return [];
    const lines = csvText.trim().split(/\r?\n/);
    if (!lines.length) return [];

    const candles = [];
    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(",");
      if (parts.length < 5) continue;
      if (parts[1] === "N/D" || parts[2] === "N/D" || parts[3] === "N/D" || parts[4] === "N/D") continue;

      const time = Math.floor(new Date(parts[0] + "T00:00:00Z").getTime() / 1000);
      const open = Number(parts[1]);
      const high = Number(parts[2]);
      const low = Number(parts[3]);
      const close = Number(parts[4]);
      const volume = Number(parts[5]);

      if (![time, open, high, low, close].every(Number.isFinite)) continue;
      candles.push({
        time: time,
        open: open,
        high: high,
        low: low,
        close: close,
        volume: Number.isFinite(volume) && volume > 0 ? volume : 1,
      });
    }

    return normalizeCandles(candles);
  }

  async function fetchStooqAsset(stooqCode) {
    const rawUrl = "https://stooq.com/q/d/l/?s=" + encodeURIComponent(stooqCode) + "&i=d";
    const urls = [rawUrl, "https://api.allorigins.win/raw?url=" + encodeURIComponent(rawUrl)];

    for (let i = 0; i < urls.length; i += 1) {
      try {
        const response = await fetchWithTimeout(urls[i], 15000);
        if (!response.ok) continue;
        const text = await response.text();
        const candles = parseStooqCsv(text);
        if (candles.length >= 200) return candles;
      } catch (err) {
        void err;
      }
    }

    throw new Error("Stooq data unavailable");
  }

  function fallbackCandles(minCount, timeframe) {
    const tf = timeframeConfig(timeframe);
    if (window.TradingData && typeof window.TradingData.getCandles === "function") {
      const data = window.TradingData.getCandles(tf.value) || window.TradingData.getCandles("1D") || [];
      if (Array.isArray(data) && data.length >= minCount) {
        return normalizeCandles(data);
      }
    }

    const count = Math.max(minCount, tf.value === "1D" ? 3000 : 6000);
    const start = Math.floor(Date.now() / 1000) - count * tf.seconds;
    return generateSyntheticOHLC(count, 100, tf.seconds, start);
  }

  async function loadAssetCandles(asset, timeframe) {
    const tf = timeframeConfig(timeframe);
    const cached = readCachedCandles(asset.id, tf.value);
    if (cached && cached.length >= tf.minCandles) {
      return normalizeCandles(cached);
    }

    let candles = [];
    try {
      candles = await fetchYahooAsset(asset.yahoo, tf.value);
    } catch (err) {
      void err;
    }

    if (tf.value === "1D" && candles.length < tf.minCandles) {
      try {
        candles = await fetchStooqAsset(asset.stooq);
      } catch (err) {
        void err;
      }
    }

    if (candles.length < tf.minCandles) {
      candles = fallbackCandles(Math.max(tf.minCandles, 500), tf.value);
      const anchor = getAssetAnchor(asset.id);
      candles = remapSyntheticBase(candles, anchor);
    }

    writeCachedCandles(asset.id, tf.value, candles);
    return candles;
  }

  async function ensureAssetData(assetId, timeframe) {
    const tf = normalizeTimeframe(timeframe);
    const key = assetTimeframeKey(assetId, tf);
    if (state.assetDataCache.has(key)) return state.assetDataCache.get(key);

    if (state.assetLoadPromises.has(key)) {
      return state.assetLoadPromises.get(key);
    }

    const asset = ASSETS.find(function (item) {
      return item.id === assetId;
    });

    if (!asset) {
      const fallback = fallbackCandles(500, tf);
      state.assetDataCache.set(key, fallback);
      return fallback;
    }

    state.assetStats.set(key, { status: "loading" });
    renderStockColumns();

    const promise = loadAssetCandles(asset, tf)
      .then(function (candles) {
        const normalized = normalizeCandles(candles);
        state.assetDataCache.set(key, normalized);
        state.assetStats.set(key, buildAssetStat(normalized, "ready"));
        renderStockColumns();
        return normalized;
      })
      .catch(function () {
        const fallback = remapSyntheticBase(fallbackCandles(500, tf), getAssetAnchor(asset.id));
        state.assetDataCache.set(key, fallback);
        state.assetStats.set(key, buildAssetStat(fallback, "fallback"));
        renderStockColumns();
        return fallback;
      })
      .finally(function () {
        state.assetLoadPromises.delete(key);
      });

    state.assetLoadPromises.set(key, promise);
    return promise;
  }

  async function setActiveAsset(assetId, rerun, timeframeOverride) {
    const timeframe = normalizeTimeframe(timeframeOverride || currentTimeframe());
    state.selectedAssetId = assetId;
    state.selectedTimeframe = timeframe;
    if (dom.stockSelect) dom.stockSelect.value = assetId;
    if (dom.simTimeframe) dom.simTimeframe.value = timeframe;
    renderStockColumns();

    const candles = await ensureAssetData(assetId, timeframe);
    state.candles = candles;
    console.log("[Trading Strategy Lab] 3) data length:", candles.length);

    if (rerun) {
      runSimulation();
    }
  }

  function showError(message) {
    if (!dom.chartError) {
      alert(message);
      return;
    }
    dom.chartError.hidden = false;
    dom.chartError.textContent = message;
  }

  function hideError() {
    if (!dom.chartError) return;
    dom.chartError.hidden = true;
    dom.chartError.textContent = "";
  }

  function createCharts() {
    const libraryLoaded = typeof window.LightweightCharts !== "undefined";
    console.log("[Trading Strategy Lab] 1) library loaded:", libraryLoaded);

    const containerFound = Boolean(dom.chart);
    console.log("[Trading Strategy Lab] 2) chart container found:", containerFound);

    if (!containerFound) {
      showError("Chart container #chart not found in the page.");
      return false;
    }

    if (!libraryLoaded) {
      showError("Lightweight Charts failed to load. Check the CDN script tag and network access.");
      return false;
    }

    if (dom.chart.clientHeight <= 0) {
      showError("Chart container has zero height. Check CSS for #chart.");
      return false;
    }

    hideError();

    state.chart = LightweightCharts.createChart(
      dom.chart,
      Object.assign(
        {
          width: dom.chart.clientWidth,
          height: dom.chart.clientHeight,
        },
        chartThemeOptions()
      )
    );

    state.candleSeries = state.chart.addCandlestickSeries({
      upColor: cssVar("--positive") || "#16a34a",
      downColor: cssVar("--negative") || "#dc2626",
      borderVisible: false,
      wickUpColor: cssVar("--positive") || "#16a34a",
      wickDownColor: cssVar("--negative") || "#dc2626",
    });

    state.sma50Series = state.chart.addLineSeries({
      color: INDICATOR_COLORS.sma50,
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    state.sma200Series = state.chart.addLineSeries({
      color: INDICATOR_COLORS.sma200,
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    state.bbUpperSeries = state.chart.addLineSeries({
      color: INDICATOR_COLORS.bb,
      lineWidth: 1,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    state.bbMiddleSeries = state.chart.addLineSeries({
      color: INDICATOR_COLORS.bbMiddle,
      lineWidth: 1,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    state.bbLowerSeries = state.chart.addLineSeries({
      color: INDICATOR_COLORS.bb,
      lineWidth: 1,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    state.vwapSeries = state.chart.addLineSeries({
      color: INDICATOR_COLORS.vwap,
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    if (dom.macdChart) {
      state.macdChart = LightweightCharts.createChart(
        dom.macdChart,
        Object.assign(
          {
            width: dom.macdChart.clientWidth,
            height: dom.macdChart.clientHeight,
          },
          chartThemeOptions()
        )
      );

      state.macdLineSeries = state.macdChart.addLineSeries({
        color: INDICATOR_COLORS.macd,
        lineWidth: 2,
        lastValueVisible: false,
        priceLineVisible: false,
      });

      state.macdSignalSeries = state.macdChart.addLineSeries({
        color: INDICATOR_COLORS.macdSignal,
        lineWidth: 2,
        lastValueVisible: false,
        priceLineVisible: false,
      });

      state.macdHistSeries = state.macdChart.addHistogramSeries({
        priceLineVisible: false,
        lastValueVisible: false,
      });

      syncCharts();
    }

    return true;
  }

  function syncCharts() {
    if (!state.chart || !state.macdChart) return;

    let lock = false;
    state.chart.timeScale().subscribeVisibleLogicalRangeChange(function (range) {
      if (lock || !range) return;
      lock = true;
      state.macdChart.timeScale().setVisibleLogicalRange(range);
      lock = false;
    });

    state.macdChart.timeScale().subscribeVisibleLogicalRangeChange(function (range) {
      if (lock || !range) return;
      lock = true;
      state.chart.timeScale().setVisibleLogicalRange(range);
      lock = false;
    });
  }

  function strategyContext(strategy, candles) {
    const defaults = typeof strategy.getDefaultParams === "function" ? strategy.getDefaultParams() : {};
    const params = typeof strategy.validateParams === "function" ? strategy.validateParams(defaults) : defaults;
    const timeframe = dom.simTimeframe ? dom.simTimeframe.value || "1D" : "1D";

    return {
      candles: candles,
      params: params,
      timeframe: timeframe,
    };
  }

  function runBacktest(candles, strategy, allowMultiple) {
    const ctx = strategyContext(strategy, candles);

    let signals = [];
    try {
      signals = (strategy.signal && strategy.signal(ctx)) || [];
    } catch (err) {
      signals = [];
    }

    signals = signals
      .filter(function (signal) {
        return signal && Number.isInteger(signal.index) && signal.index > 0 && signal.index < candles.length - 1;
      })
      .sort(function (a, b) {
        return a.index - b.index;
      })
      .map(function (signal, i) {
        return Object.assign({}, signal, {
          id: signal.id || signal.direction + "-" + signal.index + "-" + i,
        });
      });

    const queue = new Map();
    const events = new Map();
    signals.forEach(function (signal) {
      const entryIndex = signal.index + 1;
      if (!queue.has(entryIndex)) queue.set(entryIndex, []);
      queue.get(entryIndex).push(signal);
      if (!events.has(signal.index)) events.set(signal.index, []);
      events.get(signal.index).push("Signal " + signal.direction.toUpperCase() + ": " + (signal.reason || ""));
    });

    const trades = [];
    const openPositions = [];

    function pushEvent(index, text) {
      if (!events.has(index)) events.set(index, []);
      events.get(index).push(text);
    }

    function sanitizeLevels(direction, entry, stop, target) {
      let safeStop = stop;
      let safeTarget = target;

      if (!Number.isFinite(safeStop)) safeStop = direction === "long" ? entry * 0.99 : entry * 1.01;
      if (!Number.isFinite(safeTarget)) safeTarget = direction === "long" ? entry * 1.02 : entry * 0.98;

      if (direction === "long") {
        if (safeStop >= entry) safeStop = entry * 0.995;
        if (safeTarget <= entry) safeTarget = entry + Math.abs(entry - safeStop) * 2;
      } else {
        if (safeStop <= entry) safeStop = entry * 1.005;
        if (safeTarget >= entry) safeTarget = entry - Math.abs(entry - safeStop) * 2;
      }

      return { stop: safeStop, target: safeTarget };
    }

    function closePosition(position, exitIndex, exitPrice, reason) {
      const retPct =
        position.direction === "long"
          ? ((exitPrice - position.entryPrice) / position.entryPrice) * 100
          : ((position.entryPrice - exitPrice) / position.entryPrice) * 100;

      const trade = {
        signalId: position.signalId,
        direction: position.direction,
        entryIndex: position.entryIndex,
        entryPrice: position.entryPrice,
        stop: position.stop,
        target: position.target,
        exitIndex: exitIndex,
        exitPrice: exitPrice,
        returnPct: retPct,
        reason: reason,
      };

      trades.push(trade);
      pushEvent(exitIndex, "Exit " + position.direction.toUpperCase() + " " + formatNumber(retPct, 2) + "% (" + reason + ")");
    }

    function tryExit(position, candle, i) {
      if (position.direction === "long") {
        const stopHit = candle.low <= position.stop;
        const targetHit = candle.high >= position.target;

        if (stopHit && targetHit) {
          closePosition(position, i, position.stop, "Stop+Target same candle (conservative)");
          return true;
        }
        if (stopHit) {
          closePosition(position, i, position.stop, "Stop hit");
          return true;
        }
        if (targetHit) {
          closePosition(position, i, position.target, "Target hit");
          return true;
        }
      } else {
        const stopHit = candle.high >= position.stop;
        const targetHit = candle.low <= position.target;

        if (stopHit && targetHit) {
          closePosition(position, i, position.stop, "Stop+Target same candle (conservative)");
          return true;
        }
        if (stopHit) {
          closePosition(position, i, position.stop, "Stop hit");
          return true;
        }
        if (targetHit) {
          closePosition(position, i, position.target, "Target hit");
          return true;
        }
      }

      return false;
    }

    for (let i = 1; i < candles.length; i += 1) {
      const candle = candles[i];

      for (let p = openPositions.length - 1; p >= 0; p -= 1) {
        if (tryExit(openPositions[p], candle, i)) {
          openPositions.splice(p, 1);
        }
      }

      const entries = queue.get(i) || [];
      for (let e = 0; e < entries.length; e += 1) {
        if (!allowMultiple && openPositions.length) break;

        const signal = entries[e];
        const entryPrice = candles[i].open;

        let stop = signal.direction === "long" ? entryPrice * 0.99 : entryPrice * 1.01;
        let target = signal.direction === "long" ? entryPrice * 1.02 : entryPrice * 0.98;

        try {
          if (typeof strategy.stop === "function") stop = strategy.stop(ctx, signal, i, entryPrice);
        } catch (err) {
          void err;
        }

        try {
          if (typeof strategy.target === "function") target = strategy.target(ctx, signal, i, entryPrice, stop);
        } catch (err) {
          void err;
        }

        if (typeof strategy.sanitizeLevels === "function") {
          const sanitized = strategy.sanitizeLevels(signal.direction, entryPrice, stop, target);
          stop = sanitized.stop;
          target = sanitized.target;
        } else {
          const sanitized = sanitizeLevels(signal.direction, entryPrice, stop, target);
          stop = sanitized.stop;
          target = sanitized.target;
        }

        openPositions.push({
          signalId: signal.id,
          direction: signal.direction,
          entryIndex: i,
          entryPrice: entryPrice,
          stop: stop,
          target: target,
        });

        pushEvent(
          i,
          "Entry " + signal.direction.toUpperCase() + " @ " + formatNumber(entryPrice, 3) +
            " | SL " + formatNumber(stop, 3) + " | TP " + formatNumber(target, 3)
        );

        if (!allowMultiple) break;
      }
    }

    if (openPositions.length) {
      const lastIndex = candles.length - 1;
      const lastClose = candles[lastIndex].close;
      for (let i = openPositions.length - 1; i >= 0; i -= 1) {
        closePosition(openPositions[i], lastIndex, lastClose, "EOD close");
      }
    }

    const markers = signals.map(function (signal) {
      return {
        index: signal.index,
        time: candles[signal.index].time,
        position: signal.direction === "long" ? "belowBar" : "aboveBar",
        shape: signal.direction === "long" ? "arrowUp" : "arrowDown",
        color: signal.direction === "long" ? INDICATOR_COLORS.histUp : INDICATOR_COLORS.histDown,
        text: signal.direction === "long" ? "L" : "S",
      };
    });

    return {
      signals: signals,
      trades: trades,
      markers: markers,
      events: events,
      metrics: computeMetrics(trades),
    };
  }

  function computeMetrics(trades) {
    if (!trades.length) {
      return { count: 0, winRate: 0, avgReturn: 0, maxDrawdown: 0 };
    }

    let wins = 0;
    let sum = 0;
    let equity = 1;
    let peak = 1;
    let maxDrawdown = 0;

    trades.forEach(function (trade) {
      if (trade.returnPct > 0) wins += 1;
      sum += trade.returnPct;
      equity *= 1 + trade.returnPct / 100;
      peak = Math.max(peak, equity);
      maxDrawdown = Math.max(maxDrawdown, ((peak - equity) / peak) * 100);
    });

    return {
      count: trades.length,
      winRate: (wins / trades.length) * 100,
      avgReturn: sum / trades.length,
      maxDrawdown: maxDrawdown,
    };
  }

  function updateMetrics(metrics) {
    if (dom.metricTrades) dom.metricTrades.textContent = String(metrics.count);
    if (dom.metricWinRate) dom.metricWinRate.textContent = formatNumber(metrics.winRate, 1) + "%";
    if (dom.metricAvgReturn) dom.metricAvgReturn.textContent = formatNumber(metrics.avgReturn, 2) + "%";
    if (dom.metricDrawdown) dom.metricDrawdown.textContent = formatNumber(metrics.maxDrawdown, 2) + "%";
  }

  function computeIndicators(candles) {
    const closes = candles.map(function (c) {
      return c.close;
    });

    return {
      sma50: calculateSMA(closes, 50),
      sma200: calculateSMA(closes, 200),
      bb: calculateBollinger(closes, 20, 2),
      vwap: calculateVWAP(candles),
      macd: calculateMACD(closes, 12, 26, 9),
    };
  }

  function visibleMarkers(index) {
    return state.markers
      .filter(function (marker) {
        return marker.index <= index;
      })
      .map(function (marker) {
        return {
          time: marker.time,
          position: marker.position,
          color: marker.color,
          shape: marker.shape,
          text: marker.text,
        };
      });
  }

  function sliceLine(values, candles, endIndex) {
    const out = [];
    for (let i = 0; i <= endIndex; i += 1) {
      if (!Number.isFinite(values[i])) continue;
      out.push({ time: candles[i].time, value: values[i] });
    }
    return out;
  }

  function sliceMacdHist(values, candles, endIndex) {
    const out = [];
    for (let i = 0; i <= endIndex; i += 1) {
      if (!Number.isFinite(values[i])) continue;
      out.push({
        time: candles[i].time,
        value: values[i],
        color: values[i] >= 0 ? INDICATOR_COLORS.histUp : INDICATOR_COLORS.histDown,
      });
    }
    return out;
  }

  function syncStatus(index) {
    const candle = state.candles[index];
    const asset = ASSETS.find(function (item) {
      return item.id === state.selectedAssetId;
    });

    if (!dom.statusPanel || !candle) return;
    dom.statusPanel.textContent =
      (asset ? asset.label : state.selectedAssetId) +
      " | " +
      state.selectedTimeframe +
      " | " +
      state.selectedStrategyName +
      " | Candle: " +
      (index + 1) +
      " / " +
      state.candles.length +
      " | Close: " +
      formatNumber(candle.close, 4);
  }

  function syncExplanation(index) {
    if (!dom.explanationPanel) return;

    const events = state.strategyEvents.get(index) || [];
    if (!events.length) {
      dom.explanationPanel.textContent =
        "No new event on this candle. Simulation is progressing through historical data.";
      return;
    }

    dom.explanationPanel.textContent = events.join(" ");
  }

  function applyInitialZoom(index) {
    if (!state.chart) return;
    const backBars = 55;
    const lookAheadBars = 8;
    const from = Math.max(0, index - backBars);
    const to = index + lookAheadBars;
    state.chart.timeScale().setVisibleLogicalRange({ from: from, to: to });
    if (state.macdChart) state.macdChart.timeScale().setVisibleLogicalRange({ from: from, to: to });
  }

  function renderToIndex(index) {
    if (!state.chart || !state.candleSeries || !state.candles.length || !state.indicatorData) return;

    const capped = Math.max(0, Math.min(index, state.candles.length - 1));
    state.currentIndex = capped;

    const candles = state.candles;
    const indicator = state.indicatorData;

    state.candleSeries.setData(
      candles.slice(0, capped + 1).map(function (candle) {
        return {
          time: candle.time,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        };
      })
    );

    if (dom.toggleSma50 && dom.toggleSma50.checked) {
      state.sma50Series.setData(sliceLine(indicator.sma50, candles, capped));
    } else {
      state.sma50Series.setData([]);
    }

    if (dom.toggleSma200 && dom.toggleSma200.checked) {
      state.sma200Series.setData(sliceLine(indicator.sma200, candles, capped));
    } else {
      state.sma200Series.setData([]);
    }

    if (dom.toggleBb && dom.toggleBb.checked) {
      state.bbUpperSeries.setData(sliceLine(indicator.bb.upper, candles, capped));
      state.bbMiddleSeries.setData(sliceLine(indicator.bb.middle, candles, capped));
      state.bbLowerSeries.setData(sliceLine(indicator.bb.lower, candles, capped));
    } else {
      state.bbUpperSeries.setData([]);
      state.bbMiddleSeries.setData([]);
      state.bbLowerSeries.setData([]);
    }

    if (dom.toggleVwap && dom.toggleVwap.checked) {
      state.vwapSeries.setData(sliceLine(indicator.vwap, candles, capped));
    } else {
      state.vwapSeries.setData([]);
    }

    if (typeof state.candleSeries.setMarkers === "function") {
      state.candleSeries.setMarkers(visibleMarkers(capped));
    }

    if (state.macdChart) {
      state.macdLineSeries.setData(sliceLine(indicator.macd.line, candles, capped));
      state.macdSignalSeries.setData(sliceLine(indicator.macd.signal, candles, capped));
      state.macdHistSeries.setData(sliceMacdHist(indicator.macd.histogram, candles, capped));
    }

    updateMetrics(state.metrics);

    syncStatus(capped);
    syncExplanation(capped);
  }

  function runSimulation() {
    stopPlay();

    if (!state.candles.length) {
      state.metrics = { count: 0, winRate: 0, avgReturn: 0, maxDrawdown: 0 };
      updateMetrics(state.metrics);
      if (dom.explanationPanel) {
        dom.explanationPanel.textContent = "No candles loaded yet for the selected asset.";
      }
      return;
    }

    const strategy = findStrategyByName(state.selectedStrategyName);
    const allowMultiple = Boolean(dom.allowMultiple && dom.allowMultiple.checked);

    state.indicatorData = computeIndicators(state.candles);

    if (strategy && typeof strategy.signal === "function") {
      const simulation = runBacktest(state.candles, strategy, allowMultiple);
      state.strategySignals = simulation.signals;
      state.trades = simulation.trades;
      state.markers = simulation.markers;
      state.strategyEvents = simulation.events;
      state.metrics = simulation.metrics;

      if (!state.markers.length) {
        state.markers = buildRandomMarkers(state.candles, Math.max(8, Math.round(state.candles.length / 150)));
      }

      updateMetrics(state.metrics);
    } else {
      state.strategySignals = [];
      state.trades = [];
      state.markers = buildRandomMarkers(state.candles, Math.max(8, Math.round(state.candles.length / 150)));
      state.strategyEvents = new Map();
      state.metrics = { count: 0, winRate: 0, avgReturn: 0, maxDrawdown: 0 };
      updateMetrics(state.metrics);
    }

    state.initialIndex = Math.min(Math.max(260, Math.round(state.candles.length * 0.18)), state.candles.length - 1);
    state.currentIndex = state.initialIndex;

    renderToIndex(state.currentIndex);
    applyInitialZoom(state.currentIndex);
  }

  function nextCandle() {
    if (!state.candles.length) return;
    if (state.currentIndex >= state.candles.length - 1) {
      stopPlay();
      return;
    }
    state.currentIndex += 1;
    renderToIndex(state.currentIndex);
    applyInitialZoom(state.currentIndex);
  }

  function resetSimulation() {
    stopPlay();
    state.currentIndex = state.initialIndex || 0;
    renderToIndex(state.currentIndex);
    applyInitialZoom(state.currentIndex);
  }

  function play() {
    if (state.playTimer || !state.candles.length) return;
    state.playTimer = setInterval(nextCandle, 400);
  }

  function stopPlay() {
    if (!state.playTimer) return;
    clearInterval(state.playTimer);
    state.playTimer = null;
  }

  function bindControls() {
    [dom.runBtn, dom.sidebarRun].forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener("click", runSimulation);
    });

    [dom.resetBtn, dom.resetBtnBottom].forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener("click", resetSimulation);
    });

    [dom.nextBtn, dom.nextBtnBottom].forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener("click", nextCandle);
    });

    [dom.playBtn, dom.playBtnBottom].forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener("click", play);
    });

    [dom.pauseBtn, dom.pauseBtnBottom].forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener("click", stopPlay);
    });

    [dom.toggleSma50, dom.toggleSma200, dom.toggleBb, dom.toggleVwap].forEach(function (toggle) {
      if (!toggle) return;
      toggle.addEventListener("change", function () {
        renderToIndex(state.currentIndex);
      });
    });

    if (dom.strategySearch) {
      dom.strategySearch.addEventListener("input", function () {
        renderStrategyList(dom.strategySearch.value);
      });
    }

    if (dom.strategySelect) {
      dom.strategySelect.addEventListener("change", function () {
        setSelectedStrategy(dom.strategySelect.value, true);
      });
    }

    if (dom.simStrategy) {
      dom.simStrategy.addEventListener("change", function () {
        setSelectedStrategy(dom.simStrategy.value, true);
      });
    }

    if (dom.stockSelect) {
      dom.stockSelect.addEventListener("change", function () {
        void setActiveAsset(dom.stockSelect.value, true);
      });
    }

    if (dom.allowMultiple) {
      dom.allowMultiple.addEventListener("change", function () {
        runSimulation();
      });
    }

    if (dom.simTimeframe) {
      dom.simTimeframe.addEventListener("change", function () {
        void setActiveAsset(state.selectedAssetId, true, dom.simTimeframe.value);
      });
    }

    window.addEventListener("resize", function () {
      if (state.chart && dom.chart) {
        state.chart.applyOptions({ width: dom.chart.clientWidth, height: dom.chart.clientHeight });
      }
      if (state.macdChart && dom.macdChart) {
        state.macdChart.applyOptions({ width: dom.macdChart.clientWidth, height: dom.macdChart.clientHeight });
      }
      renderToIndex(state.currentIndex);
    });
  }

  async function warmAssetData() {
    const first = state.selectedAssetId;
    const tf = currentTimeframe();
    await setActiveAsset(first, true, tf);

    ASSETS.forEach(function (asset) {
      if (asset.id === first) return;
      void ensureAssetData(asset.id, tf);
    });
  }

  function boot() {
    setupTabs();
    initializeTheme();
    applyUrlAssetSelection();

    state.strategyRecords = getStrategyRecords();
    state.selectedStrategyName = state.strategyRecords[0] ? state.strategyRecords[0].name : "";

    populateStrategyDropdowns();
    populateStocks();
    renderStockColumns();
    setSelectedStrategy(state.selectedStrategyName, false);

    const chartsReady = createCharts();

    bindControls();
    void warmAssetData();

    if (!chartsReady && dom.explanationPanel) {
      dom.explanationPanel.textContent =
        "Chart library unavailable. Strategy data and controls remain active, but chart rendering is disabled.";
    }
  }

  boot();
});

function generateSyntheticOHLC(count, startPrice) {
  const candles = [];
  const intervalSec = 24 * 60 * 60;
  const start = Math.floor(Date.UTC(2010, 0, 1, 0, 0, 0) / 1000);
  let close = Number.isFinite(startPrice) ? startPrice : 100;

  for (let i = 0; i < count; i += 1) {
    const drift = (Math.random() - 0.49) * 0.02;
    const vol = 0.008 + Math.random() * 0.016;
    const open = close * (1 + (Math.random() - 0.5) * 0.004);
    close = open * (1 + drift);

    const bodyMax = Math.max(open, close);
    const bodyMin = Math.min(open, close);
    const high = bodyMax * (1 + Math.random() * vol);
    const low = bodyMin * (1 - Math.random() * vol);

    candles.push({
      time: start + i * intervalSec,
      open: round(open),
      high: round(Math.max(high, open, close)),
      low: round(Math.min(low, open, close)),
      close: round(close),
      volume: Math.round(1000 + Math.random() * 6000),
    });
  }

  return candles;
}

function remapSyntheticBase(candles, basePrice) {
  if (!candles.length || !Number.isFinite(basePrice) || basePrice <= 0) return candles;

  const first = candles[0].close;
  if (!Number.isFinite(first) || first <= 0) return candles;

  const factor = basePrice / first;
  return candles.map(function (candle) {
    return {
      time: candle.time,
      open: round(candle.open * factor),
      high: round(candle.high * factor),
      low: round(candle.low * factor),
      close: round(candle.close * factor),
      volume: Number.isFinite(candle.volume) ? candle.volume : 1,
    };
  });
}

function buildRandomMarkers(candles, count) {
  const used = new Set();
  const markers = [];

  while (markers.length < count && markers.length < candles.length - 20) {
    const index = 10 + Math.floor(Math.random() * (candles.length - 20));
    if (used.has(index)) continue;
    used.add(index);

    const longSide = Math.random() > 0.5;
    markers.push({
      index: index,
      time: candles[index].time,
      position: longSide ? "belowBar" : "aboveBar",
      shape: longSide ? "arrowUp" : "arrowDown",
      color: longSide ? "#16a34a" : "#dc2626",
      text: longSide ? "L" : "S",
    });
  }

  markers.sort(function (a, b) {
    return a.index - b.index;
  });

  return markers;
}

function calculateSMA(values, period) {
  const result = new Array(values.length).fill(null);
  if (!Array.isArray(values) || values.length < period || period <= 0) return result;

  let sum = 0;
  for (let i = 0; i < values.length; i += 1) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) result[i] = sum / period;
  }

  return result;
}

function calculateEMA(values, period) {
  const result = new Array(values.length).fill(null);
  if (!Array.isArray(values) || values.length < period || period <= 0) return result;

  let sum = 0;
  for (let i = 0; i < period; i += 1) sum += values[i];

  const multiplier = 2 / (period + 1);
  let prev = sum / period;
  result[period - 1] = prev;

  for (let i = period; i < values.length; i += 1) {
    prev = (values[i] - prev) * multiplier + prev;
    result[i] = prev;
  }

  return result;
}

function calculateBollinger(values, period, stdDev) {
  const upper = new Array(values.length).fill(null);
  const middle = new Array(values.length).fill(null);
  const lower = new Array(values.length).fill(null);

  if (!Array.isArray(values) || values.length < period || period <= 0) {
    return { upper: upper, middle: middle, lower: lower };
  }

  let sum = 0;
  let sumSq = 0;

  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];
    sum += value;
    sumSq += value * value;

    if (i >= period) {
      const old = values[i - period];
      sum -= old;
      sumSq -= old * old;
    }

    if (i >= period - 1) {
      const mean = sum / period;
      const variance = Math.max(0, sumSq / period - mean * mean);
      const sd = Math.sqrt(variance);
      middle[i] = mean;
      upper[i] = mean + sd * stdDev;
      lower[i] = mean - sd * stdDev;
    }
  }

  return { upper: upper, middle: middle, lower: lower };
}

function calculateVWAP(candles) {
  const out = new Array(candles.length).fill(null);
  let cumulativePV = 0;
  let cumulativeVolume = 0;

  for (let i = 0; i < candles.length; i += 1) {
    const candle = candles[i];
    const typicalPrice = (candle.high + candle.low + candle.close) / 3;
    const volume = Number.isFinite(candle.volume) && candle.volume > 0 ? candle.volume : 1;
    cumulativePV += typicalPrice * volume;
    cumulativeVolume += volume;
    out[i] = cumulativeVolume === 0 ? null : cumulativePV / cumulativeVolume;
  }

  return out;
}

function calculateMACD(values, fastPeriod, slowPeriod, signalPeriod) {
  const fast = calculateEMA(values, fastPeriod || 12);
  const slow = calculateEMA(values, slowPeriod || 26);

  const line = values.map(function (_, i) {
    if (!Number.isFinite(fast[i]) || !Number.isFinite(slow[i])) return null;
    return fast[i] - slow[i];
  });

  const signal = calculateEMA(
    line.map(function (value) {
      return Number.isFinite(value) ? value : 0;
    }),
    signalPeriod || 9
  );

  const histogram = line.map(function (value, i) {
    if (!Number.isFinite(value) || !Number.isFinite(signal[i])) return null;
    return value - signal[i];
  });

  return {
    line: line,
    signal: signal,
    histogram: histogram,
  };
}

function round(value) {
  return Math.round(value * 10000) / 10000;
}
