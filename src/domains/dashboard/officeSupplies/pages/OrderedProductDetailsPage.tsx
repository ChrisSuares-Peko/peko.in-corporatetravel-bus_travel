import { Flex, Skeleton } from 'antd';
import { useParams } from 'react-router-dom';

import OrderProductDetails from '../components/orderDetails/OrderedProductDetails';
import ShipmentDetails from '../components/orderDetails/ShipmentDetails';
import { useOrderDetailsApi } from '../hooks/useOrderDetailsApi';

function OrderedProductDetailsPage() {
    const { id } = useParams();
    const { isLoading } = useOrderDetailsApi(id!);
    return (
        <>
            {isLoading ? (
                <Flex vertical gap={50}>
                    <Skeleton avatar paragraph={{ rows: 4 }} />
                    <Skeleton paragraph={{ rows: 10 }} />
                </Flex>
            ) : (
                <>
                    <OrderProductDetails />
                    <ShipmentDetails />
                </>
            )}
        </>
    );
}

export default OrderedProductDetailsPage;
