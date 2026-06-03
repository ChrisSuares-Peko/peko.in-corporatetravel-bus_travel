import { useEffect, useState } from 'react';

import { EyeOutlined, EyeInvisibleOutlined, DownOutlined } from '@ant-design/icons';
import { Descriptions, Flex, Table, TableProps, Button, Dropdown, Menu } from 'antd';
import { ColumnsType } from 'antd/lib/table';

type GenericTableProps = Omit<TableProps<any>, 'expandable'> & {
    handleSort?: TableProps<any>['onChange'];
};

type ExpandableData = {
    title: string;
    dataIndex: string;
    key: string;
    render?: (data: any, record: any) => React.ReactNode;
    sorter?: (a: any, b: any) => number;
};

const GenericTable: React.FC<GenericTableProps> = ({
    dataSource,
    loading,
    columns,
    handleSort,
    ...restProps
}: any) => {
    const [tableColumns, setTableColumns] = useState<ColumnsType<any>>([]);
    const [expandableData, setExpandableData] = useState<ExpandableData[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set(columns.map((col: any) => col.key))
    );

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            let totalWidth = 0;
            const fitColumns: ColumnsType<any> = [];
            const remainingData: ExpandableData[] = [];

            columns?.forEach((column: any) => {
                if (!visibleColumns.has(column.key)) return;

                const colWidth = column.width ? column.width : 200; // Default width if not provided
                if (totalWidth + colWidth <= screenWidth) {
                    fitColumns.push(column);
                    totalWidth += colWidth;
                } else {
                    remainingData.push({
                        title: column.title,
                        dataIndex: column.dataIndex,
                        key: column.key,
                        render: column.render,
                        sorter: column.sorter,
                    });
                }
            });

            setTableColumns(fitColumns);
            setExpandableData(remainingData);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call

        return () => window.removeEventListener('resize', handleResize);
    }, [dataSource, columns, visibleColumns]);

    const toggleColumnVisibility = (key: string) => {
        setVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const expandableRowRender = (record: any) => (
        <Descriptions layout="horizontal">
            {expandableData.map((data: ExpandableData) => (
                <Descriptions.Item
                    key={data.key}
                    span={24}
                    labelStyle={{ fontWeight: 'bold' }}
                    label={data.title}
                >
                    <Flex className="w-full" align="center">
                        {data.render
                            ? data.render(record[data.dataIndex], record)
                            : record[data.dataIndex]}
                    </Flex>
                </Descriptions.Item>
            ))}
        </Descriptions>
    );

    const columnMenu = (
        <Menu>
            {columns.map(
                (column: any) =>
                    column.visibilityToggle && (
                        <Menu.Item key={column.key}>
                            <Button
                                type="text"
                                icon={
                                    visibleColumns.has(column.key) ? (
                                        <EyeOutlined />
                                    ) : (
                                        <EyeInvisibleOutlined />
                                    )
                                }
                                onClick={() => toggleColumnVisibility(column.key)}
                            >
                                {column.title}
                            </Button>
                        </Menu.Item>
                    )
            )}
        </Menu>
    );

    return (
        <>
            <Flex style={{ marginBottom: 16 }} wrap="wrap" align="center" justify="space-between">
                <div className="hidden md:block">
                    {columns.map(
                        (column: any) =>
                            column.visibilityToggle && (
                                <Button
                                    key={column.key}
                                    icon={
                                        visibleColumns.has(column.key) ? (
                                            <EyeOutlined />
                                        ) : (
                                            <EyeInvisibleOutlined />
                                        )
                                    }
                                    onClick={() => toggleColumnVisibility(column.key)}
                                    style={{ margin: '0 8px 8px 0' }}
                                >
                                    {column.title}
                                </Button>
                            )
                    )}
                </div>
                <div className="md:hidden w-full">
                    <Dropdown overlay={columnMenu} trigger={['click']}>
                        <Button>
                            Columns <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>
            </Flex>
            <Table
                columns={tableColumns}
                dataSource={dataSource}
                pagination={false}
                loading={loading}
                expandable={
                    expandableData.length > 0
                        ? {
                              expandedRowRender: expandableRowRender,
                          }
                        : false
                }
                {...restProps}
            />
        </>
    );
};

export default GenericTable;
