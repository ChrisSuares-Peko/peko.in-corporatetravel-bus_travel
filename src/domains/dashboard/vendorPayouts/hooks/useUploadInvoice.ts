/* eslint-disable consistent-return */
import { useEffect, useRef, useState } from 'react';

import useInvoice from './useInvoice';
import { extractNumbers } from '../utils/extractNumbers';

type InvoiceEntity = {
    subtotal_amount?: number;
    tax_amount?: number;
    total_amount?: number;
    invoice_due_date?: number;
    invoice_number?: number;
};

const useUploadInvoice = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [viewPdf, setViewPdf] = useState<string | null>(null);
    const [fileSelected, setFileSelected] = useState<boolean>(false);
    const [subtotalAmount, setSubtotalAmount] = useState<string>('');
    const [taxAmount, setTaxAmount] = useState<string>('');
    const [totalAmount, setTotalAmount] = useState<string>('');
    const [invoiceNumber, setInvoiceNumber] = useState<string>('');
    const [invoiceDate, setInvoiceDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const fileTypes = ['application/pdf'];
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { invoicePost } = useInvoice();

    useEffect(() => {
        if (!files || files.length === 0) return;

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

            setLoading(true); // Start loading

            try {
                const response = await invoicePost(formData);
                const { data }: any = response;
                const { entities }: { entities: InvoiceEntity[] } = data;

                let subtotal: string | undefined;
                let tax: string | undefined;
                let total: string | undefined;
                let dueDate: string | undefined;
                let number: string | undefined;

                entities.forEach(item => {
                    if (item.subtotal_amount)
                        subtotal = extractNumbers(item.subtotal_amount.toString());
                    if (item.tax_amount) tax = extractNumbers(item.tax_amount.toString());
                    if (item.total_amount) total = extractNumbers(item.total_amount.toString());
                    if (item.invoice_due_date) dueDate = item.invoice_due_date.toString();
                    if (item.invoice_number) number = item.invoice_number.toString();
                });

                if (subtotal) setSubtotalAmount(subtotal);
                if (tax) setTaxAmount(tax);
                if (total) setTotalAmount(total);
                if (number) setInvoiceNumber(number);
                if (dueDate) setInvoiceDate(dueDate);
            } catch (error) {
                console.error('File upload error:', error);
            } finally {
                setLoading(false); // Stop loading
            }
        } else {
            console.log('Please select a PDF file');
        }
    };

    return {
        files,
        previews,
        viewPdf,
        fileSelected,
        fileInputRef,
        handleChange,
        subtotalAmount,
        taxAmount,
        totalAmount,
        invoiceNumber,
        invoiceDate,
        loading,
    };
};

export default useUploadInvoice;
