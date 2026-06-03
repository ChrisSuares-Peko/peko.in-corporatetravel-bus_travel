import React, { useEffect, useState } from 'react';

import { Button, Flex, Skeleton } from 'antd';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import InvoiceCard from '../components/InvoiceCard';
import useGetInvoiceDetails from '../hooks/useGetInvoiceDetails';
import DownloadInvoiceData from '../hooks/useInvoiceDownloadApi';
import { setDetails } from '../slices/InvoiceSlices';

type Props = {};

const InvoicePreview = (props: Props) => {
    const state = useLocation();
    const { invoiceResponse } = useAppSelector(store => store.reducer.invoices);
    const { data, dataSource, isLoading, invoiceId } = useGetInvoiceDetails(invoiceResponse.id);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setDetails(data));
    }, [data, dispatch]);
    const componentRef = React.useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { getInvoiceDetails, loader } = DownloadInvoiceData();
    const navigate = useNavigate();
    const handlePrintClick = async () => {
        try {
            getInvoiceDetails(invoiceResponse.invoiceId);
        } catch (error) {
            // console.error('Error occurred while printing:', error);
        }
    };
    return isLoading ? (
        <Flex vertical gap={20} justify="center" align="center" className="w-full ">
            <Skeleton className="mt-10 md:w-3/4" paragraph={{ rows: 15 }} />
        </Flex>
    ) : (
        <Flex vertical gap={20} justify="center" align="center" className="w-full">
            <InvoiceCard data={data} componentRef={componentRef} dataSource={dataSource} />
            <Flex justify="space-between" align="center" className="w-full md:max-w-3xl mt-3">
                {/* <Flex vertical gap={8} align="center">
                    <Typography.Text className="text-textGrey text-sm">
                        Share invoice
                    </Typography.Text>
                    <Flex gap={18}>
                        <Image
                            src={email}
                            height={50}
                            width={50}
                            preview={false}
                            onClick={() => setModalVisible(true)} // Open modal on click
                            className="cursor-pointer"
                        />
                    </Flex>
                </Flex> */}
                {/* <Link to={paths.invoice.guidelines}> */}
                <Button
                    type="primary"
                    className="md:px-10"
                    danger
                    // onClick={handlePrintClick}
                    // loading={loader}
                    onClick={() => navigate(paths.invoice.guidelines, { state: data })}
                >
                    Proceed
                </Button>
                {/* </Link> */}
            </Flex>
            {/* <SendEmailModal
                open={modalVisible}
                handleCancel={() => setModalVisible(false)}
                invoiceId={invoiceId}
            /> */}
        </Flex>
    );
};

export default InvoicePreview;
