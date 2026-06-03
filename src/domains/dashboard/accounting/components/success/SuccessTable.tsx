import { Table } from 'antd';

const columns = [
    {
        title: 'LEFT',
        dataIndex: 'left',
        key: 'left',
    },
    {
        title: 'RIGHT',
        dataIndex: 'right',
        key: 'right',
    },
];

const SuccessData = [
    {
        left: 'Date:',
        right: '21-07-23 14:47:33',
    },
    {
        left: 'VAT TRN (Tax Registration Number):',
        right: '230721131720793050',
    },
    {
        left: 'Registered Business Name:',
        right: 'Savoll LLC',
    },
];

type Props = {};

const SuccessTable = (props: Props) => (
    <Table
        className="xs:w-full md:w-1/2"
        pagination={false}
        bordered
        size="small"
        dataSource={SuccessData}
        columns={columns}
        showHeader={false}
        style={{ borderRadius: 0 }}
    />
);

export default SuccessTable;
