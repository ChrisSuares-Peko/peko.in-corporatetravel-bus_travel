import React, { useState } from 'react';

import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Upload, Image, Flex } from 'antd';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { RootState } from '@store/store';

import { setRecipientDetails } from '../slices/InvoicesSlices';

const UploadImage: React.FC = () => {
    const { setFieldValue } = useFormikContext<any>();
    const { user } = useAppSelector(state => state.reducer.user);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [imageInfo, setImageInfo] = useState<{
        url: string | null | undefined;
        type: string | null;
    }>({
        url: user?.logo,
        type: 'image/png',
    });

    const dispatch = useAppDispatch();
    const recipientDetails = useSelector((state: RootState) => state.reducer);

    const beforeUpload = (file: File) => {
        const isJpegOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt1MB = file.size / 1024 / 1024 <= 1;

        if (!isJpegOrPng) {
            dispatch(
                showToast({
                    description: 'You can only upload jpeg or png image.',
                    variant: 'error',
                })
            );
        }

        if (!isLt1MB) {
            dispatch(
                showToast({ description: 'Image must be smaller than 1MB!', variant: 'error' })
            );
        }

        return isJpegOrPng && isLt1MB;
    };

    const setValue = ({ file, onSuccess }: any) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    dispatch(
                        setRecipientDetails({
                            ...recipientDetails,
                            logo: {
                                imageBase: reader.result.split(',')[1],
                                imageFormat: file.type.split('/')[1],
                            },
                            billerName: '',
                            billerEmail: '',
                            billerCompanyAddress: '',
                            billerPhone: 0,
                            billerGST: '',
                            customerName: '',
                            customerEmail: '',
                            customerAddress: '',
                            customerPhone: '',
                        })
                    );

                    setFieldValue('logo', {
                        imageBase: reader.result.split(',')[1],
                        imageFormat: file.type.split('/')[1],
                    });
                    setImageInfo({ url: reader.result, type: file.type });
                }
            };

            reader.readAsDataURL(file);

            dispatch(showToast({ description: 'File uploaded successfully', variant: 'success' }));
            onSuccess('ok');
        }
    };

    const handleDeleteImage = () => {
        setImageInfo({ url: null, type: null });
        setFieldValue('logo', null);
        dispatch(showToast({ description: 'File removed successfully', variant: 'success' }));
    };
    const handleMouseLeave = () => {
        setVisible(false);
    };
    const handleMouseEnter = () => {
        setVisible(true);
    };
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Upload
                multiple={false}
                name="logo"
                maxCount={1}
                onRemove={handleDeleteImage}
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={setValue}
            >
                {imageInfo.url ? (
                    <Flex
                        style={{
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <Image
                            preview={false}
                            src={imageInfo.url}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className=""
                            alt="Uploaded Logo"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: visible ? 0.3 : 1,
                            }}
                        />
                    </Flex>
                ) : (
                    <button style={{ border: 0, background: 'none' }} type="button">
                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                        <Flex style={{ marginTop: 8 }}>Upload</Flex>
                    </button>
                )}
            </Upload>
            {imageInfo.url && visible && (
                <DeleteOutlined
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleDeleteImage}
                    className="text-textRed text-lg "
                    size={60}
                    style={{ position: 'absolute', top: 50, right: 50, cursor: 'pointer' }}
                />
            )}
        </div>
    );
};

export default UploadImage;
