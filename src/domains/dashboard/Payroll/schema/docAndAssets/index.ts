import * as Yup from 'yup';

export const docSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter the document name')
        .matches(/^[^\s].*$/, 'Document name cannot start with a space')
        .min(3, 'Document name must be atleast 3 characters'),
    employee: Yup.string().required('Please select an employee'),
    expiryDate: Yup.string().required('Please select a expiry date'),

    url: Yup.string().required('Please upload a document'),
});

export const employeeDocSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please enter the document name')
        .matches(/^[^\s].*$/, 'Document name cannot start with a space')
        .min(3, 'Document name must be atleast 3 characters'),

    expiryDate: Yup.string().optional(),

    url: Yup.string().required('Please upload a document'),
});
export const assetSchema = Yup.object().shape({
    assetType: Yup.string()

        .required('Please enter the asset type')
        .matches(/^[^\s].*$/, 'Asset type cannot start with a space')
        .min(3, 'Asset Type must be atleast 3 characters'),

    assetName: Yup.string()
        .required('Please enter the asset name')
        .matches(/^[^\s].*$/, 'Asset name cannot start with a space')

        .min(3, 'Asset name must be atleast 3 characters'),
    assetId: Yup.string()
        .required('Please enter the asset ID')
        .matches(/^[^\s].*$/, 'Asset ID cannot start with a space'),
    purchasedDate: Yup.string().required('Please select a purchased date'),
    employee: Yup.string().required('Please select a user'),
    status: Yup.string().required('Please select a status'),
    batchNo: Yup.string()
        .required('Please enter a Batch No.')
        .matches(/^[^\s].*$/, 'Batch Number cannot start with a space'),
});
