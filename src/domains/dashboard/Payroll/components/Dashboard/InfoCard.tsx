import { Flex, Statistic, Typography } from 'antd';
import CountUp from 'react-countup';
import { ReactSVG } from 'react-svg';

import { InfoCardProps } from '@domains/dashboard/Payroll/types/types';

const formatter = (value: any, isCurrency: any) => (
    <CountUp end={value} separator="," decimals={isCurrency ? 2 : 0} />
);
const InfoCard = ({ icon, title, value, isCurrency, bgColor, reference }: InfoCardProps) => (
    <Flex
        ref={reference}
        vertical
        className={`${bgColor} rounded-2xl py-4 lg:py-5 pl-6 md:pl-8 pr-4 flex-1 `}
        gap={7}
    >
        <Flex
            className="w-8 h-8 xs:bg-red-50 md:bg-white rounded-full"
            align="center"
            justify="center"
        >
            <ReactSVG src={icon} />
        </Flex>

        {isCurrency ? (
            <Flex gap={3} align="baseline">
                <Typography.Text ellipsis className={` text-xs font-normal md:text-sm`}>
                    AED &nbsp;
                </Typography.Text>

                <Typography.Text
                    ellipsis
                    className={` text-base font-semibold sm:text-sm md:text-lg whitespace-nowrap sm:min-w-28`}
                >
                    <Statistic
                        value={Number(value)?.toFixed(0)}
                        formatter={() => formatter(value, isCurrency)}
                        precision={2}
                        className="payroll-dashboard"
                    />
                </Typography.Text>
            </Flex>
        ) : (
            <Typography.Text
                ellipsis
                className={` text-base font-semibold sm:text-sm md:text-lg whitespace-nowrap sm:min-w-28`}
            >
                <Statistic
                    className="payroll-dashboard"
                    value={Number(value)}
                    formatter={() => formatter(value, isCurrency)}
                    precision={0}
                />
            </Typography.Text>
        )}
        <Typography.Text className=" text-xs font-normal md:text-sm text-nowrap sm:min-w-28">
            {title}
        </Typography.Text>
    </Flex>
);

export default InfoCard;
