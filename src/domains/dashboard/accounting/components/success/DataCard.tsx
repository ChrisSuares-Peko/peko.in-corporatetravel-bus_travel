import { Button, Col } from 'antd';

import SuccessTable from './SuccessTable';

type Props = {
    tax: boolean;
};

const DataCard = ({ tax }: Props) => (
    <Col className="flex mt-6 flex-col w-full justify-center items-center gap-6">
        {tax ? (
            <Button className=" flex justify-center items-center">
                Download Tax Registration Certificate
            </Button>
        ) : (
            <Button className="flex justify-center items-center">Download VAT Certificate</Button>
        )}
        <SuccessTable />
    </Col>
);

export default DataCard;
