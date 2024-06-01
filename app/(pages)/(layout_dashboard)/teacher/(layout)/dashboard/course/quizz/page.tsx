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
    const [exams, setExams] = useState<[any]>()
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState<boolean>(false)
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
            await examApi.getAllQuizByTeacher(`${authUser.id}`, '1').then((data: any) => setExams(data.data.exams)).catch((err: any) => { })
        }
        fetchData()
    }, [authUser.id, change]);

    return (
        <div className="">
            <div className="">
                <div className="font-bold text-[#171347] text-lg mb-5">Bài tập của của tôi</div>
                {/* <div className="flex justify-between items-center mt-5 mb-10 w-full ">
                    <form className="flex items-center w-1/3" onSubmit={async (e: any) => {
                        e.preventDefault()
                        await examApi.searchExam(searchInput).then((data: any) => {
                            setExams(data.data.result)
                        }).catch((err: any) => { })
                    }}>
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <input onChange={async (e: any) => {
                                setSearchInput(e.target.value)
                            }} type="text" id="simple-search" className="w-full text-sm text-[#343434]  rounded-md border-[1px] border-[#ececec] focus:ring-0 focus:border-primary_border" placeholder="Tìm kiếm đề thi" />
                        </div>
                        <button type="submit" className="ml-2 bg-primary p-2.5 rounded-md shadow-primary_btn_shadow border-primary text-white hover:bg-primary_hover">
                            <MagnifyingGlassIcon className='w-4 h-4' />
                            <span className="sr-only">Search</span>
                        </button>
                    </form>
                </div> */}

            </div>

            <div className="flex flex-col bg-white p-4 rounded-lg">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="table-fixed w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                <thead>
                                    <tr>
                                        <th scope="col" className="w-1/5 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Tên bài tập</th>
                                        <th scope="col" className="w-1/5 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Khóa học</th>
                                        {/* <th scope="col" className="py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Số lượt làm bài</th>
                                        <th scope="col" className="py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Điểm trung bình</th>
                                        <th scope="col" className="py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Hoàn thành</th>
                                        <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Thất bại</th> */}
                                        <th scope="col" className="px-6 py-3 w-1/12 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Tác vụ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">

                                    {exams?.map((exam: any) => (
                                        <tr key={exam.id} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                                            <>
                                                <Modal show={modal[`delete-exam${exam.id}`] || false} size="md" onClose={() => setModal({ ...modal, [`delete-exam${exam.id}`]: false })} popup>
                                                    <Modal.Header />
                                                    <Modal.Body>
                                                        <form className="space-y-6" onSubmit={async (e) => {
                                                            e.preventDefault()
                                                            await examApi.delete(exam.id).catch((err: any) => { })
                                                            setChange(!change)
                                                            setModal(false)
                                                        }}>
                                                            <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                                            <h3 className="mb-5 text-lg font-normal text-center text-gray-500 dark:text-gray-400">
                                                                Bạn có chắc muốn xóa bài tập này?
                                                            </h3>
                                                            <div className="flex justify-center gap-4">
                                                                <Button color="failure" type='submit'>
                                                                    Xóa
                                                                </Button>
                                                                <Button color="gray" onClick={() => {
                                                                    setModal({ ...modal, [`delete-exam${exam.id}`]: false })
                                                                }}>
                                                                    Hủy
                                                                </Button>
                                                            </div>
                                                        </form>
                                                    </Modal.Body>
                                                </Modal>
                                            </>
                                            <td className="px-6 py-4 text-sm whitespace-normal text-gray-800 dark:text-neutral-200 ">{exam.title}</td>
                                            <td className="px-6 py-4 whitespace-normal  text-sm  text-gray-800 dark:text-neutral-200">{exam.course_name}</td>
                                            {/* <td className="px-6 py-4 whitespace-normal  text-sm  text-gray-800 dark:text-neutral-200">22</td>
                                            <td className="px-6 py-4 whitespace-normal  text-sm  text-gray-800 dark:text-neutral-200">8</td>
                                            <td className="px-6 py-4 whitespace-normal  text-sm  text-gray-800 dark:text-neutral-200">16</td>
                                            <td className="px-6 py-4 whitespace-normal  text-sm  text-gray-800 dark:text-neutral-200">6</td> */}
                                            <td className="px-6 py-4 whitespace-normal  w-full text-center text-sm font-medium flex justify-center items-center">

                                                <Dropdown label="" renderTrigger={() => <EllipsisVerticalIcon className="w-7 h-7" />} placement="left">
                                                    <Dropdown.Item >
                                                        <Link href={`/teacher/dashboard/course/quizz/edit/${exam.id}`} >
                                                            Sửa bài tập
                                                        </Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Link href={`/teacher/dashboard/course/quizz/${exam.id}/assignment`} >
                                                            Kết quả bài tập
                                                        </Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item><p className="text-red-600" onClick={() => setModal({ ...modal, [`delete-exam${exam.id}`]: true })}>Xóa bài tập</p></Dropdown.Item>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
