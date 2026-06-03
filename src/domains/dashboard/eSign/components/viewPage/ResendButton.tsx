import type { FC } from 'react';

import { Button, Tooltip } from 'antd';

import { SignerDetailsTypes } from '../../types';

interface ResendButtonProps {
    signers_info: SignerDetailsTypes[];
    sequentialSignature: boolean;
    index: number;
    isLoading: boolean;
    resendInvitation: (index: number) => void;
}

const ResendButton: FC<ResendButtonProps> = ({
    sequentialSignature,
    index,
    isLoading,
    resendInvitation,
    signers_info,
}) => {
    const currentSignerStatus = signers_info[index]?.status;
    const previousSignerStatus = signers_info[index - 1]?.status;

    const shouldShowButton = currentSignerStatus !== 'signed';
    const shouldShowTooltip = index > 0 && previousSignerStatus !== 'signed' && sequentialSignature;

    if (!shouldShowButton) {
        return null;
    }

    return shouldShowTooltip ? (
        <Tooltip
            title="Sequential signing is enabled. Please resend once the first signer has completed signing."
            placement="bottomLeft"
        >
            <Button className="w-full mt-1 " danger disabled size="small" loading={isLoading}>
                Resend
            </Button>
        </Tooltip>
    ) : (
        <Button
            className="w-full mt-1 "
            danger
            size="small"
            loading={isLoading}
            onClick={() => resendInvitation(index)}
        >
            Resend
        </Button>
    );
};

export default ResendButton;
