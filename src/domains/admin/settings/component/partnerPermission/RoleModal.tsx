import React from 'react';

import { Button, Col, Flex, Modal, Row, Skeleton, Typography } from 'antd';
import { Formik } from 'formik';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import SwitchInput from '@components/atomic/inputs/SwitchInput';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import usePartnersForCorporate from '../../hooks/usePartnersForCorporate';
import useUpdateRoles from '../../hooks/useUpdateRoles';
import rolesSchema from '../../schema/roles';
import { Permission, refresh, Role } from '../../types/partnerPermission';

type RoleModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: Role;
};
const RoleModal = ({ open, handleCancel, data, setRefresh }: RoleModalProps & refresh) => {
    const { categoryDatas } = usePartnersForCorporate('');
    const dispatch = useAppDispatch();
    const { permissionData, updateRoleApi, createNewRoles, isloading } = useUpdateRoles();

    const updateMockService = (mockServices: Permission[], existingServices: Permission[]) =>
        mockServices.map(mockServiceCategory => {
            const matchingExistingCategory = existingServices.find(
                existingServiceCategory =>
                    existingServiceCategory.label === mockServiceCategory.label
            );

            if (matchingExistingCategory) {
                // Update hasAccess for the service category
                mockServiceCategory.hasAccess = matchingExistingCategory.hasAccess;

                // Update hasAccess for each service within the category
                if (mockServiceCategory.subServices.length > 0) {
                    mockServiceCategory.subServices = mockServiceCategory.subServices.map(
                        mockServiceItem => {
                            const matchingExistingService =
                                matchingExistingCategory.subServices.find(
                                    existingServiceItem =>
                                        existingServiceItem.label === mockServiceItem.label
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
                registeredBy: data?.registeredBy ? Number(data?.registeredBy) : data?.registeredBy,
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
                        title="Add Partner Permissions"
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
                                {categoryDatas ? (
                                    <SelectInput
                                        name="registeredBy"
                                        options={(categoryDatas || []).map(d => ({
                                            value: d.id,
                                            label: d.name,
                                        }))}
                                        placeholder=""
                                        label="Partner"
                                        isRequired
                                    />
                                ) : (
                                    <Skeleton.Input active block />
                                )}
                                <Typography.Title level={5} className="pb-5">
                                    Permissions
                                </Typography.Title>
                                {values.permissions?.map(
                                    (permission, index) =>
                                        permission.label !== 'Dashboard' && (
                                            <div key={index}>
                                                <SwitchInput
                                                    labelClasses="text-sm text-end font-normal"
                                                    name={`permissions[${index}].hasAccess`}
                                                    label={permission.label}
                                                />
                                                <Row>
                                                    {permission.subServices.map(
                                                        (service, serviceIndex) => (
                                                            <Col
                                                                xs={24}
                                                                sm={12}
                                                                md={6}
                                                                key={serviceIndex}
                                                            >
                                                                <CheckboxInput
                                                                    key={serviceIndex}
                                                                    name={`permissions[${index}].subServices[${serviceIndex}].hasAccess`}
                                                                    children={
                                                                        <Typography.Text>
                                                                            {service.label}
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
