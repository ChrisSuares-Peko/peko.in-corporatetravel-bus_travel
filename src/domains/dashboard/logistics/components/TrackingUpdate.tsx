import { Divider, Flex, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import TrackIconGreen from '@domains/dashboard/logistics/assets/icons/tracking-green.svg';
import TrackIcon from '@domains/dashboard/logistics/assets/icons/tracking.svg';

type Props = {
    date: string;
    location: string;
    description: string;
    comments: string;
    isEnd?: boolean;
};

const TrackingUpdate = ({ date, location, description, comments, isEnd = false }: Props) => (
    <Flex gap={20}>
        <Flex vertical justify="start" align="center">
            <ReactSVG src={isEnd ? TrackIcon : TrackIconGreen} />
            {!isEnd && (
                <Divider
                    type="vertical"
                    style={{ borderColor: '#05BE63', borderLeftWidth: '2px', minHeight: '120px' }}
                />
            )}
        </Flex>
        <Flex vertical gap={10} className="w-9/12">
            <Typography.Text className="text-base font-medium">{description}</Typography.Text>
            <Typography.Paragraph
                className="truncate text-base"
                ellipsis={{
                    expandable: false,
                    tooltip: {
                        title: comments,
                    },
                }}
            >
                {comments}
            </Typography.Paragraph>
            <Typography.Text className="text-sm ">{`${date}, ${location}`}</Typography.Text>
        </Flex>
    </Flex>
);
export default TrackingUpdate;
