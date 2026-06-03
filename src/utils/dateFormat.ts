const DateOnlyConfig: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
};

const DateTimeConfig: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // For AM/PM format
};

const TimeConfig: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // For AM/PM format
};

type FormattedDateFn = (datetime: Date) => string;

type FormattedDateTimeFn = (datetime: Date) => string;

export const formattedDateOnly: FormattedDateFn = datetime =>
    datetime.toLocaleString('en-US', DateOnlyConfig);

export const formattedDateTime: FormattedDateTimeFn = datetime =>
    datetime.toLocaleString('en-US', DateTimeConfig);

export const formattedTime: FormattedDateFn = datetime =>
    datetime.toLocaleString('en-US', TimeConfig);
