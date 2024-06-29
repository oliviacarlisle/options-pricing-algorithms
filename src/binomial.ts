/**
 * Calculates the price of an American call option using the Cox-Ross-Rubinstein (CRR) binomial options pricing model.
 * 
 * @param S - Current stock price (number): The current price of the underlying stock.
 * @param K - Strike price (number): The price at which the option can be exercised.
 * @param r - Risk-free rate (number): The annual risk-free interest rate (as a decimal).
 * @param T - Time to maturity (number): The time to maturity of the option in days.
 * @param N - Number of time steps (number): The number of time steps in the binomial model.
 * @param sigma - Volatility (number): The annual volatility of the stock's returns (as a decimal).
 * 
 * @returns The price of the American call option (number).
 * 
 * Example usage:
 * ```
 * const S = 100;  // Current stock price
 * const K = 100;  // Strike price
 * const r = 0.05;  // Risk-free rate
 * const T = 1;  // Time to maturity (days)
 * const N = 100;  // Number of time steps
 * const sigma = 0.2;  // Volatility
 * 
 * const optionPrice = binomialOptionPricing(S, K, r, T, N, sigma);
 * console.log(`The American call option price is: ${optionPrice.toFixed(2)}`);
 * ```
 */
function binomialOptionPricing(S: number, K: number, r: number, T: number, N: number, sigma: number): number {
  const DAYS_PER_YEAR = 365;
  const dt = T / DAYS_PER_YEAR / N;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const p = (Math.exp(r * dt) - d) / (u - d);

  // Create binomial price tree
  const priceTree: number[][] = new Array(N + 1).fill(0).map(() => new Array(N + 1).fill(0));

  for (let i = 0; i <= N; i++) {
    for (let j = 0; j <= i; j++) {
      priceTree[i][j] = S * Math.pow(u, j) * Math.pow(d, i - j);
    }
  }

  // Create option value tree
  const optionTree: number[][] = new Array(N + 1).fill(0).map(() => new Array(N + 1).fill(0));

  for (let j = 0; j <= N; j++) {
    optionTree[N][j] = Math.max(0, priceTree[N][j] - K);
  }

  for (let i = N - 1; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      optionTree[i][j] = Math.max(
        priceTree[i][j] - K,
        Math.exp(-r * dt) * (p * optionTree[i + 1][j + 1] + (1 - p) * optionTree[i + 1][j])
      );
    }
  }

  return optionTree[0][0];
}

// Example usage
const S = 100;  // Current stock price
const K = 100;  // Strike price
const r = 0.05;  // Risk-free rate
const T = 1;  // Time to maturity (1 year)
const N = 100;  // Number of time steps
const sigma = 0.2;  // Volatility

const optionPrice = binomialOptionPricing(S, K, r, T, N, sigma);

console.log(`The American call option price is: ${optionPrice.toFixed(2)}`);