import React from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FieldArray } from 'formik';
import { ReactSVG } from 'react-svg';

import add from '@domains/dashboard/Invoice/assets/add.svg';

import EditGuidelineForm from './EditGuidelineForm';

type WishListProps = {
    values: any;
    data: any;
    isLoading: boolean;
};
const EditGuideline = ({ values, data, isLoading }: WishListProps) => (
    <Flex vertical>
        <Flex justify="space-between" align="center" className="w-full">
            <Typography.Text className="text-xl font-medium">Invoice Guidelines</Typography.Text>
        </Flex>
        <Content className="bg-gray-50  py-4 md:mt-7 xs:hidden xxl:block ">
            <Row>
                <Col span={11}>
                    <Typography.Text className="text-sm font-medium ml-4">Days</Typography.Text>
                </Col>
                <Col span={6}>
                    <Typography.Text className="text-sm font-medium">Action</Typography.Text>
                </Col>
                <Col span={4}>
                    <Typography.Text className="text-sm font-medium ml-4">Template</Typography.Text>
                </Col>
                <Col span={3}>
                    <Typography.Text className="text-sm font-medium">Status</Typography.Text>
                </Col>
            </Row>
            {/* <Flex justify="space-between" className="px-5">
               
                <Typography.Text className="text-xs font-medium">Action</Typography.Text>
                <Typography.Text className="text-xs font-medium">Template</Typography.Text>
                <Typography.Text className="text-xs font-medium">Status</Typography.Text>
               
            </Flex> */}
        </Content>
        <Flex vertical className="w-full mt-5">
            {/* {index > 0 && (
                            <DeleteOutlined
                                onClick={() => remove(index)}
                                className="text-xl text-bgOrange2 pl-3"
                            />
                        )} */}

            <Flex vertical className="w-full mt-5">
                <FieldArray name="data">
                    {({ push, remove }) => (
                        <>
                            {values.map((_: any, index: number) => (
                                <Flex key={index} align="center">
                                    {/* <AddGuideline index={index} templateData={data} /> */}
                                    <EditGuidelineForm index={index} templateData={data} />
                                    {index > 0 && (
                                        <DeleteOutlined
                                            onClick={() => remove(index)}
                                            className="text-xl text-bgOrange2 pl-3"
                                        />
                                    )}
                                    {index === 0 && (
                                        <DeleteOutlined
                                            onClick={() => remove(index)}
                                            className="text-xl text-bgOrange2 pl-3"
                                            style={{ visibility: 'hidden' }}
                                        />
                                    )}
                                </Flex>
                            ))}
                        </>
                    )}
                </FieldArray>
            </Flex>
            <FieldArray name="data">
                {({ push }) =>
                    values.length < 10 && (
                        <Flex className="cursor-pointer  justify-end" gap={6}>
                            <Flex gap={3} justify="space-between w-full">
                                <ReactSVG className="mt-4" src={add} />

                                <Typography.Text
                                    className="font-medium text-bgOrange2 mt-3 "
                                    onClick={() =>
                                        push({
                                            days: '',
                                            sms: false,
                                            email: false,
                                            notification: false,
                                            actionDate: '',
                                            templet: {
                                                email: {
                                                    emailId: '',
                                                    subject: '',
                                                    body: '',
                                                    index: '',
                                                },
                                                sms: {
                                                    mobileNo: '',
                                                    body: '',
                                                },
                                            },

                                            invoiceId: values[0].invoiceId,
                                        })
                                    }
                                >
                                    Add another condition
                                </Typography.Text>
                            </Flex>
                        </Flex>
                    )
                }
            </FieldArray>
        </Flex>
        <Button htmlType="submit" type="primary" className="w-fit " danger loading={isLoading}>
            <Typography.Text className="text-white font-medium text-xs">
                Update Guideline
            </Typography.Text>
        </Button>
    </Flex>
);

export default EditGuideline;
