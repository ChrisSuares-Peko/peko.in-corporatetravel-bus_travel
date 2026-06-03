import { useCallback, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { postApplyCoupon } from '../api';
import { ApplyCouponResponse } from '../types';

export default function useApplyCoupon() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [coupon, setCoupon] = useState<string>('');

    const applyCoupon = useCallback(
        async (couponCode: string, totalPrice: number) => {
            setIsLoading(true);
            setDiscountAmount(totalPrice);
            const data: ApplyCouponResponse | false = await postApplyCoupon({
                userId: id,
                userType: role,
                amount: totalPrice,
                couponCode,
            });
            if (data) {
                setDiscountAmount(data.discountAmount);
                setIsLoading(false);
                setIsApplied(true);
                setCoupon(couponCode);
            } else {
                setDiscountAmount(0);
                setIsLoading(false);
                setCoupon('');
            }
        },
        [id, role]
    );

    const removeCoupon = useCallback(() => {
        setDiscountAmount(0);
        setIsApplied(false);
    }, []);

    return { discountAmount, isLoading, applyCoupon, isApplied, removeCoupon, coupon };
}
