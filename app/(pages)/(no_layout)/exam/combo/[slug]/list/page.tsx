"use client"

import examApi from "@/app/api/examApi"
import { convertToHourMinuteSecond, convertToVietnamTime } from "@/app/helper/FormatFunction"
import { useAppSelector } from "@/redux/store"
import { ChevronDownIcon, ChevronUpIcon, DocumentIcon, Squares2X2Icon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"
import { HeaderLearning } from "@/app/_components/Header/HeaderLearning"
import SidebarLearning from "@/app/_components/Sidebar/SidebarLearning"
import courseApi from "@/app/api/courseApi"
import PaginateButton from "@/app/_components/Paginate/PaginateButton"
import { HeaderExam } from "@/app/_components/Header/HeaderExam"
import { useSearchParams } from "next/navigation"

export default function ExamDetail({ params }: { params: { slug: string } }) {
    const [assignments, setAssignments] = useState<any>([])
    const { user } = useAppSelector(state => state.authReducer);
    const initToggle: any = {}
    const [toggle, setToggle] = useState(initToggle)
    const [combos, setCombos] = useState<any>({});
    const [countPaginate, setCountPaginate] = useState(0)
    const [course, setCourse] = useState<any>({})
    const searchParams = useSearchParams();
    const [examId, setExamId] = useState<any>(searchParams.get('exam'))
    const [currentPage, setCurrentPage] = useState(1)
    const [currExam, setCurrExam] = useState<any>({})




    useEffect(() => {
        async function fetchData() {
            await examApi.getComboDetail(params.slug).then((data: any) => {
                setCombos(data.data)
                if (!examId) {
                    setExamId(data.data?.Exams[0]?.id)
                }
                if (!currExam?.id)
                    setCurrExam(data.data?.Exams[0])
            }
            ).catch((err: any) => { })
        }
        fetchData()
    }, [params.slug, currExam?.id, examId]);

    useEffect(() => {
        async function fetchData() {
            if (examId)
                examApi.getAssigmnentByExamId(`${user.id}`, examId, currentPage).then((data) => {
                    setAssignments(data.data.assignments)
                    setCountPaginate(Math.ceil(data.data.count / 10))
                })
        }
        fetchData()
    }, [currentPage, examId, user.id]);
    // useEffect(() => {
    //     setExamId(searchParams.get('exam'))
    // }, [examId]);


    return (
        <div>
            <HeaderExam params={params} combo={combos} />
            <div className="relative flex w-[calc(100%-373px)] mt-24">
                <div className='w-full'>
                    <div className='relative flex'>
                        <div className='p-4 flex-1' >
                            <div className='bg-white rounded-[10px] p-4'>
                                <section className='flex justify-between items-center border-[1px] border-[#ececec] p-3 rounded-lg'>
                                    <div className='flex items-center justify-center'>
                                        <div className='p-4 h-28 w-28 bg-slate-100 rounded-md mr-5 flex justify-center items-center'>
                                            <Image
                                                width={60}
                                                height={48}
                                                src={`/images/exam_icon.png`}
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className="h-28 pr-10">
                                            <div className='text-[#818894] text-2xl'>{currExam?.title}</div>
                                            <div>
                                                <span className="mr-2">
                                                    Thời gian: {currExam?.period} phút
                                                </span>
                                                <span>
                                                    Số câu: {currExam?.quantity_question}
                                                </span>

                                            </div>
                                            <div className='mt-5'>
                                                <Link href={`/exam/attemp/${currExam?.id}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Làm bài</Link>
                                            </div>
                                        </div>

                                    </div>

                                </section>
                                <div className='mt-10'>
                                    <h3 className='font-bold text-lg'>
                                        Tóm tắt kết quả các lần làm bài trước của bạn.
                                    </h3>
                                    {
                                        assignments?.length === 0 ? <p className='mt-4 text-[#818894]'>Chưa có lần làm bài nào</p> : <div>

                                            <div className='mt-5'>
                                                <div className="relative overflow-x-auto">
                                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                            <tr>
                                                                <th scope="col" className="flex-1 px-6 py-3 text-center">
                                                                    STT
                                                                </th>
                                                                <th scope="col" className="w-1/4 px-6 py-3">
                                                                    Thời gian hoàn thành
                                                                </th>
                                                                <th scope="col" className="w-1/6 px-6 py-3 text-center">
                                                                    Điểm
                                                                </th>
                                                                <th scope="col" className="w-1/3 px-6 py-3 text-center">
                                                                    Thời gian làm bài
                                                                </th>

                                                                <th scope="col" className="w-1/4 px-6 py-3 text-center">
                                                                    Xem lại
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                assignments?.map((assignment: any, index: number) => {

                                                                    return (
                                                                        <tr key={assignment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                                            <th
                                                                                scope="row"
                                                                                className="px-6 py-4 flex-1 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                                            >
                                                                                {index + 1}
                                                                            </th>
                                                                            <td className="w-1/3 px-6 py-4">{convertToVietnamTime(assignment.time_end)}</td>
                                                                            <td className="w-1/6 px-6 py-4 text-center">{(assignment.score || 0).toFixed(1)}</td>
                                                                            <td className="w-1/3 px-6 py-4 text-center">
                                                                                {convertToHourMinuteSecond(assignment.time_to_do || 0)}
                                                                            </td>
                                                                            <td className="w-1/4 px-6 py-4 text-center"><Link href={`/exam/result/${assignment.id}`} className='underline text-blue-500'>Xem lại</Link></td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }


                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <PaginateButton countPaginate={countPaginate} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                                </div>
                            </div>
                        </div >
                    </div>
                </div>
            </div>
            <>
                <div className='w-[373px] min-w-[373px] mt-24 h-full fixed right-0 top-0 border-l-[1px] shadow-sm border-[#f1f1f1]'>
                    <div className='text-left text-lg font-bold mx-4 py-2 mt-2 border-b-[1px] border-[#f1f1f1]'>
                        Danh sách đề thi
                    </div>
                    <div className='overflow-auto h-[400px] sidebar_learning'>
                        <div className=''>
                            <div className='p-4'>
                                <ul>
                                    {combos?.Exams?.map((combo: any) => {
                                        return (
                                            <Link onClick={() => {
                                                setCurrExam(combo)
                                                setExamId(combo.id)
                                            }} key={combo.id} href={`/exam/combo/${params.slug}/list?exam=${combo.id}`}>
                                                <li className='bg-white py-2 px-4 rounded-lg mb-2 list-none border-[1px] border-slate-300 hover:bg-slate-100'>
                                                    <div className={`flex items-center justify-between ${toggle[`open_chapter_${combo.id}`] ? 'pb-2 border-b-[1px] border-slate-200' : ''}`}>
                                                        <div className="flex justify-between items-center">
                                                            <div className="">

                                                                <div className="font-bold text-[rgb(23,19,71)] text-lg text-ellipsis overflow-hidden whitespace-nowrap ">
                                                                    {combo.title}
                                                                </div>
                                                                <div className="font-normal text-[818894] text-xs">
                                                                    {combo.quantity_question} câu
                                                                    | {combo.period} phút
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </Link>
                                        )

                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}