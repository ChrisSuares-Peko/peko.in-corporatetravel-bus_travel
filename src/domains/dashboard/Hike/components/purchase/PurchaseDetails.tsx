import React, { useState, useEffect } from 'react';

import {
    Card,
    Checkbox,
    Col,
    Divider,
    Flex,
    Form,
    Image,
    Input,
    InputNumber,
    Row,
    Typography,
} from 'antd';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';

import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import useServiceAccess from '@src/hooks/useSubscriptionCheck';
import { showToast } from '@src/slices/apiSlice';
import { accessKeys } from '@utils/accessKeys';
import { formatNumberWithLocalString } from '@utils/priceFormat';

const PurchaseDetails = ({
    logo,
    onUpdateItem,
    id,
    data,
    price,
    hikeName,
    salaryValidation,
    salaryAmt,
}: any) => {
    const dispatch = useDispatch();
    salaryValidation = salaryValidation === 'GREATER_THAN' ? 'greater than' : 'less than';
    const isPurchased = useServiceAccess(accessKeys.payroll);
    const [voucherCount, setVoucherCount] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);
    const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
    const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
    const [isDropdownDisabled, setIsDropdownDisabled] = useState<boolean>(false);
    const [isCheckboxDisabled, setIsCheckboxDisabled] = useState<boolean>(false);
    const voucherPrice = price;

    const calculateAmount = (count: number) => {
        const newAmount = count * voucherPrice;
        setAmount(newAmount);

        onUpdateItem(id, count, price, hikeName, newAmount, selectedEmployees, logo);
    };

    useEffect(() => {
        if (isPurchased && selectedEmployees.length > 0) {
            const employeeCount = selectedEmployees.length;
            setVoucherCount(employeeCount);
            calculateAmount(employeeCount);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedEmployees, isPurchased]);

    const handleVoucherCountChange = (value: number | null) => {
        const count = value ?? 0;
        setVoucherCount(count);
        const newAmount = count * voucherPrice;
        setAmount(newAmount);

        onUpdateItem(id, count, price, hikeName, newAmount, selectedEmployees, logo);
    };

    const handleEmployeeSelection = (value: any) => {
        const selected = data
            .filter((employee: any) => value.includes(employee.value))
            .map((employee: any) => ({
                name: employee.fullName,
                employeeId: employee.id,
            }));

        setSelectedEmployees(selected);
        setIsCheckboxDisabled(true);

        if (!isPurchased) {
            const employeeCount = selected.length;
            setVoucherCount(employeeCount);
            calculateAmount(employeeCount);
        }
        if (selected.length === 0) {
            setVoucherCount(0);
            calculateAmount(0);
            setIsCheckboxDisabled(false);
        }
    };

    const handleSelectAllEmployees = (e: any) => {
        setSelectAllChecked(e.target.checked);

        if (e.target.checked) {
            const filteredEmployees = data.filter((employee: any) => {
                if (salaryValidation === 'greater than') {
                    return employee.netSalary > salaryAmt;
                }
                return employee.netSalary < salaryAmt;
            });

            if (filteredEmployees.length === 0) {
                dispatch(
                    showToast({
                        description: `no employees with salary ${salaryValidation} ${salaryAmt}`,
                        variant: 'error',
                    })
                );
                setSelectedEmployees([]);
                setVoucherCount(0);
                setAmount(0);
                return;
            }

            const selected = filteredEmployees.map((employee: any) => ({
                name: employee.fullName,
                employeeId: employee.id,
            }));

            const selectedEmployeeIds = filteredEmployees.map((employee: any) => employee.value);

            setSelectedEmployees(selected);
            setVoucherCount(selected.length);
            calculateAmount(selected.length);
            setIsDropdownDisabled(true);
        } else {
            // Uncheck, to clear selection
            setSelectedEmployees([]);
            setVoucherCount(0);
            calculateAmount(0);
            setIsDropdownDisabled(false);
        }
    };

    return (
        <>
            <Row className="mt-5 w-full" gutter={20}>
                <Col xs={24} md={7}>
                    <Card className="rounded-2xl h-36 xxl:w-80 ">
                        <Flex vertical justify="center" align="center">
                            <Image
                                src={logo}
                                preview={false}
                                style={{ width: '100%', height: '100%', maxHeight: '9rem' }}
                                className="mt-5"
                            />
                            {/* <Typography.Text className="text-lg font-medium mt-4">
                                AED {price}
                            </Typography.Text> */}
                        </Flex>
                    </Card>
                </Col>
                <Col xs={24} md={8} xxl={8}>
                    <Formik
                        initialValues={{ employee: '' }}
                        onSubmit={values => {
                            console.log('Selected Employees:', values);
                        }}
                    >
                        {({ handleSubmit }) => (
                            <Flex vertical className="mt-4 ">
                                <Typography.Text className="text-medium">
                                    Select employee
                                </Typography.Text>
                                <Form onFinish={handleSubmit}>
                                    <SelectInputWithSearch
                                        name="employee"
                                        options={data}
                                        classes="mt-1"
                                        placeholder="Select employees"
                                        // label="Select employees"
                                        mode="multiple"
                                        handleChange={handleEmployeeSelection}
                                        isDisabled={!isPurchased || isDropdownDisabled}
                                    />
                                </Form>
                                <Checkbox
                                    disabled={!isPurchased || isCheckboxDisabled}
                                    className=""
                                    name="selfDeclaration"
                                    onChange={handleSelectAllEmployees}
                                >
                                    <Typography.Text className="text-sm xxl:text-[0.85rem] md:text-[0.76rem] xs:text-[0.57rem]">
                                        Select all employees with salary {salaryValidation} AED{' '}
                                        {salaryAmt}
                                    </Typography.Text>
                                </Checkbox>
                            </Flex>
                        )}
                    </Formik>
                </Col>
                <Col xs={12} md={5} xxl={5}>
                    <Flex vertical className="mt-4 ml-0 xl:ml-10">
                        <Typography.Text className="text-medium line-clamp-1">
                            Number of Vouchers
                        </Typography.Text>
                        {isPurchased && selectedEmployees.length > 0 ? (
                            <Flex vertical className="mt-1">
                                <Input
                                    value={selectedEmployees.length}
                                    readOnly
                                    className="w-24 border rounded-sm"
                                />
                            </Flex>
                        ) : (
                            <Flex vertical className="mt-1">
                                <InputNumber
                                    min={0}
                                    value={voucherCount}
                                    onChange={handleVoucherCountChange}
                                    className="border rounded-sm"
                                    type="number"
                                />
                            </Flex>
                        )}
                    </Flex>
                </Col>
                <Col xs={12} md={3} xxl={3}>
                    <Flex vertical className="mt-4 ml-0 xxl:ml-10">
                        <Typography.Text className="text-medium">Sub total</Typography.Text>
                        <Typography.Text className="mt-3 text-medium">
                            AED {formatNumberWithLocalString(amount)}
                        </Typography.Text>
                    </Flex>
                </Col>
            </Row>
            <Divider className="mt-10" />
        </>
    );
};

export default PurchaseDetails;
