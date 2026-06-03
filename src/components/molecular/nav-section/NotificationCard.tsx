import { Flex, Typography, theme } from 'antd';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(calendar);
interface NotificationCardProps {
    notificationTitle: string;
    notification: string;
    date: string;
}
const NotificationCard = ({ notificationTitle, notification, date }: NotificationCardProps) => {
    const {
        token: { colorTextTertiary },
    } = theme.useToken();
    const formattedDate = dayjs(date);

    const parseNotification = (text: string) => {
        if (!text) return '';

        const regex = /(\bAED \d+\.\d+|\b \d+|\d+\.\d+|\d+)/gi;

        const parts = text.split(regex);

        return parts.map((part, index) => {
            if (part.match(regex)) {
                return <strong key={index}>{part}</strong>;
            }

            return part;
        });
    };

    return (
        <Flex className="py-4 px-4 border-b">
            <Flex vertical gap={10}>
                <Typography.Text className="max-w-[24rem] text-base font-medium text-black">
                    {notificationTitle}
                </Typography.Text>
                <Typography.Text className=" max-w-[24rem] text-sm text-gray-700">
                    {parseNotification(notification)}
                </Typography.Text>
                <Typography.Text style={{ color: colorTextTertiary }} className="text-xs">
                    {formattedDate.calendar(null, {
                        sameDay: '[Today at] h:mm A', // Today at 10:30 AM
                        nextDay: '[Tomorrow at] h:mm A', // Tomorrow at 10:30 AM
                        nextWeek: 'dddd [at] h:mm A', // Next Tuesday at 10:30 AM
                        lastDay: '[Yesterday at] h:mm A', // Yesterday at 10:30 AM
                        lastWeek: '[Last] dddd [at] h:mm A', // Last Monday at 10:30 AM
                        sameElse: 'DD MMM [at] h:mm A', // Everything else ( 07/10/2011 )
                    })}
                </Typography.Text>
            </Flex>
        </Flex>
    );
};

export default NotificationCard;
