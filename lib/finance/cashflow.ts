export interface TimelinePoint {
  month: number;
  B_liq: number;
  B_mix: number;
  B_eq: number;
  total: number;
}

export interface CashflowResult {
  timeline: TimelinePoint[];
  L_target: number;
  M_target: number;
}

export interface SimulateParams {
  initialPortfolio: number;
  monthlyWithdrawal: number;
  liquidMonths?: number;
  mixedMonths?: number;
  r_liq?: number;
  r_mix?: number;
  r_eq?: number;
  years?: number;
}

export function simulateCashFlow({
  initialPortfolio,
  monthlyWithdrawal,
  liquidMonths = 12,
  mixedMonths = 24,
  r_liq = 0.05,
  r_mix = 0.08,
  r_eq = 0.12,
  years = 30,
}: SimulateParams): CashflowResult {
  const months = years * 12;
  let L_target = monthlyWithdrawal * liquidMonths;
  let M_target = monthlyWithdrawal * mixedMonths;

  if (initialPortfolio < L_target + M_target) {
    const f = initialPortfolio / (L_target + M_target);
    L_target *= f;
    M_target *= f;
  }

  let B_liq = L_target;
  let B_mix = M_target;
  let B_eq = Math.max(0, initialPortfolio - B_liq - B_mix);

  const timeline: TimelinePoint[] = [];
  for (let t = 1; t <= months; t++) {
    B_liq *= 1 + r_liq / 12;
    B_mix *= 1 + r_mix / 12;
    B_eq *= 1 + r_eq / 12;

    let needed = monthlyWithdrawal;
    if (B_liq >= needed) {
      B_liq -= needed;
    } else {
      needed -= B_liq;
      B_liq = 0;
      if (B_mix >= needed) {
        B_mix -= needed;
      } else {
        needed -= B_mix;
        B_mix = 0;
        B_eq -= Math.min(B_eq, needed);
      }
    }

    const mixedShort = Math.max(0, monthlyWithdrawal * mixedMonths - B_mix);
    if (mixedShort > 0) {
      const stpAmount = Math.min(B_eq, mixedShort / 12);
      B_eq -= stpAmount;
      B_mix += stpAmount;
    }

    const liqShort = Math.max(0, L_target - B_liq);
    if (liqShort > 0) {
      const transfer = Math.min(B_mix, liqShort);
      B_mix -= transfer;
      B_liq += transfer;
    }

    const total = B_liq + B_mix + B_eq;
    timeline.push({ month: t, B_liq, B_mix, B_eq, total });
  }

  return { timeline, L_target, M_target };
}

export function formatLifespan(
  exhaustedMonth: TimelinePoint | undefined,
  years: number,
): string {
  if (!exhaustedMonth) return `${years}+ Yrs`;
  const yrs = Math.floor(exhaustedMonth.month / 12);
  const mos = exhaustedMonth.month % 12;
  return `${yrs} Yrs, ${mos} Mos`;
}
