export interface Goal {
  id: number;
  name: string;
  amount: number;
  horizon: number;
  inflation: number;
}

export interface GoalCalculation extends Goal {
  futureValue: number;
  requiredSip: number;
}

export interface GoalMarker {
  id: number;
  year: number;
  name: string;
  status: "met" | "adjustment";
}

export interface ChartDataPoint {
  year: number;
  value: number;
}

export function calculateFutureValue(
  initial: number,
  monthlySip: number,
  sipIncreaseRate: number,
  cagr: number,
  years: number,
): number {
  let investmentValue = initial;
  let currentMonthlySip = monthlySip;
  const monthlyRate = cagr / 12;
  const numMonths = years * 12;
  for (let month = 1; month <= numMonths; month++) {
    investmentValue = (investmentValue + currentMonthlySip) * (1 + monthlyRate);
    if (month % 12 === 0 && month < numMonths) {
      currentMonthlySip *= 1 + sipIncreaseRate;
    }
  }
  return investmentValue;
}

export function calculateRequiredSip(
  fv: number,
  years: number,
  cagrPct: number,
): number {
  const i = cagrPct / 100 / 12;
  const n = years * 12;
  if (n <= 0) return fv;
  if (i === 0) return fv / n;
  const sip = fv / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  return sip > 0 ? sip : 0;
}

export interface PlannerResult {
  totalRequiredSip: number;
  maxHorizon: number;
  totalFutureGoalValue: number;
  projectedInvestmentValue: number;
  shortfall: number;
  investmentGrowthData: ChartDataPoint[];
  goalGrowthData: ChartDataPoint[];
  status: string;
  statusClass: "success" | "warning" | "danger";
  goalMarkers: GoalMarker[];
}

export function calculateGoalPlan(
  goals: Goal[],
  initialSavings: number,
  monthlySip: number,
  sipIncreasePct: number,
  cagrPct: number,
): PlannerResult {
  const maxHorizon = Math.max(1, ...goals.map((g) => g.horizon));
  const cagrRate = cagrPct / 100;

  const goalCalculations: GoalCalculation[] = goals.map((goal) => {
    const futureValue =
      goal.amount * Math.pow(1 + goal.inflation / 100, goal.horizon);
    const requiredSip = calculateRequiredSip(futureValue, goal.horizon, cagrPct);
    return { ...goal, futureValue, requiredSip };
  });

  const totalRequiredSip = goalCalculations.reduce(
    (sum, g) => sum + g.requiredSip,
    0,
  );

  const projectedInvestmentValue = calculateFutureValue(
    initialSavings,
    monthlySip,
    sipIncreasePct / 100,
    cagrRate,
    maxHorizon,
  );

  const investmentGrowthData: ChartDataPoint[] = Array.from(
    { length: maxHorizon + 1 },
    (_, y) => ({
      year: y,
      value: calculateFutureValue(
        initialSavings,
        monthlySip,
        sipIncreasePct / 100,
        cagrRate,
        y,
      ),
    }),
  );

  const totalGoalValueAtEnd = goalCalculations.reduce((sum, goal) => {
    if (maxHorizon >= goal.horizon) {
      return sum + goal.futureValue;
    }
    return sum;
  }, 0);

  const goalGrowthData: ChartDataPoint[] = Array.from(
    { length: maxHorizon + 1 },
    (_, y) => ({
      year: y,
      value: goalCalculations.reduce((sum, goal) => {
        if (y <= goal.horizon) {
          return sum + goal.amount * Math.pow(1 + goal.inflation / 100, y);
        }
        return sum;
      }, 0),
    }),
  );

  const goalMarkers: GoalMarker[] = goalCalculations.map((goal) => {
    const investmentAtHorizon =
      investmentGrowthData.find((d) => d.year === goal.horizon)?.value ?? 0;
    const status: "met" | "adjustment" =
      investmentAtHorizon >= goal.futureValue ? "met" : "adjustment";
    return {
      id: goal.id,
      year: goal.horizon,
      name: goal.name,
      status,
    };
  });

  const shortfall = totalGoalValueAtEnd - projectedInvestmentValue;

  let status = "✅ You're on track to meet your goals!";
  let statusClass: "success" | "warning" | "danger" = "success";
  if (monthlySip < totalRequiredSip) {
    status = `⚠️ Your SIP is less than the required ₹${(totalRequiredSip / 100000).toFixed(2)} L. A shortfall is projected.`;
    statusClass = "warning";
  }
  if (shortfall > 0 && monthlySip >= totalRequiredSip) {
    status = `❌ A significant shortfall is projected despite meeting the required SIP.`;
    statusClass = "danger";
  }

  return {
    totalRequiredSip,
    maxHorizon,
    totalFutureGoalValue: totalGoalValueAtEnd,
    projectedInvestmentValue,
    shortfall,
    investmentGrowthData,
    goalGrowthData,
    status,
    statusClass,
    goalMarkers,
  };
}
