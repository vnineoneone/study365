"use client"
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';
import courseApi from "@/app/api/courseApi"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { AppDispatch, useAppSelector } from "@/redux/store";
import { formatDateTime } from '@/app/helper/FormatFunction';

export default function TopicPage({ params }: { params: { id: string, slug: string } }) {
    const [topic, setTopic] = useState<any>()
    const [toggle, setToggle] = useState<any>({})
    const [change, setChange] = useState(false)
    const { user } = useAppSelector(state => state.authReducer);
    console.log(user);

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
            await courseApi.getTopicForum(params.id, 1).then((data: any) => {
                setTopic(data.data.topic)
            }
            ).catch((err: any) => { })

        }
        fetchData()


    }, [params.id, change]);


    return (
        <div className='w-full'>
            <div className='bg-[#f7fafd] p-4' >
                <div className='bg-white rounded-[10px] p-4'>
                    <section className='rounded-lg border-[1px] border-[#ececec] p-3 flex flex-col justify-center'>
                        <h3 className='text-xl text-secondary font-bold'>{topic?.title}</h3>
                        <span className='mt-2 text-[#818894] text-sm'>Tạo bởi <span className='font-bold'>{topic?.author?.name}</span> in {formatDateTime(topic?.createdAt)}</span>
                        <nav className="flex mt-2 text-[#818894]" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li>
                                    <div className="flex items-center">

                                        <Link
                                            href={`/course/learning/${params.slug}/forum`}
                                            className="text-sm font-medium text-gray-700 hover:text-blue-500  dark:text-gray-400 dark:hover:text-white"
                                        >
                                            Thảo luận
                                        </Link>
                                    </div>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg
                                            className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="m1 9 4-4-4-4"
                                            />
                                        </svg>
                                        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                            {topic?.title}
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </nav>

                    </section>
                    <div className='mt-5'>
                        <div className='mb-6 rounded-lg border-[2px] border-[#ececec] bg-slate-100 p-4'>
                            <div className=' flex w-full'>
                                <div className='flex w-full'>
                                    <div className='flex-1 bg-[#f7fafd] p-2 rounded-lg pb-4'>
                                        <div className='flex flex-col justify-center items-center p-2 pt-0'>
                                            <div className='p-[6px] bg-white rounded-full'>
                                                <Image
                                                    src={`${topic?.author?.avatar ? topic?.author?.avatar : '/images/avatar.png'}`}
                                                    width={80}
                                                    height={80}
                                                    className='rounded-full'
                                                    alt="logo"
                                                />
                                            </div>
                                            <div className='text-center mt-4 flex flex-col items-center '>
                                                <span className=' text-secondary text-sm font-bold'>
                                                    {topic?.author?.name}
                                                </span>
                                                <span className='text-[#818894] text-[0.75rem] mt-2]'>{topic?.author?.role == "teacher" ? "Giáo viên" : "Học sinh"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='ml-7 w-4/5'>
                                        <p className='text-[#818894] text-sm mt-5'>{topic?.description}</p>
                                        {
                                            topic?.file ?
                                                <Link href={topic?.file} target='_blank' download className='bg-[#f7fafd] text-sm mt-2 p-1 flex justify-center items-center rounded-xl text-[#818894] w-28'>
                                                    <PaperClipIcon className='w-4 h-4 mr-2' />
                                                    Đính kèm
                                                </Link> : null
                                        }

                                    </div>

                                </div>
                            </div>

                        </div>
                        {
                            topic?.answer?.length != 0 ?
                                topic?.answers?.map((answer: any, index: any) => {
                                    return (
                                        <div key={index} className='mb-6 rounded-lg border-[1px] border-[#ececec] p-4'>
                                            <div className=' flex w-full'>
                                                <div className='flex w-full'>
                                                    <div className='flex-1 bg-[#f7fafd] p-4 rounded-lg pb-4'>
                                                        <div className=' flex-1 flex flex-col justify-center items-center p-2 pt-0'>
                                                            <div className='p-[6px] bg-white rounded-full'>
                                                                <Image
                                                                    src={`${answer.user?.avatar ? answer.user?.avatar : '/images/avatar.png'}`}
                                                                    width={80}
                                                                    height={80}
                                                                    className='rounded-full'
                                                                    alt="logo"
                                                                />
                                                            </div>
                                                            <div className='text-center mt-4 flex flex-col items-center'>
                                                                <span className=' text-secondary font-bold'>
                                                                    {answer.user?.name}
                                                                </span>
                                                                <span className='text-[#818894] text-[0.75rem] mt-2]'>{answer.user?.role == "teacher" ? "Giáo viên" : "Học sinh"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='ml-7 w-3/6 '>
                                                        <p className='text-[#818894] text-sm'>{answer.content}</p>
                                                        {
                                                            answer.file ?
                                                                <Link href={answer.file} target='_blank' download className='bg-[#f7fafd] text-sm mt-6 p-1 flex justify-center items-center rounded-xl text-[#818894] w-28'>
                                                                    <PaperClipIcon className='w-4 h-4 mr-2' />
                                                                    Đính kèm
                                                                </Link> : null
                                                        }

                                                    </div>
                                                    <div className='w-1/4 flex flex-col justify-between items-end'>
                                                        <div className='text-[#818894] text-sm'>{formatDateTime(answer.createdAt)}</div>
                                                        <div className='flex text-sm'>
                                                            <span className='mr-4 text-[#818894] underline cursor-pointer' onClick={() => setToggle({ ...toggle, [`reply-${answer.id}`]: !toggle[`reply-${answer.id}`] })}>{answer.replies?.length} phản hồi</span>
                                                            <button className='text-blue-500' onClick={() => setToggle({ ...toggle, [`form-${answer.id}`]: true, [`reply-${answer.id}`]: true })}>Phản hồi</button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`border-t-[1px] border-[#ececec] pt-4 flex justify-end items-center mt-10`}>
                                                <div className='w-11/12'>
                                                    <div className={`${toggle[`form-${answer.id}`] ? '' : 'hidden'}`}>

                                                        <div className='mb-6 flex w-full  border-b-[1px] border-[#ececec] pb-6'>
                                                            <div className='flex w-full'>
                                                                <div className='flex-1 h-[180px] bg-[#f7fafd] p-2 rounded-lg flex justify-center items-center'>
                                                                    <div className=' flex-1 flex flex-col justify-center items-center p-2 pt-0'>
                                                                        <div className='p-[6px] bg-white rounded-full'>
                                                                            <Image
                                                                                src={user.avatar ? user.avatar : '/images/avatar.png'}
                                                                                width={60}
                                                                                height={60}
                                                                                className='rounded-full'
                                                                                alt="logo"
                                                                            />
                                                                        </div>
                                                                        <div className='text-center mt-2 flex flex-col items-center'>
                                                                            <span className=' text-secondary font-bold'>
                                                                                {user.name}
                                                                            </span>
                                                                            <span className='text-[#818894] text-[0.75rem] mt-2]'>Học sinh</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='ml-7 w-3/4'>
                                                                    <form onSubmit={handleSubmit(async (data: any) => {
                                                                        if (
                                                                            data[`content-${index}`] != '' && data[`content-${index}`]
                                                                        ) {
                                                                            const formData = {
                                                                                data: {
                                                                                    id_topic_forum: params.id,
                                                                                    id_parent: answer.id,
                                                                                    content: data[`content-${index}`],
                                                                                },
                                                                                file: data[`file-${index}`][0]
                                                                            }
                                                                            await courseApi.createAnswerOfTopic(formData).catch((err: any) => { })
                                                                            setChange(!change)
                                                                            reset()
                                                                        }

                                                                        setValue(`content-${index}`, '')
                                                                    })}>
                                                                        <textarea
                                                                            placeholder="Nhập phản hồi của bạn..."
                                                                            {...register(`content-${index}`)}
                                                                            className="w-full p-2 border rounded focus:ring-0 focus:border-primary_border"
                                                                            rows={2}
                                                                        ></textarea>
                                                                        {/* <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                                                            {errors?.`content-${index}`.message}
                                                                        </div> */}
                                                                        <div className='mt-2 w-1/2'>
                                                                            <div className="mb-2 block">
                                                                            </div>
                                                                            <input  {...register(`file-${index}`)} className="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file" type="file" />
                                                                        </div>
                                                                        <div className='flex justify-end mt-4'>
                                                                            <button type='button' className='h-[36px] px-[22px] mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200' onClick={() => setToggle({ ...toggle, [`form-${answer.id}`]: false })}>Hủy</button>
                                                                            <button type='submit' className='h-[36px] px-[22px] bg-primary shadow-primary_btn_shadow border-primary text-white rounded-md hover:bg-primary_hover'>Phản hồi</button>
                                                                        </div>
                                                                    </form>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`${toggle[`reply-${answer.id}`] ? '' : 'hidden'}`}>

                                                        {
                                                            answer.replies?.map((reply: any) => {
                                                                return (
                                                                    <div key={reply.id} className=''>
                                                                        <div className='mb-6 flex w-full border-b-[1px] border-[#ececec] pb-6'>
                                                                            <div className='flex w-full'>
                                                                                <div className='flex-1 bg-[#f7fafd] p-2 rounded-lg'>
                                                                                    <div className=' flex-1 flex flex-col justify-center items-center p-2 pt-0'>
                                                                                        <div className='p-[6px] bg-white rounded-full'>
                                                                                            <Image
                                                                                                src={`${reply.user?.avatar ? reply.user?.avatar : '/images/avatar.png'}`}
                                                                                                width={60}
                                                                                                height={60}
                                                                                                className='rounded-full'
                                                                                                alt="logo"
                                                                                            />
                                                                                        </div>
                                                                                        <div className='text-center mt-2 flex flex-col items-center'>
                                                                                            <span className=' text-secondary font-bold'>
                                                                                                {reply.user?.name}
                                                                                            </span>
                                                                                            <span className='text-[#818894] text-[0.75rem] mt-2]'>{answer.user?.role == "teacher" ? "Giáo viên" : "Học sinh"}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='ml-7 w-7/12'>
                                                                                    <p className='text-[#818894] text-sm'>{reply.content}</p>
                                                                                    {
                                                                                        reply.file ? <Link href={reply.file} className='bg-[#f7fafd] text-sm mt-6 p-1 flex justify-center items-center rounded-xl text-[#818894] w-28'>
                                                                                            <PaperClipIcon className='w-4 h-4 mr-2' />
                                                                                            Đính kèm
                                                                                        </Link> : null
                                                                                    }

                                                                                </div>
                                                                                <div className='w-1/6 flex flex-col justify-between items-end'>
                                                                                    <div className='text-[#818894] text-sm'>{formatDateTime(reply.createdAt)}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                : <div className='mb-6 rounded-lg border-[1px] border-[#ececec] p-4 py-8 my-6 text-[#818894]'>
                                    Không có phản hồi nào cho chủ đề này.
                                </div>
                        }


                    </div>
                    <div className='mt-5'>
                        <h3 className='text-secondary font-bold text-xl'>Phản hồi</h3>
                        <div className='mt-4 rounded-lg border-[1px] border-[#ececec] p-4 flex w-full'>
                            <div className='flex w-full'>
                                <div className='flex-1 h-[180px] bg-[#f7fafd] p-4 rounded-lg flex justify-center items-center'>
                                    <div className=' flex-1 flex flex-col justify-center items-center p-2 pt-0'>
                                        <div className='p-[6px] bg-white rounded-full'>
                                            {
                                                <Image
                                                    src={`${user?.avatar ? user?.avatar : '/images/avatar.png'}`}
                                                    width={80}
                                                    height={80}
                                                    className='rounded-full'
                                                    alt="logo"
                                                />
                                            }

                                        </div>
                                        <div className='text-center mt-4 flex flex-col items-center'>
                                            <span className=' text-secondary font-bold'>
                                                {user.name}
                                            </span>
                                            <span className='text-[#818894] text-[0.75rem] mt-2]'>Học sinh</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='ml-7 w-3/4 flex flex-col'>
                                    <form onSubmit={handleSubmit(async (data: any) => {
                                        if (data.content != '' && data.content) {
                                            const formData = {
                                                data: {
                                                    id_topic_forum: params.id,
                                                    content: data.content,

                                                },
                                                file: data.file[0]
                                            }
                                            await courseApi.createAnswerOfTopic(formData).catch((err: any) => { }).catch((err: any) => { })
                                        }
                                        setChange(!change)
                                        reset()
                                    })}>
                                        <textarea
                                            placeholder="Nhập phản hồi của bạn..."
                                            {...register("content")}
                                            className="w-full p-2 border rounded focus:ring-0 focus:border-primary_border"
                                            rows={4}
                                        ></textarea>
                                        {/* <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                            {errors?.content?.message}
                                        </div> */}
                                        <div className='mt-2 w-full flex justify-between items-center'>
                                            <input  {...register('file')} className="block w-1/2 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file" type="file" />
                                            <div className='flex justify-end'>
                                                <button type='submit' className='h-[36px] px-[22px] bg-primary shadow-primary_btn_shadow border-primary text-white rounded-md hover:bg-primary_hover'>Phản hồi</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div >
        </div>

    )
}
