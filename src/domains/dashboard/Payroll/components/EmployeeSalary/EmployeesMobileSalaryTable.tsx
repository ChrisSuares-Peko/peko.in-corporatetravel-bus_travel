import { Col, Row, Pagination, Skeleton, Card, Flex, Empty } from 'antd';
import '../../assets/styles.css';

import { filterState, salarytableType } from '../../types/salaryProfileTypes/employeeSalaryTable';
import EmployeeSalaryCardMobile from '../Employees/EmployeeSalaryCardMobile';

interface tableProps {
    filter: filterState;
    setFilter: (value: any) => void;
    page: number;
    data: salarytableType[];
    isLoading: boolean;
    count: number | undefined;
    handlePageChange: (page: number, pageSize: number) => void;
}

const EmployeesMobileSalaryTable = ({
    filter,
    setFilter,
    page,
    data,
    isLoading,
    count,
    handlePageChange,
}: tableProps) => {
    const renderSkeleton = () => <Skeleton active paragraph={{ rows: 3 }} />;
    let tableContent;
    if (isLoading) {
        tableContent = Array.from({ length: 10 }).map((_, index) => (
            <Card size="small" className="h-40 p-2 mt-4 border-none bg-slate-50" key={index}>
                <Flex className="w-full" gap={5} vertical>
                    {renderSkeleton()}
                </Flex>
            </Card>
        ));
    } else if (data.length === 0) {
        tableContent = <Empty description="No data available" />;
    } else {
        tableContent = data.map((item, index) => (
            <EmployeeSalaryCardMobile key={item.id} {...item} />
        ));
    }
    return (
        <Row className="mt-4" gutter={[0, 20]}>
            <Col span={24}>{tableContent}</Col>
            <Col span={24}>
                {data.length > 0 && (
                    <Pagination
                        current={1}
                        size="default"
                        className="md:text-end pt-7 xs:text-center"
                        total={count}
                        onChange={handlePageChange}
                    />
                )}
            </Col>
        </Row>
    );
};
export default EmployeesMobileSalaryTable;
