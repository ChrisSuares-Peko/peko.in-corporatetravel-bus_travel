// @ts-nocheck
function link() {
    Lean.link({
        app_token: '[YOUR_APP_TOKEN]',
        customer_id: '[CUSTOMER_ID]',
        permissions: ['identity', 'transactions', 'balance', 'accounts'],
        sandbox: true,
    });
}

function connect() {
    Lean.connect({
        app_token: '[YOUR_APP_TOKEN]',
        customer_id: '[CUSTOMER_ID]',
        permissions: ['identity', 'transactions', 'balance', 'accounts', 'payments'],
        payment_destination_id: '[YOUR_PAYMENT_DESTINATION_ID]',
        sandbox: true,
    });
}

function reconnect() {
    Lean.reconnect({
        app_token: '[YOUR_APP_TOKEN]',
        reconnect_id: '[RECONNECT_ID]',
        sandbox: true,
    });
}

function updatePaymentSource() {
    Lean.updatePaymentSource({
        app_token: '[YOUR_APP_TOKEN]',
        customer_id: '[CUSTOMER_ID]',
        payment_source_id: '[PAYMENT_SOURCE_ID]',
        payment_destination_id: '[PAYMENT_DESTINATION_ID]',
        sandbox: true,
    });
}

function createPaymentSource() {
    Lean.createPaymentSource({
        app_token: '[YOUR_APP_TOKEN]',
        customer_id: '[CUSTOMER_ID]',
        sandbox: true,
    });
}

function pay() {
    Lean.pay({
        app_token: '[YOUR_APP_TOKEN]',
        payment_intent_id: '[PAYMENT_INTENT_ID]',
        sandbox: true,
    });
}
