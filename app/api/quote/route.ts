import { NextRequest, NextResponse } from "next/server";

// Mock quote calculation - replace with actual .NET API call
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Forward to actual .NET backend API
    // const response = await fetch(process.env.QUOTE_API_URL!, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body),
    // });
    // return NextResponse.json(await response.json());

    // Mock response for development
    const purchasePrice = body.purchase?.propertyPrice || 0;
    const salePrice = body.sale?.propertyPrice || 0;

    // Simple mock calculation
    const baseFee = 500;
    const purchaseFee = purchasePrice > 0 ? 750 : 0;
    const saleFee = salePrice > 0 ? 600 : 0;
    const legalFees = baseFee + purchaseFee + saleFee;

    // Mock disbursements
    const searchFees = purchasePrice > 0 ? 300 : 0;
    const landRegistryFee = purchasePrice > 0 ? calculateLandRegistryFee(purchasePrice) : 0;
    const idChecks = 20;
    const bankTransferFee = 40;
    const disbursements = searchFees + landRegistryFee + idChecks + bankTransferFee;

    // Mock stamp duty calculation (simplified)
    const stampDuty = purchasePrice > 0
      ? calculateStampDuty(purchasePrice, body.purchase?.isFirstTimeBuyer || false)
      : 0;

    const breakdown = [
      { description: "Base Legal Fee", amount: baseFee },
    ];

    if (purchaseFee > 0) {
      breakdown.push({ description: "Purchase Legal Fee", amount: purchaseFee });
    }
    if (saleFee > 0) {
      breakdown.push({ description: "Sale Legal Fee", amount: saleFee });
    }
    if (searchFees > 0) {
      breakdown.push({ description: "Search Fees", amount: searchFees });
    }
    if (landRegistryFee > 0) {
      breakdown.push({ description: "Land Registry Fee", amount: landRegistryFee });
    }
    breakdown.push({ description: "ID Verification", amount: idChecks });
    breakdown.push({ description: "Bank Transfer Fee", amount: bankTransferFee });

    // Add VAT to legal fees
    const vat = legalFees * 0.2;
    breakdown.push({ description: "VAT (20%)", amount: vat });

    const totalFee = legalFees + vat + disbursements + stampDuty;

    return NextResponse.json({
      totalFee,
      legalFees: legalFees + vat,
      disbursements,
      stampDuty,
      breakdown,
    });
  } catch (error) {
    console.error("Quote API error:", error);
    return NextResponse.json(
      { message: "Failed to calculate quote" },
      { status: 500 }
    );
  }
}

function calculateLandRegistryFee(price: number): number {
  // Simplified Land Registry fee scale
  if (price <= 80000) return 20;
  if (price <= 100000) return 40;
  if (price <= 200000) return 100;
  if (price <= 500000) return 150;
  if (price <= 1000000) return 295;
  return 500;
}

function calculateStampDuty(price: number, isFirstTimeBuyer: boolean): number {
  // Simplified SDLT calculation (2024 rates, residential, England/NI)
  // First time buyers have nil rate up to £425k and 5% on £425k-£625k
  // Standard buyers: 0% up to £250k, 5% £250k-£925k, 10% £925k-£1.5m, 12% over

  if (isFirstTimeBuyer) {
    if (price <= 425000) return 0;
    if (price <= 625000) return (price - 425000) * 0.05;
    // Over £625k, no first time buyer relief
  }

  // Standard rates
  let duty = 0;

  if (price > 250000) {
    const band1 = Math.min(price, 925000) - 250000;
    duty += band1 * 0.05;
  }

  if (price > 925000) {
    const band2 = Math.min(price, 1500000) - 925000;
    duty += band2 * 0.10;
  }

  if (price > 1500000) {
    const band3 = price - 1500000;
    duty += band3 * 0.12;
  }

  return Math.round(duty);
}
