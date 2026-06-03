import doc from '@domains/dashboard/emailDomain/assets/docs.png';
import file from '@domains/dashboard/emailDomain/assets/file.png';
import gmail from '@domains/dashboard/emailDomain/assets/gmail.jpg';
import workspaces from '@domains/dashboard/emailDomain/assets/googleworkspace.png';
import calendar from '@domains/dashboard/emailDomain/assets/logo31.png';
import chat from '@domains/dashboard/emailDomain/assets/logo32.png';
import meet from '@domains/dashboard/emailDomain/assets/meet.png';
import ms365 from '@domains/dashboard/emailDomain/assets/ms365.png';
import ppt from '@domains/dashboard/emailDomain/assets/ppt.png';

export const cardData = [
    {
        image: workspaces,
        name: 'Google WorkSpace',
        description: 'Save 15% on your first year of Google Workspace.',
    },
    {
        image: ms365,
        name: 'Microsoft 365',
        description: 'AED 250 in fee-free processing',
    },
];

export const workspace = [
    {
        image: gmail,
        name: 'Gmail',
        description: 'Professional email with your own domain name',
    },
    {
        image: meet,
        name: 'Meet',
        description: 'Powerful video conferencing tool with cutting-edge features',
    },
    {
        image: calendar,
        name: 'Calendar',
        description: 'Schedule meetings, set reminders, and manage work efficiently',
    },
    {
        image: chat,
        name: 'Chat',
        description: 'Connect, discuss, and engage in productive conversations anytime',
    },
    {
        image: doc,
        name: 'Docs',
        description: 'Create professional documents and collaborate in real-time',
    },
    {
        image: ppt,
        name: 'Sheets',
        description: 'Create detailed spreadsheets, visualize data, and perform analysis',
    },
    {
        image: file,
        name: 'Slides',
        description: 'Create impactful presentations',
    },
];
