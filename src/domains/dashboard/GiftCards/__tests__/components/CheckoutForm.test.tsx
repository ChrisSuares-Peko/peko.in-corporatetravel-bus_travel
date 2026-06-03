import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import CheckoutForm from '../../components/CheckoutForm';
import * as useGetEmployeeModule from '../../hooks/useGetEmployeeApi';
import { GiftCardOrderTypes } from '../../types/employee';

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

describe('checkout form', () => {
    const mockDispatch = vi.fn();
    beforeEach(() => {
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    auth: {
                        role: 'user',
                        id: 12,
                    },
                    giftcardCheckout: {
                        formDetails: {
                            orderType: GiftCardOrderTypes.BUYFOREMPLOYEE,
                            quantity: '',
                            amount: '',
                            product: '',
                        },
                    },
                    subscriptions: {
                        services: {
                            userAccessibleServices: ['peko_payroll'],
                        },
                    },
                },
            })
        );
        cleanup();
    });

    test('renders CheckoutForm with BUYFOREMPLOYEE order type', () => {
        render(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <CheckoutForm
                    setSelectedEmployees={() => {}}
                    setSelectAllChecked={() => {}}
                    selectAllChecked={false}
                />
            </Formik>
        );

        expect(screen.getByText('Select Employees')).toBeInTheDocument();
    });

    test('renders CheckoutForm with other order types', () => {
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    auth: {
                        role: 'user',
                        id: 12,
                    },
                    giftcardCheckout: {
                        formDetails: {
                            orderType: GiftCardOrderTypes.BUYFOROTHER,
                            quantity: '',
                            amount: '',
                            product: '',
                        },
                    },
                    subscriptions: {
                        services: {
                            userAccessibleServices: ['peko_payroll'],
                        },
                    },
                },
            })
        );
        render(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <CheckoutForm
                    setSelectedEmployees={() => {}}
                    setSelectAllChecked={() => {}}
                    selectAllChecked={false}
                />
            </Formik>
        );

        expect(screen.getByPlaceholderText('Receiver Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Receiver Email Address')).toBeInTheDocument();
    });

    test('handles employee selection', async () => {
        const setSelectedEmployees = vi.fn();
        const mockGenerateEmployeesDropdown = vi.fn().mockReturnValue([
            {
                value: '1',
                label: 'John Doe',
                personalEmail: 'john@example.com',
                fullName: 'John Doe',
            }, // Ensure fullName is not empty
        ]);

        const mockReturnValue = {
            fullName: 'John Doe',
            value: '1',
            label: 'string',
            personalEmail: 'john@example.com',
            id: 'string',
            employeeInformation: {
                employeeId: '123',
            },
        };
        vi.spyOn(useGetEmployeeModule, 'useGetEmployee').mockReturnValue({
            data: [mockReturnValue],
            generateEmployeesDropdown: mockGenerateEmployeesDropdown,
        });
        const { getByRole } = render(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <CheckoutForm
                    setSelectedEmployees={setSelectedEmployees}
                    setSelectAllChecked={() => {}}
                    selectAllChecked={false}
                />
            </Formik>
        );
        const selectInput = getByRole('combobox');

        fireEvent.mouseDown(selectInput);

        const employeeOption = await screen.findByText('John Doe');

        fireEvent.click(employeeOption);

        await waitFor(() => {
            expect(setSelectedEmployees).toHaveBeenCalledWith([
                { receiverFirstName: 'John Doe', receiverEmail: 'john@example.com' },
            ]);
        });
    });

    test('shows recipient fields only for BUYFOROTHER order type', () => {
        render(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <CheckoutForm
                    setSelectedEmployees={() => {}}
                    setSelectAllChecked={() => {}}
                    selectAllChecked={false}
                />
            </Formik>
        );

        expect(screen.queryByPlaceholderText('Recipient Name')).toBeNull();
        expect(screen.queryByPlaceholderText('Recipient Email ID')).toBeNull();
    });
});
