"use client"
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import paymentApi from '@/app/api/paymentApi';
import { DataTable } from '@/app/_components/Table/TableFormat';
import { columns } from "@/app/_components/Table/TransactionColumns/columns"

export default function FinanceDashboard() {
    const [transactions, settransactions] = useState([])
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState(false)
    const searchParams = useSearchParams()
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const { user } = useAppSelector(state => state.authReducer);
    useEffect(() => {
        async function fetchData() {
            await paymentApi.getTransactionOfTeacher(`${user.id}`).then((data: any) => {
                settransactions(data.data)
            }).catch((err: any) => { })
        }
        fetchData()


    }, [change, user.id, page]);


    return (
        <div className='w-full'>
            <div>
                <div className="font-bold text-[#171347] text-lg">Danh sách giao dịch</div>
                <div className="container mx-auto rounded-lg mt-4">
                    <DataTable columns={columns} data={transactions} page={page} setPage={setPage} pageCount={pageCount} />
                </div>

            </div>
        </div>

    )
}
