import { useState } from 'react';

import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Table, TableProps, Pagination, Flex, Button, Row, Col, Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { ReactSVG } from 'react-svg';

import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import MoreServicesIcon from '@domains/dashboard/Payroll/assets/icons/viewMore.svg';
import { showToast } from '@src/slices/apiSlice';

import CustomModal from './CustomModal';
import { useDeleteAnnouncementApi } from '../../hooks/announcementHooks/useDeleteAnnouncementApi';
import { AnnouncementDataType } from '../../types/types';
import { monthsArray, yearsArray } from '../../utils/salaryTable/data';

type Props = {
    announcementData: any;

    count?: number;
    isLoading: boolean;
    setRefresh: (value: any) => void;
    handleSearch: (value: any) => void;
    handleChangeYear: (value: any) => void;
    handleChangeMonth: (value: any) => void;
    handlePageChange: (page: any, pageSize: any) => void;
};

const AnnouncementTab = ({
    announcementData,
    handleChangeMonth,
    handleChangeYear,
    handleSearch,
    handlePageChange,
    count,
    isLoading,
    setRefresh,
}: Props) => {
    const initialMonth = new Date().getMonth() + 1;
    const initialYear = new Date().getFullYear();

    const dispatch = useDispatch();
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState('');

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const columns = (
        handleDelete: (id: string) => void
    ): TableProps<AnnouncementDataType>['columns'] => [
        {
            title: <Flex>Date</Flex>,
            dataIndex: 'date',
            key: 'date',
            width: '25%',
            render: (data: any) => <Flex>{data}</Flex>,
        },
        {
            title: <Flex>Subject</Flex>,
            dataIndex: 'subject',
            key: 'subject',
            width: '25%',
            render: (data: any) => <Flex>{data}</Flex>,
        },
        {
            title: <Flex>Details</Flex>,
            dataIndex: 'details',
            key: 'details',
            width: '25%',
            render: (data: any) => <Flex className="line-clamp-1">{data}</Flex>,
        },

        {
            title: <Flex justify="center">Status</Flex>,
            dataIndex: 'status',
            key: 'status',
            width: '35%',
            render: (data: any) => <Flex justify="center">{data}</Flex>,
        },
        {
            title: <Flex>Action</Flex>,
            dataIndex: 'action',
            key: 'action',
            width: '15%',
            render: (text, record) => (
                <Flex align="center">
                    <Button
                        type="link"
                        onClick={() => {
                            toggleModal();
                            setSelectedAnnouncement(record);
                        }}
                    >
                        <ReactSVG
                            src={MoreServicesIcon}
                            className="svg-primary-stroke cursor-pointer"
                        />
                    </Button>
                    <Button className="border-0" onClick={() => handleDelete(record.id)}>
                        <DeleteOutlined className="text-[#E30000]" style={{ fontSize: '20px' }} />
                    </Button>
                </Flex>
            ),
        },
    ];
    const { deleteAnnouncementData } = useDeleteAnnouncementApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });
    const HandleDelete = (id: string) => {
        setOpenConfirmationModal(true);
        setIdToDelete(id);
    };
    const handleDeleteAnnouncement = async () => {
        const res = await deleteAnnouncementData(idToDelete);
        if (res) {
            setRefresh(true);
            dispatch(
                showToast({
                    description: 'Announcement deleted successfully',
                    variant: 'success',
                })
            );
        }
        if (!res) {
            dispatch(
                showToast({
                    description: 'Something went wrong, please try again later',
                    variant: 'error',
                })
            );
        }
    };
    return (
        <Row>
            <Col span={24}>
                <Flex justify="space-between">
                    <Col md={18} className="mb-6">
                        <Input
                            placeholder="Search by name,leave type"
                            suffix={<SearchOutlined />}
                            allowClear
                            onChange={handleSearch}
                        />
                    </Col>
                    <Col>
                        <Select
                            options={monthsArray}
                            className="w-32"
                            onChange={handleChangeMonth}
                            defaultValue={initialMonth.toString()}
                        />
                    </Col>
                    <Col>
                        <Select
                            options={yearsArray}
                            className="w-36"
                            onChange={handleChangeYear}
                            defaultValue={initialYear}
                        />
                    </Col>
                </Flex>
                <Table
                    scroll={{ x: 992 }}
                    className="mt-4"
                    columns={columns(HandleDelete)}
                    dataSource={announcementData}
                    loading={isLoading}
                    size="small"
                    pagination={false}
                />
                <Flex className="w-full" justify="end" align="end">
                    <Pagination
                        defaultPageSize={10}
                        defaultCurrent={1}
                        total={count}
                        className="mt-4"
                        onChange={(pageCount, pageSize) => {
                            // setCurrentPage(pageCount);
                            handlePageChange(pageCount, pageSize);
                        }}
                    />
                </Flex>
                <CustomModal
                    isModalOpen={isModalOpen}
                    modalData={selectedAnnouncement}
                    toggleModal={toggleModal}
                />
                <ConfirmationModal
                    isOpen={openConfirmationModal}
                    handleCancel={() => setOpenConfirmationModal(false)}
                    title="Are you sure you want to delete this announcement?"
                    handleSubmit={handleDeleteAnnouncement}
                    isLoading={false}
                />
            </Col>
        </Row>
    );
};

export default AnnouncementTab;
