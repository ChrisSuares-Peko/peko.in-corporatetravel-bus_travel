import React, { useState, useCallback } from 'react';

import { Card, Button, Image, Flex, Typography, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import useScreenSize from '@src/hooks/useScreenSize';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import ShoppingCartIcon from '../../assets/icons/shopping-cart.svg';
import { useCartApi } from '../../hooks/useCartApi';
import { ProductCardProps } from '../../types/products';

const ProductCard: React.FC<ProductCardProps> = ({
    image,
    name,
    price,
    category,
    savePrice,
    id,
    quantity,
    actualPrice,
}) => {
    const save = (parseFloat(actualPrice) - parseFloat(price)).toFixed(2);
    const cartDetails = useAppSelector(state => state.reducer.cart);
    const dispatch = useAppDispatch();
    const screen = useScreenSize();
    const navigate = useNavigate();
    const { addToCart, isLoading } = useCartApi();
    const [showNumberInput, setShowNumberInput] = useState(false);
    const [numInputValue, setNumInputValue] = useState(0); // Initial value for the number input
    const { user } = useAppSelector(state => state.reducer.user);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const handleAddToCart = useCallback(
        (prodId: number, num: number) => {
            const cartItem = cartDetails.items.find(item => item.id === prodId);
            if (cartItem) {
                // Check if the product quantity in the cart equals the available stock
                if (cartItem.productQuantity >= cartItem.productQuantityInDB) {
                    dispatch(
                        showToast({
                            description: 'Sorry! Maximum quantity reached',
                            variant: 'error',
                        })
                    );
                    return;
                }
            }

            setNumInputValue(prev => prev + num);
            setShowNumberInput(true);
            addToCart(prodId, num);

            if (timer) {
                clearTimeout(timer);
            }

            const newTimer = setTimeout(() => {
                setShowNumberInput(false);
                setNumInputValue(0);
            }, 6000);

            setTimer(newTimer);
        },
        [addToCart, cartDetails.items, dispatch, timer]
    );

    const handleClick = (prodName: string) => {
        navigate(`${paths.officeSupplies.productDetails}/${id}`);
    };

    return (
        <Col
            xs={12}
            sm={12}
            lg={12}
            xl={6}
            className={`flex justify-center ${quantity! < 1 ? 'hidden' : ''}`}
        >
            <Card
                className="w-full mx-1 cursor-pointer xs:px-2 sm:p-6 rounded-2xl"
                size="small"
                cover={
                    <Image
                        onClick={() => handleClick(name)}
                        alt="Product"
                        preview={false}
                        loading="lazy"
                        src={image}
                        className="object-contain hover:scale-105 mt-3 sm:mt-1"
                        style={{
                            minWidth: '100%',
                            height: `${screen.xs ? '100px' : '150px'}`,
                            objectFit: 'contain',
                            transition: 'transform .3s ease-in-out',
                        }}
                    />
                }
            >
                <Flex
                    vertical
                    gap={8}
                    className="ms:mt-1 sm:mt-4"
                    onClick={() => handleClick(name)}
                >
                    <Typography.Text className="text-gray-600 xs:text-xs sm:text-base">
                        {}
                    </Typography.Text>
                    <Typography.Text className="line-clamp-2 h-12 xs:text-xs sm:text-base">
                        {name}
                    </Typography.Text>
                    <Flex align="center" gap={8}>
                        <Typography.Text className="xs:text-sm sm:text-base font-bold">
                            AED {formatNumberWithLocalString(price)}
                        </Typography.Text>
                    </Flex>
                </Flex>
                <Flex justify="space-between" align="flex-end">
                    <Flex
                        justify="space-between"
                        align="start"
                        vertical
                        onClick={() => handleClick(name)}
                    >
                        {parseFloat(save) > 0 ? (
                            <Typography.Paragraph className="font-medium text-textGreen xs:text-[.6rem] sm:text-sm">
                                Save AED {formatNumberWithLocalString(save)}
                            </Typography.Paragraph>
                        ) : (
                            <Typography.Paragraph className="font-medium text-textGreen" />
                        )}
                    </Flex>

                    {showNumberInput ? (
                        <Flex align="center" justify="center" className="border p-1 px-3" gap={10}>
                            <Typography.Text
                                className="text-xl text-textBlack"
                                onClick={e => {
                                    if (
                                        numInputValue === 1 ||
                                        numInputValue === 10 ||
                                        numInputValue === quantity
                                    ) {
                                        navigate(`${paths.officeSupplies.cartPage}`);
                                    }
                                    if (numInputValue <= 1) return;
                                    e.stopPropagation();
                                    handleAddToCart(id, -1);
                                }}
                                disabled={isLoading}
                            >
                                -
                            </Typography.Text>
                            <Typography.Text className="text-base text-textBlack">
                                {numInputValue}
                            </Typography.Text>
                            <Typography.Text
                                className="text-xl text-textBlack mb-2"
                                onClick={e => {
                                    if (numInputValue === 10 || numInputValue === quantity) {
                                        navigate(`${paths.officeSupplies.cartPage}`);
                                    }
                                    if (numInputValue === 10 || numInputValue === quantity) return;
                                    e.stopPropagation();
                                    handleAddToCart(id, 1);
                                }}
                                disabled={isLoading}
                            >
                                +
                            </Typography.Text>
                        </Flex>
                    ) : (
                        <Button
                            size="small"
                            loading={isLoading}
                            onClick={e => {
                                e.stopPropagation();
                                handleAddToCart(id, 1);
                            }}
                            danger
                            className="xs:p-1 sm:p-2 flex items-center rounded-[.3rem] mt-2 ms-2 hover:scale-105"
                        >
                            {!isLoading && <ReactSVG src={ShoppingCartIcon} />}
                        </Button>
                    )}
                </Flex>
            </Card>
        </Col>
    );
};

export default ProductCard;
