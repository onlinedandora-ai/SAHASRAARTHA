/**
 * Excel / CSV Ingestion Parser & Template Generator
 * Conforms strictly to Phase 1 Excel Ingestion Specification
 */

export function generateTemplateMasterFunds() {
  const headers = ["fund_id", "fund_name", "category", "invested_capital", "current_valuation", "as_of_date"];
  const sampleRows = [
    ["REVX_E1", "RevX Capital Fund II Class E1", "Venture Debt", "10000000", "9941000", "2026-08-13"],
    ["ARTHA_IV", "Artha Fund IV Class S", "Venture Capital", "2000000", "1715956", "2026-06-30"],
    ["LISTED_EQ", "Direct Listed Equities (9 scrips)", "Public Equity", "1072744", "1131516", "2026-08-13"],
    ["ETFS_CORE", "ETFs (Index, Gold & Liquid)", "ETFs", "1775053", "1962167", "2026-08-13"],
    ["NUVAMA_CASH", "Nuvama Broker Cash Ledger", "Cash & Equiv", "1507071", "1507071", "2026-08-13"],
    ["ICICI_BANK", "ICICI Bank Operating A/C", "Cash & Equiv", "170151.27", "170151.27", "2026-08-13"]
  ];

  const csv = [headers.join(","), ...sampleRows.map(r => r.join(","))].join("\n");
  return csv;
}

export function generateTemplatePartnerLedger() {
  const headers = ["partner_id", "full_name", "mobile_number", "email_address", "role", "units_allocated", "total_invested"];
  const sampleRows = [
    ["SH-SA-001", "Srikanth (Managing Partner)", "+919845012345", "srikanth@sahasraartha.in", "SUPER_ADMIN", "12000.0000", "1200000"],
    ["SH-LP-001", "Lord Sri Krishna", "+919800000001", "krishna.trust@sahasraartha.in", "LP", "50.0100", "5001"],
    ["SH-LP-002", "Leela Rani Srikanth", "+919845012346", "leelarani@sahasraartha.in", "COMMITTEE", "12000.0000", "1200000"],
    ["SH-LP-003", "Devaki Diwakar", "+919845112233", "devaki.d@sahasraartha.in", "COMMITTEE", "7000.0000", "700000"],
    ["SH-LP-005", "K Suresh", "+919845334455", "suresh.k@sahasraartha.in", "COMMITTEE", "20200.0000", "2020000"],
    ["SH-LP-015", "Sarada Ganesh P", "+919845440055", "sarada.ganesh@sahasraartha.in", "COMMITTEE", "14000.0000", "1400000"],
    ["SH-LP-028", "Seetharaman A", "+919845123408", "seetharaman.a@sahasraartha.in", "LP", "10000.0000", "1000000"]
  ];

  const csv = [headers.join(","), ...sampleRows.map(r => r.join(","))].join("\n");
  return csv;
}

export function downloadCSV(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSV(csvText) {
  const lines = csvText.trim().split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { error: "CSV file is empty or missing data rows." };

  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map(v => v.trim());
    if (values.length !== headers.length) {
      return { error: `Row ${i + 1} column count (${values.length}) does not match header count (${headers.length}).` };
    }
    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx];
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}
