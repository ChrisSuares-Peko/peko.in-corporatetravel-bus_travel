import { ChatMessage } from '@azure/communication-chat';

import { formattedDateOnly } from '@utils/dateFormat';

export function groupMessagesByDate(messages: ChatMessage[]) {
    return messages.reduce((groups: { [key: string]: any[] }, message: ChatMessage) => {
        if (message?.content?.message) {
            const dateKey = formattedDateOnly(message.createdOn);
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].unshift(message);
        }
        return groups;
    }, {});
}

export function getDisplayDate(dateString: string) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    return formattedDateOnly(date);
}
