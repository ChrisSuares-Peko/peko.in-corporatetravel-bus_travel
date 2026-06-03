import { Col, Row, Table, Pagination } from 'antd';
import '../../assets/styles.css';

import { filterState, salarytableType } from '../../types/salaryProfileTypes/employeeSalaryTable';
import { employeeSalaryColumns } from '../../utils/salaryTable/data';

interface tableProps {
    filter: filterState;
    setFilter: (value: any) => void;
    page: number;
    data: salarytableType[];
    isLoading: boolean;
    count: number | undefined;
    handlePageChange: (page: number, pageSize: number) => void;
}

const EmployeesSalaryTable = ({
    filter,
    setFilter,
    page,
    data,
    isLoading,
    count,
    handlePageChange,
}: tableProps) => (
    <Row className="mt-4" gutter={[0, 20]}>
        <Col span={24}>
            <Table
                rowKey={record => record.id}
                columns={employeeSalaryColumns(filter)}
                scroll={{ x: 992 }}
                dataSource={data}
                loading={isLoading}
                pagination={false}
            />
        </Col>
        <Col span={24}>
            {count! > 0 && (
                <Pagination
                    current={page}
                    size="default"
                    className="text-end pt-7"
                    total={count}
                    onChange={handlePageChange}
                />
            )}
        </Col>
    </Row>
);

export default EmployeesSalaryTable;
