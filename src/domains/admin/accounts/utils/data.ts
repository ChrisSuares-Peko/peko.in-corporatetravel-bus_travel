import dayjs from 'dayjs';

export const dateFormat = 'YYYY-MM-DD';
export const disabledDate = (current: any) => current && current > dayjs().endOf('day');

const today = new Date();
// const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
export const initialFilters = {
    page: 1,
    itemsPerPage: 10,
    filter: '',
    sort: 'DESC' as 'DESC' | 'ASC',
    sortField: '',
    corporateId: undefined,
    searchText: undefined,
    from: today.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0],
};

export const transferTypes = [
    { label: 'Credit', value: 'Credit' },
    { label: 'Debit', value: 'Debit' },
];
