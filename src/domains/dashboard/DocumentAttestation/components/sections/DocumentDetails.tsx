import React from 'react';

import { Flex, Typography } from 'antd';

import DocumentDetailsForm from '../forms/DocumentDetailsForm';

interface DocumentDetailsType {
    form1Ref: any;
}
const DocumentDetails = ({ form1Ref }: DocumentDetailsType) => (
    <Flex vertical className="w-full" gap={15}>
        <Typography.Text className="text-lg font-medium">Document Details</Typography.Text>
        <DocumentDetailsForm form1Ref={form1Ref} />
    </Flex>
);

export default DocumentDetails;
