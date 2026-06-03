import { Flex, Grid, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

type Props = {
    title: string;
    icon: string;
    path: string;
};

const { useBreakpoint } = Grid;
function DashboardNavigateCard({ title, icon, path }: Props) {
    const screens = useBreakpoint();
    const height = screens.xl ? 45 : 55;
    return (
        <Link to={path}>
            <Flex
                vertical
                gap={18}
                align="center"
                role="button"
                className="transition duration-300 transform cursor-pointer hover:scale-110"
            >
                <Flex
                    className=" min-w-[5.7rem] xxl:min-w-28 h-24 xxl:h-28 bg-bgIconCard rounded-3xl"
                    align="center"
                    justify="center"
                >
                    <ReactSVG src={icon} width="100%" height="100%" />
                </Flex>
                <Typography.Text className="text-md  text-center sm:text-xs">
                    {title}
                </Typography.Text>
            </Flex>
        </Link>
    );
}

export default DashboardNavigateCard;
