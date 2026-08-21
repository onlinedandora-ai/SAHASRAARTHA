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
