import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import { BulkPaymentResp, TransactionDetailsResponse } from '../types';

interface SuccessPageData {
    accessKey?: string;
    title: string;
    message: string;
    firstButtonTxt: string;
    firstBtnLink: string;
    secondButtonTxt?: string;
    secondBtnLink?: string;
}

export function getSuccessPageData(
    transactionData: TransactionDetailsResponse | undefined,
    bulkPaymentData: BulkPaymentResp[]
): SuccessPageData | undefined {
    const serviceAccessKey = transactionData?.serviceOperator.accessKey || '';
    const {
        hotels,
        airline,
        officeSupplies,
        subscriptions,
        shipmentServices,
        giftCards,
        giftCardsVouchers,
        premoGiftCards,
        CarbonFootprint,
        dubaiDED,
        officeAddress,
        documentAttestation,
        eSim,
        taxRegistration,
        pekoWorks,
        whatsappBasic,
        emailDomain,
        hike,
    } = accessKeys;
    let orderResponse;
    if (transactionData?.orderResponse && serviceAccessKey === accessKeys.officeAddress) {
        orderResponse = JSON.parse(transactionData?.orderResponse);
    }
    const isBillPayment = checkIsBillPayment(serviceAccessKey);
    if (Array.isArray(bulkPaymentData) && bulkPaymentData.length > 0) {
        if (bulkPaymentData[0]?.serviceName==='esim'){
            return {
                title: 'Your payment has been successful',
                message: `Your payment is in-progress please wait to complete`,
                firstButtonTxt: 'Go to eSIM',
                firstBtnLink: `/${paths.dashboard.corporateTravel.slice(1)}/${paths.esim.index}`,
            };
        }
        // transactionData will be not av
        return {
            title: 'Your payment has been successful',
            message: `Your payment is in-progress please wait to complete`,
            firstButtonTxt: 'Go to Bill Payments',
            firstBtnLink: `/${paths.billPayments.index}`,
        };
    }

    if (isBillPayment) {
        if (serviceAccessKey === accessKeys.dUPrepaid) {
            return {
                title: `Your top-up for Du prepaid number ${transactionData?.accountNo} was successful`,
                message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
                firstButtonTxt: 'Go to Bill Payments',
                firstBtnLink: `/${paths.billPayments.index}`,
            };
        }
        if (serviceAccessKey === accessKeys.dUPostpaid) {
            return {
                title: `Your bill payment for Du postpaid number ${transactionData?.accountNo} was successful`,
                message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
                firstButtonTxt: 'Go to Bill Payments',
                firstBtnLink: `/${paths.billPayments.index}`,
            };
        }
        if (serviceAccessKey === accessKeys.etisalatPrepaid) {
            return {
                title: `Your top-up for Etisalat prepaid number ${transactionData?.accountNo} was successful`,
                message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
                firstButtonTxt: 'Go to Bill Payments',
                firstBtnLink: `/${paths.billPayments.index}`,
            };
        }
        if (serviceAccessKey === accessKeys.etisalatPostpaid) {
            return {
                title: `Your bill payment for Etisalat postpaid number ${transactionData?.accountNo} was successful`,
                message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
                firstButtonTxt: 'Go to Bill Payments',
                firstBtnLink: `/${paths.billPayments.index}`,
            };
        }
        if (serviceAccessKey === accessKeys.AADC) {
            return {
                title: `Your bill payment for AADC ${transactionData?.accountNo} was successful`,
                message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
                firstButtonTxt: 'Go to Bill Payments',
                firstBtnLink: `/${paths.billPayments.index}`,
            };
        }
        if (serviceAccessKey === accessKeys.ADDC) {
            return {
                title: `Your bill payment for ADDC ${transactionData?.accountNo} was successful`,
                message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
                firstButtonTxt: 'Go to Bill Payments',
                firstBtnLink: `/${paths.billPayments.index}`,
            };
        }
        if (serviceAccessKey === accessKeys.Ajman) {
            return {
                title: `Your bill payment for Ajman Sewerage ${transactionData?.accountNo} was successful`,
                message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
                firstButtonTxt: 'Go to Bill Payments',
                firstBtnLink: `/${paths.billPayments.index}`,
            };
        }
        if (serviceAccessKey === accessKeys.Lootah) {
            return {
                title: `Your bill payment for Lootah Gas ${transactionData?.accountNo} was successful`,
                message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
                firstButtonTxt: 'Go to Bill Payments',
                firstBtnLink: `/${paths.billPayments.index}`,
            };
        }
        if (serviceAccessKey === accessKeys.NOL) {
            return {
                title: `Your top-up for Nol ${transactionData?.accountNo} was successful`,
                message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
                firstButtonTxt: 'Go to Bill Payments',
                firstBtnLink: `/${paths.billPayments.index}`,
            };
        }
        if (serviceAccessKey === accessKeys.Salik) {
            return {
                title: `Your top-up for Salik ${transactionData?.accountNo} was successful`,
                message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
                firstButtonTxt: 'Go to Bill Payments',
                firstBtnLink: `/${paths.billPayments.index}`,
            };
        }
        if (serviceAccessKey === accessKeys.dubaiPolice) {
            return {
                title: `Your bill payment for Dubai Police ${transactionData?.accountNo} was successful`,
                message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
                firstButtonTxt: 'Go to Bill Payments',
                firstBtnLink: `/${paths.billPayments.index}`,
            };
        }
        if (serviceAccessKey === accessKeys.FEWA) {
            return {
                title: `Your bill payment for EWE ${transactionData?.accountNo} was successful`,
                message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
                firstButtonTxt: 'Go to Bill Payments',
                firstBtnLink: `/${paths.billPayments.index}`,
            };
        }
        return {
            title: 'Your payment for the bill has been successful',
            message: `Your top-up for ${transactionData?.accountNo} is successful. You will receive a confirmation email shortly. Thank you for choosing Peko`,
            firstButtonTxt: 'Go to Bill Payments',
            firstBtnLink: `/${paths.billPayments.index}`,
        };
    }

    const array = [
        {
            accessKey: hotels,
            title: 'Your payment for hotel booking was successful',
            message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
            firstButtonTxt: 'Go to Manage Bookings',
            firstBtnLink: `/${paths.dashboard.corporateTravel.slice(1)}/${paths.hotels.index}/${paths.hotels.manageBookings}`,
        },
        {
            accessKey: airline,
            title: 'Your payment for flight ticket booking was successful',
            message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
            firstButtonTxt: 'Go to Manage Bookings',
            firstBtnLink: `/${paths.dashboard.corporateTravel.slice(1)}/${paths.airline.index}/${paths.airline.manage}`,
        },
        {
            accessKey: officeSupplies,
            title: 'Your payment for Office Supplies purchase was successful ',
            message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
            firstButtonTxt: 'Go to Office Supplies',
            firstBtnLink: `/${paths.officeSupplies.index}`,
        },
        {
            accessKey: subscriptions,
            title: 'Your payment for Softwares purchase was successful',
            message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
            firstButtonTxt: 'Go to Softwares',
            firstBtnLink: `/${paths.subscriptions.index}`,
        },
        {
            accessKey: shipmentServices,
            title: 'Your payment for Logistics service was successful ',
            message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
            firstButtonTxt: 'Track your Order',
            firstBtnLink: `/${paths.logistics.index}/${paths.logistics.orderHistory}`,
        },
        {
            accessKey: giftCards,
            title: 'Your payment for Gift Card purchase was successful ',
            message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
            firstButtonTxt: 'Go to Gift Cards',
            firstBtnLink: `/${paths.giftcards.index}`,
        },
        {
            accessKey: giftCardsVouchers,
            title: 'Your payment for Gift Card purchase was successful ',
            message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
            firstButtonTxt: 'Go to Gift Cards',
            firstBtnLink: `/${paths.giftcards.index}`,
        },
        {
            accessKey: premoGiftCards,
            title: 'Your Transaction is Successful',
            message:
                'Your order has been successfully processed. You will receive a confirmation email shortly. Thank you for choosing Peko.',
            firstButtonTxt: 'Go to Gift Cards',
            firstBtnLink: `/${paths.giftcards.index}`,
        },
        {
            accessKey: CarbonFootprint,
            title: 'Your payment has been successful',
            message: 'You will receive a confirmation email shortly. Thank you for choosing Peko.',
            firstButtonTxt: 'Go to Zero Carbon',
            firstBtnLink: `${paths.dashboard.zeroCarbon}`,
        },
        {
            accessKey: dubaiDED,
            title: 'Your payment for License Renewal service was successful ',
            message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
            firstButtonTxt: 'Go to License Renewal',
            firstBtnLink: `${paths.dashboard.licenseRenewal}`,
        },
        {
            accessKey: officeAddress,
            title: 'Your payment for Office Address service was successful ',
            message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
            firstButtonTxt: 'Go to Office Address',
            firstBtnLink: paths.dashboard.officeAddress,
        },
        {
            accessKey: documentAttestation,
            title: 'Your payment for Document Attestation service was successful ',
            message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
            firstButtonTxt: 'Go to Document Attestation',
            firstBtnLink: `${paths.dashboard.documentAttestation}`,
        },
        {
            accessKey: eSim,
            title: 'Your payment for eSIM purchase was successful. Go to Orders to install your eSIM. ',
            message: 'You will receive a confirmation email shortly. Thank you for using Peko. ',
            firstButtonTxt: 'Go to eSIM',
            firstBtnLink: `/${paths.dashboard.corporateTravel.slice(1)}/${paths.esim.index}`,
        },
        {
            accessKey: taxRegistration,
            title: 'Your payment for Tax & More service was successful',
            message: 'You will receive a confirmation email shortly. Thank you for using Peko.',
            firstButtonTxt: 'Go to Tax & More',
            firstBtnLink: `/${paths.accounting.index}`,
        },
        {
            accessKey: pekoWorks,
            title: 'Your payment has been successful',
            message: 'You will receive a confirmation email shortly.Thank you for choosing Peko.',
            firstButtonTxt: 'Go to Peko Works',
            firstBtnLink: paths.dashboard.works,
            secondButtonTxt: 'View Transaction',
            secondBtnLink: `${paths.dashboard.works}/${paths.works.orderHistory}`,
        },
        {
            accessKey: whatsappBasic,
            title: 'Your payment has been successful',
            message: 'You will receive a confirmation email shortly.Thank you for choosing Peko.',
            firstButtonTxt: 'Go to WhatsApp Dashboard',
            firstBtnLink: `/${paths.dashboard.whatsappForBusiness}`,
            secondButtonTxt: 'View Transaction',
            secondBtnLink: `/${paths.dashboard.whatsappForBusiness}/${paths.whatsappForBusiness.orderhistory}`,
        },
        {
            accessKey: emailDomain,
            title: 'Your payment for Email/Domain service was successful',
            message: 'You will receive a confirmation email shortly. Thank you for choosing Peko.',
            firstButtonTxt: 'Go to Email/Domain',
            firstBtnLink: paths.dashboard.emailDomain,
        },
        {
            accessKey: hike,
            title: 'Your payment for Hike service was successful',
            message: 'You will receive a confirmation email shortly. Thank you for choosing Peko.',
            firstButtonTxt: 'Go to Hike',
            firstBtnLink: paths.dashboard.hike,
        },
    ];

    const defaultData = {
        title: 'Your payment has been successful',
        message: 'You will receive a confirmation email shortly. Thank you for choosing Peko.',
        firstButtonTxt: 'Go to Dashboard',
        firstBtnLink: `/${paths.dashboard.home.slice(1)}`,
        secondButtonTxt: 'View Transaction',
        secondBtnLink: `/${paths.dashboard.reports.slice(1)}`,
    };
    const serviceSuccessData = array.find(obj => obj.accessKey === serviceAccessKey);
    return serviceSuccessData || defaultData;
}

export function checkIsBillPayment(serviceAccessKey: string) {
    const {
        AADC,
        Ajman,
        ADDC,
        FEWA,
        Lootah,
        Mawaqif,
        NOL,
        SEWA,
        Salik,
        dUPostpaid,
        dUPrepaid,
        etisalatPostpaid,
        etisalatPrepaid,
        darb,
        hafilat,
        dubaiPolice,
    } = accessKeys;

    const billPaymentAccessKeys = [
        AADC,
        Ajman,
        ADDC,
        FEWA,
        Lootah,
        Mawaqif,
        NOL,
        SEWA,
        Salik,
        dUPostpaid,
        dUPrepaid,
        etisalatPostpaid,
        etisalatPrepaid,
        darb,
        hafilat,
        dubaiPolice,
    ];
    return billPaymentAccessKeys.includes(serviceAccessKey);
}
