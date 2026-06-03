export const toTitleCase = (str: string): string => {
    try {
        if (!str) throw new Error('Input string is empty or invalid');
        if (str === 'N/A') return str;

        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    } catch (error) {
        console.error(`Error in toTitleCase: ${error.message}`);
        return str; // Return empty string as a fallback
    }
};

export const toSentenceCase = (str: string): string => {
    try {
        if (!str) throw new Error('Input string is empty or invalid');
        if (str === 'N/A') return str;

        const lowerStr = str.toLowerCase().trim();
        return lowerStr.charAt(0).toUpperCase() + lowerStr.slice(1);
    } catch (error) {
        console.error(`Error in toSentenceCase: ${error.message}`);
        return str; // Return empty string as a fallback
    }
};

type Role = string | undefined;

// It will convert string CORPORATE  to Corporate...
const formatString = (role: Role): string => {
    if (!role) return '';
    return `${role.charAt(0).toUpperCase()}${role.slice(1).toLowerCase()}`;
};

export default formatString;
