import { paths } from '@src/routes/paths';

import CreateInvoiceBase from './CreateInvoiceBase';

const CreateCreditNote = () => (
    <CreateInvoiceBase
        mode="sales-credit-note"
        title="Issue credit note"
        listPath={paths.einvoicing.creditNotes}
        detailParent={paths.einvoicing.creditNotes}
    />
);

export default CreateCreditNote;
