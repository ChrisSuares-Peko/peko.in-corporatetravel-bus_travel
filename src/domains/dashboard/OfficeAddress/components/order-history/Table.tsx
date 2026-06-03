import React from 'react';

import { Col, Grid } from 'antd';

import MobileTable from './MobileTable';
import WebTable from './WebTable';

const Table = () => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    return <Col span={24}>{screens.xs ? <MobileTable /> : <WebTable />}</Col>;
};

export default Table;
