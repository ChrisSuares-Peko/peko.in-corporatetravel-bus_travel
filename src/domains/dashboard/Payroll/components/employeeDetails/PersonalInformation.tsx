import { useState } from 'react';

import { Flex, Typography, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { ReactSVG } from 'react-svg';

import PersonalInformationsDrawer from './forms/PersonalInformationsDrawer';
import CalenderSVG from '../../assets/icons/employeeInformtion/Calander.svg';
import GlobeSVG from '../../assets/icons/employeeInformtion/Globe.svg';
import HatSVG from '../../assets/icons/employeeInformtion/Hat.svg';
import HomeSVG from '../../assets/icons/employeeInformtion/Home.svg';
// import PhoneSVG from '../../assets/icons/employeeInformtion/Phone.svg';
import Experience from '../../assets/icons/employeeInformtion/job-expereince.svg';
import SuitcaseSVG from '../../assets/icons/employeeInformtion/Suitcase.svg';
import UserArrowSVG from '../../assets/icons/employeeInformtion/UserArrow.svg';
import UserSVG from '../../assets/icons/employeeInformtion/UserIcon.svg';
import emailSVG from '../../assets/icons/leaveSummary/letteremail.svg';
import { UpdateEmployee } from '../../types/types';
import { retrieveEmployeeData } from '../../utils/RetrieveEmployeeData';

type Props = {
    employeeData: UpdateEmployee;
    setRefState: (num: number) => void;
    isLoading: boolean;
};

const PersonalInformation = ({ employeeData, setRefState, isLoading }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    function formatGender(gender: string): string {
        if (!gender) return ''; // Handle null, undefined, or empty string
        return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
    }
    function formatExperience(years: string | undefined, months: string | undefined): string {
        if (!years && !months) {
            return 'N/A';
        }
        if (years && !months) {
            return `${years} `;
        }
        if (!years && months) {
            return `${months} `;
        }
        if (years !== undefined && Number(years) > 10) {
            return '10+';
        }

        return `${years}  and ${months} `;
    }

    const employeeInfo = [
        {
            icon: CalenderSVG,
            title: retrieveEmployeeData(
                dayjs(new Date(employeeData?.dateOfBirth)).format('MMM. DD, YYYY')
            ),
            subTitle: 'Date of Birth',
        },
        {
            icon: UserSVG,
            title: retrieveEmployeeData(formatGender(employeeData?.gender)),
            subTitle: 'Gender',
        },
        {
            icon: HomeSVG,
            title: retrieveEmployeeData(employeeData?.mobileNo),
            subTitle: 'Mobile Number',
        },
        {
            icon: emailSVG,
            title: retrieveEmployeeData(employeeData?.personalEmail),
            subTitle: 'Official Email',
        },
        {
            icon: emailSVG,
            title: retrieveEmployeeData(employeeData?.email),
            subTitle: 'Personal Email',
        },
        {
            icon: GlobeSVG,
            title: retrieveEmployeeData(employeeData?.nationality),
            subTitle: 'Nationality',
        },
        {
            icon: HatSVG,
            title: retrieveEmployeeData(employeeData?.qualification),
            subTitle: 'Qualification',
        },
        {
            icon: Experience,
            title: retrieveEmployeeData(
                formatExperience(employeeData?.experienceInYear, employeeData?.experienceInMonth)
            ),
            subTitle: 'Experience',
        },
        {
            icon: SuitcaseSVG,
            title: retrieveEmployeeData(employeeData?.maritialStatus),
            subTitle: 'Marital Status',
        },
        {
            icon: UserArrowSVG,
            title: retrieveEmployeeData(employeeData?.emergencyNo),
            subTitle: 'Emergency Contact',
        },
        {
            icon: UserArrowSVG,
            title: retrieveEmployeeData(employeeData?.emergencyContactName),
            subTitle: 'Emergency Contact Name',
        },
        {
            icon: UserArrowSVG,
            title: retrieveEmployeeData(employeeData?.emergencyContactRelation),
            subTitle: 'Emergency Contact Relation',
        },
    ];

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <Flex vertical>
            <Flex className="mt-6">
                {isLoading ? (
                    <Skeleton.Input style={{ width: 200 }} active size="small" />
                ) : (
                    <>
                        <Typography.Text className="text-textGrey">
                            Personal Information
                        </Typography.Text>
                        <Typography.Text
                            className="text-iconRed ms-6 cursor-pointer"
                            onClick={() => toggleModal()}
                        >
                            Edit
                        </Typography.Text>
                    </>
                )}
            </Flex>
            <Flex className="mt-10 w-4/5" gap={25} vertical>
                {employeeInfo.map((item, i) => (
                    <Flex gap={25} justify="space-between" key={i}>
                        <Flex
                            className="bg-red-50 p-2 h-10 w-10 rounded-md"
                            justify="center"
                            align="center"
                        >
                            <ReactSVG
                                src={item.icon}
                                beforeInjection={svg => {
                                    svg.setAttribute('style', 'width: 19px; height: 19px;');
                                }}
                            />
                        </Flex>
                        <Flex
                            vertical
                            className="h-full w-full"
                            justify="space-between"
                            align="start"
                        >
                            {isLoading ? (
                                <Skeleton
                                    active
                                    title={false}
                                    paragraph={{ rows: 2, width: ['100%', '50%'] }}
                                />
                            ) : (
                                <>
                                    <Typography.Text className="text-base text-textBlack">
                                        {item.title}
                                    </Typography.Text>

                                    <Typography.Text className="text-textGrey text-sm">
                                        {item.subTitle}
                                    </Typography.Text>
                                </>
                            )}
                        </Flex>
                    </Flex>
                ))}
            </Flex>
            <PersonalInformationsDrawer
                handleCancel={toggleModal}
                open={isModalOpen}
                setRefState={setRefState}
                initialValues={{
                    id: employeeData?._id,
                    firstName: employeeData?.fullName,
                    gender: employeeData?.gender,
                    dateOfBirth: employeeData?.dateOfBirth,
                    phoneNumber: employeeData?.mobileNo,
                    personalEmail: employeeData?.personalEmail,
                    email: employeeData?.email,
                    emergencyNo: employeeData?.emergencyNo,
                    emergencyContactName: employeeData?.emergencyContactName,
                    emergencyContactRelation: employeeData?.emergencyContactRelation,
                    qualification: employeeData?.qualification,
                    experienceInYear: employeeData?.experienceInYear,
                    experienceInMonth: employeeData?.experienceInMonth,
                    maritialStatus: employeeData?.maritialStatus,
                    nationality: employeeData?.nationality,
                }}
            />
        </Flex>
    );
};

export default PersonalInformation;
