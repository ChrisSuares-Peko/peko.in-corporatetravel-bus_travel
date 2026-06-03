import React from 'react';

import { Avatar, Badge, Flex, Space, TableProps, Typography } from 'antd';
import { BadgeProps } from 'antd/lib';
import { ReactSVG } from 'react-svg';

import ViewMore from '@components/molecular/view-more/ViewMore';

import DeleteIcon from '../assets/trash-bin.svg';
import { SubCorporate } from '../types/userManagement';

function getInitials(name: string): string {
    const words = name.split(' ');
    const initials = words
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 3)
        .toUpperCase();
    return initials;
}

export const SubCorporateColumns = (
    setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedRow: React.Dispatch<React.SetStateAction<SubCorporate | undefined>>,
    setOpenConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>,
    resendInvite: (userId: number) => void,
    setActionType: React.Dispatch<
        React.SetStateAction<'DELETE' | 'ACTIVE' | 'INACTIVE' | undefined>
    >,
    setOpenServiceView: React.Dispatch<React.SetStateAction<boolean>>
): TableProps<SubCorporate>['columns'] => [
    {
        title: 'Name',
        dataIndex: 'name',
        width: '22%',
        render: (text: string, record) => (
            <Flex gap={10}>
                <Flex align="center" style={{ cursor: 'pointer' }}>
                    <Avatar style={{ backgroundColor: '#fde3cf', color: 'red' }}>
                        {getInitials(text)}
                    </Avatar>
                </Flex>
                <Flex vertical justify="center">
                    <Typography.Text className="   font-normal">{text}</Typography.Text>
                    <Typography.Text className="  font-normal">{record.email}</Typography.Text>
                </Flex>
            </Flex>
        ),
    },
    {
        title: 'Username',
        dataIndex: 'credential',
        width: '18%',
        render: (credential: { username: string }) => (
            <Typography.Text className="  text-gray-900 font-normal">
                {credential.username}
            </Typography.Text>
        ),
    },
    {
        title: 'Role',
        dataIndex: 'role',
        width: '13%',

        render: (text: string) => (
            <Typography.Text className="  text-gray-900 font-normal">{text}</Typography.Text>
        ),
    },
    {
        title: 'Mobile',
        dataIndex: 'mobileNo',
        width: '12%',
        render: (mobileNo: string) => (
            <Typography.Text className="  text-gray-900 font-normal">
                {mobileNo ? `+971 ${mobileNo}` : 'N/A'}
            </Typography.Text>
        ),
    },
    {
        title: 'Services',
        dataIndex: 'services',
        width: '5%',
        align: 'center',
        render: (services: string, record) => (
            <Typography.Text
                className="text-bgOrange font-medium cursor-pointer"
                onClick={() => {
                    setSelectedRow(record);
                    setOpenServiceView(true);
                }}
            >
                {services.length}
            </Typography.Text>
        ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        width: '10%',
        render: (userStatus: string) => {
            const { className, status, text, style } = getBadgeProps(userStatus);
            return <Badge status={status} text={text} className={className} style={style} />;
        },
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: '4%',
        render: (text, record) => {
            const list = [];
            if (record.status === 'PENDING') {
                list.push({
                    label: 'Resend Invitation',
                    action: () => resendInvite(record.id),
                });
            } else if (record.status === 'ACTIVE') {
                list.push({
                    label: 'Edit Access',
                    id: record.id,
                    action: () => {
                        setSelectedRow(record);
                        setOpenEditModal(true);
                    },
                });

                list.push({
                    label: 'Block User',
                    id: record.id,
                    action: () => {
                        setSelectedRow(record);
                        setActionType('INACTIVE');
                        setOpenConfirmationModal(true);
                    },
                });
            } else if (record.status === 'INACTIVE') {
                list.push({
                    label: 'Unblock User',
                    id: record.id,
                    action: () => {
                        setSelectedRow(record);
                        setActionType('ACTIVE');
                        setOpenConfirmationModal(true);
                    },
                });
            }
            return (
                <Space size="large">
                    <ReactSVG
                        data-testid="trash-bin"
                        src={DeleteIcon}
                        onClick={() => {
                            setSelectedRow(record);
                            setActionType('DELETE');
                            setOpenConfirmationModal(true);
                        }}
                        className="cursor-pointer"
                    />
                    <ViewMore list={list} />
                </Space>
            );
        },
    },
];

const getBadgeProps = (status: string): BadgeProps => {
    switch (status) {
        case 'PENDING':
            return {
                status: 'warning',
                text: 'Pending',
                className: 'rounded-2xl',
                style: {
                    color: '#FAAD14',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '12px',
                    padding: '0 4px',
                },
            };
        case 'ACTIVE':
            return {
                status: 'success',
                text: 'Active',
                className: 'px-2 rounded-2xl',
                style: { backgroundColor: '#ECFDF3', color: '#027A48' },
            };
        case 'INACTIVE':
            return {
                status: 'error',
                text: 'Inactive',
                className: 'px-2 rounded-2xl',
                style: { backgroundColor: '#FFF2EA', color: '#F15046' },
            };
        default:
            return {
                status: 'default',
                text: status,
                className: 'px-2 rounded-2xl',
            };
    }
};
