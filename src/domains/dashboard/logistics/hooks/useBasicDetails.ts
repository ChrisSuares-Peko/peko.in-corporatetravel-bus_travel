import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useSaveAddressApi } from './useSaveAddressApi';
import {
    setDestinationAddress,
    setOriginAddress,
    setShipmentDetails,
} from '../slice/logisticsSlice';
import { AddressFormValues, RecieverFormValues, SenderFormValues } from '../types/address';

export const useBasicDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleSenderAddress, handleRecieverAddress } = useSaveAddressApi();

    const handleFormSubmit = useCallback(
        ({
            senderSaveAddress,
            recieverSaveAddress,
            senderEmail,
            recieverEmail,
            shipmentType,
            senderAddress,
            senderCity,
            senderName,
            senderCountry,
            senderPhone,
            senderZipCode,
            recieverName,
            recieverAddress,
            recieverPhone,
            recieverCity,
            recieverCountry,
            recieverZipCode,
        }: AddressFormValues) => {
            dispatch(
                setOriginAddress({
                    Line1: senderName,
                    Line2: senderAddress,
                    Line3: senderPhone.toString(),
                    City: senderCity,
                    CountryCode: senderCountry,
                    Description: senderEmail,
                    PostCode: senderZipCode,
                })
            );

            dispatch(
                setDestinationAddress({
                    Line1: recieverName,
                    Line2: recieverAddress,
                    Line3: recieverPhone.toString(),
                    City: recieverCity,
                    CountryCode: recieverCountry,
                    Description: recieverEmail,
                    PostCode: recieverZipCode,
                })
            );
            dispatch(setShipmentDetails({ productGroup: shipmentType || 'DOM' }));
            if (senderSaveAddress) {
                handleSenderAddress({
                    Line1: senderName,
                    Line2: senderAddress,
                    Line3: senderPhone,
                    City: senderCity,
                    CountryCode: senderCountry,
                    Description: senderEmail,
                    PostCode: senderZipCode,
                });
            }
            if (recieverSaveAddress) {
                handleRecieverAddress({
                    Line1: recieverName,
                    Line2: recieverAddress,
                    Line3: recieverPhone,
                    City: recieverCity,
                    CountryCode: recieverCountry,
                    Description: recieverEmail,
                    PostCode: recieverZipCode,
                });
            }
            navigate('/logistics/details');
        },
        [dispatch, handleRecieverAddress, handleSenderAddress, navigate]
    );

    const handleFormRecieverSubmit = useCallback(
        (values: RecieverFormValues) =>
            new Promise((resolve, reject) => {
                try {
                    dispatch(
                        setDestinationAddress({
                            Line1: values.recieverName,
                            Line2: values.recieverAddress,
                            Line3: values.recieverPhone.toString(),
                            City: values.recieverCity,
                            CountryCode: values.recieverCountry,
                            Description: values.recieverEmail,
                            PostCode: values.recieverZipCode,
                        })
                    );

                    if (values.recieverSaveAddress) {
                        handleRecieverAddress(
                            {
                                Line1: values.recieverName,
                                Line2: values.recieverAddress,
                                Line3: values.recieverPhone,
                                City: values.recieverCity,
                                CountryCode: values.recieverCountry,
                                Description: values.recieverEmail,
                                PostCode: values.recieverZipCode,
                            },
                            values.addressId
                        )
                            .then(res => {
                                if (res) resolve(true);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        resolve(true);
                    }
                } catch (error) {
                    reject(error);
                }
            }),
        [dispatch, handleRecieverAddress]
    );

    const handleFormSenderSubmit = useCallback(
        (values: SenderFormValues) =>
            new Promise((resolve, reject) => {
                try {
                    dispatch(
                        setOriginAddress({
                            Line1: values.senderName,
                            Line2: values.senderAddress,
                            Line3: values.senderPhone.toString(),
                            City: values.senderCity,
                            CountryCode: values.senderCountry,
                            Description: values.senderEmail,
                            PostCode: values.senderZipCode,
                        })
                    );

                    if (values.senderSaveAddress) {
                        handleSenderAddress(
                            {
                                Line1: values.senderName,
                                Line2: values.senderAddress,
                                Line3: values.senderPhone,
                                City: values.senderCity,
                                CountryCode: values.senderCountry,
                                Description: values.senderEmail,
                                PostCode: values.senderZipCode,
                            },
                            values.addressId
                        )
                            .then(res => {
                                if (res) resolve(true);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        resolve(true);
                    }
                } catch (error) {
                    reject(error);
                }
            }),
        [dispatch, handleSenderAddress]
    );

    return { handleFormSubmit, handleFormSenderSubmit, handleFormRecieverSubmit };
};
