import type { FC } from 'react';

import { Badge, Tooltip } from 'antd';

import { SignerInfo } from '../../types';

interface SignersBadgesProps {
    signers_info: SignerInfo[];
}

const SignersBadges: FC<SignersBadgesProps> = ({ signers_info }) => {
    const displayCount = 3;
    const displaySigners = signers_info.slice(0, displayCount);
    const isMore = signers_info.length > displayCount;

    return (
        <>
            {displaySigners.map((v, i) => (
                // <Tooltip key={i} title={v.signer_name}>
                <Badge
                    key={i}
                    title=""
                    color="#F9F9F9"
                    style={{ backgroundColor: '#F9F9F9', color: 'black' }}
                    count={v.signer_name}
                />
                // </Tooltip>
            ))}
            {isMore && (
                <Tooltip
                    className="cursor-pointer"
                    key="more"
                    title={`${signers_info.length - displayCount} more signers`}
                >
                    <Badge
                        title=""
                        color="#F9F9F9"
                        style={{ backgroundColor: '#F9F9F9', color: 'black' }}
                        count="..."
                    />
                </Tooltip>
            )}
        </>
    );
};

export default SignersBadges;
