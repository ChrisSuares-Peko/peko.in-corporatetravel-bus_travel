import { Flex, Form } from 'antd';
import { useFormikContext } from 'formik';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import CustomSelectSearch from '@components/atomic/inputs/CustomSelectSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import { DropDown } from '@customtypes/general';

import SelectInputWithSearch from './SelectInputWithSearch';
import { categoriesNotifications, defaultNotificationTo } from '../utils';

type Props = {
    setSpecificCorporate: (value: boolean) => void;
    setSearchText: (value: string) => void;
    specificCorporate: boolean;
    corporates: DropDown;
    searchText: string;
};

const FormComponent = ({
    corporates,
    setSpecificCorporate,
    specificCorporate,
    searchText,
    setSearchText,
}: Props) => {
    const { setFieldValue } = useFormikContext();

    const handleCheckbox = (e: any) => {
        setFieldValue('notificationTo', []);
        setSpecificCorporate(e.target.checked);
    };
    return (
        <Flex vertical className="w-full ">
            <Form layout="vertical">
                <TextInput
                    name="notificationTitle"
                    label="Notification Title"
                    type="text"
                    placeholder="Enter Notification Title"
                    isRequired
                    classes=" rounded-sm"
                />
                <TextInput
                    name="notificationBrief"
                    label="Notification Brief"
                    type="text"
                    placeholder="Enter Notification Brief"
                    isRequired
                    classes="rounded-sm"
                />

                <CustomSelectSearch
                    name="notificationCategory"
                    label="Category"
                    options={categoriesNotifications}
                    isRequired
                    placeholder="Select Category"
                />
                <CheckboxInput
                    onChange={e => handleCheckbox(e)}
                    name="selCorporate"
                    checked={specificCorporate}
                >
                    Any Specific Corporate
                </CheckboxInput>
                <SelectInputWithSearch
                    mode="multiple"
                    name="notificationTo"
                    label="Notification To"
                    options={specificCorporate ? corporates : defaultNotificationTo}
                    isRequired
                    placeholder="Select Corporate"
                    isDisabled={!specificCorporate}
                    filterOption={false}
                    showSearch
                    onSearch={setSearchText}
                    searchValue={searchText}
                    onClear={() => setSearchText('')}
                />
            </Form>
        </Flex>
    );
};
export default FormComponent;
