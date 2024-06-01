"use client"
import Link from 'next/link';
import Image from 'next/image';
import { DocumentIcon, EllipsisHorizontalIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactPlayer from 'react-player'
import courseApi from "@/app/api/courseApi"
import TinyMceEditorComment from '@/app/_components/Editor/TinyMceEditorComment'
import parse from 'html-react-parser';
import { formatDateTime, convertTime, convertToVietnamTime } from '@/app/helper/FormatFunction';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useSearchParams } from 'next/navigation';
import { Button, Modal } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import examApi from '@/app/api/examApi';
import PaginateButton from '@/app/_components/Paginate/PaginateButton';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function LearningPage({ params }: { params: { slug: string } }) {
    const searchParams = useSearchParams();
    const [course, setCourse] = useState<any>({})
    const initToggle: any = {}
    const playRef = useRef<any>()
    const [toggle, setToggle] = useState(initToggle)
    const [tab, setTab] = useState(2)
    const [content, setContent] = useState('')
    const [topic, setTopic] = useState<any>({})
    const [comments, setComments] = useState<any>({})
    const [change, setChange] = useState(false)
    const [countPaginate, setCountPaginate] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const { user } = useAppSelector(state => state.authReducer);
    const [modal, setModal] = useState<any>({})
    const editorRef = useRef<any>(null);
    const [assignments, setAssignments] = useState<any>([])
    const [progress, setProgress] = useState<any>({})

    const lectureId = searchParams.get('lecture') || (topic?.type === "lecture" && !searchParams.get('exam') ? topic?.id : null)
    const examId = searchParams.get('exam') || (topic?.type === "exam" && !searchParams.get('lecture') ? topic?.id_exam : null)

    const topicId = lectureId || examId;

    let time: any = 0
    const timeQuery = searchParams.get('time')
    if (timeQuery) {
        time = timeQuery
    }
    else {
        time = JSON.parse(localStorage.getItem('time') || '{}')[params.slug]?.time || 0
    }

    const [isReady, setIsReady] = useState(false);
    const onReady = useCallback(() => {
        if (!isReady) {
            if (playRef.current) {
                playRef?.current?.seekTo(time);
            }
            setIsReady(true);
        }
    }, [isReady, time]);

    const {
        register,
        reset,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()


    function extractTimestamps(text: string) {
        const regex = /(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)|(?:[0-5]\d):(?:[0-5]\d)/g;
        let timestamps = [];
        // Fix: Add --downlevelIteration flag or set --target to 'es2015' or higher
        // @ts-ignore
        if (text) {
            // @ts-ignore
            for (const element of text.matchAll(regex)) {
                timestamps.push(element[0]);
            }
        }
        return timestamps;
    }

    function convertTimestampToUrl(timestamp: any, topicId: string, courseId: string) {
        const timeArray = timestamp.split(':');
        const hours = parseInt(timeArray[0]);
        const minutes = parseInt(timeArray[1]);
        const seconds = parseInt(timeArray[2]);


        let time = 0;
        if (seconds)
            time = hours * 3600 + minutes * 60 + seconds;
        else
            time = hours * 60 + minutes;

        // Ví dụ URL video
        const videoUrl = `http://localhost:3000/course/learning/${courseId}?lecture=${topicId}&time=${time}`;

        return videoUrl;
    }

    function createLink(timestamp: any, url: any) {
        // Tạo link với URL video và timestamp
        const link = `<a href=${url} className="underline text-blue-500">${timestamp}</a>`;

        return link;
    }

    function handleTimeStampe(content: string, topicId: string, courseId: string) {
        // Lấy nội dung phần bình luận
        const text = content;
        let res = text
        // Lấy tất cả timestamp trong text
        const timestamps = extractTimestamps(text);

        timestamps?.forEach(timestamp => {
            // Chuyển đổi timestamp thành URL
            const url = convertTimestampToUrl(timestamp, topicId, courseId);

            // Tạo link
            const link = createLink(timestamp, url);

            // Thay thế timestamp bằng link
            res = res.replace(timestamp, link);
        });
        return res
    };


    useEffect(() => {
        async function fetchData() {
            try {
                const data = await courseApi.get(params.slug);
                setCourse(data.data);
                if (!searchParams.get('lecture') && !searchParams.get('exam')) {
                    setTopic(data.data?.chapters[0]?.topics[0])
                }
                else {
                    data.data?.chapters?.map((chapter: any) => {
                        chapter.topics?.map((topic: any) => {
                            if (topic.id == topicId || topic.id_exam == topicId) {
                                setTopic(topic);
                            }
                        });
                    });
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [params.slug, topicId]);


    useEffect(() => {
        async function fetchData() {
            await courseApi.getProgress(`${user?.id}`, params.slug).then((data: any) => {
                setProgress(data.data)
            }
            ).catch((err: any) => { })
        }
        fetchData()
    }, [params.slug, user?.id, change]);

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

    useEffect(() => {
        async function fetchData() {
            if (lectureId)
                await courseApi.getCommentByTopic(lectureId, currentPage).then((data: any) => {
                    setComments(data.data)
                    setCountPaginate(Math.ceil(data.data.count / 10))
                }
                ).catch((err: any) => { })
        }
        fetchData()
    }, [change, currentPage, lectureId]);

    if (lectureId) {
        return (
            <div className='flex relative h-[calc(100vh-85px)] w-full'>
                <ToastContainer />
                <div className='flex-1'>
                    <div className='flex bg-black p-4 h-full'>
                        <div className='w-full rounded-xl'>
                            <div className='flex flex-col h-full'>
                                <ReactPlayer
                                    onProgress={(state) => {
                                        const storedTime = JSON.parse(localStorage.getItem('time') || '{}');
                                        localStorage.setItem('time', JSON.stringify({
                                            ...storedTime,
                                            [params.slug]: {
                                                topicId: topicId,
                                                time: state.playedSeconds
                                            }
                                        }));
                                    }}
                                    onReady={onReady}
                                    onEnded={() => {
                                        let flag = false
                                        progress.progress.map((p: any) => {
                                            if (p.id_topic == topicId) {
                                                flag = true
                                                return
                                            }
                                        })
                                        if (!flag) {
                                            const formData = {
                                                data: {
                                                    id_student: user.id,
                                                    id_course: params.slug,
                                                    id_topic: topicId
                                                }
                                            }

                                            courseApi.createProgress(formData)
                                            setChange(!change)
                                        }

                                    }} width='100%' height='100%' ref={playRef} controls={true} url={`${topic?.video ? topic?.video : '/'}`} />

                            </div>
                        </div>
                    </div>
                    <div className=' overflow-auto'>

                        <div className='px-10 mt-5'>
                            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <li className="me-2">
                                    <button
                                        type='button'
                                        onClick={() => setTab(2)}
                                        className={`${tab === 2 ? 'text-blue-600 bg-gray-100 active' : 'hover:text-gray-600 hover:bg-gray-50'} inline-block p-4 px-8 rounded-t-lg `}
                                    >
                                        Mô tả
                                    </button>
                                </li>
                                <li className="me-2">
                                    <button
                                        type='button'
                                        onClick={() => setTab(0)}
                                        className={`${tab === 0 ? 'text-blue-600 bg-gray-100 active' : 'hover:text-gray-600 hover:bg-gray-50'} inline-block p-4 px-8 rounded-t-lg `}
                                    >
                                        Bình luận
                                    </button>
                                </li>
                                <li className="me-2">
                                    <button
                                        type='button'
                                        onClick={() => setTab(1)}
                                        className={`${tab === 1 ? 'text-blue-600 bg-gray-100 active' : 'hover:text-gray-600 hover:bg-gray-50'} inline-block p-4 px-8 rounded-t-lg `}
                                    >
                                        Tài liệu
                                    </button>

                                </li>
                            </ul>

                        </div>
                        <div>
                            <div className={`${tab === 0 ? '' : 'hidden'} p-10`}>
                                <p className='font-medium text-xl mb-5'>Bình luận của học sinh</p>
                                <div>
                                    <div className='flex'>
                                        <div className='mr-4'>
                                            <Image
                                                width={45}
                                                height={45}
                                                src={`${user?.avatar ? user?.avatar : '/images/avatar.png'}`}
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <form onSubmit={handleSubmit(async (data) => {

                                                const con = handleTimeStampe(data['content'], topicId, params.slug)


                                                if (data['content'] != '') {
                                                    const formData = {
                                                        data: {
                                                            id_topic: topicId,
                                                            content: con,
                                                        }
                                                    }
                                                    MySwal.fire({
                                                        title: <p className='text-lg'>Đang xử lý</p>,
                                                        didOpen: async () => {
                                                            MySwal.showLoading()
                                                            await courseApi.createComment(formData).then(() => {
                                                                reset()
                                                                editorRef.current.setContent('')
                                                                setChange(!change)
                                                            }).catch((err: any) => { })
                                                            MySwal.close()
                                                        },
                                                    })


                                                }
                                            })}>
                                                <div className={`${toggle[`edit-cmt`] ? 'hidden' : ''}`}>
                                                    <input onFocus={() => {
                                                        setToggle({ ...toggle, [`edit-cmt`]: !toggle[`edit-cmt`] })
                                                    }} type="text" className="bg-gray-50 border-b border-[#ccc] mb-2 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Bạn có thắc mắc gì trong bài học này?" />
                                                </div>
                                                <div className={`${toggle[`edit-cmt`] ? '' : 'hidden'}`}>
                                                    <TinyMceEditorComment value={content} setValue={setValue} position={'content'} editorRef={editorRef} link={`${process.env.NEXT_PUBLIC_BASE_URL_COURSE_LOCAL}/images/single`} />
                                                </div>
                                                <div className='flex justify-end mt-4'>
                                                    <button type="button" className="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200" onClick={() => (setToggle({ ...toggle, [`edit-cmt`]: false }))}>Hủy</button>
                                                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">Bình luận</button>
                                                </div>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                                <div className='mt-10 '>
                                    <p className='font-medium text-lg mb-10'>{comments?.count || 0} bình luận</p>

                                    {
                                        comments?.comments?.map((cmt: any) => {
                                            return (
                                                <div key={cmt.id} className='mt-5' >
                                                    <>
                                                        <Modal show={modal[`delete-comment${cmt.id}`] || false} size="md" onClose={() => setModal({ ...modal, [`delete-comment${cmt.id}`]: false })} popup>
                                                            <Modal.Header />
                                                            <Modal.Body>
                                                                <form className="space-y-6" onSubmit={async (e) => {
                                                                    e.preventDefault()
                                                                    await courseApi.deleteComment(cmt.id).then(() => {
                                                                        toast.success('Xóa bình luận thành công', {
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
                                                                    setModal(false)
                                                                }}>
                                                                    <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                                                    <h3 className="mb-5 text-lg font-normal text-center text-gray-500 dark:text-gray-400">
                                                                        Bạn có chắc muốn xóa bình luận này?
                                                                    </h3>
                                                                    <div className="flex justify-center gap-4">
                                                                        <Button color="failure" type='submit'>
                                                                            Xóa
                                                                        </Button>
                                                                        <Button color="gray" onClick={() => {
                                                                            setModal({ ...modal, [`delete-comment${cmt.id}`]: false })
                                                                        }}>
                                                                            Hủy
                                                                        </Button>
                                                                    </div>
                                                                </form>
                                                            </Modal.Body>
                                                        </Modal>
                                                    </>

                                                    <div className='flex mb-2'>
                                                        <div className=''>
                                                            <Image
                                                                width={50}
                                                                height={50}
                                                                src={`${cmt.user.avatar ? cmt.user.avatar : '/images/avatar.png'}`}
                                                                alt="avatar"
                                                                className='rounded-full'
                                                            />
                                                        </div>
                                                        <div className='mx-2'>
                                                            <div className='w-full'>
                                                                <div className='bg-[#f2f3f5] rounded-xl'>
                                                                    <div className='p-3'>
                                                                        <div className='flex items-center justify-between'>
                                                                            <div className='flex items-center justify-center'>
                                                                                <p className='mr-2 text-[#184983] font-medium'>{cmt.id_user === user.id ? 'Tôi' : cmt.user.name}</p>
                                                                                {
                                                                                    cmt.user.role == "teacher" ? <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">Giáo viên</span> : null
                                                                                }
                                                                                <p className='text-[#828282] text-sm mr-2'>{formatDateTime(cmt.createdAt)}</p>
                                                                            </div>
                                                                            {
                                                                                cmt.id_user === user.id ? <div className='flex'>
                                                                                    <button className='text-red-500 text-sm mr- 2' onClick={() => setModal({ ...modal, [`delete-comment${cmt.id}`]: true })}>Xóa</button>
                                                                                </div> : null
                                                                            }

                                                                        </div>
                                                                        <div>
                                                                            <div className='mt-2 max-w-3xl min-w-80'>{parse(cmt.content)}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='flex items-center justify-start mt-2 mb-5'>
                                                                    <button className='text-black underline hover:text-slate-800 text-md mr-2' onClick={() => {
                                                                        setToggle({ ...toggle, [`edit-cmt${cmt.id}`]: !toggle[`edit-cmt${cmt.id}`] })
                                                                    }}>
                                                                        {cmt.replies?.length || 0} phản hồi
                                                                    </button>
                                                                    <button type='button' className='text-blue-600 hover:text-blue-800 text-md ' onClick={() => {
                                                                        setToggle({ ...toggle, [`form${cmt.id}`]: true, [`edit-cmt${cmt.id}`]: true })
                                                                    }}>Trả lời</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`ml-32 w-4/5 mt-2 ${toggle[`form${cmt.id}`] ? '' : 'hidden'}`}>
                                                        <form onSubmit={handleSubmit(async (data) => {
                                                            if (data[cmt.id] != '') {

                                                                const formData = {
                                                                    data: {
                                                                        id_topic: topicId,
                                                                        content: data[cmt.id],
                                                                        id_parent: cmt.id
                                                                    }
                                                                }
                                                                await courseApi.createComment(formData).catch((err: any) => { })
                                                                // editorRef.current.setContent('')
                                                                reset()
                                                                setChange(!change)
                                                            }
                                                        })}>

                                                            <TinyMceEditorComment value={getValues()[cmt.id]} setValue={setValue} position={`${cmt.id}`} link={`${process.env.NEXT_PUBLIC_BASE_URL_COURSE_LOCAL}/images/single`} />
                                                            <div className='flex justify-end mt-4'>
                                                                <button type="button" className="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200" onClick={() => (setToggle({ ...toggle, [`form${cmt.id}`]: false }))}>Hủy</button>
                                                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">Bình luận</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className={`ml-32 w-4/5 mt-2 ${toggle[`edit-cmt${cmt.id}`] ? '' : 'hidden'}`}>
                                                        {
                                                            cmt.replies.map((reply: any) => {
                                                                return (
                                                                    <div key={reply.id} className='mt-5' >
                                                                        <div className='flex mb-2'>
                                                                            <div className=''>
                                                                                <Image
                                                                                    width={50}
                                                                                    height={50}
                                                                                    src={`${cmt.user.avatar ? cmt.user.avatar : '/images/avatar.png'}`}
                                                                                    alt="avatar"
                                                                                    className='rounded-full'
                                                                                />
                                                                            </div>
                                                                            <div className='mx-2'>
                                                                                <div className='w-full'>
                                                                                    <div className='bg-[#f2f3f5] rounded-xl'>
                                                                                        <div className='p-3'>
                                                                                            <div className='flex items-center'>
                                                                                                <p className='mr-2 text-[#184983] font-medium'>{cmt.user.name}</p>
                                                                                                <p className='text-[#828282] text-sm'>{formatDateTime(reply.createdAt)}</p>
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className='mt-2 max-w-3xl min-w-80'>{parse(reply.content)}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                    <PaginateButton countPaginate={countPaginate} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                                </div>

                            </div>
                            <div className={`${tab === 1 ? '' : 'hidden'} px-10 `}>
                                {topic?.Documents?.length == 0 ? <p className='text-secondary py-5'>Không có tài liệu.</p> :
                                    topic?.Documents?.map((document: any) => {
                                        return (
                                            <div className='py-2' key={document.id}>
                                                <Link
                                                    target='_blank'
                                                    href={document.url}
                                                >
                                                    <button className='py-2 underline'>{document.name}</button>
                                                </Link>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            <div className={`${tab === 2 ? '' : 'hidden'} px-10 py-5`}>
                                <p><span className='font-medium'>Bài giảng:</span> {topic?.name}</p>
                                <p className={`${topic?.description != "" ? topic?.description : "hidden"} mt-2`}>
                                    <span className='font-medium'>Mô tả: </span>
                                    {
                                        topic?.description
                                    }
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className='w-full'>
                <div className='relative flex'>
                    <div className='p-4 flex-1' >
                        <div className='bg-white rounded-[10px] p-4 '>
                            <section className='flex justify-between items-center border-[1px] border-[#ececec] p-3 rounded-lg'>
                                <div className='flex items-center'>
                                    <div className='p-6 bg-slate-100 mr-2 rounded-md'>
                                        <DocumentIcon className='w-8 h-8' />
                                    </div>
                                    <div>
                                        <div className='text-[#818894] text-sm'>BÀI KIỂM TRA</div>
                                        <h3 className='text-xl text-secondary font-bold'>{topic?.name}</h3>
                                        <div>
                                            <span className="mr-2">
                                                Thời gian: {topic?.exam?.data?.period} phút
                                            </span>
                                            <span>
                                                Số câu: {topic?.exam?.data?.quantity_question}
                                            </span>

                                        </div>
                                    </div>

                                </div>
                                <div className='h-1/2'>
                                    <Link href={`/course/learning/${params.slug}/exam/attemp/${examId}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Làm bài</Link>
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
                                                                Hoàn thành
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
                                                                            {!assignment.passed ?
                                                                                <span className="bg-red-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Chưa hoàn thành</span>
                                                                                :
                                                                                <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Hoàn thành</span>}
                                                                        </td>
                                                                        <td className="w-1/4 px-6 py-4 text-center"><Link href={`/course/learning/${params.slug}/exam/result/${assignment.id}`} className='underline text-blue-500'>Xem lại</Link></td>
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
        )
    }


}
