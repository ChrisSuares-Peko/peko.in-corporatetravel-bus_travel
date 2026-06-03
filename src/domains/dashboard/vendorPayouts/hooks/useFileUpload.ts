/* eslint-disable consistent-return */
import { useEffect, useRef, useState } from 'react';

import useInvoice from './useInvoice';

const useFileUpload = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [viewPdf, setViewPdf] = useState<string | null>(null);
    const [fileSelected, setFileSelected] = useState<boolean>(false);
    const [subtotalAmount, setSubtotalAmount] = useState<string>('');
    const [taxAmount, setTaxAmount] = useState<string>('');
    const [totalAmount, setTotalAmount] = useState<string>('');

    const fileTypes = ['application/pdf'];
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { invoicePost } = useInvoice();

    useEffect(() => {
        if (files.length === 0) return;

        const temp: string[] = [];
        const fileReaders: FileReader[] = [];

        files.forEach(file => {
            if (file.type === 'application/pdf') {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = e => {
                    setViewPdf(e?.target?.result as string);
                };
                fileReaders.push(reader);
            } else {
                setViewPdf(null);
                const url = URL.createObjectURL(file);
                temp.push(url);
            }
        });

        setPreviews(temp);
        setFileSelected(true);

        return () => {
            temp.forEach(url => URL.revokeObjectURL(url));
            fileReaders.forEach(reader => reader.abort && reader.abort());
        };
    }, [files]);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const validFiles = Array.from(selectedFiles).filter(file =>
                fileTypes.includes(file.type)
            );
            setFiles(validFiles);

            const formData = new FormData();
            validFiles.forEach(file => {
                formData.append('file', file);
            });

            try {
                const response = await invoicePost(formData);
                const { data }: any = response;
                const { entities }: any = data;

                let subtotal: string | undefined;
                let tax: string | undefined;
                let total: string | undefined;

                entities.forEach(
                    (item: {
                        subtotal_amount?: number;
                        tax_amount?: number;
                        total_amount?: number;
                    }) => {
                        if (item.subtotal_amount) subtotal = item.subtotal_amount.toString();
                        if (item.tax_amount) tax = item.tax_amount.toString();
                        if (item.total_amount) total = item.total_amount.toString();
                    }
                );

                if (subtotal) setSubtotalAmount(subtotal);
                if (tax) setTaxAmount(tax);
                if (total) setTotalAmount(total);
            } catch (error) {
                console.error('File upload error:', error);
            }
        } else {
            console.log('Please select pdf file');
        }
    };

    return {
        files,
        previews,
        viewPdf,
        fileSelected,
        subtotalAmount,
        taxAmount,
        totalAmount,
        fileInputRef,
        handleChange,
    };
};

export default useFileUpload;
