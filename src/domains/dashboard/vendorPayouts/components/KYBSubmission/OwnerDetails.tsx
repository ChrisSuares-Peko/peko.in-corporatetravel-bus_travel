import React from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
import { FieldArray, FieldArrayRenderProps, ErrorMessage } from 'formik';

import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';

type CountryData = {
    label: string;
    value: string;
};

type Owner = {
    ownerName: string;
    nationality: string;
    id: string;
    designation: string;
    percentageShares: string;
    document: File | null;
    documentFormat: string;
};

type OwnerDetailsProps = {
    countryData: CountryData[];
    values: Owner[];
    kybData: any;
};

const MAX_OWNERS = 3; // Maximum number of allowed owners

const OwnerDetails: React.FC<OwnerDetailsProps> = ({ countryData, values, kybData }) => (
    <Col>
        <FieldArray name="owners">
            {({ push, remove }: FieldArrayRenderProps) => (
                <>
                    {values.map((_, index) => (
                        <React.Fragment key={index}>
                            <Typography.Text className="text-base font-medium">
                                Owner {index + 1}
                            </Typography.Text>
                            <Row className="mt-3" gutter={[40, 0]}>
                                <Col xs={24} md={7}>
                                    <TextInput
                                        name={`owners[${index}].ownerName`}
                                        label="Owner Name"
                                        type="text"
                                        placeholder="Enter owner name"
                                        allowAlphabetsAndSpaceOnly
                                        isRequired
                                        isDisabled={
                                            kybData?.status !== 'RE UPLOAD' &&
                                            kybData?.status !== undefined
                                        }
                                    />
                                    <ErrorMessage
                                        name={`owners[${index}].ownerName`}
                                        render={msg => (
                                            <div className="error-message -mt-6 text-red-500">
                                                {msg}
                                            </div>
                                        )}
                                    />
                                </Col>
                                <Col xs={24} md={7}>
                                    <SelectInputWithSearch
                                        name={`owners[${index}].nationality`}
                                        options={countryData}
                                        placeholder="Please select a country"
                                        label="Nationality"
                                        isRequired
                                        isDisabled={
                                            kybData?.status !== 'RE UPLOAD' &&
                                            kybData?.status !== undefined
                                        }
                                    />
                                    <ErrorMessage
                                        name={`owners[${index}].nationality`}
                                        render={msg => (
                                            <div className="error-message -mt-6 text-red-500">
                                                {msg}
                                            </div>
                                        )}
                                    />
                                </Col>
                                <Col xs={24} md={7}>
                                    <TextInput
                                        name={`owners[${index}].id`}
                                        type="text"
                                        label="National ID / Passport No."
                                        placeholder="Enter national ID or passport no"
                                        allowAlphabetsAndNumbersOnly
                                        isRequired
                                        isDisabled={
                                            kybData?.status !== 'RE UPLOAD' &&
                                            kybData?.status !== undefined
                                        }
                                    />
                                    <ErrorMessage
                                        name={`owners[${index}].id`}
                                        render={msg => (
                                            <div className="error-message -mt-6 text-red-500">
                                                {msg}
                                            </div>
                                        )}
                                    />
                                </Col>
                                <Col xs={24} md={7}>
                                    <TextInput
                                        name={`owners[${index}].designation`}
                                        label="Designation"
                                        type="text"
                                        placeholder="Enter designation"
                                        allowAlphabetsAndNumbersOnly
                                        isRequired
                                        isDisabled={
                                            kybData?.status !== 'RE UPLOAD' &&
                                            kybData?.status !== undefined
                                        }
                                    />
                                    <ErrorMessage
                                        name={`owners[${index}].designation`}
                                        render={msg => (
                                            <div className="error-message -mt-6 text-red-500">
                                                {msg}
                                            </div>
                                        )}
                                    />
                                </Col>
                                <Col xs={24} md={7}>
                                    <TextInput
                                        name={`owners[${index}].percentageShares`}
                                        label="Percentage of Shares"
                                        type="text"
                                        placeholder="Enter percentage of shares"
                                        allowNumbersOnly
                                        isRequired
                                        maxLength={3}
                                        isDisabled={
                                            kybData?.status !== 'RE UPLOAD' &&
                                            kybData?.status !== undefined
                                        }
                                    />
                                    <ErrorMessage
                                        name={`owners[${index}].percentageShares`}
                                        render={msg => (
                                            <div className="error-message -mt-6 text-red-500">
                                                {msg}
                                            </div>
                                        )}
                                    />
                                </Col>
                                <Col xs={24} md={7}>
                                    <FileUploadInput
                                        name={`owners[${index}].document`}
                                        label="Upload ID"
                                        format={`owners[${index}].documentFormat`}
                                        showNotification
                                        showFileName
                                        allowedFileTypes={['application/pdf']}
                                        maxFileSize={2048}
                                        isRequired
                                    />
                                    <ErrorMessage
                                        name={`owners[${index}].document`}
                                        render={msg => (
                                            <div className="error-message -mt-6 text-red-500">
                                                {msg}
                                            </div>
                                        )}
                                    />
                                </Col>
                                <Col xs={24} md={2}>
                                    <Button
                                        className="mb-6"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => remove(index)}
                                        disabled={index === 0}
                                    />
                                </Col>
                            </Row>
                        </React.Fragment>
                    ))}
                    <Button
                        className="sm:mt-6 md:mt-3 mb-4"
                        danger
                        onClick={() =>
                            push({
                                ownerName: '',
                                nationality: '',
                                id: '',
                                designation: '',
                                percentageShares: '',
                                document: null,
                            })
                        }
                        disabled={
                            values.length >= MAX_OWNERS ||
                            (kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined)
                        }
                    >
                        Add New Owner
                    </Button>
                </>
            )}
        </FieldArray>
    </Col>
);

export default OwnerDetails;
