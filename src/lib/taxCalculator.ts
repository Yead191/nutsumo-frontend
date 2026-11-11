/**
 * Statutory Taxes & Platform Deduction Calculator for Ghana
 *
 * Statutory Breakdown:
 *  - VAT (Value Added Tax): 15%
 *  - NHIL (National Health Insurance Levy): 2.5%
 *  - GETFund Levy (Ghana Education Trust Fund Levy): 2.5%
 *  ----------------------------------------------------
 *  Total Deductions: 20%
 *  Artisan Net Take-Home Payout: 80%
 */

export const TAX_RATES = {
  VAT: 15, // 15%
  NHIL: 2.5, // 2.5%
  GET_FUND_LEVY: 2.5, // 2.5%
} as const;

export const TOTAL_DEDUCTION_PERCENTAGE = 20;
export const ARTISAN_NET_PAYOUT_PERCENTAGE = 80;

export interface IFeeBreakdown {
  grossAmount: number;
  vatRate: number;
  vatAmount: number;
  nhilRate: number;
  nhilAmount: number;
  getFundLevyRate: number;
  getFundLevyAmount: number;
  platformCommissionRate: number;
  totalDeductions: number;
  netPayoutAmount: number;
}

export const calculateFeeBreakdown = (
  amount: number | string,
): IFeeBreakdown => {
  const safeAmount = Math.max(0, Number(amount) || 0);

  const vatAmount = Number(((safeAmount * TAX_RATES.VAT) / 100).toFixed(2));
  const nhilAmount = Number(((safeAmount * TAX_RATES.NHIL) / 100).toFixed(2));
  const getFundLevyAmount = Number(
    ((safeAmount * TAX_RATES.GET_FUND_LEVY) / 100).toFixed(2),
  );

  const totalDeductions = Number(
    (vatAmount + nhilAmount + getFundLevyAmount).toFixed(2),
  );
  const netPayoutAmount = Number((safeAmount - totalDeductions).toFixed(2));

  return {
    grossAmount: safeAmount,
    vatRate: TAX_RATES.VAT,
    vatAmount,
    nhilRate: TAX_RATES.NHIL,
    nhilAmount,
    getFundLevyRate: TAX_RATES.GET_FUND_LEVY,
    getFundLevyAmount,
    platformCommissionRate: TOTAL_DEDUCTION_PERCENTAGE,
    totalDeductions,
    netPayoutAmount,
  };
};
