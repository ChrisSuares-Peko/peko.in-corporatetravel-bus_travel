import { Col, Grid, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import IconCard from '@components/molecular/cards/IconCard';
import EInvoicingTile from '@src/domains/dashboard/EInvoicing/components/EInvoicingTile';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { quickActions } from '@utils/data';

import { setVendor } from '../../billPayments/slices/billPayment';

const { useBreakpoint } = Grid;

type QuickActionsListProps = {
    quickAction?: React.MutableRefObject<null>;
};
const QuickActionsList = ({ quickAction }: QuickActionsListProps) => {
    const { services } = useAppSelector(state => state.reducer.subscriptions);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const screens = useBreakpoint();
    const justify = screens.xl ? 'space-between' : 'start';
    const handleClick = (item: any) => () => {
        if (item.accessKey && services) {
            const isPurchased = services.userAccessibleServices.includes(item.accessKey);
            if (!isPurchased) return navigate(item.indexURL);
        }
        dispatch(setVendor(item.state));
        return navigate(item.url);
    };
    return (
        <Row gutter={[20, 20]} className="mt-3 md:px-2" justify={justify} ref={quickAction}>
            <Col span={24}>
                <Typography.Text className="text-lg font-normal text-black ">
                    Quick Actions
                </Typography.Text>
            </Col>
            {quickActions.map((item, index) =>
                item.kind === 'einvoicing' ? (
                    <Col key="einvoicing" className="mt-3" xs={8} md={4}>
                        <EInvoicingTile />
                    </Col>
                ) : (
                    <Col key={index} className="mt-3" xs={8} md={4}>
                        <IconCard
                            icon={item.icon}
                            title={item.title}
                            key={item.icon}
                            onClick={handleClick(item)}
                        />
                    </Col>
                )
            )}
        </Row>
    );
};

export default QuickActionsList;
