import React from 'react';

import { Button, Col, Flex, Modal, Row, Skeleton, Typography } from 'antd';
import { Formik } from 'formik';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import SwitchInput from '@components/atomic/inputs/SwitchInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { refresh } from '../../officeSupplies/types/products';
import useUpdateRoles from '../hooks/useUpdateRoles';
import rolesSchema from '../schema/roles';
import { Permission, Role } from '../types/systemUserTypes';

type RoleModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: Role;
};
const RoleModal = ({ open, handleCancel, data, setRefresh }: RoleModalProps & refresh) => {
    const dispatch = useAppDispatch();
    const { permissionData, updateRoleApi, createNewRoles, isloading } = useUpdateRoles();

    const updateMockService = (mockServices: Permission[], existingServices: Permission[]) =>
        mockServices.map(mockServiceCategory => {
            const matchingExistingCategory = existingServices.find(
                existingServiceCategory =>
                    existingServiceCategory.serviceCategory === mockServiceCategory.serviceCategory
            );

            if (matchingExistingCategory) {
                // Update hasAccess for the service category
                mockServiceCategory.hasAccess = matchingExistingCategory.hasAccess;

                // Update hasAccess for each service within the category
                if (mockServiceCategory.services.length > 0) {
                    mockServiceCategory.services = mockServiceCategory.services.map(
                        mockServiceItem => {
                            const matchingExistingService = matchingExistingCategory.services.find(
                                existingServiceItem =>
                                    existingServiceItem.service === mockServiceItem.service
                            );

                            if (matchingExistingService) {
                                mockServiceItem.hasAccess = matchingExistingService.hasAccess;
                            }

                            return mockServiceItem;
                        }
                    );
                }
            }

            return mockServiceCategory;
        });

    let updatedMockService: Permission[] = [];
    if (data && permissionData) {
        updatedMockService = updateMockService(permissionData, data.permissions);
    } else if (permissionData) {
        updatedMockService = permissionData;
    }

    return (
        <Formik
            initialValues={{
                id: data?.id,
                roleName: data?.roleName,
                permissions: updatedMockService,
            }}
            onSubmit={async values => {
                let res: any;
                if (data) {
                    res = await updateRoleApi({
                        ...values,
                    });
                } else {
                    res = await createNewRoles({
                        ...values,
                    });
                }
                if (res.status === true) {
                    setRefresh(true);
                    if (data)
                        dispatch(
                            showToast({
                                description: res.message,
                                variant: 'success',
                            })
                        );
                    else
                        dispatch(
                            showToast({
                                description: res.message,
                                variant: 'success',
                            })
                        );
                    handleCancel();
                }
                if (res.status === false) {
                    dispatch(
                        showToast({
                            description: `${res.message}`,
                            variant: 'error',
                        })
                    );
                }
            }}
            validationSchema={rolesSchema}
            enableReinitialize
        >
            {({ values, handleSubmit }) => {
                const onClickSubmit: React.MouseEventHandler<HTMLElement> = e => {
                    e.preventDefault();
                    handleSubmit();
                };
                return (
                    <Modal
                        width={1000}
                        centered
                        title="Add Roles & Permissions"
                        footer={[
                            <Flex className="w-full " justify="flex-end" gap={10} key="">
                                <Button
                                    key="submit"
                                    type="primary"
                                    danger
                                    loading={isloading}
                                    onClick={onClickSubmit}
                                    className="px-5"
                                >
                                    Submit
                                </Button>
                                <Button
                                    key="back"
                                    onClick={() => {
                                        handleCancel();
                                    }}
                                    className="px-5"
                                >
                                    Cancel
                                </Button>
                            </Flex>,
                        ]}
                        open={open}
                        onCancel={handleCancel}
                    >
                        {updatedMockService.length > 0 ? (
                            <>
                                <TextInput
                                    isRequired
                                    name="roleName"
                                    label="Role Name"
                                    type="text"
                                    placeholder="Enter role name"
                                    classes="rounded-sm"
                                />
                                <Typography.Title level={5} className="pb-5">
                                    Permissions
                                </Typography.Title>
                                {values.permissions?.map(
                                    (permission, index) =>
                                        permission.serviceCategory !== 'Dashboard' &&
                                        permission.serviceCategory !== 'Profile' && (
                                            <div key={index}>
                                                <SwitchInput
                                                    labelClasses="text-sm text-end font-normal"
                                                    name={`permissions[${index}].hasAccess`}
                                                    label={permission.serviceCategory}
                                                />
                                                <Row>
                                                    {permission.services.map(
                                                        (service, serviceIndex) => (
                                                            <Col
                                                                xs={24}
                                                                sm={12}
                                                                md={6}
                                                                key={serviceIndex}
                                                            >
                                                                <CheckboxInput
                                                                    key={serviceIndex}
                                                                    name={`permissions[${index}].services[${serviceIndex}].hasAccess`}
                                                                    children={
                                                                        <Typography.Text>
                                                                            {service.service}
                                                                        </Typography.Text>
                                                                    }
                                                                    isRequired
                                                                    disabled={
                                                                        !values.permissions[index]
                                                                            .hasAccess
                                                                    } // for disable if parent is not checked
                                                                />
                                                            </Col>
                                                        )
                                                    )}
                                                </Row>
                                            </div>
                                        )
                                )}
                            </>
                        ) : (
                            <Skeleton active paragraph={{ rows: 10 }} />
                        )}
                    </Modal>
                );
            }}
        </Formik>
    );
};

export default RoleModal;
