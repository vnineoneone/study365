"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import notifyApi from '@/app/api/notifyApi';
import { useAppSelector } from '@/redux/store';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { convertToVietnamTime } from '@/app/helper/FormatFunction';
import Paginate from '@/app/_components/Paginate/Paginate';
import { useSearchParams } from 'next/navigation';

export default function NotifycationDashboard() {
    const [notifycations, setNotifycations] = useState<any>([])
    const { user } = useAppSelector(state => state.authReducer);
    const [countPaginate, setCountPaginate] = useState(1)
    const searchParams = useSearchParams()
    const page = searchParams.get('page') || '1'

    useEffect(() => {
        async function fetchData() {
            if (user) {

                await notifyApi.getNotify(`${user.id}`, page).then((data) => {
                    setNotifycations(data.data.notifications)
                    setCountPaginate(Math.ceil(data.data.count / 10))
                }).catch((err: any) => { })

            }
        }
        fetchData()
    }, [page, user]);
    return (
        <div>
            <div className="font-bold text-[#171347] text-lg">Thông báo</div>
            <div className='mt-10'>
                {
                    notifycations?.map((notify: any, index: any) => {
                        return (
                            <div key={notify.id} className='rounded-md bg-white shadow-sm mb-5 px-10 py-5'>

                                <div className='flex items-center justify-between'>
                                    <div className="text-[#171347] text-sm font-semibold w-1/3 flex flex-col justify-center items-start ">
                                        <div className='mb-2'>

                                            <div>
                                                {
                                                    notify.read ? null : <span className="mr-1 inline-block rounded-full bg-red-500 h-[10px] w-[10px]"></span>
                                                }
                                                Thông báo mới từ
                                                <span className='ml-1'>{notify.type === 'teacher' ? `giáo viên ${notify.name}` : "hệ thống"}</span>
                                            </div>
                                        </div>
                                        <span className='text-[#818894] text-xs'>
                                            {convertToVietnamTime(notify.createdAt)}
                                        </span>
                                    </div>
                                    <div className="text-gray-500 text-sm flex-1 text-start px-5">
                                        {notify.type === 'teacher' && (
                                            <> {notify.content}</>
                                        )}
                                        {notify.type === 'assignment exam' && (
                                            <>giáo viên {notify.name} đã đánh giá bài làm của bạn trong bài kiểm tra {notify.exam_name} </>
                                        )}
                                        {notify.type === 'assignment exercise' && (
                                            <>giáo viên {notify.name} đã đánh giá bài làm của bạn trong bài tập {notify.exam_name} </>
                                        )}
                                        {notify.type === 'topic' && (
                                            <>Có người vừa tạo chủ đề {notify.name} trong khóa học{notify.course_name}</>
                                        )}
                                    </div>
                                    <div className='w-1/12 flex justify-center items-center'>

                                        {
                                            notify.type === 'teacher' && (<div className="text-gray-500 text-sm w-1/12 flex justify-center items-center">
                                                <button type='button' onClick={async () => { if (!notify.read) await notifyApi.readNotify({ data: [notify.id] }) }} className='px-4 py-2 border-[1px] border-gray-200 rounded-md hover:text-white hover:bg-primary'>Xem</button>
                                            </div>)
                                        }
                                        {
                                            notify.type === 'assignment exam' && (<Link href={`/exam/result/${notify.id_assignment}`} className="text-gray-500 text-sm w-1/12 flex justify-center items-center">
                                                <button type='button' onClick={async () => { if (!notify.read) await notifyApi.readNotify({ data: [notify.id] }) }} className='px-4 py-2 border-[1px] border-gray-200 rounded-md hover:text-white hover:bg-primary'>Xem</button>
                                            </Link>)
                                        }
                                        {
                                            notify.type === 'assignment exercise' && (<Link href={`/course/learning/${notify.id_course}/exam/result/${notify.id_assignment}`} className="text-gray-500 text-sm w-1/12 flex justify-center items-center">
                                                <button type='button' onClick={async () => { if (!notify.read) await notifyApi.readNotify({ data: [notify.id] }) }} className='px-4 py-2 border-[1px] border-gray-200 rounded-md hover:text-white hover:bg-primary'>Xem</button>
                                            </Link>)
                                        }
                                        {
                                            notify.type === 'topic' && (<Link href={`/course/learning/${notify.id_course}/forum/${notify.id_topic}`} className="text-gray-500 text-sm w-1/12 flex justify-center items-center">
                                                <button type='button' onClick={async () => { if (!notify.read) await notifyApi.readNotify({ data: [notify.id] }) }} className='px-4 py-2 border-[1px] border-gray-200 rounded-md hover:text-white hover:bg-primary'>Xem</button>
                                            </Link>)
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
            < Paginate countPaginate={countPaginate} currentPage={page} />
        </div>

    )
}
