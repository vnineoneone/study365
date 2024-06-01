"use client"

import Image from "next/image"
import Link from "next/link"
import { StarIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from "react"
import courseApi from "@/app/api/courseApi"
import { useAppSelector } from "@/redux/store";
import { formatCash } from "@/app/helper/FormatFunction"
import { Dropdown } from 'flowbite-react';
import { ExclamationCircleIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Button, Modal } from 'flowbite-react';
import { useSearchParams } from 'next/navigation'
import Paginate from '@/app/_components/Paginate/Paginate';

export default function CourseDashboard() {
    const authUser = useAppSelector(state => state.authReducer.user);
    const [courses, setCourses] = useState<any>()
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState<boolean>(false)
    const [countPaginate, setCountPaginate] = useState(1)
    const searchParams = useSearchParams()
    const page = searchParams.get('page')
    const search = searchParams.get('search')
    const [searchInput, setSearchInput] = useState('')

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
            await courseApi.studentGetCourse(`${authUser.id}`).then((data: any) => {
                setCourses(data.data.records)
                setCountPaginate(Math.ceil(data.data.count / 10))
            }).catch((err: any) => { })
        }
        fetchData()
    }, [authUser.id, change, page]);

    return (
        <div className="">

            <div className="font-bold text-[#171347] text-lg">Khóa học của tôi</div>
            <div className="mt-8">
                {
                    courses?.map((data: any) => {
                        const course = data.Course
                        return (
                            <Link key={course?.id} href={`/course/learning/${course?.id}`}>
                                <div className="relative rounded-[10px] flex bg-white mb-8">

                                    <div className="h-[200px] w-[300px] relative">
                                        <Image
                                            src={`${course?.thumbnail ? course?.thumbnail : '/images/cousre-thumnail-1.jpg'}`}
                                            fill
                                            alt="logo"
                                            className="rounded-l-[10px] h-full w-full overflow-hidden object-center object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col py-3 pl-[25px] pr-[17px] flex-1">
                                        <div className="flex justify-between items-center w-full">
                                            <h3 className="text-[#171347] font-bold text-lg">
                                                {course?.name}
                                            </h3>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            {
                                                renderStars(Math.floor(course?.average_rating || 0))
                                            }
                                            <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{course?.average_rating.toFixed(1)}</span>
                                        </div>

                                        <div className="mt-4">
                                            <span className="text-[20px] font-bold text-primary">{formatCash(`${course?.price}`)} VNĐ</span>
                                        </div>
                                        <div className='flex items-center mt-4 '>
                                            <div className='w-[400px]'>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                    <div className="bg-yellow-300 h-2.5 rounded-full" style={{ width: `${data?.progress ? `${data?.progress * 100}%` : '0%'}` }} />
                                                </div>
                                            </div>
                                            <span className='ml-3 font-medium text-[#818894]'>Hoàn thành {`${data?.progress ? `${data?.progress * 100}%` : '0%'}`}</span>
                                        </div>
                                        <div className="mt-2">
                                            Giáo viên giảng dạy: <span className="font-semibold">{data?.teacher?.name}</span>
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        )
                    })
                }
            </div>
            < Paginate countPaginate={countPaginate} currentPage={page} />

        </div>
    )
}
