// Statistical helpers for Ritika's admin analytics (correlation heatmap).

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// Pearson correlation coefficient between two equal-length numeric arrays.
// Returns null when there isn't enough data or one variable has zero variance
// (e.g. every response in the sample gave the same value) - avoids a divide-by-zero.
function pearsonCorrelation(x, y) {
  const n = x.length;
  if (n < 2 || y.length !== n) return null;

  const meanX = mean(x);
  const meanY = mean(y);

  let numerator = 0;
  let sumSqX = 0;
  let sumSqY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    sumSqX += dx * dx;
    sumSqY += dy * dy;
  }

  const denominator = Math.sqrt(sumSqX * sumSqY);
  if (denominator === 0) return null;

  return numerator / denominator;
}

// Builds a symmetric correlation matrix for a list of named numeric variables.
// variables: [{ name, values }, ...] - every `values` array must be the same length
// and index-aligned (values[i] across all variables must come from the same row/response).
function correlationMatrix(variables) {
  return variables.map((a) =>
    variables.map((b) => {
      if (a.name === b.name) return 1;
      const r = pearsonCorrelation(a.values, b.values);
      return r === null ? null : Math.round(r * 1000) / 1000;
    })
  );
}

module.exports = { mean, pearsonCorrelation, correlationMatrix };