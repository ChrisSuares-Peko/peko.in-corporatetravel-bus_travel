import { Button, Drawer, Flex, Form } from 'antd';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';

import InputTextArea from '@components/atomic/inputs/InputTextArea';
import TextInput from '@components/atomic/inputs/TextInput';
import { showToast } from '@src/slices/apiSlice';

import CreateAnnouncement from '../../hooks/announcementHooks/useCreateAnnoncementApi';
import { addAnouncementSchema } from '../../schema/announcement/AddAnnouncementSchema';

type AnnouncementModalProps = {
    open: boolean;
    handleCancel: () => void;
    setRefresh: (value: any) => void;
};

const AnnouncementModal = ({ open, handleCancel, setRefresh }: AnnouncementModalProps) => {
    const { createAnnouncementHandler } = CreateAnnouncement();

    const dispatch = useDispatch();

    return (
        <Formik
            initialValues={{
                subject: '',
                details: '',
            }}
            onSubmit={async values => {
                const postData = {
                    subject: values.subject,
                    details: values.details,
                };
                const res = await createAnnouncementHandler(postData);
                if (res) {
                    setRefresh(true);
                    dispatch(
                        showToast({
                            description: 'Announcement created successfully',
                            variant: 'success',
                        })
                    );
                    handleCancel();
                }
                if (!res) {
                    dispatch(
                        showToast({
                            description: 'Something went wrong, please try again later',
                            variant: 'error',
                        })
                    );
                    handleCancel();
                }
            }}
            validationSchema={addAnouncementSchema}
            enableReinitialize
        >
            {({ handleSubmit, isSubmitting }) => (
                <Drawer
                    title="Add Announcement"
                    placement="right"
                    closable={false}
                    onClose={handleCancel}
                    open={open}
                    key="right"
                    destroyOnClose
                    width={470}
                    styles={{
                        body: { paddingInline: 20, paddingBlock: 16 },
                        header: { paddingInline: 20 },
                    }}
                    zIndex={10}
                    footer={[
                        <Flex className=" w-full" justify="flex-end" gap={10} key="">
                            <Button
                                key="submit"
                                type="primary"
                                danger
                                loading={isSubmitting}
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                Submit
                            </Button>

                            <Button key="back" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Flex>,
                    ]}
                >
                    <Flex vertical className="w-full">
                        <Form layout="vertical">
                            <TextInput
                                name="subject"
                                label="Subject"
                                type="text"
                                placeholder="Enter Subject"
                                isRequired
                                classes=" rounded-sm "
                            />
                            <InputTextArea
                                name="details"
                                placeholder="Enter Details"
                                label="Details"
                                isRequired
                            />
                        </Form>
                    </Flex>
                </Drawer>
            )}
        </Formik>
    );
};

export default AnnouncementModal;
