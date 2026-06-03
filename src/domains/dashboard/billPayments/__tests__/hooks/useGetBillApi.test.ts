import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { SuccessGenericResponse, SurchargeResponse } from '@customtypes/general';
import { useAppDispatch } from '@src/hooks/store';
import { getSurcharge } from '@src/services/surcharge';

import { getBillDetails } from '../../api';
import { useGetBillApi } from '../../hooks/useGetBillApi';

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn().mockReturnValue({ role: 'admin', id: '1' }),
}));

vi.mock('@src/services/surcharge', () => ({
    getSurcharge: vi.fn(),
}));

vi.mock('../../api', () => ({
    getBillDetails: vi.fn(),
    getLimit: vi.fn(),
}));

vi.mock('../../slices/billPayment', async importOriginal => {
    const actual = (await importOriginal()) as Record<string, unknown>;
    return {
        ...actual,
        setBeneficiary: vi.fn(),
        setFormKey: vi.fn(),
        setVendor: vi.fn(),
    };
});

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
    useLocation: () => ({ pathname: '/some/path' }),
}));

vi.mock('../../utils/data', () => ({
    beneficiaryOptions: [{ value: 'someKey', directPay: false }],
    findObjectByAccessKey: vi.fn().mockReturnValue({ url: 'someUrl' }),
}));

vi.mock('../../hooks/hafilat/useHafilatApi', () => ({
    useHafilatApi: () => ({
        getBalance: vi.fn(),
    }),
}));

describe('useGetBillApi', () => {
    const mockDispatch = vi.fn();
    const mockNavigate = vi.fn();
    const mockGetBalance = vi.fn();
    const mockGetLimit = vi.fn();

    beforeEach(() => {
        (useAppDispatch as Mock).mockReturnValue(mockDispatch);
        (useNavigate as Mock).mockReturnValue(mockNavigate);
        (mockGetBalance as Mock).mockClear();
        (mockGetLimit as Mock).mockClear();
    });

    it('should initialize hook properly', () => {
        const { result } = renderHook(() => useGetBillApi());
        expect(result.current.getBillLimit).toBeDefined();
        expect(result.current.directPay).toBeDefined();
        expect(result.current.isSubmitting).toBe(false);
    });

    describe('getBillLimit', () => {
        it('should handle successful bill limit retrieval with surcharge calculation', async () => {
            const mockData: SuccessGenericResponse<any> = {
                status: true,
                data: {
                    dueBalanceInAed: '100',
                },
                message: '',
                responseCode: '',
            };
            const mockSurcharge: SurchargeResponse = {
                surcharge: '10',
                corporateCashback: '5',
            };

            (getBillDetails as Mock).mockResolvedValue(mockData);
            (getSurcharge as Mock).mockResolvedValue(mockSurcharge);

            const { result } = renderHook(() => useGetBillApi());
            await act(async () => {
                await result.current.getBillLimit({
                    flexiKey: 'key',
                    typeKey: 'type',
                    apiPath: 'path',
                    rechargeAmount: '200',
                });
            });

            expect(getBillDetails).toHaveBeenCalled();
            expect(getSurcharge).toHaveBeenCalled();
            expect(mockDispatch).toHaveBeenCalledWith(expect.anything());
            expect(result.current.isSubmitting).toBe(false);
        });

        it('should handle cases with missing or incorrect data', async () => {
            (getBillDetails as Mock).mockResolvedValue(false);
            const { result } = renderHook(() => useGetBillApi());
            await act(async () => {
                await result.current.getBillLimit({
                    flexiKey: 'key',
                    typeKey: 'type',
                    apiPath: 'path',
                });
            });
            expect(result.current.isSubmitting).toBe(false);
        });

        it('should handle edge cases with rechargeAmount being 0 or undefined', async () => {
            const mockData: SuccessGenericResponse<any> = {
                status: true,
                data: {
                    dueBalanceInAed: '50',
                },
                message: '',
                responseCode: '',
            };
            (getBillDetails as Mock).mockResolvedValue(mockData);
            (getSurcharge as Mock).mockResolvedValue({ surcharge: 0, corporateCashback: 0 });

            const { result } = renderHook(() => useGetBillApi());
            await act(async () => {
                await result.current.getBillLimit({
                    flexiKey: 'key',
                    typeKey: 'type',
                    apiPath: 'path',
                    rechargeAmount: undefined,
                });
            });

            expect(result.current.isSubmitting).toBe(false);
        });
    });
});
