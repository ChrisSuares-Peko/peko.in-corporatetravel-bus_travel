import { paths } from '@src/routes/paths';

import CreateInvoiceBase from './CreateInvoiceBase';

const CreatePurchaseInvoice = () => (
    <CreateInvoiceBase
        mode="purchase-invoice"
        title="Self-billed purchase invoice"
        listPath={paths.einvoicing.purchaseInvoices}
        detailParent={paths.einvoicing.purchaseInvoices}
    />
);

export default CreatePurchaseInvoice;
