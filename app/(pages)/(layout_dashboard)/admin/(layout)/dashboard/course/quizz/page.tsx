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
            {/* <div className="">
                {
                    exams?.map((exam) => {
                        return (
                            <div key={exam.id} className="relative rounded-[10px] flex bg-white mb-8">
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
                                                    Bạn có chắc muốn xóa đề thi này?
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

                                <div className="h-[200px] w-[200px] relative py-3 px-10 bg-slate-100 flex justify-center items-center">
                                    <Image
                                        src={`/images/exam_icon.png`}
                                        width={150}
                                        height={150}
                                        alt="logo"
                                        className="rounded-l-[10px] overflow-hidden object-center object-cover"
                                    />
                                </div>
                                <div className="flex flex-col py-3 pl-[25px] pr-[17px] flex-1">
                                    <div className="flex justify-between items-center w-full">
                                        <Link href="#" >
                                            <h3 className="text-[#171347] font-bold text-lg">
                                                {exam.title}

                                            </h3>
                                        </Link>

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
                                    </div>
                                    <div className="flex items-center mt-4">
                                        {
                                            renderStars(Math.floor(0))
                                        }
                                        <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{0}</span>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-[20px] font-bold text-primary">{formatCash(`${exam.price}`)} VNĐ</span>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between flex-wrap">
                                        <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                            <span className="text-sm text-[#818894]">Lớp:</span>
                                            <span className="text-sm text-[#171347]">{exam.Categories[0]?.Class}</span>
                                        </div>
                                        <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                            <span className="text-sm text-[#818894]">Môn học:</span>
                                            <span className="text-sm text-[#171347]">{exam.Categories[1]?.Subject}</span>
                                        </div>
                                        <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                            <span className="text-sm text-[#818894]">Mức độ:</span>
                                            <span className="text-sm text-[#171347]">{exam.Categories[2]?.Level}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div> */}

            <div className="flex flex-col bg-white p-4 rounded-lg">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="table-fixed w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                <thead>
                                    <tr>
                                        <th scope="col" className="w-1/5 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Tên bài tập</th>
                                        <th scope="col" className="w-1/5 px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Khóa học</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Số lượt làm bài</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Điểm trung bình</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Hoàn thành</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Thất bại</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Tác vụ</th>
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
                                            <td className="px-6 py-4 whitespace-normal  text-sm  text-gray-800 dark:text-neutral-200">{exam.name}</td>
                                            <td className="px-6 py-4 whitespace-normal  text-sm  text-gray-800 dark:text-neutral-200">{exam.name}</td>
                                            <td className="px-6 py-4 whitespace-normal  text-sm  text-gray-800 dark:text-neutral-200">{exam.name}</td>
                                            <td className="px-6 py-4 whitespace-normal  text-sm  text-gray-800 dark:text-neutral-200">{exam.name}</td>
                                            <td className="px-6 py-4 whitespace-normal  text-sm  text-gray-800 dark:text-neutral-200">{exam.name}</td>
                                            <td className="px-6 py-4 whitespace-normal  text-center text-sm font-medium flex justify-center items-center">

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
