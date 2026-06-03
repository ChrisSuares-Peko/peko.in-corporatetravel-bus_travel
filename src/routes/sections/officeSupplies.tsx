import { lazy } from 'react';

import { paths } from '../paths';

const OfficeSuppliesPage = lazy(
    () => import('@domains/dashboard/officeSupplies/pages/OfficeSupplies')
);

const ProductDetailsPage = lazy(
    () => import('@domains/dashboard/officeSupplies/pages/ProductDetailsPage')
);
const CartPage = lazy(() => import('@domains/dashboard/officeSupplies/pages/CartPage'));
const OrderedProductDetailsPage = lazy(
    () => import('@domains/dashboard/officeSupplies/pages/OrderedProductDetailsPage')
);
const OrderHistoryPage = lazy(
    () => import('@domains/dashboard/officeSupplies/pages/OrderHistoryPage')
);

const OrderPlaced = lazy(() => import('@domains/dashboard/officeSupplies/pages/OrderPlaced'));

// -----------------------------------------------------------------------

export const officeSuppliesRoutes = [
    { element: <OfficeSuppliesPage />, index: true },
    {
        element: <ProductDetailsPage />,
        path: `${paths.officeSupplies.productDetails}/:${paths.officeSupplies.id}`,
    },
    { element: <CartPage />, path: paths.officeSupplies.cartPage },
    { element: <OrderPlaced />, path: paths.officeSupplies.orderPlaced },
    { element: <OrderHistoryPage />, path: paths.officeSupplies.orderHistory },
    {
        element: <OrderedProductDetailsPage />,
        path: `${paths.officeSupplies.orderHistory}/${paths.officeSupplies.orderDetails}/:id`,
    },
];
