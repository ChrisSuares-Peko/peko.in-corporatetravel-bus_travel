export const ticketStatus = [
    {
        value: 'all',
        label: 'All',
    },
    {
        value: 'RESOLVED',
        label: 'Resolved',
    },
    {
        value: 'PENDING',
        label: 'Pending',
    },
    {
        value: 'REJECTED',
        label: 'Rejected',
    },
];

export const TicketStatusOnly = [
    {
        value: 'RESOLVED',
        label: 'Resolved',
    },
    {
        value: 'PENDING',
        label: 'Pending',
    },
    {
        value: 'REJECTED',
        label: 'Rejected',
    },
];

export type tableType = {
    date: string;
    issueDetails: string;
    id: number;
    module: string;
    updates: string;
    status: string;
    view: string;
};
