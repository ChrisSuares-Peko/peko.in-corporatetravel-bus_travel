import React, { useState } from 'react';

import { Flex } from 'antd';

import { OrderDatatype } from '@src/domains/admin/officeSupplies/types/types';
// import { columns, data } from '@src/domains/admin/officeSupplies/utils/data';

type OrderHistoryPageProps = {};

const OrderContent: React.FC<OrderHistoryPageProps> = () => {
    const [filteredData, setFilteredData] = useState<OrderDatatype[]>([]);

    // const tableData = filteredData.length > 0 ? filteredData : data;

    return (
        <Flex vertical gap={20} className="pt-10">
            {/* <Table columns={columns} dataSource={tableData} /> */}
            <p>table here</p>
        </Flex>
    );
};

export default OrderContent;
