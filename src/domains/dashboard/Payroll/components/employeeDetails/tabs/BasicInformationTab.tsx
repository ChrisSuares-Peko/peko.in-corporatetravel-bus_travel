import React from 'react';

import { Col, Row } from 'antd';

import { UpdateEmployee } from '../../../types/types';
import EmployeeInformation from '../EmployeeInformation';
import ExitInformation from '../ExitInformation';
import PersonalInformation from '../PersonalInformation';

type Props = {
    employeeData: UpdateEmployee;
    setRefState: (num: number) => void;
    isLoading: boolean;
};

const BasicInformationTab = ({ employeeData, setRefState, isLoading }: Props) => (
    <Row className="h-full ml-10 ">
        <Col className="" xs={24} md={7}>
            <PersonalInformation
                isLoading={isLoading}
                setRefState={setRefState}
                employeeData={employeeData && employeeData}
            />
        </Col>
        <Col xs={0} md={1} className="border-l -mt-4" />
        <Col xs={24} md={15}>
            <>
                <EmployeeInformation
                    isLoading={isLoading}
                    setRefState={setRefState}
                    employeeData={employeeData && employeeData}
                />
                {employeeData && employeeData?.employeeInformation.status === 'RESIGNED' ? (
                    <ExitInformation
                        setRefState={setRefState}
                        employeeData={employeeData && employeeData}
                    />
                ) : (
                    ''
                )}
            </>
        </Col>
    </Row>
);

export default BasicInformationTab;
