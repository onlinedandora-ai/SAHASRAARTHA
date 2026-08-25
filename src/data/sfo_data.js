/**
 * Sahasraartha Family Office LLP - Official Reconciled Accounts & Entities Dataset
 * Target Platform: iOS & Android (Cross-Platform)
 * Position as of 13-August-2026 / FY2026-27
 * Reconciled from bank (ICICI), broker (Nuvama), RevX AIF, and Artha Fund IV records.
 */

export const SFO_METADATA = {
  entityName: "Sahasraartha Family Office LLP",
  tagline: "Institutional Family Office Portfolio & Wealth Portal",
  legalForm: "Limited Liability Partnership (LLP)",
  jurisdiction: "Ministry of Corporate Affairs (MCA), India",
  llpPin: "ACA-1928-SFO",
  conceptualizer: "Mr. A. V. Srikanth",
  statutoryAuditor: "Murahari & Associates (Chartered Accountants)",
  asOfDate: "2026-08-13",
  comparisonDate: "2026-03-31",
  managingPartner: "Srikanth",
  sebiRegAIF: "SEBI IN/AIF2/24-25/1507",
  baseCurrency: "INR",
  currencySymbol: "₹",
  totalPartners: 28,
  totalFamilies: 12,
  bankReceiving: {
    bankName: "ICICI Bank",
    accountHolder: "Sahasraartha Family Office LLP",
    accountNumber: "818305500002",
    ifscCode: "ICIC0008183",
    branch: "Gajularamaram, Hyderabad",
    accountType: "Current Account",
    upiId: "sfo.llp@icici"
  }
};

export const HEADLINE_POSITION = {
  asOf13Aug2026: {
    totalAssets: 16427861.17,
    contributorFunds: 15250001.00,
    accumulatedSurplus: 1177860.17,
    returnOnCapitalPct: 7.72,
  },
  asOf31Mar2026: {
    totalAssets: 15602603.00,
    contributorFunds: 15250001.00,
    accumulatedSurplus: 352602.00,
    returnOnCapitalPct: 2.31,
  },
  asOf07Jan2026: {
    totalAssets: 16016851.00,
    contributorFunds: 15250001.00,
    accumulatedSurplus: 766850.00,
    returnOnCapitalPct: 5.03,
  }
};

/**
 * Full 18-Securities Holdings Master Table as of 13-August-2026
 * Directly extracted from SFO_Accounts.xlsx "Holdings" tab:
 * Quantities independently verified; 31-Mar-2026 holdings rolled forward through all FY2026-27 trades tie exactly to the Held Away Report
 */
export const HOLDINGS_AS_AT_13_AUG_2026 = [
  {
    security: "REVX Capital Trust Fund II Class E1",
    category: "AIF (Venture Debt)",
    qty: 99410,
    cost: 9941000,
    market: 9941000,
    unrealised: 0,
    returnPct: 0.00,
    portfolioPct: 67.39,
    notes: "Distributing class at par; generated ₹11.98L cash distributions."
  },
  {
    security: "Artha Fund IV Class S (at capital account)",
    category: "AIF (Venture Capital)",
    qty: 20000,
    cost: 2000000,
    market: 1715956,
    unrealised: -284044,
    returnPct: -14.20,
    portfolioPct: 11.63,
    notes: "Per manager statement 30-Jun-2026 (closing balance ₹17,15,956)."
  },
  {
    security: "Nippon Gold BeES ETF",
    category: "Commodity ETF",
    qty: 2752,
    cost: 237033,
    market: 345789,
    unrealised: 108756,
    returnPct: 45.88,
    portfolioPct: 2.34,
    notes: "Gold rally hedge; +45.88% unrealised gain."
  },
  {
    security: "Nippon Nifty 50 BeES ETF",
    category: "Index ETF",
    qty: 1153,
    cost: 329447,
    market: 320718,
    unrealised: -8729,
    returnPct: -2.65,
    portfolioPct: 2.17,
    notes: "Broad market index core."
  },
  {
    security: "Edelweiss Nifty500 Multicap Momentum Q50 ETF",
    category: "Smart-Beta ETF",
    qty: 20600,
    cost: 800928,
    market: 862110,
    unrealised: 61182,
    returnPct: 7.64,
    portfolioPct: 5.84,
    notes: "Momentum factor multicap strategy."
  },
  {
    security: "ABSL Nifty IT ETF",
    category: "Sectoral ETF",
    qty: 12434,
    cost: 402862,
    market: 428600,
    unrealised: 25738,
    returnPct: 6.39,
    portfolioPct: 2.91,
    notes: "Technology sector thematic ETF."
  },
  {
    security: "Nippon Nifty Next 50 Junior BeES ETF",
    category: "Index ETF",
    qty: 2,
    cost: 1509,
    market: 1614,
    unrealised: 105,
    returnPct: 6.96,
    portfolioPct: 0.01,
    notes: "Next 50 Junior index."
  },
  {
    security: "Zerodha Gold ETF",
    category: "Commodity ETF",
    qty: 96,
    cost: 2267,
    market: 2297,
    unrealised: 30,
    returnPct: 1.32,
    portfolioPct: 0.02,
    notes: "Gold physical ETF."
  },
  {
    security: "Zerodha NIFTY 1D Rate Liquid ETF",
    category: "Liquid ETF",
    qty: 9,
    cost: 1007,
    market: 1039,
    unrealised: 32,
    returnPct: 3.18,
    portfolioPct: 0.01,
    notes: "Overnight liquidity management."
  },
  {
    security: "Pricol",
    category: "Listed Equity",
    qty: 198,
    cost: 122841,
    market: 151470,
    unrealised: 28629,
    returnPct: 23.31,
    portfolioPct: 1.03,
    notes: "Auto Ancillary & instruments."
  },
  {
    security: "Finolex Cables",
    category: "Listed Equity",
    qty: 118,
    cost: 122139,
    market: 147683,
    unrealised: 25544,
    returnPct: 20.91,
    portfolioPct: 1.00,
    notes: "Electrical & telecom cables."
  },
  {
    security: "Kalpataru Projects International",
    category: "Listed Equity",
    qty: 95,
    cost: 109539,
    market: 128697,
    unrealised: 19158,
    returnPct: 17.49,
    portfolioPct: 0.87,
    notes: "Power transmission & EPC."
  },
  {
    security: "Glenmark Pharma",
    category: "Listed Equity",
    qty: 55,
    cost: 123382,
    market: 127600,
    unrealised: 4218,
    returnPct: 3.42,
    portfolioPct: 0.87,
    notes: "Specialty generics & respiratory."
  },
  {
    security: "NMDC",
    category: "Listed Equity",
    qty: 1456,
    cost: 122245,
    market: 123760,
    unrealised: 1515,
    returnPct: 1.24,
    portfolioPct: 0.84,
    notes: "Iron ore miner & dividend payer."
  },
  {
    security: "Great Eastern Shipping",
    category: "Listed Equity",
    qty: 90,
    cost: 121941,
    market: 117783,
    unrealised: -4158,
    returnPct: -3.41,
    portfolioPct: 0.80,
    notes: "Seaborne bulk & crude transportation."
  },
  {
    security: "Strides Pharma Science",
    category: "Listed Equity",
    qty: 119,
    cost: 122516,
    market: 117215,
    unrealised: -5301,
    returnPct: -4.33,
    portfolioPct: 0.79,
    notes: "Pharma formulations & softgels."
  },
  {
    security: "Lupin",
    category: "Listed Equity",
    qty: 50,
    cost: 117905,
    market: 112515,
    unrealised: -5390,
    returnPct: -4.57,
    portfolioPct: 0.76,
    notes: "Global formulations & biosimilars."
  },
  {
    security: "Waaree Energies",
    category: "Listed Equity",
    qty: 39,
    cost: 110236,
    market: 104793,
    unrealised: -5443,
    returnPct: -4.94,
    portfolioPct: 0.71,
    notes: "Solar PV module leader."
  }
];

export const PORTFOLIO_ASSETS = [
  {
    assetId: "AST-REVX-01",
    assetCode: "REVX-E1",
    assetName: "RevX Capital Trust Fund II (Class E1)",
    assetClass: "DEBT",
    category: "Alternative Investment Fund",
    subCategory: "Venture Debt & Yield",
    acquisitionDate: "2025-06-16",
    totalInvestedAmount: 9941000,
    currentValuation: 9941000,
    unitsOrQty: 99410,
    unitNav: 100.00,
    irrPct: 13.3,
    status: "ACTIVE",
    allocationPct: 60.51,
    manager: "RevX Capital Partners",
    location: "Mumbai, Maharashtra",
    exitTerms: "Quarterly amortizing distributions with 4-year fund tenure. Target gross IRR 14.5%.",
    historicalRevaluations: [
      { date: "2025-06-16", value: 9941000, nav: 100.00, note: "Initial subscription" },
      { date: "2025-10-03", value: 9941000, nav: 100.00, note: "Q2 cash yield ₹3.30L distributed" },
      { date: "2026-01-03", value: 9941000, nav: 100.00, note: "Q3 cash yield ₹3.30L distributed" },
      { date: "2026-04-04", value: 9941000, nav: 100.00, note: "Q4 cash yield ₹2.04L distributed" },
      { date: "2026-07-03", value: 9941000, nav: 100.00, note: "Q1 cash yield ₹3.32L distributed" }
    ],
    documents: [
      { title: "RevX Fund II Private Placement Memorandum", type: "PPM", size: "3.2 MB" },
      { title: "RevX Quarterly Distribution Advice Q1 FY27", type: "STATEMENT", size: "450 KB" }
    ],
    metadata: {
      totalCashDistributed: 1198114,
      payoutFrequency: "Quarterly",
      collateralCover: "1.75x Senior Secured Assets"
    },
    notes: "Distributing class at par; generated ₹11.98L cumulative cash yield (~13.3% p.a.)."
  },
  {
    assetId: "AST-ARTHA-02",
    assetCode: "ARTHA-IV",
    assetName: "Artha Fund IV (Class S, Folio 330035)",
    assetClass: "UNLISTED_EQUITY",
    category: "Alternative Investment Fund",
    subCategory: "Venture Capital / Early Stage",
    acquisitionDate: "2025-06-24",
    totalInvestedAmount: 2000000,
    currentValuation: 1715956,
    committedCapital: 10000000,
    undrawnCommitment: 8000000,
    unitsOrQty: 20000,
    unitNav: 85.80,
    irrPct: 18.2, // projected portfolio IRR
    status: "ACTIVE",
    allocationPct: 10.45,
    manager: "Artha India Ventures",
    location: "Mumbai / Bangalore",
    exitTerms: "7+2 Year Fund lifecycle. Exits via strategic secondary buyouts and IPO listing windows.",
    portfolioCompanies: [
      { name: "TakeMe2Space (TM2Space)", deployedCr: 10.026, heldValueCr: 10.026, multiple: 1.00, pctOfFund: 34.8, sfoLookThroughINR: 339001, status: "Active (Cost carrying)" },
      { name: "Raana Semiconductors", deployedCr: 6.423, heldValueCr: 6.423, multiple: 1.00, pctOfFund: 22.3, sfoLookThroughINR: 217174, status: "Active (520-CCPS tranche)" },
      { name: "Calligo Technologies", deployedCr: 5.357, heldValueCr: 17.440, multiple: 2.94, pctOfFund: 18.6, sfoLookThroughINR: 181135, status: "Term Sheet Marked (2.94x)" },
      { name: "Alwaysrise Stays", deployedCr: 3.002, heldValueCr: 3.002, multiple: 1.00, pctOfFund: 10.4, sfoLookThroughINR: 101504, status: "Active" },
      { name: "Cheerio Technologies", deployedCr: 2.002, heldValueCr: 2.002, multiple: 1.00, pctOfFund: 6.9, sfoLookThroughINR: 67680, status: "Active" },
      { name: "Clarity Global Labs", deployedCr: 1.995, heldValueCr: 1.995, multiple: 1.00, pctOfFund: 6.9, sfoLookThroughINR: 67447, status: "Active" },
      { name: "Pettle Pet Services", deployedCr: 1.002, heldValueCr: 0.000, multiple: 0.00, pctOfFund: 0.0, sfoLookThroughINR: 0, status: "100% Written Down (Diminution ₹33,875)" }
    ],
    historicalRevaluations: [
      { date: "2025-06-24", value: 1000000, nav: 100.00, note: "Drawdown 1 (10% of ₹1 Cr commitment)" },
      { date: "2026-01-07", value: 2000000, nav: 100.00, note: "Drawdown 2 (100% funded via internal yield)" },
      { date: "2026-03-31", value: 1745999, nav: 87.30, note: "FY26 year-end audit & Pettle write-down" },
      { date: "2026-06-30", value: 1715956, nav: 85.80, note: "Artha official capital account statement" }
    ],
    documents: [
      { title: "Artha Fund IV Contribution Agreement", type: "LEGAL", size: "2.4 MB" },
      { title: "Artha Capital Account Statement 30-Jun-2026", type: "STATEMENT", size: "780 KB" }
    ],
    metadata: {
      sfoLookThroughLiquid: 742014,
      sfoLookThroughInvested: 973942,
      sfoSharePct: "0.338123%"
    },
    notes: "Anchor VC investment. Second drawdown was 100% funded from portfolio cash yield (Flywheel Effect)."
  },
  {
    assetId: "AST-EQ-03",
    assetCode: "NUVAMA-EQ",
    assetName: "Direct Listed Equities (9 Quality Scrips)",
    assetClass: "LISTED_EQUITY",
    category: "Securities",
    subCategory: "High-Conviction Stock Basket",
    acquisitionDate: "2025-06-24",
    totalInvestedAmount: 1072744,
    currentValuation: 1131516,
    irrPct: 11.8,
    status: "ACTIVE",
    allocationPct: 6.89,
    manager: "Nuvama Wealth / SFO Desk",
    location: "National Stock Exchange (NSE)",
    exitTerms: "Liquid daily T+1 settlement on NSE/BSE.",
    scripsList: [
      { scrip: "Pricol Ltd", sector: "Auto Ancillary", cost: 122841, val: 151470, ret: 23.31 },
      { scrip: "Finolex Cables", sector: "Industrial & Telecom", cost: 122139, val: 147683, ret: 20.91 },
      { scrip: "Kalpataru Projects", sector: "EPC & Infrastructure", cost: 109539, val: 128697, ret: 17.49 },
      { scrip: "Glenmark Pharma", sector: "Healthcare / Pharma", cost: 123382, val: 127600, ret: 3.42 },
      { scrip: "NMDC Ltd", sector: "Mining & Metals", cost: 122245, val: 123760, ret: 1.24 },
      { scrip: "Great Eastern Shipping", sector: "Logistics", cost: 121941, val: 117783, ret: -3.41 },
      { scrip: "Strides Pharma Science", sector: "Pharma Formulations", cost: 122516, val: 117215, ret: -4.33 },
      { scrip: "Lupin Ltd", sector: "Pharma / Generics", cost: 117905, val: 112515, ret: -4.57 },
      { scrip: "Waaree Energies", sector: "Solar / Clean Energy", cost: 110236, val: 104793, ret: -4.94 }
    ],
    historicalRevaluations: [
      { date: "2025-06-24", value: 1072744, nav: 100.00, note: "Initial deployment" },
      { date: "2026-03-31", value: 1045000, nav: 97.41, note: "FY26 Year end valuation" },
      { date: "2026-08-13", value: 1131516, nav: 105.48, note: "Nuvama Held Away Report verified" }
    ],
    documents: [
      { title: "Nuvama Held Away Portfolio Report 13-Aug-2026", type: "REPORT", size: "1.1 MB" }
    ],
    metadata: {
      dividendYield: "1.45% p.a.",
      topHolding: "Pricol Ltd (₹1.51L)"
    },
    notes: "Core blue-chip and high-conviction midcap value basket managed with zero leverage."
  },
  {
    assetId: "AST-ETF-04",
    assetCode: "INDEX-ETF",
    assetName: "Index, Gold & Smart-Beta ETFs (7 Instruments)",
    assetClass: "COMMODITY",
    category: "Securities",
    subCategory: "Precious Metals & Index Trackers",
    acquisitionDate: "2025-06-24",
    totalInvestedAmount: 1775053,
    currentValuation: 1962167,
    irrPct: 15.4,
    status: "ACTIVE",
    allocationPct: 11.94,
    manager: "Nuvama Wealth / SFO Desk",
    location: "NSE / BSE",
    exitTerms: "Liquid exchange trading with daily market maker liquidity.",
    scripsList: [
      { scrip: "Edelweiss Nifty500 Momentum Q50", type: "Factor Index", cost: 800928, val: 862110, ret: 7.64 },
      { scrip: "ABSL Nifty IT ETF", type: "Sectoral Index", cost: 402862, val: 428600, ret: 6.39 },
      { scrip: "Nippon Gold BeES ETF", type: "Physical Gold", cost: 237033, val: 345789, ret: 45.88 },
      { scrip: "Nippon Nifty 50 BeES ETF", type: "Broad Benchmark", cost: 329447, val: 320718, ret: -2.65 },
      { scrip: "Zerodha Gold ETF", type: "Commodity Hedge", cost: 2267, val: 2297, ret: 1.32 },
      { scrip: "Nippon Nifty Next 50 BeES", type: "Index", cost: 1509, val: 1614, ret: 6.96 },
      { scrip: "Zerodha NIFTY 1D Rate Liquid ETF", type: "Overnight Yield", cost: 1007, val: 1039, ret: 3.18 }
    ],
    historicalRevaluations: [
      { date: "2025-06-24", value: 1775053, nav: 100.00, note: "Initial ETF allocation" },
      { date: "2026-03-31", value: 1812000, nav: 102.08, note: "FY26 Year end valuation" },
      { date: "2026-08-13", value: 1962167, nav: 110.54, note: "Gold + Momentum rally driven" }
    ],
    documents: [
      { title: "ETF Asset Allocation Sheet Q1 FY27", type: "REPORT", size: "520 KB" }
    ],
    metadata: {
      goldAllocation: "₹3.48 Lakhs (17.7%)",
      momentumIndex: "₹8.62 Lakhs (43.9%)"
    },
    notes: "Nippon Gold BeES returned +45.88% providing superior macro risk diversification."
  },
  {
    assetId: "AST-LIQ-05",
    assetCode: "LIQUID-CASH",
    assetName: "Dry Powder & Bank Liquid Reserves",
    assetClass: "DEBT",
    category: "Liquid Reserves",
    subCategory: "Treasury & Overnight Cash",
    acquisitionDate: "2025-05-14",
    totalInvestedAmount: 1677222,
    currentValuation: 1677222,
    irrPct: 6.5,
    status: "ACTIVE",
    allocationPct: 10.21,
    manager: "ICICI Bank & Nuvama Broker",
    location: "Hyderabad & Mumbai",
    exitTerms: "Instant same-day availability for capital call deployment.",
    accountsBreakdown: [
      { name: "Nuvama Broker Cash Ledger (Client 50191350)", val: 1507071.00, status: "Dry powder for equity dips" },
      { name: "ICICI Current Account (818305500002)", val: 170151.27, status: "Operational liquidity" }
    ],
    historicalRevaluations: [
      { date: "2026-03-31", value: 1248000, nav: 100.00, note: "FY26 closing cash" },
      { date: "2026-08-13", value: 1677222, nav: 100.00, note: "Reconciled with bank & broker statements" }
    ],
    documents: [
      { title: "ICICI Bank Reconciled Statement 12-Aug-2026", type: "BANK_STMT", size: "840 KB" },
      { title: "Nuvama Cash Ledger Confirmation 13-Aug-2026", type: "BROKER_STMT", size: "320 KB" }
    ],
    metadata: {
      bankConfirmed: "12-Aug-2026",
      brokerConfirmed: "13-Aug-2026"
    },
    notes: "₹15.07L dry powder held in Nuvama awaiting market entry opportunities; avoided ~₹30k MTM drawdown."
  }
];

export const INITIAL_CAPITAL_CALLS = [
  {
    callId: "CC-2026-01",
    callNumber: "Capital Call #01/2026-27",
    totalCallAmount: 10000000, // ₹1.00 Cr
    purpose: "Artha Fund IV Drawdown 3 (₹40L) & Strategic Commercial RE Asset Deployment (₹60L)",
    issueDate: "2026-08-15",
    dueDate: "2026-09-15",
    status: "ACTIVE",
    receivingBank: SFO_METADATA.bankReceiving,
    description: "Designated LLP capital call for all 28 partners according to official Profit Sharing Ratio (PSR %)."
  },
  {
    callId: "CC-2025-02",
    callNumber: "Capital Call #02/2025-26",
    totalCallAmount: 5250000,
    purpose: "RevX Capital Fund II Par Allotment and Equity Margin Setup",
    issueDate: "2025-05-18",
    dueDate: "2025-05-26",
    status: "CLOSED",
    receivingBank: SFO_METADATA.bankReceiving,
    description: "Successfully raised 100% of commitment across all 28 partners."
  }
];

export const INITIAL_CAPITAL_TRANSACTIONS = [
  {
    transactionId: "TX-2026-089",
    partnerId: "SH-LP-004",
    partnerName: "SURESH KESARLA",
    callId: "CC-2026-01",
    transactionType: "CAPITAL_CONTRIBUTION",
    amount: 1324600,
    paymentMode: "RTGS",
    utrReference: "UTIB2026081800192841",
    paymentDate: "2026-08-18",
    status: "PENDING", // In verification queue for Admin!
    receiptUrl: "receipt_suresh_kesarla_1324600.pdf",
    notes: "RTGS transfer for Capital Call #01 quota (13.246% PSR)"
  },
  {
    transactionId: "TX-2026-090",
    partnerId: "SH-LP-014",
    partnerName: "SARADA GANESH PANATHULA",
    callId: "CC-2026-01",
    transactionType: "CAPITAL_CONTRIBUTION",
    amount: 918000,
    paymentMode: "NEFT",
    utrReference: "SBIN2026081900881920",
    paymentDate: "2026-08-19",
    status: "PENDING", // In verification queue for Admin!
    receiptUrl: "receipt_sarada_ganesh_918000.pdf",
    notes: "NEFT transfer for Capital Call #01 quota (9.180% PSR)"
  },
  {
    transactionId: "TX-2026-091",
    partnerId: "SH-SA-001",
    partnerName: "Srikanth (Managing Partner)",
    callId: "CC-2026-01",
    transactionType: "CAPITAL_CONTRIBUTION",
    amount: 786900,
    paymentMode: "RTGS",
    utrReference: "HDFC2026081600491823",
    paymentDate: "2026-08-16",
    status: "VERIFIED",
    receiptUrl: "receipt_srikanth_786900.pdf",
    notes: "Verified by Statutory Designated Partner"
  },
  {
    transactionId: "TX-2026-078",
    partnerId: "SH-LP-001",
    partnerName: "LEELA RANI AYINAVOLU",
    callId: "CC-2026-01",
    transactionType: "CAPITAL_CONTRIBUTION",
    amount: 786900,
    paymentMode: "RTGS",
    utrReference: "HDFC2026081700991824",
    paymentDate: "2026-08-17",
    status: "VERIFIED",
    receiptUrl: "receipt_leelarani_786900.pdf",
    notes: "Verified by Statutory Designated Partner"
  }
];

export const INITIAL_DISTRIBUTION_EVENTS = [
  {
    eventId: "DIST-2026-Q1",
    title: "Q1 FY26-27 RevX Debt Yield Distribution",
    distributionDate: "2026-07-03",
    totalDistributionAmount: 332050.00,
    incomeType: "RENTAL_YIELD", // Debt yield treated under Income from other sources
    status: "COMPLETED",
    tdsRatePct: 10.0,
    totalTdsDeducted: 33205.00,
    totalNetPayable: 298845.00,
    sourceAsset: "RevX Capital Trust Fund II (Class E1)"
  },
  {
    eventId: "DIST-2026-Q4",
    title: "Q4 FY25-26 RevX Debt Yield Distribution",
    distributionDate: "2026-04-04",
    totalDistributionAmount: 204642.00,
    incomeType: "RENTAL_YIELD",
    status: "COMPLETED",
    tdsRatePct: 10.0,
    totalTdsDeducted: 20464.20,
    totalNetPayable: 184177.80,
    sourceAsset: "RevX Capital Trust Fund II (Class E1)"
  },
  {
    eventId: "DIST-2026-DIV",
    title: "FY26 Annual Listed Securities Dividend Payout",
    distributionDate: "2026-08-12",
    totalDistributionAmount: 16341.00,
    incomeType: "DIVIDEND",
    status: "COMPLETED",
    tdsRatePct: 10.0,
    totalTdsDeducted: 1634.10,
    totalNetPayable: 14706.90,
    sourceAsset: "Direct Listed Equities (9 Quality Scrips)"
  }
];

export const INITIAL_DOCUMENTS = [
  {
    documentId: "DOC-2026-01",
    title: "Form 16A — Tax Deducted at Source Certificate (FY 2025-26 Q4)",
    docType: "FORM_16A",
    folder: "Tax",
    partnerId: null, // Fund-wide
    fileSizeKb: 245,
    uploadedAt: "2026-05-15",
    isConfidential: true,
    fileExt: "pdf",
    description: "Statutory TDS certificate for partner tax filings issued by Murahari & Associates."
  },
  {
    documentId: "DOC-2026-02",
    title: "Form 64C — Partner Statement of Income Distributed (FY 2025-26)",
    docType: "FORM_16A",
    folder: "Tax",
    partnerId: null,
    fileSizeKb: 310,
    uploadedAt: "2026-06-30",
    isConfidential: true,
    fileExt: "pdf",
    description: "Detailed breakdown of interest, dividend and capital gains passed through to partners."
  },
  {
    documentId: "DOC-2026-03",
    title: "Sahasraartha Family Office LLP Agreement & MCA Incorporation Certificate",
    docType: "LLP_AGREEMENT",
    folder: "Legal",
    partnerId: null,
    fileSizeKb: 1840,
    uploadedAt: "2025-05-14",
    isConfidential: true,
    fileExt: "pdf",
    description: "Official LLP deed registered with Ministry of Corporate Affairs, Govt of India."
  },
  {
    documentId: "DOC-2026-04",
    title: "Supplementary LLP Deed — Schedule of 28 Partners & Capital Reconstitution",
    docType: "LLP_AGREEMENT",
    folder: "Legal",
    partnerId: null,
    fileSizeKb: 920,
    uploadedAt: "2025-05-26",
    isConfidential: true,
    fileExt: "pdf",
    description: "Formal annexure documenting partner profit sharing ratios (PSR %) and capital accounts."
  },
  {
    documentId: "DOC-2026-05",
    title: "Audited Financial Statements FY2025-26 — Murahari & Associates",
    docType: "QUARTERLY_REPORT",
    folder: "Reports",
    partnerId: null,
    fileSizeKb: 1420,
    uploadedAt: "2026-07-25",
    isConfidential: false,
    fileExt: "pdf",
    description: "Complete statutory audit report with balance sheet, P&L and auditor notes."
  },
  {
    documentId: "DOC-2026-06",
    title: "Artha Fund IV — Quarterly Capital Account Statement (Folio 330035)",
    docType: "QUARTERLY_REPORT",
    folder: "Reports",
    partnerId: null,
    fileSizeKb: 780,
    uploadedAt: "2026-06-30",
    isConfidential: true,
    fileExt: "pdf",
    description: "Portfolio lookup, company valuations (TM2Space, Calligo) and NAV statement."
  },
  {
    documentId: "DOC-2026-07",
    title: "RevX Capital Trust Fund II — Distribution Advice & Yield Reconciled Report",
    docType: "QUARTERLY_REPORT",
    folder: "Reports",
    partnerId: null,
    fileSizeKb: 450,
    uploadedAt: "2026-07-03",
    isConfidential: true,
    fileExt: "pdf",
    description: "Q1 FY27 cash yield payout calculation and credit confirmation."
  },
  {
    documentId: "DOC-2026-08",
    title: "Sahasraartha Family Office LLP — Corporate Overview & Operating Model v1.0",
    docType: "PITCH_DECK",
    folder: "Legal",
    partnerId: null,
    fileSizeKb: 1200,
    uploadedAt: "2026-08-01",
    isConfidential: false,
    fileExt: "pdf",
    description: "Official corporate structure, unitized NAV engine, and digital roadmap blueprint."
  }
];

export const INITIAL_DEALS = [
  {
    dealId: "DEAL-2026-01",
    title: "Artha Fund IV — Capital Drawdown Tranche 3 (₹40.0 Lakhs)",
    category: "Venture Capital Follow-on",
    proposer: "Srikanth (Managing Partner)",
    targetAmount: 4000000,
    votingDeadline: "2026-08-30",
    status: "ACTIVE",
    quorumNeededPct: 66.67,
    currentVotePct: 78.4,
    votes: {
      for: 22,
      against: 1,
      abstain: 3
    },
    summary: "Capital call for Calligo Technologies (currently marked at 2.94x) and TakeMe2Space expansion round.",
    comments: [
      { author: "Srikanth", date: "2026-08-16", text: "Strong metrics reported by Artha for Calligo. Recommended for follow-on." },
      { author: "Suresh Kesarla", date: "2026-08-17", text: "Voted FOR. Cash flow yield supports our drawdowns." }
    ]
  },
  {
    dealId: "DEAL-2026-02",
    title: "Bangalore Tech Corridor Commercial Pre-Leased Unit 501 (₹60.0 Lakhs)",
    category: "Real Estate (Rental Yield)",
    proposer: "Working Committee",
    targetAmount: 6000000,
    votingDeadline: "2026-09-05",
    status: "ACTIVE",
    quorumNeededPct: 75.0,
    currentVotePct: 62.5,
    votes: {
      for: 18,
      against: 2,
      abstain: 4
    },
    summary: "Grade A pre-leased commercial office with 8.4% entry rental yield and 5% annual escalation with Global IT MNC tenant.",
    comments: [
      { author: "Devaki Diwakar", date: "2026-08-18", text: "Rental yield provides stable monthly distributions for all 28 partners." }
    ]
  }
];

export const LIQUIDITY_BREAKDOWN = {
  brokerCashNuvama: 1507071.00,
  bankBalanceICICI: 170151.27,
  totalLiquidCash: 1677222.27,
  notes: "₹15.07L is held as dry powder in Nuvama awaiting market entry opportunities. Nifty pullback avoided ~₹30k MTM loss."
};

// Sheet 1: What Drove the Surplus (Inception to 13-Aug-2026)
export const SURPLUS_DRIVERS = [
  { component: "RevX Capital Fund II — cash distributions (4 received)", amount: 1198114, type: "income", basis: "Bank credits 03-Oct-25, 03-Jan-26, 04-Apr-26, 03-Jul-26" },
  { component: "Dividends received", amount: 16341, type: "income", basis: "23 ACH credits to ICICI" },
  { component: "Realised gains — securities, FY2025-26", amount: 34839, type: "gain", basis: "Nuvama P&L Tax Report FY2025-26" },
  { component: "Realised losses — securities, FY2026-27 YTD", amount: -37352, type: "loss", basis: "Derived from rolled cost basis" },
  { component: "F&O — NIFTY Aug-2026 round trip, 24-Jul-2026", amount: 29794, type: "gain", basis: "Gross, before charges (₹1.24 Cr notional)" },
  { component: "Brokerage, STT, GST, stamp, DP, SEBI charges", amount: -45655, type: "expense", basis: "FY25-26 ₹26,736 + FY26-27 ₹18,919" },
  { component: "Professional fees — CA and MCA", amount: -51450, type: "expense", basis: "Paid 23-Apr-2026 to ASHOKCA" },
  { component: "Reimbursement of professional fees", amount: 51450, type: "income", basis: "Devaki Prabhakar 23-Apr-2026" },
  { component: "Artha Fund IV — fees and diminution", amount: -284044, type: "loss", basis: "Artha capital account statement 30-Jun-2026" },
  { component: "Unrealised MTM on securities held", amount: 245886, type: "gain", basis: "Held Away Report 13-Aug-2026 vs rolled cost" },
  { component: "Residual to reconcile", amount: 19937, type: "other", basis: "0.13% of surplus. Dividend routing, charge capitalisation, estimated ledger" }
];

// Sheet 2: Master Ledger — 5 Reconciliation Accounts Proof
export const MASTER_ACCOUNTS_RECONCILIATION = [
  {
    id: "ACC-01",
    category: "1. BANK",
    name: "ICICI Current A/C (818305500002)",
    openingBalance: 0.00,
    receipts: 24832600.86,
    payments: -24662449.59,
    computedClosing: 170151.27,
    confirmedClosing: 170151.27,
    variance: 0.00,
    status: "RECONCILED",
    sourceDoc: "ICICI statement, 12-Aug-2026 (131 credits, 95 transactions)"
  },
  {
    id: "ACC-02",
    category: "2. BROKER",
    name: "Nuvama Cash Ledger (Client 50191350)",
    openingBalance: 334457.36,
    receipts: 1191532.28,
    payments: -18918.64,
    computedClosing: 1507071.00,
    confirmedClosing: 1507071.00,
    variance: 0.00,
    status: "RECONCILED",
    sourceDoc: "Nuvama ledger confirmed 13-Aug-2026 (Dry powder awaiting entry)"
  },
  {
    id: "ACC-03",
    category: "3. AIF (VENTURE)",
    name: "Artha Fund IV (Folio 330035, Class S)",
    openingBalance: 0.00,
    receipts: 2026857.04,
    payments: -310901.23,
    computedClosing: 1715955.81,
    confirmedClosing: 1715955.81,
    variance: 0.00,
    status: "RECONCILED",
    sourceDoc: "Artha capital account 30-Jun-2026 (Capital ₹20L, Fees ₹2.75L, Pettle ₹33.8k)"
  },
  {
    id: "ACC-04",
    category: "4. AIF (DEBT)",
    name: "RevX Capital Fund II (Class E1)",
    openingBalance: 0.00,
    receipts: 10000000.00,
    payments: -58999.00,
    computedClosing: 9941001.00,
    confirmedClosing: 9941000.00,
    variance: 1.00,
    status: "RECONCILED",
    sourceDoc: "Held Away Report — 99,410 units at par ₹100.00 (₹1.00 rounding diff)"
  },
  {
    id: "ACC-05",
    category: "5. SECURITIES",
    name: "Listed Equities (9) & ETFs (7)",
    openingBalance: 0.00,
    receipts: 3093683.09,
    payments: 0.00,
    computedClosing: 3093683.09,
    confirmedClosing: 3093683.09,
    variance: 0.00,
    status: "RECONCILED",
    sourceDoc: "Held Away Report, 13-Aug-2026 (Cost ₹28,47,797 + MTM ₹2,45,886.09)"
  }
];

// Sheet 4: Consolidated Balance Sheet
export const REVISED_BALANCE_SHEET = {
  asOf: "13-August-2026",
  assets: [
    { name: "REVX Capital Trust Fund II — Class E1 (99,410 units @ par)", cost: 9941000, marketValue: 9941000, source: "Held Away Report 13-Aug-2026" },
    { name: "Artha Fund IV — Class S (20,000 units @ manager capital a/c)", cost: 2000000, marketValue: 1715956, source: "Artha capital account 30-Jun-2026" },
    { name: "Listed equity — 9 scrips", cost: 1072744, marketValue: 1131516, source: "Held Away Report 13-Aug-2026" },
    { name: "ETFs — index, gold and liquid (7 instruments)", cost: 1775053, marketValue: 1962167, source: "Held Away Report 13-Aug-2026" },
    { name: "Broker cash ledger — Nuvama (Client 50191350)", cost: 1507071, marketValue: 1507071, source: "Nuvama ledger confirmed 13-Aug-2026" },
    { name: "Bank — ICICI current a/c 818305500002", cost: 170151, marketValue: 170151, source: "Statement, 12-Aug-2026" }
  ],
  totalAssetsCost: 16466019,
  totalAssetsMarket: 16427861,
  fundsEmployed: [
    { name: "Partners capital contribution (28 partners)", amount: 15250001, source: "36 bank credits, 14-May to 26-May-2025" },
    { name: "Accumulated surplus", amount: 1177860, source: "Analysed on P&L Statement" }
  ],
  totalFundsEmployed: 16427861
};

// Sheet 5: Profit & Loss Statement
export const PROFIT_AND_LOSS_STATEMENT = {
  periods: {
    fy26Closing: "31-Mar-2026",
    currentPeriod: "13-Aug-2026"
  },
  totalIncome: {
    fy26: 710462,
    fy27Ytd: 582724,
    total: 1293186
  },
  totalExpenses: {
    fy26: -280737,
    fy27Ytd: -100412,
    total: -381149
  },
  netRealisedResult: {
    fy26: 429725,
    fy27Ytd: 482312,
    total: 912037
  },
  unrealisedMovement: {
    fy26: -97060,
    fy27Ytd: 342946,
    total: 245886
  },
  residualReconcile: {
    fy26: 19937,
    fy27Ytd: 0,
    total: 19937
  },
  netResultForPeriod: {
    fy26: 352602,
    fy27Ytd: 825258
  },
  cumulativeSurplus: 1177860
};

// Sheet 6: Fund Flow Triangulation & The Flywheel
export const FUND_FLOW_FLYWHEEL = {
  title: "THE FLYWHEEL — DEMONSTRATED, NOT PROJECTED",
  summary: "The 2nd Artha drawdown of ₹10,00,000 on 07-Jan-2026 was funded 100% from portfolio income: RevX distributions (₹6,61,422) + Kotak Arbitrage redemption (₹2,50,030) + dividends. Zero fresh capital called from partners.",
  revxCashYieldAnnualizedPct: 13.3,
  sources: [
    { item: "Contributor receipts (36 credits, 14 to 26 May 2025)", amount: 15250001 },
    { item: "Reimbursement of MCA/CA fees — Devaki Prabhakar", amount: 51450 },
    { item: "RevX distributions received (4 quarterly payouts)", amount: 1198114 },
    { item: "RevX refund of excess subscription", amount: 58355 },
    { item: "Dividends received to bank (23 ACH credits)", amount: 16341 },
    { item: "Net returned from broker / clearing corp", amount: 5701207 },
    { item: "Total Sources Traced", amount: 22275468 }
  ],
  uses: [
    { item: "RevX Capital Fund II — Class E1 subscription", amount: 10000000 },
    { item: "Artha Fund IV — Drawdown 1 (24-Jun-2025)", amount: 1000000 },
    { item: "Artha Fund IV — Drawdown 2 (07-Jan-2026, Funded via Yield)", amount: 1000000 },
    { item: "Transfers to Nuvama / clearing corp", amount: 9955000 },
    { item: "Professional fees — CA and MCA", amount: 51450 },
    { item: "Total Uses Traced", amount: 22006450 },
    { item: "Closing Bank Balance (12-Aug-2026)", amount: 170151 }
  ]
};

// Sheet 8 & 9: Artha Fund IV Detailed Look-Through & Interim Mark Scenarios
export const ARTHA_LOOKTHROUGH = {
  folioNumber: "330035",
  sebiReg: "IN/AIF2/24-25/1507",
  capitalCommitment: 10000000,
  drawnCapital: 2000000,
  undrawnCommitment: 8000000,
  unitsHeld: 20000,
  sfoSharePct: 0.338123,
  sfoLiquidFundsINR: 742014,
  sfoInvestedLookthroughINR: 973942,
  scenarios: [
    { scenario: "A. Carrying value per 30-Jun statement (At Cost)", fundHeldCr: 28.80, sfoLookThrough: 973794, sfoLiquid: 742014, totalValINR: 1715808, multipleOnDrawn: 0.86 },
    { scenario: "B. At the 1.50x interim mark (Manager Slide)", fundHeldCr: 46.70, sfoLookThrough: 1579034, sfoLiquid: 742014, totalValINR: 2321048, multipleOnDrawn: 1.16 },
    { scenario: "C. If TakeMe2Space re-rates from 125 to 900 Cr", fundHeldCr: 125.32, sfoLookThrough: 4237222, sfoLiquid: 742014, totalValINR: 4979236, multipleOnDrawn: 2.49 }
  ],
  portfolioCompanies: [
    { name: "TakeMe2Space (TM2Space)", deployedCr: 10.026, heldValueCr: 10.026, multiple: 1.00, pctOfFund: 34.8, sfoLookThroughINR: 339001, status: "Active (Cost carrying)" },
    { name: "Raana Semiconductors", deployedCr: 6.423, heldValueCr: 6.423, multiple: 1.00, pctOfFund: 22.3, sfoLookThroughINR: 217174, status: "Active (520-CCPS tranche)" },
    { name: "Calligo Technologies", deployedCr: 5.357, heldValueCr: 17.440, multiple: 2.94, pctOfFund: 18.6, sfoLookThroughINR: 181135, status: "Term Sheet Marked (2.94x)" },
    { name: "Alwaysrise Stays", deployedCr: 3.002, heldValueCr: 3.002, multiple: 1.00, pctOfFund: 10.4, sfoLookThroughINR: 101504, status: "Active" },
    { name: "Cheerio Technologies", deployedCr: 2.002, heldValueCr: 2.002, multiple: 1.00, pctOfFund: 6.9, sfoLookThroughINR: 67680, status: "Active" },
    { name: "Clarity Global Labs", deployedCr: 1.995, heldValueCr: 1.995, multiple: 1.00, pctOfFund: 6.9, sfoLookThroughINR: 67447, status: "Active" },
    { name: "Pettle Pet Services", deployedCr: 1.002, heldValueCr: 0.000, multiple: 0.00, pctOfFund: 0.0, sfoLookThroughINR: 0, status: "100% Written Down (Diminution ₹33,875)" }
  ]
};

// Sheet 11: Open Items & Audit Reconciliation Notes
export const OPEN_ITEMS_AND_SOURCES = [
  { id: 1, item: "Contribution Treatment", status: "Resolved", detail: "Bank narrations showing 'Loan' reflect day-of transfer routing. Amounts were credited to partners capital on opening LLP operational accounts. All ₹1.525 Cr is partner equity." },
  { id: 2, item: "Dry Powder Strategy", status: "Active Management", detail: "₹15,07,071 held at broker cash ledger awaiting favourable entry. Nifty pullback avoided ~₹30k MTM drawdown." },
  { id: 3, item: "Artha NAV per Unit Discrepancy", status: "Query Raised", detail: "Manager capital account quotes NAV ₹102.88 (₹20,57,600) yet closing balance is ₹17,15,955.80 (₹85.80/unit). Line items support ₹85.80. Query lodged with manager." },
  { id: 4, item: "RevX Distribution Basis", status: "Verification", detail: "Confirm whether quarterly payouts ₹3,30,711 etc. are gross or net of TDS. Obtain Form 16A / 26AS." },
  { id: 5, item: "Devaki Prabhakar ₹51,450", status: "Reconciled", detail: "Credited 23-Apr-2026 matching statutory CA and MCA filing fees paid the same day. Net neutral to surplus." },
  { id: 6, item: "Fund Identity in Prior Notes", status: "Corrected", detail: "Holding is ARTHA FUND IV (SEBI IN/AIF2/24-25/1507), not Artha Venture Fund II." },
  { id: 7, item: "Idle Cash Deployment", status: "Monitoring", detail: "Estimated ₹15.07L in broker ledger earning zero interest. Deploying into liquid funds / selective dips." }
];
