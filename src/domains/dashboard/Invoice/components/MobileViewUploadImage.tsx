import React, { useState } from 'react';

import { useFormikContext } from 'formik';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

const MobileViewUploadImage = () => {
    const { setFieldValue } = useFormikContext<any>();
    const [loading, setLoading] = useState(false);
    const [imageInfo, setImageInfo] = useState<{ url: string | null; type: string | null }>({
        url: 'https://firebasestorage.googleapis.com/v0/b/peko-storage.appspot.com/o/profile%2Fimages%2F1700742922626.png?alt=media&token=663f6698-5c0d-4cb9-bffb-5bb482cda5ee',
        type: 'image/png',
    });
    const dispatch = useAppDispatch();

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
    return <></>;
};

export default MobileViewUploadImage;
