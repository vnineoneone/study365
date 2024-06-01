'use client'
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { Controller, set, useForm } from "react-hook-form"
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import courseApi from '@/app/api/courseApi';
import { teacher } from '@/redux/features/teacherSlice';
import notifyApi from '@/app/api/notifyApi';
import { ToastContainer, toast } from 'react-toastify';
import { initFlowbite } from 'flowbite';
import { convertToVietnamTime } from '@/app/helper/FormatFunction';
import Paginate from '@/app/_components/Paginate/Paginate';

export default function CreateNotify() {
    const [students, setStudents] = useState<any>()
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState(false)
    const [currentCourse, setCurrentCourse] = useState<any>('')
    const [listStudent, setListStudent] = useState<any>({})
    const [isAllStudent, setIsAllStudent] = useState(true)
    const searchParams = useSearchParams()
    const page = searchParams.get('page') || '1'
    const [paginate, setPaginate] = useState(1)
    const list: any = []
    const [courses, setCourses] = useState<any>()
    const { user } = useAppSelector(state => state.authReducer);

    const [notifycations, setNotifycations] = useState<any>([])
    const [countPaginate, setCountPaginate] = useState(1)

    const {
        register,
        reset,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        async function fetchData() {
            await courseApi.getAllByTeacher(`${user.id}`, page).then((data: any) => {
                setCourses(data.data.courses)
            }).catch((err: any) => { })
            await notifyApi.getNotifyBySendTeacher(`${user.id}`, page).then((data: any) => {
                setNotifycations(data.data)
            }).catch((err: any) => { })
        }
        fetchData()
    }, [page, user.id]);



    useEffect(() => {
        async function fetchData() {
            if (currentCourse) {
                if (currentCourse === 'all_course')
                    await courseApi.getAllStudenBuyCourseOfTeacher(`${user.id}`, page).then((data: any) => {
                        setStudents(data.data)
                    }).catch((err: any) => { })
                else
                    await courseApi.getAllStudenBuySpecificCourseOfTeacher(currentCourse, `${user.id}`, page).then((data: any) => {
                        setStudents(data.data)
                    }).catch((err: any) => { })
            }

        }
        fetchData()
    }, [page, user.id, currentCourse]);

    useEffect(() => {
        initFlowbite();
    }, []);
    return (
        <div>
            <ToastContainer />
            <div>
                <h2 className="text-[#171347] font-bold section-title text-lg flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1] mb-5">Tạo thông báo</h2>

                <form onSubmit={handleSubmit(async (data: any) => {
                    let studentIds: any = []
                    if (isAllStudent || currentCourse === 'all_course')
                        studentIds = students?.map((student: any) => student.id) || [];
                    else
                        studentIds = Object.keys(listStudent).filter(key => listStudent[key]) || students?.map((student: any) => student.id);

                    const formData = {
                        data: {
                            message: data.content,
                            users: studentIds
                        }
                    }

                    await notifyApi.teacherSendNotify(formData).then((data: any) => {
                        setCurrentCourse('')
                        setIsAllStudent(false)
                        toast.success('Thông báo đã được gửi thành công', {
                            position: "bottom-right",
                            autoClose: 800,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });
                    }).catch((err: any) => { })
                    setChange(!change)
                    reset()
                })}>
                    <div className='flex items-start'>
                        <div className='w-1/3 mr-5 '>
                            <select {...register("course", {
                                required: 'Hãy chọn khóa học'
                            })} id="courses" name="course" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setCurrentCourse(e.target.value)}>
                                <option value="" defaultChecked>Chọn khóa học</option>
                                <option value="all_course" >Tất cả khóa học</option>
                                {courses?.map((course: any, index: number) => {
                                    return (
                                        <option key={course.id} value={`${course.id}`}>{course.name}</option>
                                    )
                                })}
                            </select>
                            <div className="mt-1 text-sm text-red-600 dark:text-red-500">
                                {errors?.course?.message && (
                                    <React.Fragment>{errors.course.message.toString()}</React.Fragment>
                                )}
                            </div>
                        </div>
                        <div className={`w-full`}>
                            <button
                                id="dropdownSearchButton"
                                data-dropdown-toggle="dropdownSearch"
                                data-dropdown-placement="bottom"
                                className="w-1/3 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 justify-between flex items-center"
                                type="button"
                            >
                                Chọn học sinh{" "}
                                <svg
                                    className="w-2.5 h-2.5 ms-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            {/* Dropdown menu */}
                            <div
                                id="dropdownSearch"
                                className="z-10 hidden bg-white rounded-lg shadow w-80 dark:bg-gray-700"
                            >
                                <div className="p-3">
                                    <label htmlFor="input-group-search" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <svg
                                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="input-group-search"
                                            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Tìm kiếm người dùng"
                                        />
                                    </div>
                                </div>
                                <ul
                                    className="h-auto px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                                    aria-labelledby="dropdownSearchButton"

                                >
                                    <li >

                                        <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                            <input
                                                onChange={(e) => { setIsAllStudent((e.target as HTMLInputElement).checked) }}
                                                type="checkbox"
                                                defaultChecked
                                                id={'all'}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                            />
                                            <label
                                                htmlFor="checkbox-item-11"
                                                className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                            >
                                                Tất cả học sinh
                                            </label>
                                        </div>
                                    </li>
                                    {
                                        students ? students?.map((student: any, index: number) => {
                                            return (
                                                <li key={student.id}>
                                                    <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                        <input
                                                            onChange={(e) => setListStudent({ ...listStudent, [student.id]: (e.target as HTMLInputElement).checked })
                                                            }
                                                            checked={isAllStudent ? true : (listStudent[student.id] || false)}
                                                            type="checkbox"
                                                            defaultValue=""
                                                            id={student.id}
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                        />
                                                        <label
                                                            htmlFor="checkbox-item-11"
                                                            className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                                        >
                                                            {student.email}
                                                        </label>
                                                    </div>
                                                </li>
                                            )
                                        }) : <p className='text-center'>Không có người dùng</p>

                                    }


                                </ul>
                            </div>
                        </div>

                    </div>
                    <div className='w-3/4 flex flex-col mt-10'>

                        <div>
                            <textarea
                                placeholder="Nhập nội dung..."
                                {...register("content", {
                                    required: 'Nội dung không được để trống'
                                })}
                                className="w-full p-2 border rounded focus:ring-0 focus:border-primary_border"
                                rows={4}
                            ></textarea>
                            <div className="mt-1 text-sm text-red-600 dark:text-red-500">
                                {errors?.content?.message && (
                                    <React.Fragment>{errors.content.message.toString()}</React.Fragment>
                                )}
                            </div>

                            <div className='mt-5'>
                                <button type='submit' className='h-[36px] px-[22px] bg-primary shadow-primary_btn_shadow border-primary text-white rounded-md hover:bg-primary_hover'>Gửi thông báo</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div>
                <h2 className="text-[#171347] font-bold section-title text-lg flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1] mb-5 mt-8">Thông báo đã gửi</h2>
                {
                    notifycations?.map((notify: any, index: any) => {
                        return (
                            <div key={notify.id} className='rounded-md bg-white shadow-sm mb-5 px-10 py-5'>

                                <div className='flex items-center justify-between'>
                                    <div className="text-[#171347] text-sm font-semibold w-1/3 flex flex-col justify-center items-start">
                                        <div className='mb-2 flex justify-center items-center'>
                                            <div>

                                                Khóa học

                                            </div>
                                        </div>
                                        <span className='text-[#818894] text-xs'>
                                            {convertToVietnamTime(notify.createdAt)}
                                        </span>
                                    </div>
                                    <div className="text-gray-500 text-sm flex-1 text-center px-5">

                                        {notify.content}

                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

                <Paginate countPaginate={countPaginate} currentPage={page} />
            </div>

        </div >
    )

}



