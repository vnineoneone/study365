"use client"

import { persistor } from '@/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import React, { ReactNode } from 'react'; // Add the missing import statement

export function ReduxProvider({ children, store }: { children: ReactNode, store: any }) { // Update the type of the children parameter
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}