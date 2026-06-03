import { useState } from 'react';

import { Avatar, Flex, Form, Typography, theme } from 'antd';
import { useFormikContext, FormikProps } from 'formik';

import 'react-image-crop/dist/ReactCrop.css';
import UAEFlag from '@assets/svg/uaeflag.svg';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';

import ImageCropModal from '../../../../../components/molecular/modals/ImageCropModal'; // Adjust the import path accordingly
import CustomImageUploadInput from '../CustomImageUploadInput';

interface BasicInfoFormProps {
    countriesList: any[];
    companySizesList: any[];
}

interface FormValues {
    profileImageBase: any;
}

const BasicInfoForm = ({ countriesList, companySizesList }: BasicInfoFormProps) => {
    const { data } = useAppSelector(state => state.reducer.basicInfo);
    const {
        token: { colorPrimary },
    } = theme.useToken();

    const { values, setFieldValue }: FormikProps<FormValues> = useFormikContext();
    const [file, setFile] = useState<any>(
        values.profileImageBase !== '' ? values.profileImageBase : null
    );
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImage = (base64: string, image: string) => {
        setFile(image);
        setFieldValue('profileImageBase', base64);
    };

    const clearFilePreview = () => {
        setFile(null);
    };

    const [isCropModalVisible, setIsCropModalVisible] = useState(false);

    const showCropModal = () => setIsCropModalVisible(true);
    const hideCropModal = () => setIsCropModalVisible(false);

    return (
        <>
            <Form layout="vertical">
                <Flex align="center" gap={30}>
                    <Avatar
                        src={file}
                        alt="Profile"
                        shape="square"
                        size={64}
                        draggable={false}
                        className="bg-[#ffeeee]"
                    >
                        {!file && (
                            <Typography.Text
                                style={{ color: colorPrimary }}
                                className="text-4xl font-bold"
                            >
                                {data?.name?.slice(0, 1)}
                            </Typography.Text>
                        )}
                    </Avatar>
                    <Flex align="center" className="mt-5">
                        <CustomImageUploadInput
                            label=""
                            name="profileImageBase"
                            setFile={setSelectedImage}
                            format="profileImageFormat"
                            isImageCrop
                            handleChange={showCropModal}
                            clearFilePreview={clearFilePreview} // Pass the new prop
                        />
                    </Flex>
                </Flex>
                <Flex vertical className="w-full mt-6">
                    <TextInput
                        name="name"
                        label="Company Name"
                        type="text"
                        placeholder="Enter Company Name"
                        classes="rounded-sm"
                        tooltipText="Please get in touch with our customer service representative to update your company name."
                        showToolTip
                        isDisabled
                    />
                    <TextInput
                        name="mobileNo"
                        label="Mobile Number"
                        placeholder="Enter Mobile Number"
                        type="text"
                        size="middle"
                        maxLength={10}
                        allowNumbersOnly
                        isDisabled
                        tooltipText="Please get in touch with our customer service representative to update your mobile number."
                        showToolTip
                        prefix={
                            <Flex
                                align="center"
                                gap={6}
                                className="h-full p-2 cursor-not-allowed border-e me-2"
                            >
                                <img src={UAEFlag} alt="" />
                                <p>+971</p>
                            </Flex>
                        }
                        classes="p-0"
                    />
                    <TextInput
                        name="email"
                        label="Business Email"
                        type="email"
                        placeholder="Enter Business Email"
                        tooltipText="Please get in touch with our customer service representative to update your business email."
                        classes="rounded-sm"
                        showToolTip
                        isDisabled
                    />
                    <TextInput
                        name="contactPersonName"
                        label="Full Name"
                        type="text"
                        placeholder="Enter Full Name"
                        classes="rounded-sm"
                        tooltipText="Full Name"
                        isRequired
                        maxLength={50}
                    />
                    <TextInput
                        name="designation"
                        label="Designation"
                        type="text"
                        placeholder="Enter Designation"
                        classes="rounded-sm"
                        isRequired
                        maxLength={50}
                    />
                    <TextInput
                        name="city"
                        label="City"
                        type="text"
                        placeholder="Enter City"
                        classes="rounded-sm"
                        isRequired
                        maxLength={50}
                    />
                    <SelectInput
                        name="companySize"
                        label="Company Size"
                        placeholder="Select Size"
                        classes="rounded-sm"
                        options={companySizesList}
                    />
                    <TextInput
                        name="landlineNo"
                        label="Landline Number"
                        type="text"
                        allowNumbersOnly
                        placeholder="Enter Landline Number"
                        classes="rounded-sm"
                        maxLength={10}
                    />
                </Flex>
            </Form>
            <ImageCropModal
                isVisible={isCropModalVisible}
                onClose={hideCropModal}
                handleImage={handleImage}
                imgSrc={selectedImage ? selectedImage.toString() : ''}
            />
        </>
    );
};

export default BasicInfoForm;
