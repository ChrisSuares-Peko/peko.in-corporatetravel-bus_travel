import { useState } from 'react';

import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import { saveAs } from 'file-saver';

import { useAppDispatch } from '@src/hooks/store';
import useScreenSize from '@src/hooks/useScreenSize';
import { showToast } from '@src/slices/apiSlice';

import EmployeesTable from './EmployeesTable';
import EmployeesTableMobile from './EmployeesTableMobile';
import useDownloadEmployeeData from '../../hooks/employeeHooks/useExportEmployeeApi';

function EmployeesListTab({
    updateDepartmentCount,
    employeeStatus,
    offboardReload,
}: {
    updateDepartmentCount: (count: number) => void;
    employeeStatus: 'active' | 'past';
    offboardReload: boolean;
}) {
    const [searchText, setSearchText] = useState('');
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
    const screen = useScreenSize();

    const dispatch = useAppDispatch();
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const { downloadEmployeeDetails } = useDownloadEmployeeData();

    const handleExport = async () => {
        if (selectedEmployeeIds.length === 0) {
            dispatch(
                showToast({
                    variant: 'warning',
                    description: 'Please select at least one employee to export.',
                })
            );
            return;
        }
        const data = await downloadEmployeeDetails(selectedEmployeeIds, employeeStatus);
        if (data) {
            // Assuming `data` includes the necessary information, like an ArrayBuffer
            const arrayBuffer = new Uint8Array(data.buffer.data).buffer;
            const blob = new Blob([arrayBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            saveAs(blob, 'employees.xlsx');
        }
    };

    return (
        <Row gutter={[10, 0]}>
            <Col md={21} xs={24}>
                <Input
                    placeholder="Search Employee by name, role or ID  "
                    suffix={<SearchOutlined />}
                    onChange={handleSearch} // Call handleSearch on input change
                    value={searchText} //
                    allowClear
                />
            </Col>

            <Col md={3} xs={24}>
                <Button className="md:w-36" icon={<DownloadOutlined />} onClick={handleExport}>
                    Export
                </Button>
            </Col>

            <Col span={24}>
                {screen.xs ? (
                    <EmployeesTableMobile
                        employeeStatus={employeeStatus}
                        onSelectedChange={setSelectedEmployeeIds}
                        offboardReload={offboardReload}
                        searchText={searchText}
                    />
                ) : (
                    <EmployeesTable
                        offboardReload={offboardReload}
                        searchText={searchText}
                        employeeStatus={employeeStatus}
                        onSelectedChange={setSelectedEmployeeIds}
                    />
                )}
            </Col>
        </Row>
    );
}

export default EmployeesListTab;
