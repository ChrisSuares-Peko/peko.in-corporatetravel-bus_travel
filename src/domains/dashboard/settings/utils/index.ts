import AmericanExpressLogo from '@src/domains/dashboard/settings/assets/images/American_Express_Logo.png';
import DinersClubLogo from '@src/domains/dashboard/settings/assets/images/DINERS_CLUB.png';
import mastercardLogo from '@src/domains/dashboard/settings/assets/images/Mastercard_logo.png';
import VisaLogo from '@src/domains/dashboard/settings/assets/images/Visa_Logo.png';
import { accessKeys } from '@utils/accessKeys';

export const FeaturesPeko = [
    'Free exclusive offers of all the major online brands',
    'User Management',
    'Upto 25% Cashback',
    'Dedicated Support',
    '24/7 Customer Service',
    'Secure Payment Options',
    'Easy Returns',
    'Fast Delivery',
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

export const servicesStandard = [
    'Basic++',
    'User Management',
    'Payroll',
    'Peko Cloud',
    'The Collector',
    'Peko Club',
    'Corporate Travel (Flights, Hotels, eSim)',
    'WhatsApp for Business Basic',
    'eSign (Upto 5 signs free)',
];

export const servicesPremium = [
    'Standard++',
    'Tax & More',
    'eSign (Upto 10 signs free)',
    'Vendor Payouts',
    'Phantom (Peko AI)',
    'Corporate Cards',
    'WhatsApp for Business Pro',
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

export const serviceCategories = [
    {
        label: 'Bill Payments',
        accessKeys: [
            accessKeys.dUPrepaid,
            accessKeys.etisalatPrepaid,
            accessKeys.dUPostpaid,
            accessKeys.etisalatPostpaid,
            accessKeys.FEWA,
            accessKeys.AADC,
            accessKeys.Lootah,
            accessKeys.Ajman,
            accessKeys.Salik,
            accessKeys.NOL,
        ],
    },
    {
        label: 'Corporate Travel',
        accessKeys: [accessKeys.airline, accessKeys.hotels, accessKeys.eSim],
    },
    {
        label: 'Payroll',
        accessKeys: [accessKeys.payroll],
    },
    {
        label: 'Office Supplies',
        accessKeys: [accessKeys.officeSupplies],
    },
    {
        label: 'Softwares',
        accessKeys: [accessKeys.subscriptions],
    },
    {
        label: 'Logistics',
        accessKeys: [accessKeys.shipmentServices],
    },
    {
        label: 'Gift Cards',
        accessKeys: [accessKeys.giftCards, accessKeys.premoGiftCards, accessKeys.giftCardsVouchers],
    },
    {
        label: 'Marketplace',
        accessKeys: [accessKeys.pekoConnect],
    },
    {
        label: 'Tax & More',
        accessKeys: [accessKeys.taxRegistration],
    },
    {
        label: 'The Collector',
        accessKeys: [accessKeys.paymentLinks],
    },
    {
        label: 'Insurance',
        accessKeys: [accessKeys.insurance],
    },
    {
        label: 'Corporate Cards',
        accessKeys: [accessKeys.corporateCard],
    },
    {
        label: 'Peko Cloud',
        accessKeys: [accessKeys.pekoCloud],
    },
    {
        label: 'License Renewal',
        accessKeys: [accessKeys.dubaiDED],
    },
    {
        label: 'Document Attestation',
        accessKeys: [accessKeys.documentAttestation],
    },
    {
        label: 'Office Address',
        accessKeys: [accessKeys.officeAddress],
    },
    {
        label: 'Works',
        accessKeys: [accessKeys.pekoWorks],
    },
    {
        label: 'Zero Carbon',
        accessKeys: [accessKeys.CarbonFootprint],
    },
    {
        label: 'Business Docs',
        accessKeys: [accessKeys.eDocs],
    },
    {
        label: 'WhatsApp for Business',
        accessKeys: [accessKeys.whatsappBasic],
    },
    {
        label: 'eSign',
        accessKeys: [accessKeys.eSign],
    },
    {
        label: 'Reports',
        accessKeys: [],
    },
];

export const getCardImage = (scheme: string) => {
    switch (scheme) {
        case 'VISA':
            return VisaLogo;
        case 'MASTERCARD':
            return mastercardLogo;
        case 'AMERICAN_EXPRESS':
            return AmericanExpressLogo;
        case 'DINERS_CLUB_INTERNATIONAL':
            return DinersClubLogo;
        default:
            return mastercardLogo;
    }
};
