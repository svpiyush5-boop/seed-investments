export interface SipResult {
  totalInvested: number;
  estimatedReturns: number;
  futureValue: number;
}

export function calculateSip(
  monthlyInvestment: number,
  investmentPeriodYears: number,
  expectedReturnRatePct: number,
): SipResult {
  const monthlyRate = expectedReturnRatePct / 100 / 12;
  const months = investmentPeriodYears * 12;

  if (monthlyRate === 0) {
    const fv = monthlyInvestment * months;
    return {
      totalInvested: fv,
      estimatedReturns: 0,
      futureValue: fv,
    };
  }

  const futureValue =
    monthlyInvestment *
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate));
  const totalInvested = monthlyInvestment * months;
  const estimatedReturns = futureValue - totalInvested;

  return { totalInvested, estimatedReturns, futureValue };
}

export function calculateLumpSumFutureValue(
  principal: number,
  cagrPct: number,
  years: number,
): number {
  return principal * Math.pow(1 + cagrPct / 100, years);
}
