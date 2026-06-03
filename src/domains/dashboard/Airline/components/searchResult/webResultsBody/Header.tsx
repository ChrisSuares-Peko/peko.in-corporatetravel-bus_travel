import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';

interface HeadPartProps {
    filterValue: { type: string; highest: boolean };
    setFilterValue: ({ type, highest }: { type: string; highest: boolean }) => void;
}

export default function Header({ filterValue, setFilterValue }: HeadPartProps) {
    // const handleSort = (value: string) => {
    //     if (value === '') return;

    //     if (value === 'price') {
    //         if (filterValue.highest === true) {
    //             const sortedData = dataSource.slice().sort((a: any, b: any) => a.price - b.price);
    //             setFlightData(sortedData);
    //         }
    //         if (filterValue.highest === false) {
    //             const sortedData = dataSource.slice().sort((a: any, b: any) => b.price - a.price);
    //             setFlightData(sortedData);
    //         }
    //     }

    //     if (value === 'arrival') {
    //         let sortedData;
    //         if (filterValue.highest === true) {
    //             sortedData = dataSource.slice().sort((a: any, b: any) => {
    //                 const timeA = new Date(a.arrive.datetime);
    //                 const timeB = new Date(b.arrive.datetime);
    //                 // @ts-ignore
    //                 return timeA - timeB;
    //             });
    //         }
    //         if (filterValue.highest === false) {
    //             sortedData = dataSource.slice().sort((a: any, b: any) => {
    //                 const timeA = new Date(a.arrive.datetime);
    //                 const timeB = new Date(b.arrive.datetime);
    //                 // @ts-ignore
    //                 return timeB - timeA;
    //             });
    //         }
    //         setFlightData(sortedData);
    //     }
    //     if (value === 'duration') {
    //         let sortedData;
    //         if (filterValue.highest === true) {
    //             sortedData = dataSource.slice().sort((a: any, b: any) => {
    //                 // @ts-ignore
    //                 const timeA = new Date(a.depart.datetime) - new Date(a.arrive.datetime);
    //                 // @ts-ignore
    //                 const timeB = new Date(b.depart.datetime) - new Date(b.arrive.datetime);
    //                 return timeA - timeB;
    //             });
    //         }
    //         if (filterValue.highest === false) {
    //             sortedData = dataSource.slice().sort((a: any, b: any) => {
    //                 // @ts-ignore
    //                 const timeA = new Date(a.depart.datetime) - new Date(a.arrive.datetime);
    //                 // @ts-ignore
    //                 const timeB = new Date(b.depart.datetime) - new Date(b.arrive.datetime);
    //                 return timeB - timeA;
    //             });
    //         }
    //         setFlightData(sortedData);
    //     }

    //     if (value === 'departure') {
    //         let sortedData;
    //         if (filterValue.highest === true) {
    //             sortedData = dataSource.slice().sort((a: any, b: any) => {
    //                 const timeA = new Date(a.depart.datetime);
    //                 const timeB = new Date(b.depart.datetime);
    //                 // @ts-ignore
    //                 return timeA - timeB;
    //             });
    //         }
    //         if (filterValue.highest === false) {
    //             sortedData = dataSource.slice().sort((a, b) => {
    //                 const timeA = new Date(a.depart.datetime);
    //                 const timeB = new Date(b.depart.datetime);
    //                 // @ts-ignore
    //                 return timeB - timeA;
    //             });
    //         }
    //         setFlightData(sortedData);
    //     }
    // };

    const updateFilterValue = (type: string) => {
        setFilterValue({
            type,
            highest: !filterValue.highest,
        });
    };

    return (
        <Flex
            className="h-10 mt-5 w-full bg-[#F4F6FA] px-[7%] rounded-sm"
            justify="space-between"
            align="center"
        >
            <Typography.Text className=" text-xs">Airlines</Typography.Text>
            <Typography.Text
                onClick={() => updateFilterValue('departure')}
                className={`text-xs ${filterValue.type === 'departure' && 'font-semibold'} cursor-pointer hover:text-iconRed`}
            >
                Departure
                {filterValue.highest === true && filterValue.type === 'departure' && (
                    <ArrowDownOutlined className="ms-2" />
                )}
                {filterValue.highest === false && filterValue.type === 'departure' && (
                    <ArrowUpOutlined className="ms-2" />
                )}
            </Typography.Text>
            <Typography.Text
                // onClick={() =>
                //     updateFilterValue('duration')
                // }
                className={`text-xs ${filterValue.type === 'duration' && 'font-semibold'}`}
            >
                Duration
                {filterValue.highest === true && filterValue.type === 'duration' && (
                    <ArrowDownOutlined className="ms-2" />
                )}
                {filterValue.highest === false && filterValue.type === 'duration' && (
                    <ArrowUpOutlined className="ms-2" />
                )}
            </Typography.Text>
            <Typography.Text
                onClick={() => updateFilterValue('arrival')}
                className={`text-xs ${filterValue.type === 'arrival' && 'font-semibold'} cursor-pointer hover:text-iconRed`}
            >
                Arrival
                {filterValue.highest === true && filterValue.type === 'arrival' && (
                    <ArrowDownOutlined className="ms-2" />
                )}
                {filterValue.highest === false && filterValue.type === 'arrival' && (
                    <ArrowUpOutlined className="ms-2" />
                )}
            </Typography.Text>
            <Typography.Text
                onClick={() => updateFilterValue('price')}
                className={`text-xs ${filterValue.type === 'price' && 'font-semibold'} cursor-pointer hover:text-iconRed me-2`}
            >
                Price
                {filterValue.highest === true && filterValue.type === 'price' && (
                    <ArrowUpOutlined className="ms-2" />
                )}
                {filterValue.highest === false && filterValue.type === 'price' && (
                    <ArrowDownOutlined className="ms-2" />
                )}
            </Typography.Text>
        </Flex>
    );
}
