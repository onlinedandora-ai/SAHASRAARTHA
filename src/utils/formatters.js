/**
 * Formatting utilities for Indian Rupee (INR), Units, and Percentages
 */

export function formatINR(val, options = {}) {
  if (val === undefined || val === null || isNaN(val)) return "₹0.00";
  const num = Number(val);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  if (options.compact) {
    if (absNum >= 10000000) {
      return `${isNegative ? "-" : ""}₹${(absNum / 10000000).toFixed(2)} Cr`;
    }
    if (absNum >= 100000) {
      return `${isNegative ? "-" : ""}₹${(absNum / 100000).toFixed(2)} L`;
    }
    if (absNum >= 1000) {
      return `${isNegative ? "-" : ""}₹${(absNum / 1000).toFixed(1)} K`;
    }
  }

  // Standard Indian Numbering System formatting
  const parts = absNum.toFixed(options.decimals !== undefined ? options.decimals : 2).split(".");
  let intPart = parts[0];
  const decPart = parts[1];

  let lastThree = intPart.substring(intPart.length - 3);
  let otherNumbers = intPart.substring(0, intPart.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return `${isNegative ? "-" : ""}₹${res}${decPart !== undefined ? "." + decPart : ""}`;
}

export function formatUnits(val, decimals = 4) {
  if (val === undefined || val === null || isNaN(val)) return "0.0000";
  return Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatPercent(val, showPlus = true) {
  if (val === undefined || val === null || isNaN(val)) return "0.00%";
  const num = Number(val);
  const prefix = showPlus && num > 0 ? "+" : "";
  return `${prefix}${num.toFixed(2)}%`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch (e) {
    return dateStr;
  }
}
