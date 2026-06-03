import { Col, Row, Flex, Skeleton } from 'antd';

import Header from './Header';
import SearchResultBody from './SearchResultBody';
import { Flight } from '../../../types/Flight';

interface WebResultsBodyProps {
    isLoading: boolean;
    filterComponent: React.ReactNode;
    flightData: Flight[];
    filterValue: { type: string; highest: boolean };
    setFilterValue: ({ type, highest }: { type: string; highest: boolean }) => void;
}

export default function WebResultsBody({
    isLoading,
    filterComponent,
    flightData,
    filterValue,
    setFilterValue,
}: WebResultsBodyProps) {
    return (
        <Row gutter={[20, 20]}>
            <Col span={5}>
                {isLoading ? <Skeleton active paragraph={{ rows: 20 }} /> : filterComponent}
            </Col>
            <Col span={18}>
                {isLoading ? (
                    Array.from({ length: 5 }, (_, index) => (
                        <Skeleton.Input
                            key={index}
                            style={{ height: '120px' }}
                            className="w-full mt-4"
                            active={isLoading}
                            size="large"
                            block
                        />
                    ))
                ) : (
                    <Flex vertical style={{ minHeight: '100%' }}>
                        <Header filterValue={filterValue} setFilterValue={setFilterValue} />
                        <SearchResultBody flights={flightData} />
                    </Flex>
                )}
            </Col>
        </Row>
    );
}
