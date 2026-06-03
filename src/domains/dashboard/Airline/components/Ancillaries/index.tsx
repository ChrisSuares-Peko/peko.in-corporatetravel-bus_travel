import { Row, Collapse, Col } from 'antd';

import { useAppSelector } from '@src/hooks/store';

import PassengerAddons from './PassengerAddons';
import { passengerTypesPtc } from '../../enum/ancillaries';
import { AncillarySearch } from '../../types/ancilaryType';

const Ancillaries = () => {
    const ancillariesData: AncillarySearch = useAppSelector(
        state => state.reducer.airline.ancillariesSearch
    ) as AncillarySearch;

    const { passengers } = ancillariesData.data[0];

    return (
        <Row className="mt-10 xs:w-full md:w-auto">
            <Collapse
                size="large"
                expandIconPosition="end"
                className="w-full border-none"
                style={{ padding: 0 }}
                defaultActiveKey={['1']}
            >
                <Collapse.Panel
                    key="1"
                    style={{ borderBottom: 0 }}
                    header={<h1 className="font-bold p-2 m-0">Add On</h1>}
                >
                    <Row className="relative flex gap-96">
                        <Col span={24}>
                            {passengers &&
                                passengers.map(
                                    (
                                        item,
                                        index // anc not req for infants in lcc
                                    ) =>
                                        item &&
                                        item.ptc !== passengerTypesPtc.INFANT && (
                                            <PassengerAddons
                                                item={item}
                                                index={index}
                                                key={index}
                                            />
                                        )
                                )}
                        </Col>
                    </Row>
                </Collapse.Panel>
            </Collapse>
        </Row>
    );
};

export default Ancillaries;
