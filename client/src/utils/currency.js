export function formatIndianPrice(value) {
  return Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatIndianCurrency(value) {
  return `₹${formatIndianPrice(value)}`;
}
