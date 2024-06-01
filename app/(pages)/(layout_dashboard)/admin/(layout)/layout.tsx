"use client"

import SidebarAdmin from '@/app/_components/Sidebar/SidebarAdmin'
import { Suspense, useEffect, useState } from 'react'
import HeaderAdmin from '@/app/_components/Header/HeaderAdmin'
import Loading from '../../loading'
import { useAppSelector } from "@/redux/store";
import Link from 'next/link';
import { redirect } from 'next/navigation';


export default function DashboardAdminLayout({
  children,
}: any) {
  const { user } = useAppSelector(state => state.authReducer);

  // if (user.id == 0) redirect('/login')
  return (
    user?.role != "admin" ? <div className='h-svh w-full flex justify-center items-center text-xl'> <p className='mr-2'>Bạn không có quyền truy cập vào trang này.</p> <Link className='underline text-blue-500' href="/">Quay lại</Link></div> :
      <section className="">

        <HeaderAdmin />

        <div className='flex justify-end mt-[70px] '>

          <SidebarAdmin />

          <div className="px-6 py-7 w-[calc(100%-254px)] min-h-svh bg-[#fbfbfd] pb-5">
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </div>
        </div>

      </section>
  )
}
