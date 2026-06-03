import logo2 from '@domains/dashboard/Hike/assets/Group.svg';
import logo1 from '@domains/dashboard/Hike/assets/logo3.svg';

export const dashboardCardsData = [
    {
        logo: logo2,
        text1: 'Personalized deals to match your lifestyle.',
        text2: 'Personalized deals to match your lifestyle.',
        text3: 'Personalized deals to match your lifestyle.',
        amount: '30',
        features: [
            'Personalized deals to match your lifestyle.',
            'Exclusive offers from 1,000+ merchants',
            'Stay updated on major discounts',
        ],
    },
    {
        logo: logo1,
        text1: 'Over 7,000 Buy One Get One Free offers .',
        text2: 'Over 7,000 Buy One Get One Free offers .',
        text3: 'Over 7,000 Buy One Get One Free offers .',
        amount: '30',
        features: [
            'Over 7,000 Buy One Get One Free offers',
            'Over 7,000 Buy One Get One Free offers',
            'Over 7,000 Buy One Get One Free offers',
        ],
    },
    // {
    //     logo: logo1,
    //     text1: 'Over 7,000 Buy One Get One Free offers .',
    //     text2: 'Over 7,000 Buy One Get One Free offers .',
    //     text3: 'Over 7,000 Buy One Get One Free offers .',
    //     amount: '30',
    //     features:['Over 7,000 Buy One Get One Free offers','Over 7,000 Buy One Get One Free offers','Over 7,000 Buy One Get One Free offers']
    // },
    // {
    //     logo: logo1,
    //     text1: 'Over 7,000 Buy One Get One Free offers .',
    //     text2: 'Over 7,000 Buy One Get One Free offers .',
    //     text3: 'Over 7,000 Buy One Get One Free offers .',
    //     amount: '30',
    //     features:['Over 7,000 Buy One Get One Free offers','Over 7,000 Buy One Get One Free offers','Over 7,000 Buy One Get One Free offers']
    // },
];

export const employees = [
    {
        label: 'employee1',
        value: 'employee1',
    },
    {
        label: 'employee2',
        value: 'employee2',
    },
    {
        label: 'employee3',
        value: 'employee3',
    },
    {
        label: 'employee4',
        value: 'employee4',
    },
];

export const dataSource = [
    {
        key: '1', // Assuming you're using the same image for each item
        price: 200,
        quantity: 1,
        productQuantity: 1,
        subtotal: 200,
    },
    {
        key: '2',
        price: 300,
        quantity: 2,
        productQuantity: 2,
        subtotal: 600,
    },
    {
        key: '3',
        price: 150,
        quantity: 3,
        productQuantity: 3,
        subtotal: 450,
    },
];

export const historyData = [
    {
        key: '1',
        date: '2023-09-15T12:34:56Z',
        name: [{ productName: 'Hiking Boots' }, { productName: 'Backpack' }],
        Orders: 2,
        amount: '150.00',
        total: '300.00',
        status: 'Completed',
    },
    {
        key: '2',
        date: '2023-09-10T10:30:00Z',
        name: [{ productName: 'Hiking Jacket' }, { productName: 'Trekking Poles' }],
        Orders: 3,
        amount: '100.00',
        total: '300.00',
        status: 'InProgress',
    },
    {
        key: '3',
        date: '2023-08-20T09:45:00Z',
        name: [{ productName: 'Tent' }],
        Orders: 1,
        amount: '200.00',
        total: '200.00',
        status: 'Pending',
    },
    {
        key: '4',
        date: '2023-07-25T11:00:00Z',
        name: [{ productName: 'Sleeping Bag' }],
        Orders: 1,
        amount: '80.00',
        total: '80.00',
        status: 'Cancelled',
    },
];

export const purchaseData = [
    {
        id: 1,
        logoimg: logo1,
    },
    {
        id: 2,
        logoimg: logo2,
    },
];
