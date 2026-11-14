/**
 * Ghana statutory levies plus the Nutsumo platform fee.
 * VAT 15% + NHIL 2.5% + GETFund 2.5% + platform fee 2.5% = 22.5%.
 * Artisan net take-home: 77.5%.
 */

export const TAX_RATES = {
  VAT: 15,
  NHIL: 2.5,
  GET_FUND_LEVY: 2.5,
  PLATFORM: 2.5,
} as const;

export const STATUTORY_DEDUCTION_PERCENTAGE = 20;
export const PLATFORM_FEE_PERCENTAGE = 2.5;
export const TOTAL_DEDUCTION_PERCENTAGE = 22.5;
export const ARTISAN_NET_PAYOUT_PERCENTAGE = 77.5;

export interface IFeeBreakdown {
  grossAmount: number;
  vatRate: number;
  vatAmount: number;
  nhilRate: number;
  nhilAmount: number;
  getFundLevyRate: number;
  getFundLevyAmount: number;
  platformServiceFeeRate: number;
  platformServiceFeeAmount: number;
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
  const platformServiceFeeAmount = Number(
    ((safeAmount * TAX_RATES.PLATFORM) / 100).toFixed(2),
  );

  const totalDeductions = Number(
    (vatAmount + nhilAmount + getFundLevyAmount + platformServiceFeeAmount).toFixed(2),
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
    platformServiceFeeRate: TAX_RATES.PLATFORM,
    platformServiceFeeAmount,
    platformCommissionRate: TOTAL_DEDUCTION_PERCENTAGE,
    totalDeductions,
    netPayoutAmount,
  };
};
