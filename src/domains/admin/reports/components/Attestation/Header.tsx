import { SearchOutlined } from '@ant-design/icons';
import { DatePicker, Input, Row, Flex, Button } from 'antd';
import dayjs from 'dayjs';

import { DownloadType } from '@customtypes/general';

type Props = {
    handleSearch: (e: any) => void;
    searchText: string;
    handleDateChange: (dates: any, dateStrings: any) => void;
    from: string;
    to: string;
    handleDownloadReport: (type: string) => void;
};
const dateFormat = 'YYYY-MM-DD';
const Header = ({
    searchText,
    handleSearch,
    from,
    to,
    handleDateChange,
    handleDownloadReport,
}: Props) => (
    <Row justify="space-between" className="w-full gap-5">
        <Flex className="flex justify-start gap-3">
            <Button danger onClick={() => handleDownloadReport(DownloadType.Excel)}>
                Excel
            </Button>
            <Button danger onClick={() => handleDownloadReport(DownloadType.Csv)}>
                CSV
            </Button>
            <Button danger onClick={() => handleDownloadReport(DownloadType.Pdf)}>
                PDF
            </Button>
        </Flex>
        <Flex className="flex-col justify-end w-full gap-3 px-0 md:flex-row md:w-auto">
            <DatePicker.RangePicker
                onChange={handleDateChange}
                format={dateFormat}
                defaultValue={[dayjs(from, dateFormat), dayjs(to, dateFormat)]}
                className="w-full"
            />
            <Input
                value={searchText}
                placeholder="Search "
                suffix={<SearchOutlined />}
                onChange={handleSearch}
                allowClear
                type="text"
                variant="outlined"
                maxLength={100}
            />
        </Flex>
    </Row>
);
export default Header;
