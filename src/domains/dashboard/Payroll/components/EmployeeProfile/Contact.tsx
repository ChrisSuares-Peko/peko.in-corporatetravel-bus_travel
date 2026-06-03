import { useEffect, useState } from 'react';

import { UserOutlined } from '@ant-design/icons';
import { Flex, Avatar, Typography, Form } from 'antd';
import { Formik } from 'formik';

import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { setImageData } from '../../slices/employeeSlices';

interface ContactProps {
    isLoading: boolean;
}

const Contact = ({ isLoading }: ContactProps) => {
    const [file, setFile] = useState<string>();
    const [imageDataUrl, setImageDataUrl] = useState<string>();
    const dispatch = useAppDispatch();
    const { id } = useAppSelector(state => state.reducer.employeeDetails);

    const { profileImage } = useAppSelector(state => state.reducer.employeeDetails);

    const handleSetFile = (base64Data: string) => {
        const base64Only = base64Data.split(',')[1];

        setFile(base64Only);
        setImageDataUrl(base64Data);
    };
    useEffect(() => {
        if (file) {
            dispatch(setImageData({ base64: file, format: 'img' }));
        } else {
            dispatch(setImageData(null));
        }
    }, [file, dispatch]);
    const handlePersonalInformation = async (values: any) => {
        dispatch(setImageData(values));
    };

    // return
    // {!isLoading?( <Formik
    //     initialValues={{ profileImage: '' }}
    //     onSubmit={values => handlePersonalInformation(values)}
    //     enableReinitialize
    // >
    //     {({ handleSubmit }) => (
    //         <Form onFinish={handleSubmit}>
    //             <Flex align="center" vertical className="">
    //                 <div className="avatar-img-cover inline-block overflow-hidden rounded-full border border-gray-300 ">
    //                     <Avatar
    //                         className=""
    //                         size={{ xs: 80, sm: 80, md: 40, lg: 100, xl: 100, xxl: 100 }}
    //                         icon={<UserOutlined />}
    //                         src={id ? profileImage : imageDataUrl}
    //                     />
    //                 </div>
    //                 <FileUploadInput
    //                     name="profileImage"
    //                     label=""
    //                     setFile={handleSetFile}
    //                     maxFileSize={1024}
    //                 />
    //                 <Typography.Text className="text-xl font-normal">
    //                     Add Profile Picture
    //                 </Typography.Text>
    //             </Flex>
    //         </Form>
    //     )}
    // </Formik>):("")}
    // (
    //     <Formik
    //         initialValues={{ profileImage: '' }}
    //         onSubmit={values => handlePersonalInformation(values)}
    //         enableReinitialize
    //     >
    //         {({ handleSubmit }) => (
    //             <Form onFinish={handleSubmit}>
    //                 <Flex align="center" vertical className="">
    //                     <div className="avatar-img-cover inline-block overflow-hidden rounded-full border border-gray-300 ">
    //                         <Avatar
    //                             className=""
    //                             size={{ xs: 80, sm: 80, md: 40, lg: 100, xl: 100, xxl: 100 }}
    //                             icon={<UserOutlined />}
    //                             src={id ? profileImage : imageDataUrl}
    //                         />
    //                     </div>
    //                     <FileUploadInput
    //                         name="profileImage"
    //                         label=""
    //                         setFile={handleSetFile}
    //                         maxFileSize={1024}
    //                     />
    //                     <Typography.Text className="text-xl font-normal">
    //                         Add Profile Picture
    //                     </Typography.Text>
    //                 </Flex>
    //             </Form>
    //         )}
    //     </Formik>
    // );

    return !isLoading ? (
        <Formik
            initialValues={{ profileImage: '' }}
            onSubmit={values => handlePersonalInformation(values)}
            enableReinitialize
        >
            {({ handleSubmit }) => (
                <Form onFinish={handleSubmit}>
                    <Flex align="center" vertical className="">
                        <div className="avatar-img-cover inline-block overflow-hidden rounded-full border border-gray-300 ">
                            <Avatar
                                className=""
                                size={{ xs: 80, sm: 80, md: 40, lg: 100, xl: 100, xxl: 100 }}
                                icon={<UserOutlined />}
                                src={id ? profileImage : imageDataUrl}
                            />
                        </div>
                        <FileUploadInput
                            name="profileImage"
                            label=""
                            setFile={handleSetFile}
                            maxFileSize={1024}
                        />
                        <Typography.Text className="text-xl font-normal">
                            Add Profile Picture
                        </Typography.Text>
                    </Flex>
                </Form>
            )}
        </Formik>
    ) : (
        ''
    );
};

export default Contact;
