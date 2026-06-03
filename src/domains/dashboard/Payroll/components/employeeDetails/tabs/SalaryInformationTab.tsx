import React from 'react';

import { Col, Row } from 'antd';

import { UpdateEmployee } from '../../../types/types';
import BankDetails from '../BankDetails';
import SalaryDetails from '../SalaryDetails';

type Props = {
    employeeData: UpdateEmployee;
    setRefState: (num: number) => void;
    isLoading: boolean;
};

const SalaryInformationTab = ({ employeeData, setRefState, isLoading }: Props) => (
    <Row className="ml-10">
        <Col span={24}>
            <SalaryDetails
                setRefState={setRefState}
                employeeData={employeeData && employeeData}
                isLoading={isLoading}
            />

            <BankDetails setRefState={setRefState} employeeData={employeeData && employeeData} />
        </Col>
    </Row>
);

export default SalaryInformationTab;
