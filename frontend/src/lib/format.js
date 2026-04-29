const formatFees = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 'INR --';
  return `INR ${amount.toLocaleString('en-IN')}`;
};

const formatPercent = (value) => `${Number(value || 0)}%`;

const formatRating = (value) => `${Number(value || 0).toFixed(1)} / 5`;

export { formatFees, formatPercent, formatRating };
