import React from 'react';

import { Flex } from 'antd';

import RegisterBody from '../components/Beneficiary/BeneficiaryRegister/RegisterBody';

const RegisterBeneficiaryPage: React.FC = () => (
    <Flex gap={40} vertical className="w-full lg:w-6/12">
        <RegisterBody />
    </Flex>
);

export default RegisterBeneficiaryPage;
