import { Tag } from 'antd';

import { DocumentStatus } from '../types';
import { STATUS_TONE } from '../utils/statusMap';

interface StatusPillProps {
    status: DocumentStatus;
    size?: 'sm' | 'md';
}

const StatusPill = ({ status, size = 'md' }: StatusPillProps) => {
    const tone = STATUS_TONE[status];
    return (
        <Tag
            style={{
                color: tone.color,
                background: tone.bg,
                borderColor: tone.bg,
                borderRadius: 999,
                paddingInline: size === 'sm' ? 8 : 12,
                paddingBlock: 2,
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
            }}
        >
            <span
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: tone.dot,
                    display: 'inline-block',
                }}
            />
            {tone.label}
        </Tag>
    );
};

export default StatusPill;
