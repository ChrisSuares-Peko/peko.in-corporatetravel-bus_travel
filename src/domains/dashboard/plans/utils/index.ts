import { DiscountResult, PackageDetails, PackagePrices, ServicePackage } from '../types';

export const FeaturesBasic = [
    'Suitable for businesses with up to 100 monthly financial entries',
    'Services included:',
    'Monthly bookkeeping for up to 100 entries',
    'VAT calculation and filing',
    'Financial statement preparation',
    'General ledger maintenance',
    'Bank reconciliation',
    'Annual financial report',
    'Email and phone support',
];

export const servicesBasic = [
    'Bill Payments',
    'Office Supplies',
    'Gift Cards',
    'Logistics',
    'Softwares',
    'POS',
    'Business Docs',
    'License Renewal',
    'Remote Hiring',
    'Works',
    'WhatsApp for Business',
    'Company Setup',
    'Document Attestation',
    'Insurance',
    'And More',
];

export const servicesStandard = [
    'Basic++',
    'User Management',
    'Payroll',
    'Peko Cloud',
    'The Collector',
    'Peko Club',
    'Corporate Travel (Flights, Hotels, eSim)',
    // 'WhatsApp for Business Basic',
    'eSign (Upto 5 signs free)',
];

export const servicesPremium = [
    'Standard++',
    'Tax & More',
    'eSign (Upto 10 signs free)',
    'Vendor Payouts',
    'Phantom (Peko AI)',
    'Corporate Cards',
    // 'WhatsApp for Business Pro',
];

export const benefitsStandard = [
    'Free exclusive offers of all the major online brands',
    'User Management',
    'Upto 25% Cashback',
    'Dedicated Support',
];

export const benefitsPremium = [
    'Free exclusive offers of all the major online brands',
    'User Management',
    'Upto 40% Cashback',
    'Dedicated CRM',
    'Early access to new features',
    'Dedicated support',
    'Lounge access',
    'Premium Perks',
];

export const FeaturesPeko = [
    'Free exclusive offers of all the major online brands',
    'User Management',
    'Upto 25% Cashback',
    'Dedicated Support',
];

export const ServicesPeko = [
    'Bill Payments',
    'Office Supplies',
    'Gift Cards',
    'Logistics',
    'Software',
    'POS',
    'Marketplace',
    'Zero Carbon',
    'Business Docs',
    'License Renewal',
    'Remote Hiring',
    'Works',
    'Whatsapp for Business',
    'Company Setup',
    'Document Attestation',
    'Insurance',
    'User FleetManagement',
    'Payroll',
    'Peko Cloud',
    'The Collecter',
    'Peko Club',
    'Corporate Travel (Flights, Hotels, eSim)',
    'eSign(Upto 5 signs free)',
    'And More',
];

export function calculateDiscount(
    actualPrice: string | number,
    discountAmount: number
): DiscountResult {
    if (Number(actualPrice) <= 0) {
        return { discountedAmount: 0, discountPercentage: 0 };
    }

    const discountedAmount = Number(actualPrice) - discountAmount;
    const discountPercentage = (discountAmount / Number(actualPrice)) * 100;

    return {
        discountedAmount,
        discountPercentage: parseFloat(discountPercentage.toFixed(2)), // rounding to 2 decimal places
    };
}

export function calculateMaxDiscountPercentages(
    packages: ServicePackage[] | PackageDetails[]
): PackagePrices {
    let maxMonthlyDiscountPercentage: number = 0;
    let maxAnnualDiscountPercentage: number = 0;

    packages.forEach(pkg => {
        const { packagePrices, discount } = pkg;
        const { discountPercentage: monthlyDiscount } = calculateDiscount(
            packagePrices.monthly,
            discount.monthly
        );
        const { discountPercentage: yearlyDiscount } = calculateDiscount(
            packagePrices.annually,
            discount.annually
        );
        if (monthlyDiscount > maxMonthlyDiscountPercentage) {
            maxMonthlyDiscountPercentage = monthlyDiscount;
        }
        if (yearlyDiscount > maxAnnualDiscountPercentage) {
            maxAnnualDiscountPercentage = yearlyDiscount;
        }
    });

    return { monthly: maxMonthlyDiscountPercentage, annually: maxAnnualDiscountPercentage };
}
