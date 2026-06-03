import Accounting from '@domains/dashboard/moreServices/assets/icons/Accounting.svg';
import AItools from '@domains/dashboard/moreServices/assets/icons/Ai.svg';
import BankAccount from '@domains/dashboard/moreServices/assets/icons/BankAccount.svg';
// import BillPaymentsIcon from '@domains/dashboard/moreServices/assets/icons/BillPayments.svg';
import BusinessDocs from '@domains/dashboard/moreServices/assets/icons/BusinessDocs.svg';
import Company from '@domains/dashboard/moreServices/assets/icons/Company.svg';
import Connect from '@domains/dashboard/moreServices/assets/icons/Connect.svg';
import CorporateCards from '@domains/dashboard/moreServices/assets/icons/CorporateCards.svg';
import DocumentAttestation from '@domains/dashboard/moreServices/assets/icons/DocumentAttestation.svg';
import EmailDomain from '@domains/dashboard/moreServices/assets/icons/EmailDomain.svg';
import ESign from '@domains/dashboard/moreServices/assets/icons/ESign.svg';
// import GiftCardsIcon from '@domains/dashboard/moreServices/assets/icons/GiftCards.svg';
import Insurance from '@domains/dashboard/moreServices/assets/icons/Insurance.svg';
import Invoicing from '@domains/dashboard/moreServices/assets/icons/Invoicing.svg';
import LicenseRenewal from '@domains/dashboard/moreServices/assets/icons/LicenseRenewal.svg';
// import LogisticsIcon from '@domains/dashboard/moreServices/assets/icons/Logistics.svg';
import NeedHelp from '@domains/dashboard/moreServices/assets/icons/NeedHelp.svg';
import OfficeSpace from '@domains/dashboard/moreServices/assets/icons/OfficeSpace.svg';
// import PaymentLinks from '@domains/dashboard/moreServices/assets/icons/PaymentLinks.svg';
import PaymentTerminal from '@domains/dashboard/moreServices/assets/icons/PaymentTerminal.svg';
// import PayrollIcon from '@domains/dashboard/moreServices/assets/icons/Payroll.svg';
import PekoCloudIcon from '@domains/dashboard/moreServices/assets/icons/PekoCloud.svg';
import Procure from '@domains/dashboard/moreServices/assets/icons/Procure.svg';
import Remote from '@domains/dashboard/moreServices/assets/icons/Remote.svg';
import Reports from '@domains/dashboard/moreServices/assets/icons/Reports.svg';
// import SubscriptionIcon from '@domains/dashboard/moreServices/assets/icons/Subscriptions.svg';
// import SuppliesIcon from '@domains/dashboard/moreServices/assets/icons/Supplies.svg';
// import TravelIcon from '@domains/dashboard/moreServices/assets/icons/Travel.svg';
import SettingIcon from '@domains/dashboard/moreServices/assets/icons/Settings.svg';
import WhatsAppForBusiness from '@domains/dashboard/moreServices/assets/icons/WhatsAppForBusiness.svg';
import WorkingCapital from '@domains/dashboard/moreServices/assets/icons/WorkingCapital.svg';
import Works from '@domains/dashboard/moreServices/assets/icons/Works.svg';
import ZeroCarbon from '@domains/dashboard/moreServices/assets/icons/ZeroCarbon.svg';
import { paths } from '@src/routes/paths';

export const moreServices = [
    {
        icon: LicenseRenewal,
        title: 'License Renewal',
        status: '',
        path: `${paths.dashboard.licenseRenewal}`,
    },
    {
        icon: DocumentAttestation,
        title: 'Document Attestation',
        status: '',
        path: paths.dashboard.documentAttestation,
    },
    {
        icon: OfficeSpace,
        title: 'Office Address',
        status: '',
        path: paths.dashboard.officeAddress,
    },
    {
        icon: Works,
        title: 'Works',
        status: '',
        path: paths.dashboard.works,
    },
    {
        path: paths.zeroCarbon.index,
        title: 'Zero Carbon',
        status: '',
        icon: ZeroCarbon,
    },
    {
        icon: BusinessDocs,
        title: 'Business Docs',
        status: '',
        path: `${paths.businessDocs.index}`,
    },

    {
        icon: WhatsAppForBusiness,
        title: 'WhatsApp for Business',
        status: '',
        path: `/${paths.dashboard.whatsappForBusiness}`,
    },
    {
        icon: ESign,
        title: 'eSign',
        status: '',
        path: `/${paths.dashboard.eSign}`,
    },
    {
        icon: WorkingCapital,
        title: 'Peko Connect',
        status: '',
        path: `${paths.dashboard.pekoConnect}`,
    },
    {
        icon: Company,
        title: 'Hike',
        status: 'New',
        path: `${paths.dashboard.hike}`,
    },
    {
        icon: EmailDomain,
        title: 'Email/Domain',
        status: 'New',
        path: `${paths.dashboard.emailDomain}`,
    },
];

export const ComingSoon = [
    {
        icon: Company,
        title: 'Company Setup',
        status: 'Coming soon',
        path: '#',
    },
    // {   // icon will hidden due to going live
    //     icon: PaymentLinks,
    //     title: 'Vendor Payouts',
    //     status: 'Coming soon',
    //     path: `/${paths.dashboard.vendorPayouts}`,
    // },
    {
        icon: PaymentTerminal,
        title: 'Payment Terminal (POS)',
        status: 'Coming soon',
        path: '#',
    },
    {
        icon: AItools,
        title: 'AI Tools',
        status: 'Coming soon',
        path: '#',
    },
    {
        icon: WorkingCapital,
        title: 'Working Capital',
        status: 'Coming soon',
        path: '#',
    },
    {
        icon: BankAccount,
        title: 'Bank Account',
        status: 'Coming soon',
        path: '#',
    },
    {
        icon: Remote,
        title: 'Remote Hiring',
        status: 'Coming soon',
        path: '#',
    },
    {
        icon: Procure,
        title: 'Procure',
        status: 'Coming soon',
        path: '#',
    },
];

export const extraServicesForMobile = [
    {
        path: paths.dashboard.connect,
        title: 'MarketPlace',
        status: 'New',
        icon: Connect,
    },
    {
        path: paths.dashboard.invoicing,
        title: 'The Collector',
        status: 'Free',
        icon: Invoicing,
    },
    {
        path: paths.dashboard.accounting,
        title: 'Tax & More',
        status: 'New',
        icon: Accounting,
    },
    {
        path: paths.dashboard.insurance,
        title: 'Insurance',
        status: 'New',
        icon: Insurance,
    },
    {
        path: paths.dashboard.corporateCard,
        title: 'Corporate Cards',
        status: '',
        icon: CorporateCards,
    },
    {
        path: paths.dashboard.pekoCloud,
        title: 'Peko Cloud',
        status: '',
        icon: PekoCloudIcon,
    },
    // {
    //     path: '#',
    //     title: 'Vendor payout',
    //     status: '',
    //     icon: Payout,
    // },
    {
        path: paths.dashboard.reports,
        title: 'Reports',
        status: '',
        icon: Reports,
    },
    {
        path: paths.dashboard.needHelp,
        title: 'Need Help',
        status: '',
        icon: NeedHelp,
    },
    {
        path: paths.dashboard.settings,
        title: 'Settings',
        status: '',
        icon: SettingIcon,
    },
];

export const endServiceForMobile = [
    {
        path: paths.dashboard.reports,
        title: 'Reports',
        status: '',
        icon: Reports,
    },
    {
        path: paths.dashboard.needHelp,
        title: 'Need Help',
        status: '',
        icon: NeedHelp,
    },
];
