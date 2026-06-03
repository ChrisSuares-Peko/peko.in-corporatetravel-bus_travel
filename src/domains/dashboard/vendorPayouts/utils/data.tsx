import { paths } from '@src/routes/paths';

import benefeciariesSVG from '../assets/benefeciariesSVG.svg';
import internationalRatesSVG from '../assets/internationalRatesSVG.svg';
import sendMoneySVG from '../assets/sendMoneySVG.svg';
import transactionsSVG from '../assets/transactionsSVG.svg';

export const featureRow = [
    {
        image: sendMoneySVG,
        title: 'Send Money',
        link: `${paths.vendorPayouts.upload}`,
    },
    {
        image: benefeciariesSVG,
        title: 'Beneficiaries',
        link: `${paths.vendorPayouts.beneficiary}`,
    },
    {
        image: internationalRatesSVG,
        title: 'International Rates',
        link: `${paths.vendorPayouts.estimateCalculator}`,
    },
    {
        image: transactionsSVG,
        title: 'Transactions',
        link: '',
    },
];

export const MODALITY_INFO = {
    title: 'Modality Information',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, justo eget ultricies porttitor, urna risus maximus metus, ac sodales tortor ex a velit. In this informative piece, we will briefly highlight some key points:',
    points: [
        'Point 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Point 2: Sed euismod, justo eget ultricies porttitor.',
        'Point 3: Urna risus maximus metus.',
        'Point 4: Ac sodales tortor ex a velit.',
    ],
};
export const columns = [
    {
        title: 'Country Code',
        dataIndex: 'destinationCountry',
        key: 'destinationCountry',
    },
    {
        title: 'Currency',
        dataIndex: 'payingCurrency',
        key: 'payingCurrency',
    },
    {
        title: 'Price',
        dataIndex: 'settlementRate',
        key: 'settlementRate',
        render: (text: number) => text.toFixed(5),
    },
];
export const dataSource = [
    {
        key: '1',
        currency: 'BANGLADESHI TAKA',
        code: 'BTK',
        price: '0.28705',
    },
];
export const legalStatusOptions = [
    { label: 'Public Company', value: 'public_company' },
    { label: 'LLC', value: 'llc' },
    { label: 'Partnership', value: 'partnership' },
    { label: 'Sole Proprietorship', value: 'sole_proprietorship' },
    { label: 'Other', value: 'other' },
];
export const CountryPresenceOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
];

// Rates Card Constants

export const constants = {
    OthersInSourceOfFund: '39',
    OthersInRemittancePurpose: '23',
};
