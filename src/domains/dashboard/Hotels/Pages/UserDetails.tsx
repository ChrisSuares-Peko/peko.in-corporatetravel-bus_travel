/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

import { Grid, Typography, Flex } from 'antd';
import { Content } from 'antd/es/layout/layout';

import { useAppSelector } from '@src/hooks/store';

import { useGetEmployee } from '../../Airline/hooks/useGetEmployeeApi';
import UserDetailsWeb from '../Components/GuestDetails/UserDetailsWeb';
import useCancellationPolicyApi from '../hooks/useCancellationPolicyApi';
import DateFields from '../hooks/useDateField';
import { cancelpolicyRoom } from '../types/cancellationTypes';
import { HotelSearch } from '../types/hotelTypes';
// import { ReactSVG } from 'react-svg';
// import closeIcon from '../Assets/icons/Close.svg'

const { useBreakpoint } = Grid;
const UserDetails = () => {
    const screens = useBreakpoint();
    const { showModal, isModalOpen, handleCancel } = DateFields();
    const { keyData, hotelResponse, reservedData } = useAppSelector(state => state.reducer.hotels);
    const [policy, setPolicy] = useState<cancelpolicyRoom[]>([]);
    const response = hotelResponse as HotelSearch;

    const bookArr = reservedData.map(value => ({
        roomKey: value.roomKey,
        roomIndex: value.roomIndex,
    }));

    const { cancellationPolicyDetails } = useCancellationPolicyApi();
    const { data: employeesList, generateEmployeesDropdown } = useGetEmployee();
    const handleClick = () => {
        cancellationPolicyDetails(
            keyData.conversationId,
            keyData.hotelKey,
            keyData.searchKey,
            bookArr,
            response.hotelDetails.commonData.culture
        )
            .then(data => {
                setPolicy(data);
                showModal();
            })
            .catch(error => {
                // console.error('Error fetching cancellation policy:', error);
            });
    };
    return (
        <Content>
            {screens.md ? (
                <>
                    <Flex
                        className="justify-end align-middle mr-10 cursor-pointer"
                        onClick={handleClick}
                    >
                        {/* <ReactSVG className="mr-1 mt-1" src={closeIcon} /> */}
                        <Typography.Text className="text-base hidden">
                            Cancellation Policy
                        </Typography.Text>
                    </Flex>
                    <Typography.Text className="font-medium" style={{ fontSize: '1.3rem' }}>
                        Guest Details
                    </Typography.Text>

                    <UserDetailsWeb
                        employeesList={employeesList}
                        generateEmployeesDropdown={generateEmployeesDropdown}
                    />
                </>
            ) : (
                <>
                    {/* <Navigation /> */}
                    <UserDetailsWeb
                        employeesList={employeesList}
                        generateEmployeesDropdown={generateEmployeesDropdown}
                    />
                </>
            )}
        </Content>
    );
};

export default UserDetails;
