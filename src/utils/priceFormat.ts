export const formatNumberWithLocalString = (
    amount: any,
    minFraction: number = 2,
    maxFraction: number = 2
): string => {
    try {
        if (minFraction > maxFraction) maxFraction = minFraction;

        // Remove commas and other non-numeric characters (except for decimal points)
        const sanitizedAmount = String(amount).replace(/,/g, '');

        // Convert sanitized amount to a number
        const number = Number(sanitizedAmount);
        // Check if the conversion resulted in NaN
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(number)) {
            // console.log('Invalid number:', sanitizedAmount);
            return amount; // Return an empty string if the amount is not a valid number
        }
        // Format the number with specified fraction digits
        return number.toLocaleString('en-US', {
            minimumFractionDigits: minFraction,
            maximumFractionDigits: maxFraction,
        });
    } catch (error) {
        console.log('Error occurred while formatting amount:', error);
        return amount; // Return an empty string if an error occurs
    }
};

export const formatNumberWithoutCommas = (
    amount: any,
    minFraction: number = 2,
    maxFraction: number = 2
): string => {
    try {
        if (minFraction > maxFraction) maxFraction = minFraction;

        // Remove commas and other non-numeric characters (except for decimal points)
        const sanitizedAmount = String(amount).replace(/,/g, '');

        // Convert sanitized amount to a number
        const number = Number(sanitizedAmount);
        // Check if the conversion resulted in NaN
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(number)) {
            // console.log('Invalid number:', sanitizedAmount);
            return amount; // Return the original amount if the conversion fails
        }
        // Format the number without grouping (no commas)
        return number.toLocaleString('en-US', {
            minimumFractionDigits: minFraction,
            maximumFractionDigits: maxFraction,
            useGrouping: false, // Disable grouping
        });
    } catch (error) {
        console.log('Error occurred while formatting amount:', error);
        return amount; // Return the original amount if an error occurs
    }
};
