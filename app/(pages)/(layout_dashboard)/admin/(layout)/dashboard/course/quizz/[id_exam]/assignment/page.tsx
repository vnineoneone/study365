"use client"

import Image from "next/image"
import Link from "next/link"
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from "react"
import examApi from "@/app/api/examApi"
import { useAppSelector } from "@/redux/store";
import { convertToVietnamTime, formatCash } from "@/app/helper/FormatFunction"
import { Dropdown } from 'flowbite-react';
import { ExclamationCircleIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Button, Modal } from 'flowbite-react';
import { DataTable } from "@/app/_components/Table/TableFormat"
import { columns } from "@/app/_components/Table/AssignmentColumns/columns_exam"
import courseApi from "@/app/api/courseApi"
import { useSearchParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"


export default function AssignmentDashboard() {

    const user = useAppSelector(state => state.authReducer.user);
    const [assignments, setAssignments] = useState<any>([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [courses, setCourses] = useState<any>([])
    const searchParams = useSearchParams();
    const queries = Object.fromEntries(searchParams.entries());
    let filterString = ''
    for (const key of Object.keys(queries)) {
        filterString += `${key}=${queries[key]}&`
    }
    const [selectedCourseId, setSelectedCourseId] = useState(
        searchParams.get('id_course') || ''
    );
    const handleCourseChange = (event: any) => {
        setSelectedCourseId(event.target.value);
    };
    useEffect(() => {
        async function fetchData() {
            await examApi.getAssigmnentOfQuizzByTeacherId(`${user.id}`, page, filterString).then((data: any) => {
                setAssignments(data.data.assignments)
                setPageCount(Math.floor(data.data.count))
            }).catch((err: any) => { })
            await courseApi.getAllByTeacher(`${user.id}`, '1').then((data: any) => {
                setCourses(data.data.courses)
            }).catch((err: any) => { })
        }
        fetchData()
    }, [filterString, page, user.id]);


    return (
        <div>
            <div>
                <div className="font-bold text-[#171347] text-lg">Lọc kết quả</div>
                <form className="p-5 bg-white mt-4 rounded-lg">
                    <div className="grid grid-cols-4 gap-8">

                        <div>
                            {courses.length > 0 ? (
                                <select id="id_course" defaultValue={selectedCourseId} onChange={handleCourseChange} name="id_course" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="">Chọn khóa học</option>

                                    {courses?.map((course: any, index: number) => {
                                        return (
                                            <option key={course.id} value={`${course.id}`}>{course.name}</option>
                                        )
                                    })}
                                </select>
                            ) : (
                                null
                            )}

                        </div>
                        <div>
                            <select id="status" name="status" defaultValue={searchParams.get("status") || ''} className=" bg-white border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="">Chọn trạng thái</option>
                                <option value={`pass`}>Hoàn thành</option>
                                <option value={`fail`}>Thất bại</option>
                            </select>
                        </div>
                        <div className="">
                            <select id="score" name="score" defaultValue={searchParams.get("score") || ''} className=" bg-white border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="">Chọn điểm</option>
                                {Array.from(Array(11).keys()).map((value) => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select id="reviewed" name="reviewed" defaultValue={searchParams.get("reviewed") || ''} className=" bg-white border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="">Chọn đánh giá</option>
                                <option value={`0`}>Chưa đánh giá</option>
                                <option value={`1`}>Đang đánh giá</option>
                                <option value={`2`}>Đã đánh giá</option>
                            </select>
                        </div>
                        <div>
                            <select id="m" name="m" defaultValue={searchParams.get("m") || ''} className=" bg-white border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="">Chọn bài làm</option>
                                <option value={`0`}>Điểm cao nhất</option>
                                <option value={`1`}>Mới nhất</option>
                            </select>
                        </div>
                        <div className="col-span-2 ">
                            <div className="flex items-center w-full">
                                <div className="w-1/2">
                                    <input date-rangepicker="true" defaultValue={searchParams.get("preDate") || ''} name="preDate" type="date" className="border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start" />
                                </div>
                                <span className="mx-4 text-gray-500">đến</span>
                                <div className="w-1/2">
                                    <input date-rangepicker="true" defaultValue={searchParams.get("postDate") || ''} name="postDate" type="date" className="border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end" />
                                </div>
                            </div>
                        </div>

                        <button type='submit' className='h-[36px] px-[22px] bg-primary shadow-primary_btn_shadow border-primary text-white rounded-md hover:bg-primary_hover'>Lọc</button>
                    </div>
                </form>
            </div>
            <div className="mt-5">
                <div className="font-bold text-[#171347] text-lg">Kết quả làm bài</div>
                <div className="container mx-auto rounded-lg mt-4">
                    <DataTable columns={columns} data={assignments.map((assignment: any) => { return { ...assignment, time_end: convertToVietnamTime(assignment.time_end) } })} page={page} setPage={setPage} pageCount={pageCount} />
                </div>
            </div>
        </div>
    )
}