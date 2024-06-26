"use client"

import type { Metadata } from 'next'
import './globals.css'
import "@/css/satoshi.css";
// import "@/css/style.css";
import FlowbiteClient from './_components/Flowbite/FlowbiteClient'
import { Suspense, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ReduxProvider } from '@/redux/provider';
import { store, persistor, useAppSelector } from '@/redux/store';
import '@/node_modules/react-multi-carousel/lib/styles.css'
import { initFlowbite } from 'flowbite';
import('flowbite')
import Loader from './loading';

// export const metadata: Metadata = {
//   title: 'Study365',
//   description: 'Generated by create next app',
// }
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  useEffect(() => {
    initFlowbite();
  }, []);
  return (
    <html lang="en">
      <body >
        <Suspense fallback={<p>Loading data...</p>}>
          <ReduxProvider store={store}>
            {children}
          </ReduxProvider>
        </Suspense>

      </body>

    </html>
  )
}
