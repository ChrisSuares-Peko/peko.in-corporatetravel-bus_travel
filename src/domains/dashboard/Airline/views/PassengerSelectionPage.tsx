import React, { useRef, useState } from 'react';

import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Flex, Row, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import dropdown from '@src/domains/dashboard/Airline/assets/icons/dropdown.svg';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { accessKeys } from '@utils/accessKeys';

import PassengerModal from '../components/adaptive/PassengerModal';
import PriceFooter from '../components/adaptive/PriceFooter';
import PassengerSelectionForm from '../components/PassengerSelectionForm';
import useAncillariesSearch from '../hooks/useAncillariesSearch';
import useGetCountries from '../hooks/useGetCountries';
import { useGetEmployee } from '../hooks/useGetEmployeeApi';
import useProvBooking from '../hooks/useProvisonalBooking';
import {
    addCustomerInfo,
    addPassengersData,
    setAncillariesConversationId,
    setAncillariesOfferId,
    setProvBookingSuccess,
} from '../slices/airlineSlice';
import { ProvBookingSuccess } from '../types/provBooking';

type Props = {
    handlePrevClick: () => void;
    handleClick: () => void;
    fareRules: any;
    handleSubmission: (values: any, bookingDetails: any) => void;
};
const { Text, Paragraph } = Typography;

const PassengerSelectionPage = ({
    handlePrevClick,
    handleClick,
    fareRules,
    handleSubmission,
}: Props) => {
    const airlineForm = useAppSelector(state => state.reducer.airline.formData);
    const [openPassengerModal, setOpenPassengerModal] = useState(false);
    const [openPassengerEditModal, setOpenPassengerEditModal] = useState(false);
    const [adultpassengerCount, setAdultPassengerCount] = useState(0);
    const [childPassengerCount, setChildPassengerCount] = useState(0);
    const [infantPassengerCount, setInfantPassengerCount] = useState(0);
    const [passengerType, setPassengerType] = useState<'adult' | 'child' | 'infant'>();
    const [cardTitle, setCardTitle] = useState<string>('');
    const [initialValues, setInitialValues] = useState<any>();
    const formRef = useRef<any>(null);

    const dispatch = useAppDispatch();

    const { handleProvBooking, isLoading } = useProvBooking();
    const { countryData, phoneCodes } = useGetCountries();
    const { handleAncillariesSearch } = useAncillariesSearch();
    const { data: employees, generateEmployeesDropdown } = useGetEmployee();

    const selectedAirlineData = useAppSelector(state => state.reducer.airline.selectedAirline);
    const bookingData = useAppSelector(state => state.reducer.airline.bookingData);

    const addPassengerHandler = () => {
        console.log({
            passengerData: airlineForm.passengerData,
            adultpassengerCount,
            childPassengerCount,
            infantPassengerCount,
        });
        if (airlineForm.passengerData.adultCount > adultpassengerCount) {
            setPassengerType('adult');
            setCardTitle(`Adult Passenger ${adultpassengerCount + 1}`);
        } else if (airlineForm.passengerData.childCount > childPassengerCount) {
            setPassengerType('child');
            setCardTitle(`Child Passenger ${childPassengerCount + 1}`);
        } else if (airlineForm.passengerData.infantCount > infantPassengerCount) {
            setPassengerType('infant');
            setCardTitle(`Infant Passenger ${infantPassengerCount + 1}`);
        } else {
            return;
        }
        setOpenPassengerModal(true);
    };

    const editPassengerHandler = (item: any) => {
        const { ptc } = item;
        console.log({ item });
        let passengerType2: 'adult' | 'child' | 'infant';
        if (ptc === 'ADT') {
            passengerType2 = 'adult';
        } else if (ptc === 'CHD') {
            passengerType2 = 'child';
        } else if (ptc === 'INF') {
            passengerType2 = 'infant';
        } else {
            return;
        }

        const initialValuesData = {
            employee: item.passengerInfo.employee,
            gender: item.passengerInfo.gender,
            nameTitle: item.passengerInfo.nameTitle,
            firstName: item.passengerInfo.givenName,
            lastName: item.passengerInfo.surname,
            dob: item.passengerInfo.birthDate,
            passportNo: item.identityDocuments[0].idDocumentNumber,
            issuedCountry: item.identityDocuments[0].issuingCountryCode,
            residenceCountryCode: item.identityDocuments[0].residenceCountryCode,
            expiryDate: item.identityDocuments[0].expiryDate,
            passengerType: passengerType2,
            email: item.contact.contactsProvided[0].emailAddress[0],
            phone: item.contact.contactsProvided[0].phone[0].phoneNumber,
            phoneCode: item.contact.contactsProvided[0].phone[0].areaCode,
            passengerId: item.passengerId,
            ptc: item.ptc,
        };
        console.log({ item, initialValuesData });
        setPassengerType(passengerType2);
        setCardTitle(item.passengerId);

        setInitialValues(initialValuesData);
        setOpenPassengerEditModal(true);
    };

    const handleFormSubmit = (values: any) => {
        console.log({ submitted: values, passengers: bookingData.passengers });
        const existingPassengerIndex = bookingData.passengers.findIndex(
            (passenger: { passengerId: any }) => passenger.passengerId === values.passengerId
        );
        console.log({ existingPassengerIndex });

        const today = new Date();
        const dob = new Date(values.dob);
        const age = today.getFullYear() - dob.getFullYear();
        let ptc;

        if (passengerType === 'adult' && existingPassengerIndex === -1) {
            ptc = 'ADT';
            setAdultPassengerCount(adultpassengerCount + 1);
        } else if (passengerType === 'child' && existingPassengerIndex === -1) {
            ptc = 'CHD';
            setChildPassengerCount(childPassengerCount + 1);
        } else if (passengerType === 'infant' && existingPassengerIndex === -1) {
            ptc = 'INF';
            setInfantPassengerCount(infantPassengerCount + 1);
        }

        const passengerData = {
            passengerId: cardTitle,
            passengerKey: Math.random().toString(36).substring(2),
            ptc,
            age,
            passengerInfo: {
                surname: values?.lastName || '',
                gender: values.gender,
                birthDate: values.employee !== '' ? values?.dob?.split('T')[0] : values.dob,
                nameTitle: values.nameTitle,
                middleName: '',
                givenName: values?.firstName || '',
            },
            identityDocuments: [
                {
                    idDocumentNumber: values.passportNo,
                    idType: 'PT',
                    issuingCountryCode: values.issuedCountry,
                    residenceCountryCode: values.residenceCountryCode,
                    expiryDate:
                        values.employee !== ''
                            ? values?.expiryDate?.split('T')[0]
                            : values.expiryDate,
                },
            ],
            contact: {
                contactsProvided: [
                    {
                        phone: [
                            {
                                label: 'Origin',
                                areaCode: values.phoneCode,
                                phoneNumber: values.phone,
                            },
                        ],
                        emailAddress: [values.email],
                    },
                ],
            },
        };
        console.log({ passengerData });

        setInitialValues(null);
        setOpenPassengerModal(false);
        setOpenPassengerEditModal(false);
        dispatch(addPassengersData(passengerData));
    };

    const handleContactSubmit = (values: any) => {
        dispatch(addCustomerInfo(values));
    };

    const handleBooking = (provBookingData: ProvBookingSuccess) => {
        const requestBody = {
            offerId: provBookingData.data[0].offerId,
            conversationId: provBookingData.conversationId,
            fare: provBookingData.data[0].fare.totalFare,
            totalAncillaryPrice: 0,
            ancillaryDetails: [],
            passengers: bookingData.passengers,
            isLcc: provBookingData.data[0].detail.lcc,
            customerInfo: {
                emailAddress: bookingData.customerInfo.emailAddress,
            },
            amount: provBookingData.data[0].fare.totalFare,
            currencyCode: 'AED',
            accessKey: accessKeys.airline,
            currentUrl: window.location.href,
        };
        const bookingDetails = {
            amount: provBookingData.data[0].fare.totalFare,
            tax: provBookingData.data[0].fare.totalTax,
        };

        handleSubmission(requestBody, bookingDetails);
    };

    const handleProvisionalBooking = async () => {
        await formRef.current.handleSubmit();

        const passengerCount =
            airlineForm.passengerData.adultCount +
            airlineForm.passengerData.childCount +
            airlineForm.passengerData.infantCount;

        if (
            bookingData.passengers.length === passengerCount &&
            bookingData.customerInfo.emailAddress !== ''
        ) {
            const res: ProvBookingSuccess = (await handleProvBooking()) as ProvBookingSuccess;

            if (res.meta.success) {
                setProvBookingSuccess(res);

                if (selectedAirlineData.lcc) {
                    const postData = {
                        offerId: res.data[0].offerId,
                        conversationId: res.conversationId,
                        supplierLocator: res.data[0].detail.supplierLocator || null,
                        isLcc: true,
                    };
                    await handleAncillariesSearch(postData);
                    dispatch(setAncillariesConversationId(res.conversationId));
                    dispatch(setAncillariesOfferId(res.data[0].offerId));
                    handleClick();
                } else {
                    handleBooking(res);
                }
            }
        } else {
            dispatch(
                showToast({
                    description: 'Please add passengers and fill in all available fields.',
                    variant: 'error',
                })
            );
        }
    };

    return (
        <Row>
            <Col span={4} flex="none">
                <Flex onClick={handlePrevClick}>
                    <ReactSVG src={dropdown} width={20} className="m-auto rotate-90" />
                </Flex>
            </Col>
            <Col span={20} className="flex justify-center">
                <Typography.Text className="text-lg font-semibold">
                    {adultpassengerCount + childPassengerCount + infantPassengerCount > 1
                        ? `Passengers Details`
                        : `Passenger Details`}
                </Typography.Text>
            </Col>
            <Divider className="border-t-2" />
            <Col span={24} className="flex justify-between">
                {/* <Typography.Text className="text-gray-500">Select 1 Adult</Typography.Text> */}
                <Typography.Text className="text-gray-500">
                    {adultpassengerCount + childPassengerCount + infantPassengerCount}/
                    {airlineForm.passengerData.adultCount +
                        airlineForm.passengerData.childCount +
                        airlineForm.passengerData.infantCount}{' '}
                    Selected
                </Typography.Text>
            </Col>
            <Divider className="border-t-2" />
            {bookingData.passengers.map(
                (item: {
                    passengerInfo: {
                        givenName:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                    };
                }) => (
                    <Col span={24} className="flex justify-between">
                        <Text className="text-lg text-gray-500">
                            {item.passengerInfo.givenName}
                        </Text>
                        <EditOutlined
                            className="text-2xl"
                            onClick={() => editPassengerHandler(item)}
                        />
                    </Col>
                )
            )}
            {adultpassengerCount + childPassengerCount + infantPassengerCount !==
                airlineForm.passengerData.adultCount +
                    airlineForm.passengerData.childCount +
                    airlineForm.passengerData.infantCount && (
                <Col span={24} className="mt-5">
                    <Button
                        className="p-0"
                        type="link"
                        onClick={() => addPassengerHandler()}
                        danger
                        icon={<PlusOutlined />}
                    >
                        Add New Passenger
                    </Button>
                </Col>
            )}

            <Divider className="border-t-2" />
            <Col span={24} className="mt-5">
                <Paragraph className="text-lg font-bold">Contact Information</Paragraph>
                <Paragraph className="text-sm text-gray-500">
                    Your booking details will be sent here
                </Paragraph>
            </Col>
            <Col className="mt-4" span={24}>
                <PassengerSelectionForm
                    handleContactSubmit={handleContactSubmit}
                    formRef={formRef}
                    phoneCodes={phoneCodes}
                />
            </Col>
            {openPassengerModal && (
                <PassengerModal
                    open={openPassengerModal}
                    handleSubmit={handleFormSubmit}
                    cardTitle={cardTitle}
                    passengerType={passengerType}
                    handleCancel={() => setOpenPassengerModal(false)}
                    fareRules={fareRules}
                    countryData={countryData}
                    phoneCodes={phoneCodes}
                    data={employees}
                    generateEmployeesDropdown={generateEmployeesDropdown}
                />
            )}
            {openPassengerEditModal && (
                <PassengerModal
                    open={openPassengerEditModal}
                    handleSubmit={handleFormSubmit}
                    initialValue={initialValues || null}
                    cardTitle={cardTitle}
                    passengerType={passengerType}
                    handleCancel={() => setOpenPassengerEditModal(false)}
                    fareRules={fareRules}
                    countryData={countryData}
                    phoneCodes={phoneCodes}
                    data={employees}
                    generateEmployeesDropdown={generateEmployeesDropdown}
                />
            )}
            <PriceFooter
                isLoading={isLoading}
                price={selectedAirlineData.price ?? 0}
                handleClick={() => {
                    handleProvisionalBooking();
                }}
            />
        </Row>
    );
};

export default PassengerSelectionPage;
