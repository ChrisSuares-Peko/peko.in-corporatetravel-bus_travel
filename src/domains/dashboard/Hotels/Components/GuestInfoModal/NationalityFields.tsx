import React from 'react';

import { Flex, Form, Select, Typography } from 'antd';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@src/hooks/store';

import useSearchCountryApi from '../../hooks/useSearchCountryApi';
import { setTravelerNationality, setcountryOfResidence } from '../../slices/getHotelSlice';

const NationalityFields = () => {
    const { hotelsRequest } = useAppSelector(state => state.reducer.hotels);
    const dispatch = useDispatch();

    const { countryList, countryOptions } = useSearchCountryApi();

    // useEffect(() => {
    //     countryList();
    //     console.log("countries",countryOptions)
    // }, [nationalityText, countryList]);

    // useEffect(() => {
    //     countryList(residenceText);
    // }, [residenceText, countryList]);

    return (
        <Flex vertical className=" w-full md:w-[18rem]">
            <Typography.Text className="text-medium">Traveller Nationality</Typography.Text>
            <Form.Item>
                <Select
                    showSearch
                    placeholder="Select Issued Country"
                    options={countryOptions}
                    defaultValue={hotelsRequest.travelerNationality}
                    onChange={val => {
                        dispatch(setTravelerNationality(val));
                    }}
                    filterOption={(input: string, option) =>
                        (
                            (option &&
                                // @ts-ignore
                                option?.label.toLowerCase()) ??
                            ''
                        ).includes(input.toLowerCase())
                    }
                />
            </Form.Item>
            <Typography.Text className="text-medium">
                Traveller Country of Residence
            </Typography.Text>
            <Form.Item>
                <Select
                    showSearch
                    placeholder="Select Issued Country"
                    options={countryOptions}
                    defaultValue={hotelsRequest.travelerCountryOfResidence}
                    onChange={val => {
                        dispatch(setcountryOfResidence(val));
                    }}
                    filterOption={(input: string, option) =>
                        (
                            (option &&
                                // @ts-ignore
                                option?.label.toLowerCase()) ??
                            ''
                        ).includes(input.toLowerCase())
                    }
                />
            </Form.Item>
        </Flex>
    );
};

export default NationalityFields;
