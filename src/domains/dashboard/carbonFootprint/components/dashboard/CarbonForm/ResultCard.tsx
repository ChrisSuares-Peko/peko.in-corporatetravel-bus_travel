import { Button, Flex, Typography, Card } from 'antd';

interface ResultCardProps {
    value: any;
    onNeutralize: () => void;
}

const ResultCard = ({ value, onNeutralize }: ResultCardProps) => (
    <Card className="rounded-lg w-full h-full md:min-w-64  bg-bgResultCard flex justify-center self-center align-middle border border-solid shadow-none">
        <Flex
            vertical
            gap={15}
            align="center"
            justify="center"
            className=" h-full  w-full sm:flex row"
        >
            <Flex vertical gap={15}>
                <Typography.Text className="text-6xl font-bold text-center">
                    {value}
                </Typography.Text>
                <Typography.Text className=" Text-lg text-center  ">
                    tons CO₂ eq/year
                </Typography.Text>
            </Flex>
            <Button danger type="primary" className="h-10 px-12" onClick={onNeutralize}>
                Neutralise
            </Button>
        </Flex>
    </Card>
);
export default ResultCard;
