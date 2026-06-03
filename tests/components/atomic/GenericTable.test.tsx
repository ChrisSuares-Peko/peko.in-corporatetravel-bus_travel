import { cleanup, render, screen } from '@testing-library/react';
import { it, expect, describe, afterEach } from 'vitest';

import GenericTable from '@components/atomic/GenericTable';

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
];

const dataSource = [
    { key: '1', name: 'John Doe', age: 32 },
    { key: '2', name: 'Jane Doe', age: 28 },
];

describe('GenericTable', () => {
    afterEach(() => {
        cleanup();
    });
    it('should render with default props', () => {
        const { container } = render(<GenericTable dataSource={[]} columns={[]} />);
        expect(container).toBeInTheDocument();
    });

    it('should render data correctly', () => {
        render(<GenericTable dataSource={dataSource} columns={columns} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('32')).toBeInTheDocument();
        expect(screen.getByText('28')).toBeInTheDocument();
    });

    it('should handle resizing and show correct columns', () => {
        global.innerWidth = 200;

        render(<GenericTable dataSource={dataSource} columns={columns} />);

        expect(screen.queryByText('Address')).toBeNull();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('should render correctly with empty data source', () => {
        render(<GenericTable dataSource={[]} columns={columns} />);

        expect(screen.queryByText('John Doe')).toBeNull();
        expect(screen.queryByText('Jane Doe')).toBeNull();
    });
    it('should render custom cell content correctly', () => {
        const customColumns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (text: string) => <b>{text}</b>,
            },
            { title: 'Age', dataIndex: 'age', key: 'age' },
        ];
        render(<GenericTable dataSource={dataSource} columns={customColumns} />);

        expect(screen.getByText('John Doe').tagName).toBe('B');
        expect(screen.getByText('Jane Doe').tagName).toBe('B');
    });

    it('should handle custom row key prop correctly', () => {
        const dataSourceWithCustomKey = [
            { id: '1', name: 'John Doe', age: 32 },
            { id: '2', name: 'Jane Doe', age: 28 },
        ];
        render(<GenericTable dataSource={dataSourceWithCustomKey} columns={columns} rowKey="id" />);

        const rows = screen.getAllByRole('row');
        expect(rows[1].getAttribute('data-row-key')).toBe('1');
        expect(rows[2].getAttribute('data-row-key')).toBe('2');
    });
});
