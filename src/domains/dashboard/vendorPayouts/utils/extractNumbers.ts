export function extractNumbers(input: string): string {
    return input
        .split(/\s+/) // Split by any whitespace
        .map(item => item.replace(/[^0-9.]/g, '')) // Remove non-numeric characters except periods
        .filter(item => item !== '') // Remove any empty strings from the result
        .join('\n'); // Join the numbers with a newline separator
}
