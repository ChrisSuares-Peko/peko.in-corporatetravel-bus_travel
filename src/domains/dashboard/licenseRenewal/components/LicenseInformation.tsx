import { useEffect, type FC } from 'react';

import { Flex, Grid, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import TextField from './TextField';

interface LicenseInformationProps {}

const LicenseInformation: FC<LicenseInformationProps> = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const LicenseDetails = state;
    useEffect(() => {
        if (!LicenseDetails) {
            navigate(`/${paths.licenseRenewal.index}`);
        }
    }, [LicenseDetails, navigate]);

    return (
        <>
            {screens.xs && (
                <Typography.Text className="text-sm font-bold leading-6 pb-5">
                    Company License Information
                </Typography.Text>
            )}
            <Flex
                vertical
                className="w-full xl:w-2/3 rounded-sm border border-zinc-100 p-6 bg-bgGray sm:bg-white"
            >
                {screens.xs ? (
                    <>
                        <Typography.Text className="text-base font-semibold leading-6  text-textLightGreen">
                            AED {formatNumberWithLocalString(LicenseDetails?.Amount)}
                        </Typography.Text>
                        <hr className="my-3" />
                    </>
                ) : (
                    <Typography.Text className="text-base font-semibold leading-6 pb-5 ">
                        Company License Information
                    </Typography.Text>
                )}
                <Row>
                    <TextField title="Voucher Number" value={LicenseDetails?.VoucherNumber} />
                    <TextField
                        title="Voucher Date"
                        value={dayjs(LicenseDetails?.VocuherDate).format('DD/MMM/YYYY')}
                    />
                    <TextField
                        title="Voucher Expiry Date"
                        value={dayjs(LicenseDetails?.VoucherExpiryDate).format('DD/MMM/YYYY')}
                    />
                    {!screens.xs && (
                        <TextField
                            title="Amount"
                            className="text-green-500"
                            value={`AED ${formatNumberWithLocalString(LicenseDetails?.Amount)}`}
                        />
                    )}
                </Row>
            </Flex>
        </>
    );
};
export default LicenseInformation;
