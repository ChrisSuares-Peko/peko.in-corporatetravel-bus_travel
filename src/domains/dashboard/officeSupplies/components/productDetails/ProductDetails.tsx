import React, { useEffect, useState } from 'react';

import { Image, Typography, Row, Col, Flex, Button, Skeleton, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import useScreenSize from '@src/hooks/useScreenSize';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import ProductDescriptionLg from './ProductDescriptionLg';
import ProductDescriptionMobile from './ProductDescriptionMobile';
import { useCartApi } from '../../hooks/useCartApi';
import { ProductDetails as ProductDetailsType, ProductImage } from '../../types/productDetails';

interface ProductDetailsProps {
    productDetails: ProductDetailsType;
    productImages: ProductImage[];
    isLoading: boolean;
}

const { Text } = Typography;

const ProductDetails: React.FC<ProductDetailsProps> = ({
    productImages,
    productDetails,
    isLoading,
}) => {
    const dispatch = useAppDispatch();
    const screens = useScreenSize();
    const { buyNow, isLoading: addToCartLoading, addToCart, loading } = useCartApi();
    const navigate = useNavigate();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [cartUpdateQuantity, SetCartUpdateQuantity] = useState(1);
    const [productCountInCart, setProductCountInCart] = useState(0);

    const [showNumberInput, setShowNumberInput] = useState(false);
    const [numInputValue, setNumInputValue] = useState(0); // Initial value for the number input

    const handleUpdateCart = (prodId: number, num: number) => {
        setNumInputValue(numInputValue + num);
        setShowNumberInput(true);
        addToCart(prodId, num);

        setTimeout(() => {
            setShowNumberInput(false);
            setNumInputValue(1);
        }, 30000);
    };

    const handleAddToCart = async (productId: number) => {
        if (cartUpdateQuantity > productDetails.quantity) {
            dispatch(
                showToast({
                    description: 'Sorry, the requested quantity is not available in stock.',
                    variant: 'warning',
                })
            );
        } else {
            await addToCart(productId, cartUpdateQuantity);
        }
    };

    const buyProducts = async (productId: number) => {
        if (cartUpdateQuantity > productDetails.quantity) {
            dispatch(
                showToast({
                    description: 'Sorry, the requested quantity is not available in stock.',
                    variant: 'warning',
                })
            );
        } else {
            if (!productCountInCart) {
                await buyNow(productId, cartUpdateQuantity);
            }
            navigate(`${paths.dashboard.officeSupplies}/${paths.officeSupplies.cartPage}`);
        }
    };

    const handleCart = async (productId: number) => {
        if (cartUpdateQuantity > productDetails.quantity) {
            dispatch(
                showToast({
                    description: 'Sorry, the requested quantity is not available in stock.',
                    variant: 'warning',
                })
            );
        } else {
            addToCart(productId, cartUpdateQuantity);
        }
    };

    const handleUpdateQuantity = (newQuantity: number) => {
        SetCartUpdateQuantity(newQuantity);
    };
    const handleClick = (quantity: any) => {
        if (numInputValue === 1 || numInputValue === 10 || numInputValue === quantity) {
            navigate(`/${paths.officeSupplies.index}/${paths.officeSupplies.cartPage}`);
        }
        // navigate(`${paths.officeSupplies.productDetails}/${id}`);
    };

    const cartDetails = useAppSelector((state: { reducer: { cart: any } }) => state.reducer.cart);

    useEffect(() => {
        if (!productDetails) return;

        const productInCart = cartDetails.items.filter(
            (product: any) => product.id === productDetails.id
        )[0];
        if (productInCart) {
            setProductCountInCart(productInCart.productQuantity || 0);
        }
    }, [cartDetails, setProductCountInCart, productDetails]);

    return (
        <>
            {isLoading ? (
                <Skeleton className="my-8" />
            ) : (
                <>
                    <Row align="middle" gutter={24} className="mt-6">
                        <Col xs={24} md={9} className="flex flex-col align-middle p-0">
                            <Card size="small" className="rounded-2xl p-0">
                                <Image
                                    src={
                                        productImages
                                            ? productImages[selectedImageIndex]?.productImageUrl
                                            : ''
                                    }
                                    alt="No image available"
                                    width="100%"
                                    height={260}
                                    className="object-contain "
                                />
                                <Flex gap={10} justify="center">
                                    {productImages?.map((image, index) => (
                                        <Image
                                            key={index}
                                            src={image?.productImageUrl!}
                                            alt={`${productDetails?.name}-${index}`}
                                            onClick={() => setSelectedImageIndex(index)}
                                            role="button"
                                            preview={false}
                                            width={70}
                                            height={70}
                                            className="object-contain hover:border hover:rounded-lg"
                                        />
                                    ))}
                                </Flex>
                            </Card>
                        </Col>
                        <Col xs={24} md={15} className="xs:pt-8 md:pt-0">
                            <Flex gap={7} vertical>
                                <Text className="text-base text-productText font-medium">
                                    {productDetails?.brand}
                                </Text>
                                <Text className="xs:lg md:text-xl line-clamp-3 mt-2">
                                    {productDetails?.name}
                                </Text>
                            </Flex>
                            {screens.md ? (
                                <ProductDescriptionLg
                                    id={productDetails?.id!}
                                    price={productDetails?.price!}
                                    actualPrice={productDetails?.actualPrice!}
                                    quantity={productDetails?.quantity}
                                    cartUpdateQuantity={cartUpdateQuantity}
                                    handleUpdateQuantity={handleUpdateQuantity}
                                    handleAddToCart={handleCart}
                                    addToCartLoading={addToCartLoading}
                                    buyProducts={buyProducts}
                                />
                            ) : (
                                <ProductDescriptionMobile
                                    id={productDetails?.id!}
                                    price={productDetails?.price!}
                                    actualPrice={productDetails?.actualPrice!}
                                    cartUpdateQuantity={cartUpdateQuantity}
                                    handleUpdateQuantity={handleUpdateQuantity}
                                />
                            )}
                        </Col>
                    </Row>
                    <Row gutter={10} className="fixed md:hidden bottom-0 z-10 w-full px-5 left-0">
                        {productDetails?.quantity < 1 ? (
                            <Col xs={24} sm={24} md={0} lg={0} xl={0}>
                                <div
                                    key="outOfStock"
                                    className="text-bgOrange h-14 border border-bgOrange bg-white rounded-sm w-full px-0 flex items-center justify-center"
                                    style={{ pointerEvents: 'none' }} // Prevent any interactions
                                >
                                    Out of Stock
                                </div>
                            </Col>
                        ) : (
                            <>
                                <Col
                                    xs={12}
                                    sm={12}
                                    md={0}
                                    lg={0}
                                    xl={0}
                                    onClick={() => handleClick(productDetails?.quantity)}
                                >
                                    {showNumberInput ? (
                                        <Flex
                                            align="center"
                                            justify="center"
                                            className="text-bgOrange h-14 border border-bgOrange bg-white rounded-sm w-full p-1 px-6 justify-between"
                                            gap={10}
                                        >
                                            <Typography.Text
                                                className="text-3xl text-textBlack"
                                                onClick={e => {
                                                    if (numInputValue <= 1) return;
                                                    e.stopPropagation();
                                                    handleUpdateCart(productDetails.id, -1);
                                                }}
                                                disabled={addToCartLoading}
                                            >
                                                -
                                            </Typography.Text>
                                            <Typography.Text
                                                className="text-xl text-bgOrange"
                                                onClick={e => {
                                                    if (numInputValue <= 1) return;
                                                    e.stopPropagation();
                                                    handleUpdateCart(productDetails.id, -1);
                                                }}
                                            >
                                                {numInputValue}
                                            </Typography.Text>
                                            <Typography.Text
                                                className="text-2xl text-textBlack mb-2"
                                                onClick={e => {
                                                    if (
                                                        numInputValue === 10 ||
                                                        numInputValue === productDetails.quantity
                                                    )
                                                        return;
                                                    e.stopPropagation();
                                                    handleUpdateCart(productDetails.id, 1);
                                                }}
                                                disabled={addToCartLoading}
                                            >
                                                +
                                            </Typography.Text>
                                        </Flex>
                                    ) : (
                                        <Button
                                            loading={addToCartLoading}
                                            key="addToCart"
                                            className="text-bgOrange h-14 border border-bgOrange bg-white rounded-sm rounded-r-none w-full px-0"
                                            style={{
                                                backgroundColor: addToCartLoading
                                                    ? '#ffffff'
                                                    : '#ffffff',
                                                opacity: addToCartLoading ? 1 : 1,
                                            }}
                                            onClick={() => handleUpdateCart(productDetails.id, 1)}
                                        >
                                            Add to Cart
                                        </Button>
                                    )}
                                </Col>
                                <Col xs={12} sm={12} md={0} lg={0} xl={0}>
                                    <Button
                                        type="primary"
                                        danger
                                        className="font-roboto h-14 rounded-sm w-full rounded-l-none px-0"
                                        onClick={() => {
                                            buyProducts(productDetails.id);
                                        }}
                                        loading={loading}
                                    >
                                        Buy Now
                                    </Button>
                                </Col>
                            </>
                        )}
                    </Row>
                </>
            )}
        </>
    );
};

export default ProductDetails;
