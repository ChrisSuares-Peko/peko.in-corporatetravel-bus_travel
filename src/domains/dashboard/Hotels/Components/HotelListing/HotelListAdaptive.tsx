/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';

import { Flex, Modal, Select, Skeleton, Typography, Pagination } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { ReactSVG } from 'react-svg';

import filterIcon from '@domains/dashboard/Hotels/Assets/icons/filter.svg';
import { useAppSelector } from '@src/hooks/store';

import BookedSm from './BookedSm';
import Filterhotel from './Filterhotel';
import { Hotels } from '../../types/types';
import Empty from '../Empty';

interface ModalProps {
    openWindow: () => void;
    isLoading: boolean;
    data: Hotels[];
    conversationId: string;
    searchKey: string;
}

const HotelListAdaptive = ({
    openWindow,
    isLoading,
    data,
    conversationId,
    searchKey,
}: ModalProps) => {
    let numberOfDays: number;

    const { hotelArr } = useAppSelector(state => state.reducer.hotels);
    const [isModalOpen, setIsmodalOpen] = useState<boolean>(false);
    const [ranges, setRange] = useState<[number, number]>([100, 10000]);
    const [progress, setProgress] = useState(0);
    const [priceRange, setPriceRange] = useState<[number, number]>([100, 10000]);
    const [filteredData, setFilteredData] = useState<Hotels[]>(data);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    if (hotelArr?.data?.length > 0) {
        isLoading = false;
        conversationId = hotelArr.conversationId;
        searchKey = hotelArr?.commonData?.searchKey;
    }

    const dataSource = data && data.length > 0 ? data : hotelArr?.data;

    if (data && data.length > 0) {
        const dateArrayLength = dataSource[0].rooms[0].roomRate.rates.length;
        const startDate = new Date(dataSource[0].rooms[0].roomRate.rates[0].from);
        const endDate = new Date(dataSource[0].rooms[0].roomRate.rates[dateArrayLength - 1].to);
        const timeDifference = endDate.getTime() - startDate.getTime();
        numberOfDays = Math.ceil(timeDifference / (24 * 60 * 60 * 1000));
    }
    // Calculate current page data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData?.slice(startIndex, endIndex);

    const toggleModal = () => setIsmodalOpen(!isModalOpen);

    useEffect(() => {
        const filterResults = (range: [number, number]) => {
            const filtered = dataSource?.filter((item: any) => {
                const totalPrice = item.rooms.reduce(
                    (sum: any, room: any) => sum + room.roomRate.netAmount,
                    0
                );
                return totalPrice >= range[0] && totalPrice <= range[1];
            });
            setFilteredData(filtered);
        };

        filterResults(priceRange);
    }, [priceRange, dataSource]);

    useEffect(() => {
        const filtered = dataSource?.filter((item: any) =>
            item.propertyInfo.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, dataSource]);

    useEffect(() => {
        if (sortOption === 'priceLowToHigh') {
            setFilteredData(prevData =>
                prevData.slice().sort((a, b) => {
                    const priceA = a.rooms.reduce((sum, room) => sum + room.roomRate.netAmount, 0);
                    const priceB = b.rooms.reduce((sum, room) => sum + room.roomRate.netAmount, 0);
                    return priceA - priceB;
                })
            );
        } else if (sortOption === 'priceHighToLow') {
            setFilteredData(prevData =>
                prevData.slice().sort((a, b) => {
                    const priceA = a.rooms.reduce((sum, room) => sum + room.roomRate.netAmount, 0);
                    const priceB = b.rooms.reduce((sum, room) => sum + room.roomRate.netAmount, 0);
                    return priceB - priceA;
                })
            );
        } else if (sortOption === 'popular') {
            setFilteredData(prevData =>
                prevData
                    .slice()
                    .sort(
                        (a, b) =>
                            Number(b.propertyInfo.starRating) - Number(a.propertyInfo.starRating)
                    )
            );
        }
        setCurrentPage(1); // Reset to first page on sort change
    }, [sortOption, paginatedData]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            {/* Modal and other UI code */}
            <Modal
                title="Filter Hotels"
                visible={isModalOpen}
                onCancel={toggleModal}
                footer={null}
                width={300}
            >
                <Filterhotel
                    range={ranges}
                    setRange={setRange}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setPriceRange={setPriceRange}
                />
            </Modal>

            <Flex justify="space-between" className="items-center p-4">
                <Typography.Text className="font-bold">Hotels</Typography.Text>
                <ReactSVG src={filterIcon} onClick={toggleModal} />
            </Flex>

            <Content className="p-4">
                <Select
                    defaultValue="Popular"
                    className="w-full h-8 custom_sort"
                    options={[
                        { label: 'Price Low to High', value: 'priceLowToHigh' },
                        { label: 'Price High to Low ', value: 'priceHighToLow' },
                        { label: 'Popular', value: 'popular' },
                    ]}
                    onChange={value => setSortOption(value)} // Update sort option
                />
            </Content>

            <div className="relative h-screen overflow-y-auto">
                {isLoading ? (
                    <Skeleton active className="p-4" />
                ) : paginatedData?.length === 0 || !dataSource ? (
                    <Empty />
                ) : (
                    paginatedData?.map((item, index) => (
                        <BookedSm
                            key={index}
                            hotelKey={item.hotelKey}
                            image={item.propertyInfo.imageUrl}
                            name={item.propertyInfo.hotelName}
                            facilities={item.propertyInfo.address}
                            reviews={item.propertyInfo.starRating}
                            cancellationPolicy={item.rooms[0].ratePlan.cancelPolicyIndicator}
                            searchKey={searchKey}
                            conversationId={conversationId}
                            price={
                                item.rooms.reduce((sum, room) => sum + room.roomRate.netAmount, 0) /
                                numberOfDays
                            }
                        />
                    ))
                )}
            </div>

            <Flex justify="center" className="my-4">
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={filteredData?.length}
                    onChange={handlePageChange}
                />
            </Flex>
        </div>
    );
};

export default HotelListAdaptive;
