import { useState } from 'react';

import { Flex } from 'antd';

import { Contact } from '../components/EmployeeProfile';
import ProfileTabs from '../components/EmployeeProfile/ProfileTabs';
// import { resetData } from '../slices/employeeDetailsSlice';

type Props = {};
const EmployeeProfile = (props: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // useEffect(() => {
    //     dispatch(resetData());
    // }, [dispatch]);

    return (
        <Flex vertical className=" sm:px-6">
            <Contact isLoading={isLoading} />
            <ProfileTabs isLoading={isLoading} setIsLoading={setIsLoading} />
        </Flex>
    );
};

export default EmployeeProfile;
