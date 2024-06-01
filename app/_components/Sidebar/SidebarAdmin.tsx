"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from "@/redux/store";
import { usePathname } from 'next/navigation'
import { initFlowbite } from 'flowbite';
import { useEffect } from 'react';

export default function SidebarTeacher() {
    const { user } = useAppSelector(state => state.authReducer);
    const pathname = usePathname()
    useEffect(() => {
        initFlowbite();
    }, []);
    return (
        <div className=''>
            <aside
                id="sidebar-multi-level-sidebar"
                className="fixed top-[55px] left-0 bottom-0 w-[254px] h-full shadow-sidebar_admin pt-[20px] pb-[25px] px-[5px]  transition-transform -translate-x-full sm:translate-x-0"
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <div className='flex flex-row items-end justify-center'>
                        <div className="w-[100px] h-[100px] relative">
                            <Image
                                src={`${user.avatar ? user.avatar : '/images/avatar.png'} `}
                                fill
                                alt="avatar"
                                className='rounded-full overflow-hidden object-cover object-center w-full h-full'
                            />
                        </div>
                    </div>
                    <div className='flex flex-row items-end justify-center mt-4 font-semibold'>
                        <Link href="#">
                            <h3 className='text-[1.25rem]'>
                                {user.name}
                            </h3>
                        </Link>
                    </div>
                    <div className='relative mt-6 overflow-y-scroll mb-6 h-[calc(100%-200px)] sidebar'>
                        <ul className="space-y-2 font-medium absolute top-0 left-0 w-full h-auto pr-1">
                            <li>
                                <Link
                                    href="/admin/dashboard"
                                    className={`${pathname == '/admin/dashboard' ? 'bg-slate-100' : ''} flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                                >

                                    <span className="ms-3">Tổng quan</span>
                                </Link>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                    aria-controls="student"
                                    data-collapse-toggle="student"
                                >
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                        Quản lý người dùng
                                    </span>
                                    <svg
                                        className="w-3 h-3"
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
                                <ul id="student" className="hidden py-2 space-y-2">
                                    <li>
                                        <Link
                                            href="/admin/dashboard/teacher"
                                            className={`${pathname == '/admin/dashboard/teacher' ? 'bg-slate-100' : ''} ml-4 flex items-center p-2 text-gray-900 transition duration-75 rounded-lg pl-2 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                                        >
                                            <div className='ml-2'>
                                                Danh sách giáo viên
                                            </div>

                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/admin/dashboard/student"
                                            className={`${pathname == '/admin/dashboard/student' ? 'bg-slate-100' : ''} ml-4 flex items-center p-2 text-gray-900 transition duration-75 rounded-lg pl-2 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                                        >
                                            <div className='ml-2'>
                                                Danh sách học sinh
                                            </div>

                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                    aria-controls="dropdown-example"
                                    data-collapse-toggle="dropdown-example"
                                >

                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                        Quản lý khóa học
                                    </span>
                                    <svg
                                        className="w-3 h-3"
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
                                <ul id="dropdown-example" className="hidden py-2 space-y-2">
                                    <li>
                                        <Link
                                            href="/admin/dashboard/course"
                                            className={`${pathname == '/admin/dashboard/course' ? 'bg-slate-100' : ''} flex ml-4 items-center p-2 text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                                        >
                                            <div className='ml-2'>
                                                Danh sách khóa học
                                            </div>

                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/admin/dashboard/course/quizz"
                                            className={`${pathname == '/admin/dashboard/course/quizz' ? 'bg-slate-100' : ''} flex ml-4 items-center p-2 text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                                        >
                                            <div className='ml-2'>
                                                Quản lý bài tập
                                            </div>

                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                    aria-controls="exam"
                                    data-collapse-toggle="exam"
                                >
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                        Quản lý đề thi
                                    </span>
                                    <svg
                                        className="w-3 h-3"
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
                                <ul id="exam" className="hidden py-2 space-y-2">
                                    <li>
                                        <Link
                                            href="/admin/dashboard/exam"
                                            className={`${pathname == '/admin/dashboard/exam' ? 'bg-slate-100' : ''} ml-4 flex items-center p-2 text-gray-900 transition duration-75 rounded-lg pl-2 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                                        >
                                            <div className='ml-2'>
                                                Danh sách đề thi
                                            </div>

                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/admin/dashboard/exam/combo"
                                            className={`${pathname == '/admin/dashboard/exam/combo' ? 'bg-slate-100' : ''} ml-4 flex items-center p-2 text-gray-900 transition duration-75 rounded-lg pl-2 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                                        >
                                            <div className='ml-2'>
                                                Danh sách combo
                                            </div>

                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/admin/dashboard/exam/assignment"
                                            className={`${pathname == '/admin/dashboard/exam/assignment' ? 'bg-slate-100' : ''} ml-4 flex items-center p-2 text-gray-900 transition duration-75 rounded-lg pl-2 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                                        >
                                            <div className='ml-2'>
                                                Kết quả làm bài
                                            </div>

                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                    aria-controls="review"
                                    data-collapse-toggle="review"
                                >
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                        Quản lý đánh giá
                                    </span>
                                    <svg
                                        className="w-3 h-3"
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
                                <ul id="review" className="hidden py-2 space-y-2">
                                    <li>
                                        <Link
                                            href="/admin/dashboard/review/teacher"
                                            className={`${pathname == '/admin/dashboard/review/teacher' ? 'bg-slate-100' : ''} ml-4 flex items-center p-2 text-gray-900 transition duration-75 rounded-lg pl-2 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                                        >
                                            <div className='ml-2'>
                                                Đánh giá giáo viên
                                            </div>

                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/admin/dashboard/review/course"
                                            className={`${pathname == '/admin/dashboard/review/course' ? 'bg-slate-100' : ''} ml-4 flex items-center p-2 text-gray-900 transition duration-75 rounded-lg pl-2 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                                        >
                                            <div className='ml-2'>
                                                Đánh giá khóa học
                                            </div>

                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/admin/dashboard/review/exam"
                                            className={`${pathname == '/admin/dashboard/review/exam' ? 'bg-slate-100' : ''} ml-4 flex items-center p-2 text-gray-900 transition duration-75 rounded-lg pl-2 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                                        >
                                            <div className='ml-2'>
                                                Đánh giá đề thi
                                            </div>

                                        </Link>
                                    </li>
                                </ul>
                            </li>



                            <li>
                                <Link
                                    href="/admin/dashboard/notifycation"
                                    className={`${pathname == '/admin/dashboard/notifycation' ? 'bg-slate-100' : ''} flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                                >
                                    <span className="ms-3">Danh sách thông báo</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/dashboard/discount"
                                    className={`${pathname == '/admin/dashboard/discount' ? 'bg-slate-100' : ''} flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                                >
                                    <span className="ms-3">Danh sách khuyến mãi</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/dashboard/finance"
                                    className={`${pathname == '/admin/dashboard/finance' ? 'bg-slate-100' : ''} flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                                >
                                    <span className="ms-3">Danh sách giao dịch</span>
                                </Link>
                            </li>


                        </ul>
                    </div>
                </div>
            </aside >

        </div >
    )
}
