import type { FC } from 'react';

import { DownloadOutlined } from '@ant-design/icons';
import { Alert, Button, Flex, Typography } from 'antd';

import { useAppSelector } from '@src/hooks/store';
import useFileDownloader from '@src/hooks/useFileDownloader';
import useScreenSize from '@src/hooks/useScreenSize';
// import PdfThumbnail from '@components/molecular/pdfViewer/PdfThumbnail';

import StatusBadge from '../orderHistory/StatusBadge';

interface ReviewPageHeaderProps {}

const ReviewPageHeader: FC<ReviewPageHeaderProps> = () => {
    const { document_url, status, isDisabled, doc_expiry_date } = useAppSelector(
        state => state.reducer.eSignDoc
    );
    const { handleDownloadLink } = useFileDownloader();
    const { sm } = useScreenSize();
    const formattedExpiryDate = doc_expiry_date
        ? new Date(doc_expiry_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'Unknown';
    return (
        <>
            {/* {true ? ( */}
            <Flex justify="space-between" align="center">
                <Flex gap={10} align="center">
                    <Typography.Text className="font-medium sm:text-xl">
                        eSign Details
                    </Typography.Text>
                    {isDisabled && <StatusBadge status={status!} />}
                </Flex>
                {isDisabled && document_url !== null && (
                    <Button
                        danger
                        size={sm ? 'middle' : 'small'}
                        icon={sm ? <DownloadOutlined /> : ''}
                        onClick={() => handleDownloadLink(document_url!)}
                    >
                        {' '}
                        {sm ? 'Download Document' : 'Download'}
                    </Button>
                )}
            </Flex>
            {status === 'COMPLETED' && (
                <Flex>
                    {document_url ? (
                        <Alert
                            message={`Important: Available to download until ${formattedExpiryDate}.`}
                            type="warning"
                            showIcon
                        />
                    ) : (
                        <Alert
                            message="The document is expired and cannot be downloaded."
                            type="error"
                            showIcon
                        />
                    )}
                </Flex>
            )}
            {/* ) : (
                <Flex className='rounded-[.4rem] border h-[8rem] p-1 border-gray-200'>
                    <Flex className='w-3/12'>
                        {documentBase64 && <PdfThumbnail fileUrl={documentBase64} />}
                    </Flex>
                    <Flex className='w-6/12'>
                        qq
                    </Flex>
                    <Flex  justify='space-between' align='center'  className='w-3/12'>
                        <Button
                            danger
                            onClick={() => handleDownloadLink(document_url!)}
                        >Download </Button>
                    </Flex>

                </Flex>
            )} */}
        </>
    );
};

export default ReviewPageHeader;
