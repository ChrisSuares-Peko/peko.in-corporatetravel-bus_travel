import { useCallback, useState } from 'react';

import { Grid } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip } from 'recharts';

import CustomTooltip from './CustomTooltip';
import { GroupedByCategory } from '../../../types/dashboard';

interface PropsType {
    chartData?: GroupedByCategory[];
}
const { useBreakpoint } = Grid;
const Chart = ({ chartData }: PropsType) => {
    const screens = useBreakpoint();
    const width = screens.xl ? 750 : 650;
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleMouseMove = useCallback((state: any) => {
        if (state.isTooltipActive && state.activeTooltipIndex !== undefined) {
            setActiveIndex(state.activeTooltipIndex);
        } else {
            setActiveIndex(null); // Reset active index when not hovering over a bar
        }
    }, []);
    return (
        <div className="py-2 mx-2 mb-2 overflow-x-scroll h-80 bg-gray-50 md:bg-white md:py-0">
            <BarChart
                width={screens.md ? width : 300}
                height={300}
                data={chartData}
                barSize={7}
                margin={{
                    top: 5,
                    right: 40,
                    left: 0,
                    bottom: 5,
                }}
                onMouseMove={handleMouseMove}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 10, width: 20 }} />
                <YAxis axisLine={false} style={{ fontSize: '11px' }} />
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#F79C9C" />
                        <stop offset="100%" stopColor="#F79C9C" />
                    </linearGradient>
                </defs>
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                <Bar dataKey="totalCo2Usage">
                    {chartData?.map((entry, index) => (
                        <Cell
                            fill={index === activeIndex ? '#FF6D6D' : 'url(#gradient)'}
                            key={index}
                        />
                    ))}
                </Bar>
            </BarChart>
        </div>
    );
};

export default Chart;
