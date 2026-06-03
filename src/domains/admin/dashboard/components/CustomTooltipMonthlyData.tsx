import { formatNumberWithLocalString } from '@utils/priceFormat';
import { TooltipProps } from 'recharts';

interface CustomTooltipProps extends TooltipProps<any, any> {
    labelText?: string;
}
const CustomTooltipMonthlyData = ({ active, payload, labelText = 'AED' }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-white border border-gray-300 rounded-md custom-tooltip">
                <p className="text-sm font-medium labelText">{`Transactions : ${parseFloat(parseFloat(payload[0].value).toFixed(2))}`}</p>
                <p className="text-sm font-medium labelText">{`Cashback : AED ${formatNumberWithLocalString(payload[1].value)}`}</p>
            </div>
        );
    }
    return null;
};

export default CustomTooltipMonthlyData;
