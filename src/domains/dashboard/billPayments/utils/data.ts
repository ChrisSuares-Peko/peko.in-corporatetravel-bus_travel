import ADDCLogo from '@assets/vendorLogos/AbuDhabi.svg';
import AjmanSewerageLogo from '@assets/vendorLogos/AjmanSewerage.svg';
import AADCLogo from '@assets/vendorLogos/AlAin.svg';
// import DarfLogo from '@assets/vendorLogos/darf.svg';
import DuIcon from '@assets/vendorLogos/Du.svg';
import DubaiPoliceLogo from '@assets/vendorLogos/dubaiPolice.svg';
import EtisalatIcon from '@assets/vendorLogos/Etisalat.svg';
import EWALogo from '@assets/vendorLogos/EWA.svg';
import LotahGasLogo from '@assets/vendorLogos/Lotah.svg';
import NolLogo from '@assets/vendorLogos/Nol.svg';
import SalikLogo from '@assets/vendorLogos/Salik.svg';
// import TaflatLogo from '@assets/vendorLogos/taflat.svg';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

export const telecomPayments = [
    {
        icon: DuIcon,
        title: 'Du Prepaid',
        url: paths.billPayments.duPrepaid,
        path: 'duTopUp',
        accessKey: accessKeys.dUPrepaid,
        inputComponents: [
            {
                type: 'input',
                name: 'accountNumber',
                label: 'Mobile Number',
                placeholder: 'Example: 05XXXXX',
                min: 10,
                max: 10,
            },
            {
                type: 'input',
                name: 'rechargeAmount',
                label: 'Top-up Amount',
                placeholder: 'Example: 100',
                showMinAndMax: true,
            },
        ],
        btnText: 'Next',
    },
    {
        icon: DuIcon,
        title: 'Du Postpaid',
        url: paths.billPayments.duPostpaid,
        path: 'duBill',

        accessKey: accessKeys.dUPostpaid,
        inputComponents: [
            {
                type: 'input',
                name: 'accountNumber',
                label: 'Mobile Number',
                placeholder: 'Example: 05XXXXX',
                min: 7,
                max: 10,
            },
        ],
    },
    {
        icon: EtisalatIcon,
        title: 'Etisalat Prepaid',
        url: paths.billPayments.etisalatPrepaid,
        path: 'etisalatTu',
        accessKey: accessKeys.etisalatPrepaid,
        inputComponents: [
            {
                type: 'input',
                name: 'accountNumber',
                label: 'Mobile Number',
                placeholder: 'Example: 05XXXXX',
                min: 10,
                max: 10,
            },
            {
                type: 'input',
                name: 'rechargeAmount',
                label: 'Top-up Amount',
                placeholder: 'Example: 100',
                showMinAndMax: true,
                multipleOf: 10,
            },
        ],
        btnText: 'Next',
    },
    {
        icon: EtisalatIcon,
        title: 'Etisalat Postpaid',
        url: paths.billPayments.etisalatPostpaid,
        path: 'etisalatBill',
        accessKey: accessKeys.etisalatPostpaid,
        inputComponents: [
            {
                type: 'select',
                name: 'serviceType',
                label: 'Type of Service',
                placeholder: 'Please select a service type',
                options: [
                    { value: 'GSM', label: 'Postpaid' },
                    { value: 'DEL', label: 'Landline' },
                    { value: 'DAILUP', label: 'Internet' },
                    { value: 'BROADBAND', label: 'AlShamil' },
                    { value: 'EVSION', label: 'eVision' },
                    { value: 'ELIFE', label: 'eLife' },
                ],
            },
            {
                type: 'input',
                name: 'accountNumber',
                label: 'Mobile Number',
                placeholder: 'Example: 05XXXXX',
                min: 8,
                max: 10,
            },
        ],
    },
];

export const utilityPayments = [
    {
        icon: AADCLogo,
        title: 'AADC',
        url: paths.billPayments.AADC,
        path: 'aadc',
        accessKey: accessKeys.AADC,
        inputComponents: [
            {
                type: 'input',
                name: 'accountNumber',
                label: 'Account Number',
                placeholder: 'Example: 05XXXXX',
                min: 9,
                max: 10,
            },
        ],
    },
    {
        icon: ADDCLogo,
        title: 'ADDC',
        url: paths.billPayments.ADDC,
        path: 'addc',
        accessKey: accessKeys.ADDC,
        inputComponents: [
            {
                type: 'input',
                name: 'accountNumber',
                label: 'Mobile Number',
                placeholder: 'Example: 05XXXXX',
                min: 9,
                max: 10,
            },
        ],
    },
    {
        icon: AjmanSewerageLogo,
        title: 'Ajman Sewerage',
        url: paths.billPayments.ajmanSewerage,
        path: 'ajman',
        accessKey: accessKeys.Ajman,
        inputComponents: [
            {
                type: 'input',
                name: 'accountNumber',
                label: 'Account Number',
                placeholder: 'Example: 05XXXXX',
                showMinAndMax: false,
                min: 9,
                max: 10,
            },
        ],
    },
    {
        icon: EWALogo,
        title: 'EWE',
        url: paths.billPayments.EWE,
        path: 'fewa',
        accessKey: accessKeys.FEWA,
        inputComponents: [
            {
                type: 'input',
                name: 'accountNumber',
                label: 'Account Number',
                placeholder: 'Example: 05XXXXX',
                min: 9,
                max: 15,
            },
        ],
    },
    {
        icon: LotahGasLogo,
        title: 'Lootah Gas',
        url: paths.billPayments.lootah,
        path: 'lootah',
        accessKey: accessKeys.Lootah,
        inputComponents: [
            {
                type: 'input',
                name: 'accountNumber',
                label: 'Account Number',
                placeholder: 'Example: 05XXXXX',
                min: 6,
                max: 15,
                supportAlphabets: true,
            },
        ],
    },
    {
        icon: NolLogo,
        title: 'Nol',
        url: paths.billPayments.NOL,
        path: 'nol',

        accessKey: accessKeys.NOL,
        inputComponents: [
            {
                type: 'input',
                name: 'accountNumber',
                label: 'Tag ID',
                placeholder: 'Example: 05XXXXX',
                min: 8,
                max: 10,
            },
            {
                type: 'input',
                name: 'rechargeAmount',
                label: 'Top-up Amount',
                placeholder: 'Example: 100',
                showMinAndMax: true,
            },
        ],
        btnText: 'Next',
    },
    {
        icon: SalikLogo,
        title: 'Salik',
        url: paths.billPayments.salik,
        path: 'salik',
        accessKey: accessKeys.Salik,
        inputComponents: [
            {
                type: 'input',
                name: 'accountNumber',
                label: 'Account Number',
                placeholder: 'Example: 3XXXXX',
                min: 5,
                max: 10,
            },
            {
                type: 'input',
                name: 'accountPin',
                label: 'Account PIN',
                placeholder: 'Example: 1XX4',
                min: 4,
                max: 4,
            },
            {
                type: 'input',
                name: 'rechargeAmount',
                label: 'Top-up Amount',
                placeholder: 'Example: 100',
                multipleOf: 50,
                showMinAndMax: true,
            },
        ],
        btnText: 'Next',
    },
    {
        icon: DubaiPoliceLogo,
        title: 'Dubai Police',
        url: paths.billPayments.dubaiPolice,
        path: 'dubai-police',
        accessKey: accessKeys.dubaiPolice,
        inputComponents: [],
    },
    // {
    //     icon: DarfLogo,
    //     title: 'DARB',
    //     url: paths.billPayments.darb,
    //     path: 'darb',
    //     accessKey: accessKeys.darb,
    //     inputComponents: [
    //         {
    //             type: 'input',
    //             name: 'plateNumber',
    //             label: 'Traffic Number',
    //             placeholder: 'Enter Traffic Number',
    //             min: 15,
    //             max: 30,
    //         },
    //         {
    //             type: 'input',
    //             name: 'eid',
    //             label: 'Emirates ID',
    //             placeholder: 'Enter Emirates ID',
    //             min: 15,
    //             max: 30,
    //         },
    //     ],
    // },
    // {
    //     icon: TaflatLogo,
    //     title: 'Hafilat',
    //     url: paths.billPayments.hafilat,
    //     path: 'taflat',
    //     accessKey: accessKeys.hafilat,
    //     inputComponents: [
    //         {
    //             type: 'input',
    //             name: 'accountNumber',
    //             label: 'Card Number',
    //             placeholder: 'Example: 05XXXXX',
    //             min: 15,
    //             max: 30,
    //         },
    //     ],
    // },
];

export const beneficiaryOptions = [
    {
        value: accessKeys.etisalatPostpaid,
        label: 'Etisalat Postpaid',
        path: 'etisalatBill',
        directPay: true,
    },
    {
        value: accessKeys.dUPostpaid,
        label: 'Du Postpaid',
        path: 'duBill',
        directPay: true,
    },
    {
        value: accessKeys.etisalatPrepaid,
        label: 'Etisalat Prepaid',
        path: 'etisalatTu',
        directPay: false,
    },
    {
        value: accessKeys.dUPrepaid,
        label: 'Du Prepaid',
        path: 'duTopUp',
        directPay: false,
    },
    {
        value: accessKeys.FEWA,
        label: 'EWE',
        path: 'fewa',
        directPay: true,
    },
    {
        value: accessKeys.AADC,
        label: 'AADC',
        path: 'aadc',
        directPay: true,
    },
    {
        value: accessKeys.Salik,
        label: 'Salik',
        path: 'salik',
        directPay: false,
    },
    {
        value: accessKeys.NOL,
        label: 'Nol',
        path: 'nol',
        directPay: false,
    },
    {
        value: accessKeys.Lootah,
        label: 'Lootah Gas',
        path: 'lootah',
        directPay: true,
    },
    {
        value: accessKeys.ADDC,
        label: 'ADDC',
        path: 'addc',
        directPay: true,
    },
    {
        value: accessKeys.Ajman,
        label: 'Ajman Sewerage',
        path: 'ajman',
        directPay: true,
    },
    {
        value: accessKeys.darb,
        label: 'DARB',
        path: 'darb',
        directPay: true,
    },
    {
        value: accessKeys.hafilat,
        label: 'Hafilat',
        path: 'hafilat',
        directPay: true,
    },
];

export const findObjectByAccessKey = (accessKey: string) => {
    const telecomObject = telecomPayments.find(item => item.accessKey === accessKey);
    if (telecomObject) {
        return telecomObject;
    }
    const utilityObject = utilityPayments.find(item => item.accessKey === accessKey);
    return utilityObject || null;
};
