import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

import { chartData } from '@utils/data';

const Chart = () => (
    <ResponsiveContainer className="mt-4" minWidth={400} height={300}>
        <BarChart
            width={500}
            height={300}
            data={chartData}
            barSize={10}
            margin={{
                top: 5,
                right: 40,
                left: 0,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis axisLine={false} style={{ fontSize: '11px' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="amt" fill="#FF3A3A" />
        </BarChart>
    </ResponsiveContainer>
);

export default Chart;
