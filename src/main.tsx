import React, { Suspense } from 'react';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '@store/store';

import App from './App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <Suspense>
                    <App />
                </Suspense>
            </BrowserRouter>
        </PersistGate>
    </Provider>
);
