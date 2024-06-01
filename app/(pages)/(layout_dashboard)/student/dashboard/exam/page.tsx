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


export default function ExamDashboard() {
    const authUser = useAppSelector(state => state.authReducer.user);
    const [exams, setExams] = useState<any>([])
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState<boolean>(false)

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
            await examApi.getComboExamOfStudent(`${authUser.id}`, '1').then((data: any) => setExams(data.data.combos)).catch((err: any) => { })
        }
        fetchData()
    }, [authUser.id, change]);
    console.log(exams);

    return (
        <div className="">
            <div className="">
                <div className="font-bold text-[#171347] text-lg">Đề thi của của tôi</div>
            </div>
            <div className="mt-5">
                {
                    exams?.map((exam: any) => {
                        return (
                            <Link href={`/exam/combo/${exam.id}/list`} key={exam.id} className="relative rounded-[10px] flex bg-white mb-8">

                                <div className="h-[200px] w-[200px] relative">
                                    <Image
                                        src={`${exam?.thumbnail ? exam.thumbnail : '/'}`}
                                        fill
                                        alt="logo"
                                        className="rounded-l-[10px] h-full w-full overflow-hidden object-center object-cover"
                                    />
                                </div>
                                <div className="flex flex-col py-3 pl-[25px] pr-[17px] flex-1">
                                    <div className="flex justify-between items-center w-full">
                                        <Link href="#" >
                                            <h3 className="text-[#171347] font-bold text-lg">
                                                {exam.name}

                                            </h3>
                                        </Link>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        {
                                            renderStars(Math.floor(exam?.average_rating || 0))
                                        }
                                        <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{(exam?.average_rating || 0).toFixed(1)}</span>
                                    </div>
                                    <div className="mt-2">
                                        <span className="text-[20px] font-bold text-primary">{formatCash(`${exam.price}`)} VNĐ</span>
                                    </div>
                                    <div className="mt-2">
                                        Giáo viên: <span className="font-semibold">{exam?.teacher?.name}</span>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between flex-wrap">
                                        {
                                            exam.Categories.map((category: any, index: number) => {
                                                if (category.Class) {
                                                    return (
                                                        <div key={category.id} className="flex items-center flex-col mt-[20px] mr-[15px]">
                                                            <span className="text-sm text-[#818894]">Lớp:</span>
                                                            <span className="text-sm text-[#171347]">{category.Class}</span>
                                                        </div>
                                                    )
                                                }
                                                else if (category.Subject) {
                                                    return (
                                                        <div key={category.id} className="flex items-center flex-col mt-[20px] mr-[15px]">
                                                            <span className="text-sm text-[#818894]">Môn học:</span>
                                                            <span className="text-sm text-[#171347]">{category.Subject}</span>
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div key={category.id} className="flex items-center flex-col mt-[20px] mr-[15px]">
                                                            <span className="text-sm text-[#818894]">Mức độ:</span>
                                                            <span className="text-sm text-[#171347]">{category.Level}</span>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>

        </div>
    )
}
