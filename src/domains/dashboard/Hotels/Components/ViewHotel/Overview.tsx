import { Typography, Grid } from 'antd';
import { Content } from 'antd/es/layout/layout';

const { useBreakpoint } = Grid;

interface desc {
    description?: string;
}
const Overview = ({ description }: desc) => {
    const screens = useBreakpoint();
    return (
        <Content className="pt-5">
            <Content>
                <Typography.Text className="font-medium text-base">About Property</Typography.Text>
                {screens.md ? (
                    <Typography
                        dangerouslySetInnerHTML={{ __html: description! }}
                        className="mt-3 text-justify"
                        style={{ lineHeight: '1.5' }}
                    />
                ) : (
                    <Typography
                        dangerouslySetInnerHTML={{ __html: description! }}
                        className="mt-3 text-justify"
                        style={{ lineHeight: '1.5' }}
                    />
                )}
            </Content>
        </Content>
    );
};

export default Overview;
