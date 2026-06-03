import { Typography } from 'antd';

type Props = {
    title: string;
    desc: string;
};

export const ProjectDesc = ({ title, desc }: Props) => (
    <>
        <Typography.Text className="font-medium text-2xl text-valueText md:ms-2 xs:ms-0 text-start mt-2">
            {title}
        </Typography.Text>
        <Typography.Text className="font-light text-base md:ms-2 xs:ms-0 text-start mt-4">
            {desc}
        </Typography.Text>
    </>
);
