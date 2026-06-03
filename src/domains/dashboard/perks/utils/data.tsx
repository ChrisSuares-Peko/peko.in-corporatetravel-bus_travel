import {
    AwsLogo,
    ByteboardLogo,
    DeelLogo,
    GoogleWorkspaceLogo,
    NotionLogo,
    QuikbooksLogo,
    StripeLogo,
    XeroLogo,
} from '../assets/images';

interface IData {
    img: string;
    title: string;
    desc: string;
}

export const data: IData[] = [
    {
        img: NotionLogo,
        title: 'Notion',
        desc: 'A modern, open-source, collaborative note taking app',
    },
    {
        img: DeelLogo,
        title: 'Deel',
        desc: 'Deel is the all-in-one HR platform for global teams. Get 20% off Deel and a free HRIS',
    },
    {
        img: StripeLogo,
        title: 'Stripe',
        desc: '$25,000 in fee-free processing',
    },
    {
        img: GoogleWorkspaceLogo,
        title: 'Google Workspace',
        desc: 'Save 15% on your first year of Google Workspace.',
    },
    {
        img: QuikbooksLogo,
        title: 'Quikbooks Time',
        desc: 'Save 30% on QuickBooks Time',
    },
    {
        img: XeroLogo,
        title: 'Xero',
        desc: '25% off Xero Business Edition',
    },
    {
        img: ByteboardLogo,
        title: 'Byteboard',
        desc: '$25,000 in fee-free processing',
    },
    {
        img: AwsLogo,
        title: 'Amazon Web Services',
        desc: 'Up to $5,000 in credits',
    },
];
