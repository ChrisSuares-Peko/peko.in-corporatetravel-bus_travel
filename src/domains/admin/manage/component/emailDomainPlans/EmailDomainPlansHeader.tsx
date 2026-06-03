import React, { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Row } from 'antd';

import { DownloadType } from '@customtypes/general';

import EmailDomainPlansModal from './EmailDomainPlansModal';

interface modalProps {
    searchText: string;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    handleSearch: any;
    downloadReport: (type: string) => void;
}
const EmailDomainPlansHeader = ({
    searchText,
    handleSearch,
    setRefresh,
    downloadReport,
}: modalProps) => {
    const [openModal, setOpenModal] = useState(false);
    return (
        <Row justify="space-between" className="w-full gap-5">
            <Flex className="flex justify-start gap-3 ">
                <Flex className="flex justify-start gap-3">
                    <Button danger onClick={() => downloadReport(DownloadType.Excel)}>
                        Excel
                    </Button>
                    <Button danger onClick={() => downloadReport(DownloadType.Csv)}>
                        CSV
                    </Button>
                    <Button danger onClick={() => downloadReport(DownloadType.Pdf)}>
                        PDF
                    </Button>
                </Flex>
            </Flex>
            <Flex className="flex-col justify-end w-full gap-3 px-0 md:flex-row md:w-auto">
                <Button
                    type="primary"
                    className="w-full sm:w-fit"
                    danger
                    onClick={() => setOpenModal(true)}
                >
                    Add Email/Domain Plan
                </Button>

                <Input
                    value={searchText}
                    placeholder="Search "
                    suffix={<SearchOutlined />}
                    onChange={handleSearch}
                    allowClear
                    type="text"
                    variant="outlined"
                    maxLength={100}
                />
            </Flex>
            {openModal && (
                <EmailDomainPlansModal
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                    setRefresh={setRefresh}
                />
            )}
        </Row>
    );
};

export default EmailDomainPlansHeader;
