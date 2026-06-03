export const probationOptions = [
    { key: 1, id: 1, value: 1, label: '1 month', name: 1 },
    { key: 2, id: 2, value: 2, label: ' 2 months', name: 2 },
    { key: 3, id: 3, value: 3, label: '3 months', name: 3 },
    { key: 4, id: 4, value: 4, label: '4 months', name: 4 },
    { key: 5, id: 5, value: 5, label: '5 months', name: 5 },
    { key: 6, id: 6, value: 6, label: '6 months', name: 6 },
    { key: 7, id: 7, value: 7, label: '7 months', name: 7 },
    { key: 8, id: 8, value: 8, label: '8 months', name: 8 },
    { key: 9, id: 9, value: 9, label: '9 months', name: 9 },
    { key: 10, id: 10, value: 10, label: '10 months', name: 10 },
    { key: 11, id: 11, value: 11, label: '11 months', name: 11 },
    { key: 12, id: 12, value: 12, label: '12 months', name: 12 },
    { key: 0, id: 0, value: 0, label: 'Completed', name: 0 },
];

export const formatDocName = (docName: any) => {
    // Convert camelCase to space-separated words
    const spaced = docName.replace(/([a-z])([A-Z])/g, '$1 $2');
    // Capitalize the first letter of each word
    return spaced
        .split(' ')
        .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export const documentOptions = [
    { key: 1, id: 1, value: 'Emirates ID Card', label: 'Emirates ID Card' },
    { key: 2, id: 2, value: 'labourCard', label: 'Labour Card' },
    { key: 3, id: 3, value: 'Labour Contract', label: 'Labour Contract' },
    { key: 4, id: 4, value: 'Residence Visa', label: 'Residence Visa' },
    { key: 5, id: 5, value: 'Educational Certificate', label: 'Educational Certificate' },
    { key: 6, id: 6, value: 'passport', label: 'Passport ' },
    { key: 7, id: 7, value: 'offerLetter', label: 'Offer Letter' },
    { key: 8, id: 8, value: 'Driving License', label: 'Driving License' },
    { key: 9, id: 9, value: 'healthInsurance', label: 'Health Insurance' },
    { key: 10, id: 10, value: 'visaDoc', label: 'Visa Doc' },
    { key: 11, id: 11, value: 'nda', label: 'NDA' },

    {
        key: 12,
        id: 12,
        value: 'governmentEmployeeContract',
        label: 'Government Employee Contract',
    },
    { key: 13, id: 13, value: 'UAEResidentID', label: 'UAE Resident ID' },
];
