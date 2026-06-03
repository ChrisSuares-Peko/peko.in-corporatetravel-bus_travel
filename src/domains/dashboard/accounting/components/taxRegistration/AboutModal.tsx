import React, { useState } from 'react';

import { Divider, Flex, Modal, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Paragraph from 'antd/es/typography/Paragraph';

interface modalProps {
    handleCancel: () => void;
    open: boolean;
}
const AboutModal = ({ handleCancel, open }: modalProps) => {
    const [data, setData] = useState();
    return (
        <Modal title="About" open={open} onCancel={handleCancel} footer={null} width={800}>
            <Divider />

            <Content className="px-4 " style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <Typography.Text className="font-medium text-lg  mt-3">
                    What is Corporate Tax Registration?
                </Typography.Text>
                <Typography.Paragraph className="mt-3">
                    Corporate tax registration is a necessary step for businesses working under a
                    corporate structure to comply with tax laws. It is a mandatory process in the
                    UAE for all businesses, regardless of business size, ensuring compliance,
                    avoiding penalties, and maintaining credibility with tax authorities. Companies
                    subject to corporate tax with licenses in January and February must register by
                    May 31st, 2024, to adhere to tax laws effectively and prevent violations.
                </Typography.Paragraph>
                <Flex vertical className="mt-3">
                    <Typography.Text className="font-medium text-lg">
                        Benefits of Corporate Tax Registration
                    </Typography.Text>
                </Flex>
                <Typography.Paragraph className="mt-3">
                    Corporate tax registration is a necessary step for businesses working under a
                    corporate structure to comply with tax laws. It is a mandatory process in the
                    UAE for all businesses, regardless of business size, ensuring compliance,
                    avoiding penalties, and maintaining credibility with tax authorities. Companies
                    subject to corporate tax with licenses in January and February must register by
                    May 31st, 2024, to adhere to tax laws effectively and prevent violations.
                </Typography.Paragraph>
                <Paragraph className="mt-3">
                    <ol style={{ paddingInlineStart: '0' }}>
                        {[
                            'Registering for corporate tax ensures that a business is compliant with the tax laws and regulations of the jurisdiction in which it operates. This helps in avoiding any legal issues or penalties.',
                            'It allows you to plan your finances effectively by understanding your tax liabilities and obligations.',
                            'Being a tax-compliant business enhances your credibility and reputation among clients, investors, and other stakeholders.',
                            'Registering for corporate tax enables your business to claim tax deductions on eligible expenses, reducing your overall tax burden.',
                            'By registering for corporate tax, you can avoid penalties and fines that may result from non-compliance with tax laws.',
                            'Proper tax registration sets a strong foundation for your business growth and expansion by ensuring financial stability and compliance with legal requirements.',
                        ].map((item, index) => (
                            <li key={index} style={{ marginBottom: '0.5em' }}>
                                {item}
                            </li>
                        ))}
                    </ol>
                </Paragraph>
                <Typography.Text className="font-medium text-lg mt-3">
                    Registration Process
                </Typography.Text>
                <Paragraph className="mt-3">
                    <ol style={{ paddingInlineStart: '0' }}>
                        {[
                            'Copy of the Trade License: Ensure that your Trade License is valid (not expired)',
                            'Passport Copy: Submit the passport copy of the owners, partners, or shareholders who own the license.Please ensure that the passport copies are valid (not expired).',
                            'Submit Emirates ID: Submit the Emirates ID of the owners, partners, or shareholders who own the license. Make sure that the Emirates IDs are valid (not expired).',
                            'Memorandum of Association (MOA) or Article of Association (AOA): Submit the required legal documents, such as the Memorandum of Association (MOA) or Article of Association (AOA), to complete the registration process.',
                        ].map((item, index) => (
                            <li key={index} style={{ marginBottom: '0.5em' }}>
                                {item}
                            </li>
                        ))}
                    </ol>
                </Paragraph>
                <Typography.Paragraph className="mt-3">
                    By submitting the documents, you can successfully register for corporate tax and
                    ensure compliance with the legal requirements.
                </Typography.Paragraph>
            </Content>
        </Modal>
    );
};

export default AboutModal;
