import React from 'react';

import { Button, Drawer, Flex, Form } from 'antd';
import { Typography } from 'antd/lib';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';

import SelectInput from '@components/atomic/inputs/SelectInput';

import useUpdateKybStatus from '../../hooks/collectorKyb/useUpdateKybStatus';
import { Records } from '../../types/collectorKyb';
import { kybStatusDropdown } from '../../utils/collectorKyb';

interface modalProps {
    open: boolean;
    handleCancel: () => void;
    data?: Records;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
const CollectorKybModal = ({ open, handleCancel, data, setRefresh }: modalProps) => {
    const { statusUpdate, isLoading } = useUpdateKybStatus(setRefresh);
    return (
        <Drawer title="Collector KYB Details" width={550} onClose={handleCancel} open={open}>
            <Flex vertical>
                <Typography.Text className="text-base font-bold mt-2">KYB Details:</Typography.Text>
                <Flex justify="space-between" className="mt-5">
                    <Typography.Text className="text-base">Corporate Name</Typography.Text>
                    <Typography.Text className="text-base">
                        {data?.corporateUser.name}
                    </Typography.Text>
                </Flex>
                <Flex justify="space-between" className="mt-5">
                    <Typography.Text className="text-base">Corporate ID</Typography.Text>
                    <Typography.Text className="text-base">
                        {data?.corporateUser.credential.username}
                    </Typography.Text>
                </Flex>

                <Flex justify="space-between" className="mt-5">
                    <Typography.Text className="text-base">Mobile Number</Typography.Text>
                    <Typography.Text className="text-base">
                        {data?.corporateUser.mobileNo}
                    </Typography.Text>
                </Flex>
                <Flex justify="space-between" className="mt-5">
                    <Typography.Text className="text-base">Email ID</Typography.Text>
                    <Typography.Text className="text-base">{data?.supplierEmail}</Typography.Text>
                </Flex>

                <Flex justify="space-between" className="mt-5">
                    <Typography.Text className="text-base">Supplier Code</Typography.Text>
                    <Typography.Text className="text-base">{data?.supplierCode}</Typography.Text>
                </Flex>
                <Flex justify="space-between" className="mt-5">
                    <Typography.Text className="text-base">KYB Status</Typography.Text>
                    <Typography.Text className="text-base">
                        {data?.kybStatus
                            .toLowerCase()
                            .replace(/^\w/, (c: string) => c.toUpperCase())}
                    </Typography.Text>
                </Flex>
                <Flex justify="space-between" className="mt-5">
                    <Typography.Text className="text-base">Reject Reason</Typography.Text>
                    <Typography.Text className="text-base">
                        {data?.rejectReason || 'N/A'}
                    </Typography.Text>
                </Flex>
                {data?.documents &&
                    Object.entries(data?.documents).map(([key, value]) => (
                        <Flex justify="space-between" className="mt-5" key={key}>
                            <Typography.Text className="text-base">
                                {key.replace(/_/g, ' ')} {/* Replace underscores with spaces */}
                            </Typography.Text>
                            <Link
                                to={value}
                                style={{ color: '#FF3A3A' }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View
                            </Link>
                        </Flex>
                    ))}

                <Formik
                    initialValues={{ kybStatus: data?.kybStatus || '' }}
                    onSubmit={async values =>
                        statusUpdate({
                            corporateUserId: data?.corporateUserId!,
                            status: values.kybStatus,
                        })
                    }
                >
                    {({ handleSubmit }) => (
                        <Form onFinish={handleSubmit} layout="vertical">
                            <Flex justify="space-between" className="mt-5">
                                <Typography.Text className="text-base">Status</Typography.Text>
                                <div className="w-52">
                                    <SelectInput
                                        options={kybStatusDropdown}
                                        name="kybStatus"
                                        placeholder="Select KYB Status"
                                    />
                                </div>
                            </Flex>

                            <Flex justify="end">
                                <Button onClick={handleCancel}>Cancel</Button>
                                <Button
                                    type="primary"
                                    danger
                                    htmlType="submit"
                                    loading={isLoading}
                                    className="ml-5"
                                >
                                    Submit
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Flex>
        </Drawer>
    );
};

export default CollectorKybModal;
