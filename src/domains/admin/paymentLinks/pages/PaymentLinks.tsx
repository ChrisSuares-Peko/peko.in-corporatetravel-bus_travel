import { useState } from 'react';

import { Flex, Pagination } from 'antd';

import GenericTable from '@components/atomic/GenericTable';

import PaymentLinksHeader from '../components/Header';
import { ResendLinkModal } from '../components/ResendLinkModal';
import useFilter from '../hooks/useFilters';
import useGetPaymentLinks from '../hooks/useGetPaymentLinks';
import PaymentLinkColumns from '../utils/PaymentLinkColumns';

const PaymentLinks = () => {
    const initialValues = {
        searchText: '',
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC' as 'ASC' | 'DESC',
        sortField: '',
    };
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLinkDetails, setSelectedLinkDetails] = useState(false);
    const [filters, setFilters] = useState(initialValues);
    const [tooltipText, setTooltipText] = useState('Copy to clipboard');

    const { handlePageChange, handleTableChange } = useFilter({ setFilters });

    const { isLoading, paymentLinksList, totalCount } = useGetPaymentLinks(filters);

    const columns = PaymentLinkColumns({
        tooltipText,
        setTooltipText,
        setSelectedLinkDetails,
        setModalVisible,
    });
    return (
        <Flex vertical gap={20}>
            <PaymentLinksHeader />
            <GenericTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={paymentLinksList}
                pagination={false}
                loading={isLoading}
                onChange={handleTableChange}
            />
            <Pagination
                current={filters.page}
                size="default"
                className="text-end pt-7"
                onChange={handlePageChange}
                total={totalCount as number}
                pageSize={initialValues.itemsPerPage}
                showSizeChanger={false}
            />
            <ResendLinkModal
                open={modalVisible}
                handleCancel={() => setModalVisible(false)}
                selectedLinkDetails={selectedLinkDetails}
            />
        </Flex>
    );
};

export default PaymentLinks;
