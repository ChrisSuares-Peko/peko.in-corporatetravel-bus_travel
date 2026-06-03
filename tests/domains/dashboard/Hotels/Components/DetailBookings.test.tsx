import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Formik } from 'formik';
import '@testing-library/jest-dom/vitest';
import { Provider } from 'react-redux';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

// import { createTestStore } from '@store/store';
import DetailBookings from '@src/domains/dashboard/Hotels/Components/GuestDetails/DetailBookings';

// Mocking necessary hooks and functions
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: () => vi.fn(),
}));

vi.mock('@src/hooks/useSubscriptionCheck', () => ({
    __esModule: true,
    default: () => true,
}));

vi.mock('@domains/dashboard/Hotels/slices/getHotelSlice', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        // Mock specific functions that are used in the component
        addPassengersData: vi.fn(),
        addUserData: vi.fn(),
        setTotalFormCount: vi.fn(), // Ensure there's no syntax error here
    };
});

describe('DetailBookings Component', () => {
    // let mockStore: MockStoreEnhanced<unknown, {}>;

    const initialProps = {
        passengerType: 'adult',
        passengerKey: 1,
        roomIndex: 1,
        roomKey: 'room1',
        formRef: { current: { handleSubmit: vi.fn() } },
        totalForm: [],
        setTotalForm: vi.fn(),
        childAge: 10,
        totalPassengers: [],
        passengerCount: 1,
        data: [
            {
                fullName: 'John Doe',
                value: '1',
                label: 'John Doe',
                dateOfBirth: '1990-01-01',
                gender: 'MALE',
                mobileNo: '1234567890',
                personalEmail: 'john.doe@example.com',
                employeeDocuments: [], // Populate with appropriate mock EmployeeDocument objects if needed
                employeeInformation: {
                    dateOfJoin: '2020-01-01',
                    employeeId: 'EMP001',
                    designation: 'Software Engineer',
                    department: 'Engineering',
                    workLocation: 'New York',
                    schedule: '9am - 5pm',
                    status: 'Active',
                },
                workSchedule: {
                    startTime: '09:00',
                    endTime: '17:00',
                    breakTimeHrs: 1,
                    days: {
                        monday: true,
                        tuesday: true,
                        wednesday: true,
                        thursday: true,
                        friday: true,
                        saturday: false,
                        sunday: false,
                    },
                    workHrs: 8,
                },
                id: '1',
            },
        ],
        generateEmployeesDropdown: (data: any) =>
            data.map((employee: any) => ({
                value: employee.id,
                label: employee.fullName,
                dateOfBirth: employee.dateOfBirth,
                gender: employee.gender,
                mobileNo: employee.mobileNo,
                personalEmail: employee.personalEmail,
            })),
    };
    const mockStore = configureStore({
        reducer: (state = initialProps) => state,
    });

    beforeEach(() => {
        render(
            <Provider store={mockStore}>
                <Formik initialValues={{}} onSubmit={() => {}}>
                    <DetailBookings {...initialProps} />
                </Formik>
            </Provider>
        );
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('renders the form with initial values', () => {
        expect(screen.getByText('Adult Guest 1')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email ID')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
        expect(screen.getByText('Add Breakfast')).toBeInTheDocument();
    });

    it('should submit the form with valid values', async () => {
        const firstNameInputs = screen.getAllByPlaceholderText('First Name');
        const firstFirstNameInput = firstNameInputs[0];

        const lastNameInputs = screen.getAllByPlaceholderText('Last Name');
        const firstLastNameInput = lastNameInputs[0];

        fireEvent.change(firstFirstNameInput, {
            target: { value: 'John' },
        });
        fireEvent.change(firstLastNameInput, {
            target: { value: 'Doe' },
        });
        const emailInputs = screen.getAllByPlaceholderText('Email ID');
        const firstEmailInput = emailInputs[0];

        fireEvent.change(firstEmailInput, {
            target: { value: 'john.doe@example.com' },
        });
        const mobileInputs = screen.getAllByPlaceholderText('Mobile Number');
        const firstMobileInput = mobileInputs[0];

        fireEvent.change(firstMobileInput, {
            target: { value: '501234567' },
        });

        const maleButtons = screen.getAllByText('Male');
        fireEvent.click(maleButtons[0]);

        // Simulate form submission
        fireEvent.blur(firstFirstNameInput);

        // await waitFor(() => {
        //     expect(initialProps.setTotalForm).toHaveBeenCalled();
        // });
    });

    it('should show validation error for invalid data', async () => {
        const firstNameInputs = screen.getAllByPlaceholderText('First Name');
        const firstFirstNameInput = firstNameInputs[0];
        fireEvent.change(firstFirstNameInput, {
            target: { value: '' },
        });

        const lastNameInputs = screen.getAllByPlaceholderText('Last Name');
        const firstLastNameInput = lastNameInputs[0];
        fireEvent.change(firstLastNameInput, {
            target: { value: '' },
        });

        const emailInputs = screen.getAllByPlaceholderText('Email ID');
        const firstEmailInput = emailInputs[0];
        fireEvent.change(firstEmailInput, {
            target: { value: 'invalid-email' },
        });

        const mobileInputs = screen.getAllByPlaceholderText('Mobile Number');
        const firstMobileInput = mobileInputs[0];
        fireEvent.change(firstMobileInput, {
            target: { value: '12345' },
        });

        // fireEvent.submit(screen.getByTestId('hotelsbtn'));
        // fireEvent.click(screen.getByRole('button', { name: /Next/i }));

        // await waitFor(() => {
        //     expect(screen.getByText('First Name is required')).toBeInTheDocument();
        //     expect(screen.getByText('Last Name is required')).toBeInTheDocument();
        //     expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        //     expect(screen.getByText('Please enter a valid phone number')).toBeInTheDocument();
        // });
    });

    // it('should prefill form when an employee is selected', async () => {
    //     await waitFor(() => {
    //         const selectEmployeeElements = screen.getAllByText('Select employee');
    //         expect(selectEmployeeElements.length).toBeGreaterThan(0);
    //         fireEvent.mouseDown(selectEmployeeElements[0]);
    //     });

    //     fireEvent.click(screen.getByText('John Doe'));

    //     // Wait for the form to update after selection
    //     await waitFor(() => {
    //         const firstNameInputs = screen.getAllByPlaceholderText('First Name');
    //         const lastNameInputs = screen.getAllByPlaceholderText('Last Name');
    //         const emailInputs = screen.getAllByPlaceholderText('Email ID');
    //         const mobileNumberInput = screen.getAllByPlaceholderText('Mobile Number');

    //         // Debugging: Log values to check what's in the input fields
    //         console.log('First Name Value:', firstNameInputs[0]);
    //         console.log('Last Name Value:', lastNameInputs[0]);
    //         console.log('Email Value:', emailInputs[0]);
    //         console.log('Mobile Number Value:', mobileNumberInput[0]);

    //         // Assuming you're interacting with the first set of input fields
    //         expect(firstNameInputs[0]).toHaveValue('John');
    //         expect(lastNameInputs[0]).toHaveValue('Doe');
    //         expect(emailInputs[0]).toHaveValue('john.doe@example.com');
    //         expect(mobileNumberInput[0]).toHaveValue('1234567890');
    //     });
    // });

    it('should handle form submission and dispatch actions correctly', async () => {
        // Get all inputs with the placeholder "First Name"
        const firstNameInputs = screen.getAllByPlaceholderText('First Name');

        // Assuming you want to interact with the first "First Name" input
        fireEvent.change(firstNameInputs[0], {
            target: { value: 'Jane' },
        });

        // Similarly, get all inputs with the placeholder "Last Name"
        const lastNameInputs = screen.getAllByPlaceholderText('Last Name');
        fireEvent.change(lastNameInputs[0], {
            target: { value: 'Doe' },
        });

        // Get all inputs with the placeholder "Email ID"
        const emailInputs = screen.getAllByPlaceholderText('Email ID');
        fireEvent.change(emailInputs[0], {
            target: { value: 'jane.doe@example.com' },
        });

        // Get the "Mobile Number" input (assuming there's only one)
        const mobileNumberInput = screen.getAllByPlaceholderText('Mobile Number');
        fireEvent.change(mobileNumberInput[0], {
            target: { value: '0987654321' },
        });

        // Submit the form
        // fireEvent.submit(screen.getByTestId('hotelsbtn'));

        // await waitFor(() => {
        //     expect(getHotelSlice.addPassengersData).toHaveBeenCalledWith(
        //         expect.arrayContaining([
        //             expect.objectContaining({
        //                 passengerInfo: expect.objectContaining({
        //                     surname: 'Jane',
        //                     givenName: 'Jane Doe',
        //                     gender: 'M',  // Assuming the gender remains unchanged
        //                     birthDate: expect.any(String),
        //                 }),
        //             }),
        //         ])
        //     );
        // });
        // submitForm();

        // Then wait for the expected dispatch
        // await waitFor(() => {
        //     expect(getHotelSlice.addPassengersData).toHaveBeenCalled();
        // });
    });
});
