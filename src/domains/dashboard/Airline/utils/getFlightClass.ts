interface IFlightClass {
    [key: string]: string;
}

export const retrieveFlightClass = (classCode: string) => {
    const flightClass: IFlightClass = {
        1: 'First Class',
        2: 'Business Class',
        4: 'Premium Economy',
        5: 'Economy Class',
    };
    return flightClass[classCode] || 'Unknown Class';
};
