"use client"

import Image from "next/image"
import Link from "next/link"
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from "react"
import examApi from "@/app/api/examApi"
import { useAppSelector } from "@/redux/store";
import { formatCash } from "@/app/helper/FormatFunction"
import { Dropdown } from 'flowbite-react';
import { ExclamationCircleIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Button, Modal } from 'flowbite-react';
import { DataTable } from '@/app/_components/Table/TableFormat';
import { columns } from "@/app/_components/Table/ExamColumns/columns"

export default function ExamDashboard() {
    const authUser = useAppSelector(state => state.authReducer.user);
    const [exams, setExams] = useState<[]>([])
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState<boolean>(false)
    const [searchInput, setSearchInput] = useState('')
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <StarIcon
                    key={i}
                    className={`text-${i <= rating ? 'yellow-300' : 'gray-300'} w-5 h-5`}
                />
            );
        }
        return stars;
    };

    useEffect(() => {
        async function fetchData() {
            await examApi.getAllExam('1').then((data: any) => setExams(data.data.exams)).catch((err: any) => { })
        }
        fetchData()
    }, [authUser.id, change]);

    return (
        <div className="">
            <div>
                <div className="">
                    <div className="font-bold text-[#171347] text-lg">Danh sách đề thi</div>
                    <div className="container mx-auto rounded-lg mt-4">
                        <DataTable columns={columns} data={exams} page={page} setPage={setPage} pageCount={pageCount} />
                    </div>
                </div>

            </div>

        </div>
    )
}
