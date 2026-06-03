import { useEffect, useState } from 'react';

import { Card, Col, Flex, Radio, Row, Slider, Space, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import afternoon from '@src/domains/dashboard/Airline/assets/icons/afternoon.svg';
import morning from '@src/domains/dashboard/Airline/assets/icons/morning.svg';
import night from '@src/domains/dashboard/Airline/assets/icons/night.svg';
import noon from '@src/domains/dashboard/Airline/assets/icons/noon.svg';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { filterTypes, Flight } from '../../types/Flight';
import { retrieveAirlineName } from '../../utils/airlineData';
import { formattedTimeOnly } from '../../utils/dateTime';
import '../../assets/style.css';

type props = {
    flightsData: Flight[] | undefined;
    setFlightData: any;
    data: Flight[];
    filterCount: any;
    filterValue: { type: string; highest: boolean };
    setFilterValue: ({ type, highest }: { type: string; highest: boolean }) => void;
};

const FilterComponent = ({
    flightsData,
    setFlightData,
    data,
    filterCount,
    filterValue,
    setFilterValue,
}: props) => {
    const { highestPrice, lowestPrice } = filterCount;
    const [startValue, setStartValue] = useState<number>(lowestPrice || 0);

    const [endValue, setEndValue] = useState<number>(highestPrice);
    const [airlineRadioValue, setAirlineRadioValue] = useState<string | null>(null);
    const [airlineTimeRadioValue, setAirlineTimeRadioValue] = useState<1 | 2 | 3 | 4 | null>(null);
    const [layoverVal, setLayoverVal] = useState<number | null>(null);

    const handleSort = (dataSource: Flight[]) => {
        const value = filterValue.type;
        if (value === '') return dataSource;
        let sorted: Flight[] = [];

        if (value === 'price') {
            if (filterValue.highest === true) {
                sorted = dataSource.slice().sort((a: any, b: any) => a.price - b.price);
            }
            if (filterValue.highest === false) {
                sorted = dataSource.slice().sort((a: any, b: any) => b.price - a.price);
            }
        }

        if (value === 'arrival') {
            if (filterValue.highest === true) {
                sorted = dataSource.slice().sort((a: any, b: any) => {
                    const timeA = new Date(a.arrive.datetime);
                    const timeB = new Date(b.arrive.datetime);
                    // @ts-ignore
                    return timeA - timeB;
                });
            }
            if (filterValue.highest === false) {
                sorted = dataSource.slice().sort((a: any, b: any) => {
                    const timeA = new Date(a.arrive.datetime);
                    const timeB = new Date(b.arrive.datetime);
                    // @ts-ignore
                    return timeB - timeA;
                });
            }
        }
        if (value === 'duration') {
            if (filterValue.highest === true) {
                sorted = dataSource.slice().sort((a: any, b: any) => {
                    // @ts-ignore
                    const timeA = new Date(a.depart.datetime) - new Date(a.arrive.datetime);
                    // @ts-ignore
                    const timeB = new Date(b.depart.datetime) - new Date(b.arrive.datetime);
                    return timeA - timeB;
                });
            }
            if (filterValue.highest === false) {
                sorted = dataSource.slice().sort((a: any, b: any) => {
                    // @ts-ignore
                    const timeA = new Date(a.depart.datetime) - new Date(a.arrive.datetime);
                    // @ts-ignore
                    const timeB = new Date(b.depart.datetime) - new Date(b.arrive.datetime);
                    return timeB - timeA;
                });
            }
        }

        if (value === 'departure') {
            if (filterValue.highest === true) {
                sorted = dataSource.slice().sort((a: any, b: any) => {
                    const timeA = new Date(a.depart.datetime);
                    const timeB = new Date(b.depart.datetime);
                    // @ts-ignore
                    return timeA - timeB;
                });
            }
            if (filterValue.highest === false) {
                sorted = dataSource.slice().sort((a, b) => {
                    const timeA = new Date(a.depart.datetime);
                    const timeB = new Date(b.depart.datetime);
                    // @ts-ignore
                    return timeB - timeA;
                });
            }
        }
        return sorted;
    };

    const handleFilter = ({
        startPrice,
        endPrice,
        layover,
        airlineTimeCode,
        flightCode,
    }: filterTypes) => {
        let filteredData = data;

        // Price Filter
        filteredData = filteredData.filter(
            (flight: Flight) => flight.price >= startPrice && flight.price <= endPrice
        );

        // Layover Filter if layover is not null
        if (layover !== null) {
            filteredData = filteredData.filter((flight: Flight) => flight.stopCount === layover);
        }

        // Airline filter if flightCode is not null
        if (flightCode !== null) {
            filteredData = filteredData.filter(
                (flight: Flight) => flight.flightCode === flightCode
            );
        }
        // Airline Time Filter
        if (airlineTimeCode !== null) {
            const airlineTime = {
                1: ['00:00', '11:59'],
                2: ['12:00', '14:59'],
                3: ['15:00', '17:59'],
                4: ['18:00', '23:59'],
            };

            const startTime: string = airlineTime[airlineTimeCode][0];
            const endTime: string = airlineTime[airlineTimeCode][1];
            filteredData = filteredData?.filter(
                (flight: Flight) =>
                    formattedTimeOnly(new Date(flight.depart.datetime)) >= startTime &&
                    formattedTimeOnly(new Date(flight.depart.datetime)) <= endTime
            );
        }
        filteredData = handleSort(filteredData);
        setFlightData(filteredData);
    };
    useEffect(() => {
        const filteredDatas = handleSort(flightsData!);
        setFlightData(filteredDatas);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterValue]);

    const onChange = (values: [number, number]) => {
        setStartValue(values[0]);
        setEndValue(values[1]);
    };

    const handleFilterReset = () => {
        const filteredDatas = handleSort(data!);
        setFlightData(filteredDatas);

        onChange([lowestPrice, highestPrice]);
        setAirlineRadioValue(null);
        setAirlineTimeRadioValue(null);
        setLayoverVal(null);
    };

    const airlineCodes = new Set();

    data?.forEach((item: Flight) => {
        airlineCodes.add(item.flightCode);
    });
    const airlineOptions = Array.from(airlineCodes);

    return (
        <Card
            className="py-4 border-gray-100 rounded-xl"
            bodyStyle={{ padding: 20 }}
            style={{ minHeight: '100%' }}
        >
            <Flex justify="space-between">
                <Typography.Text className="text-lg font-bold leading-6">Filter</Typography.Text>
                <Typography.Link
                    onClick={() => handleFilterReset()}
                    type="danger"
                    className="font-normal leading-6 cursor-pointer text-primaryOrange"
                >
                    Reset
                </Typography.Link>
            </Flex>
            <Flex vertical className="gap-3 my-5">
                <Typography.Text className="text-base font-medium leading-6">Price</Typography.Text>
                <Slider
                    range
                    className="text-red-500"
                    onChangeComplete={e => {
                        handleFilter({
                            startPrice: e[0],
                            endPrice: e[1],
                            layover: layoverVal,
                            airlineTimeCode: airlineTimeRadioValue,
                            flightCode: airlineRadioValue,
                        });
                    }}
                    onChange={values => {
                        onChange(values as [number, number]);
                    }}
                    value={[startValue, endValue]}
                    min={lowestPrice}
                    max={highestPrice}
                />
                <Row className="flex gap-2 xl:flex-row md:flex-col">
                    <Col sm={24} className="flex-col flex-1 p-2 border border-gray-100 rounded-md">
                        <Flex vertical>
                            <Typography.Text className="text-sm font-normal leading-6 text-neutral-400">
                                Min price
                            </Typography.Text>
                            <Typography.Text className="text-xs font-medium">{`AED ${formatNumberWithLocalString(startValue, 0, 0)}`}</Typography.Text>
                        </Flex>

                        {/* <InputNumber
                            min={lowestPrice}
                            max={highestPrice}
                            type="number"
                            variant="borderless"
                            className="w-full p-0 m-0 text-sm font-medium"
                            value={lowestPrice}
                            onChange={value => setStartValue(value !== null ? value : 1)}
                            size="small"
                            controls={false}
                            prefix={
                                <Typography.Text className="p-0 m-0 text-sm">AED</Typography.Text>
                            }
                        /> */}
                    </Col>
                    <Col sm={24} className="flex-col flex-1 p-2 border border-gray-100 rounded-md">
                        <Flex vertical>
                            <Typography.Text className="text-sm font-normal leading-6 text-neutral-400">
                                Max price
                            </Typography.Text>
                            <Typography.Text className="text-xs font-medium">{`AED ${formatNumberWithLocalString(endValue ?? 10, 0, 0)}`}</Typography.Text>
                        </Flex>

                        {/* <InputNumber
                            min={0}
                            max={highestPrice}
                            type="number"
                            variant="borderless"
                            className="w-full p-0 m-0 text-sm font-medium "
                            value={endValue ?? 10}
                            onChange={value => {
                                setEndValue(value !== null ? value : 10);
                            }}
                            prefix={
                                <Typography.Text className="p-0 m-0 text-sm">AED</Typography.Text>
                            }
                            controls={false}
                            size="small"
                        /> */}
                    </Col>
                </Row>
            </Flex>
            <Typography.Text className="text-base font-medium leading-6">
                Departure time
            </Typography.Text>

            <Radio.Group
                className="w-full"
                value={airlineTimeRadioValue}
                onChange={e => {
                    setAirlineTimeRadioValue(e.target.value);
                    handleFilter({
                        airlineTimeCode: e.target.value,
                        startPrice: startValue,
                        endPrice: endValue,
                        flightCode: airlineRadioValue,
                        layover: layoverVal,
                    });
                }}
            >
                <Row justify="space-between" gutter={[10, 10]} className="my-5">
                    <Col xs={12} sm={24} md={24} lg={24} xl={12}>
                        <Radio.Button
                            value={1}
                            className="w-full h-auto m-1"
                            style={{
                                borderRadius: '.30rem',
                                borderColor:
                                    airlineTimeRadioValue?.toString() === '1' ? 'red' : '#f5f5f5',
                            }}
                        >
                            <Flex vertical align="center" className="py-2">
                                <ReactSVG src={morning} className="mr-1" />
                                <Typography.Text className="text-xs font-normal leading-6 line-clamp-1">
                                    Morning
                                </Typography.Text>
                                <Flex justify="center" wrap="wrap">
                                    <Typography.Text className="text-xs font-normal leading-6 line-clamp-1">
                                        00:00 -
                                    </Typography.Text>
                                    <Typography.Text className="text-xs font-normal leading-6 line-clamp-1">
                                        11:59
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        </Radio.Button>
                    </Col>
                    <Col xs={12} sm={24} md={24} lg={24} xl={12}>
                        <Radio.Button
                            value={2}
                            className="w-full h-auto m-1"
                            style={{
                                borderRadius: '.30rem',
                                borderColor:
                                    airlineTimeRadioValue?.toString() === '2' ? 'red' : '#f5f5f5',
                            }}
                        >
                            <Flex vertical align="center" className="py-2">
                                <ReactSVG src={noon} />
                                <Typography.Paragraph className="text-xs font-normal leading-6 line-clamp-1">
                                    Noon
                                </Typography.Paragraph>
                                <Flex justify="center" wrap="wrap">
                                    <Typography.Text className="text-xs font-normal leading-6 line-clamp-1">
                                        12:00 -
                                    </Typography.Text>
                                    <Typography.Text className="text-xs font-normal leading-6 line-clamp-1">
                                        14:59
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        </Radio.Button>
                    </Col>
                    <Col xs={12} sm={24} md={24} lg={24} xl={12}>
                        <Radio.Button
                            value={3}
                            className="w-full h-auto m-1"
                            style={{
                                borderRadius: '.30rem',
                                borderColor:
                                    airlineTimeRadioValue?.toString() === '3' ? 'red' : '#f5f5f5',
                            }}
                        >
                            <Flex vertical align="center" className="py-2">
                                <ReactSVG src={afternoon} />
                                <Typography.Paragraph className="text-xs font-normal leading-6 line-clamp-1">
                                    Afternoon
                                </Typography.Paragraph>
                                <Flex justify="center" wrap="wrap">
                                    <Typography.Text className="text-xs font-normal leading-6 line-clamp-1">
                                        15:00 -
                                    </Typography.Text>
                                    <Typography.Text className="text-xs font-normal leading-6 line-clamp-1">
                                        17:59
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        </Radio.Button>
                    </Col>
                    <Col xs={12} sm={24} md={24} lg={24} xl={12}>
                        <Radio.Button
                            value={4}
                            className="w-full h-auto m-1"
                            style={{
                                borderRadius: '.30rem',
                                borderColor:
                                    airlineTimeRadioValue?.toString() === '4' ? 'red' : '#f5f5f5',
                            }}
                        >
                            <Flex vertical align="center" className="py-2">
                                <ReactSVG src={night} />
                                <Typography.Paragraph className="text-xs font-normal leading-6 line-clamp-1">
                                    Night
                                </Typography.Paragraph>
                                <Flex justify="center" wrap="wrap">
                                    <Typography.Text className="text-xs font-normal leading-6 line-clamp-1">
                                        18:00 -
                                    </Typography.Text>
                                    <Typography.Text className="text-xs font-normal leading-6 line-clamp-1">
                                        23:59
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        </Radio.Button>
                    </Col>
                </Row>
            </Radio.Group>

            <Typography.Text className="text-base font-medium leading-6">
                Number of layovers
            </Typography.Text>
            <br />
            <Radio.Group
                className="mt-2"
                defaultValue={null}
                value={layoverVal}
                onChange={e => {
                    setLayoverVal(e.target.value);
                    handleFilter({
                        startPrice: startValue,
                        endPrice: endValue,
                        airlineTimeCode: airlineTimeRadioValue,
                        flightCode: airlineRadioValue,
                        layover: e.target.value,
                    });
                }}
            >
                <Space direction="vertical">
                    <Radio value={null}>All</Radio>
                    <Radio value={0}>Non stop</Radio>
                    <Radio value={1}>1 Stop</Radio>
                    <Radio value={2}>2 Stop</Radio>
                </Space>
            </Radio.Group>
            <Row className="mt-8">
                <Typography.Text className="text-base font-medium leading-6">
                    Airlines
                </Typography.Text>
            </Row>

            <Radio.Group
                defaultValue={null}
                value={airlineRadioValue}
                className="mt-2"
                onChange={e => {
                    setAirlineRadioValue(e.target.value);
                    handleFilter({
                        startPrice: startValue,
                        endPrice: endValue,
                        layover: layoverVal,
                        airlineTimeCode: airlineTimeRadioValue,
                        flightCode: e.target.value,
                    });
                }}
            >
                <Space direction="vertical">
                    <Radio value={null}>All Airlines</Radio>
                    {airlineOptions.sort().map((item, i) => (
                        <Radio value={item} key={i}>
                            {retrieveAirlineName(item as string)}
                        </Radio>
                    ))}
                </Space>
            </Radio.Group>
        </Card>
    );
};

export default FilterComponent;
