import { paths } from '@src/routes/paths';

import CreateInvoiceBase from './CreateInvoiceBase';

const CreatePurchaseCreditNote = () => (
    <CreateInvoiceBase
        mode="purchase-credit-note"
        title="Purchase credit note"
        listPath={paths.einvoicing.purchaseCreditNotes}
        detailParent={paths.einvoicing.purchaseCreditNotes}
    />
);

export default CreatePurchaseCreditNote;
