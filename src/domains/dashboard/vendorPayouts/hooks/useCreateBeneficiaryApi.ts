import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import { createBeneficiaryApi } from '../api/BeneficiaryRegistrationApis';
import { CreateBeneficiaryPayload } from '../types/types';

export function useCreateBeneficiaryApi() {
    // const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const createBeneficiary = async (payload: CreateBeneficiaryPayload) => {
        const response = await createBeneficiaryApi(payload);
        if (response.success && response.data) {
            navigate(`/${paths.dashboard.vendorPayouts}/${paths.vendorPayouts.beneficiary}`);

            dispatch(
                showToast({
                    variant: 'success',
                    description: response.data.message || 'Beneficiary created successfully',
                })
            );
            // dispatch(resetBeneficiary());  // reset slice once the user is created
        } else {
            dispatch(
                showToast({
                    variant: 'error',
                    description:
                        response.errorMessage ||
                        'Failed to create the beneficiary due to an unexpected issue.',
                })
            );
        }

        // setLoading(false);
    };

    return { createBeneficiary };
}
