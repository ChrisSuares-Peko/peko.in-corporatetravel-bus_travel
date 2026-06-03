import React from 'react';

import { Flex, Image, Typography } from 'antd';
import dayjs from 'dayjs';
import { ReactSVG } from 'react-svg';

import CalenderSVG from '../../assets/icons/Calender.svg';
import DataSVG from '../../assets/icons/Data.svg';
import MessageSVG from '../../assets/icons/Message.svg';
import PhoneSVG from '../../assets/icons/Phone.svg';
import { EsimUsage } from '../../types/orderDetails';

type Props = {
    usage: EsimUsage;
    image: string;
    operator: string;
};

const DetailsLeft = ({ usage, image, operator }: Props) => {
    const packageDetails = [
        {
            icon: PhoneSVG,
            title: 'Voice:',
            value: `${usage?.total_voice} min` || 'N/A',
        },
        {
            icon: MessageSVG,
            title: 'SMS:',
            value: `${usage?.total_text || 0} sms`,
        },
        {
            icon: DataSVG,
            title: 'Data:',
            value: usage && `${usage.total / 1024} GB`,
        },
        {
            icon: CalenderSVG,
            title: 'Validity:',
            value: dayjs(new Date(usage?.expired_at)).format('DD-MM-YYYY'),
        },
        // {
        //     icon: GlobeSVG,
        //     title: 'Coverage:',
        //     value: usage?.,
        // },
    ];

    return (
        <Flex className="px-4" gap={25} vertical>
            <Image src={image} className="" preview={false} />
            <Typography.Text className="text-red-500 text-2xl font-medium ms-1">
                {operator ?? 'N/A'}
            </Typography.Text>
            <Flex gap={20} vertical>
                {packageDetails?.map((item, i) => (
                    <Flex>
                        <ReactSVG src={item.icon} />
                        <Typography.Text className="text-xs ms-2 w-12 text-textGrey">
                            {item.title}
                        </Typography.Text>
                        <Typography.Text className="text-xs font-medium text-textBlack ms-2">
                            {item.value}
                        </Typography.Text>
                    </Flex>
                ))}
            </Flex>
            <Flex className="w-full bg-yellow-50 p-2 my-2 mx-0">
                <Typography.Text className="text-yellow-400 text-justify text-xs">
                    Warning! Most eSIMs can only be installed once. If you remove the eSIM from your
                    device, you cannot install it again.
                </Typography.Text>
            </Flex>
        </Flex>
    );
};

export default DetailsLeft;
