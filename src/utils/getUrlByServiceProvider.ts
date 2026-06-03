import { paths } from '@src/routes/paths';

const getUrlByServiceProvider = (serviceProvider: string): string | false => {
    let linkPath: string | false;
    switch (serviceProvider) {
        case 'Etisalat Prepaid':
            linkPath = `/${paths.billPayments.index}/${paths.billPayments.etisalatPrepaid}`;
            break;
        case 'Du Postpaid':
            linkPath = `/${paths.billPayments.index}/${paths.billPayments.duPostpaid}`;
            break;
        default:
            linkPath = false;
    }

    return linkPath;
};

export default getUrlByServiceProvider;
