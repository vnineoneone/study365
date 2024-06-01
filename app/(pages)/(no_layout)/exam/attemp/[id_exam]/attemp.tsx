"use client"
import { Fragment, useRef, useState, useEffect } from 'react';
import parse from 'html-react-parser';
import Link from 'next/link';
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import examApi from '@/app/api/examApi';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function AttempExam({ params, exam }: { params: { slug: string, id_exam: string }, exam: any }) {
    const [open, setOpen] = useState(true);
    const [countDownTime, setCountDownTime] = useState('00:00');
    const [openSidebar, setOpenSideBar] = useState(true);
    const intervalRef = useRef<any>(null);
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];
    const COUNTER_KEY = 'countdown';
    const [answers, setAnswers] = useState(() => {
        // Lấy các đáp án từ localStorage khi khởi tạo state
        const savedAnswers = localStorage.getItem('answers');
        return savedAnswers ? JSON.parse(savedAnswers) : {};
    });
    const router = useRouter()

    const handleAnswerChange = (questionId: string, answer: any, checked: boolean, multi_choice: boolean) => {
        setAnswers((prevAnswers: any) => {
            let newAnswers = { ...prevAnswers };

            if (multi_choice) {
                // Nếu câu hỏi cho phép chọn nhiều đáp án
                if (checked) {
                    // Nếu đáp án được chọn, thêm nó vào danh sách các đáp án cho câu hỏi này
                    newAnswers[questionId] = [...(newAnswers[questionId] || []), answer];
                } else {
                    // Nếu đáp án bị bỏ chọn, loại bỏ nó khỏi danh sách các đáp án cho câu hỏi này
                    newAnswers[questionId] = newAnswers[questionId].filter((a: any) => a !== answer);
                }
            } else {
                // Nếu câu hỏi chỉ cho phép chọn một đáp án
                if (checked) {
                    // Nếu đáp án được chọn, đặt nó làm đáp án cho câu hỏi này
                    newAnswers[questionId] = answer;

                } else {
                    // Nếu đáp án bị bỏ chọn, xóa đáp án cho câu hỏi này
                    delete newAnswers[questionId];
                }
            }

            // Lưu các đáp án vào localStorage
            localStorage.setItem('answers', JSON.stringify(newAnswers));

            return newAnswers;
        });
    };

    const {
        register,
        getValues,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: answers,
    })


    function convertTime(i: number) {
        let hours = parseInt(`${i / 3600}`, 10);
        let minutes = parseInt(`${(i - hours * 3600) / 60}`, 10);
        let seconds = parseInt(`${i % 60}`, 10);

        let hoursString = hours < 10 ? '0' + hours : hours;
        let minutesString = minutes < 10 ? '0' + minutes : minutes;
        let secondsString = seconds < 10 ? '0' + seconds : seconds;

        if (hoursString == '00')
            return minutesString + ':' + secondsString
        else
            return hoursString + ':' + minutesString + ':' + secondsString

    }

    function countDown(i: number, callback: any) {
        intervalRef.current = setInterval(function () {
            setCountDownTime(convertTime(i));
            if (i-- > 0) {
                window.localStorage.setItem(`${COUNTER_KEY}`, `${i}`);
            } else {
                window.localStorage.removeItem(`${COUNTER_KEY}`);
                clearInterval(intervalRef.current);
                callback();
            }
        }, 1000);
    }

    async function submitTest(formData: any) {
        let data: any = {
            id_exam: params.id_exam,
            time_start: localStorage.getItem(`${COUNTER_KEY}`) ? Date.now() - (exam.period * 60 - Number(localStorage.getItem(`${COUNTER_KEY}`))) * 1000 : Date.now() - exam.period * 60 * 1000,
            time_end: Date.now(),
            id_topic: exam.id_topic,
            assignment: []
        }
        exam.questions.map((question: any) => {
            data.assignment.push({
                id_question: question.id,
                answers: question.answers.map((answer: any) => {
                    return {
                        id_answer: answer.id,
                        is_selected: formData[question.id] ? formData[question.id].includes(answer.id) : false
                    }
                })

            })
        })
        MySwal.fire({
            title: <p className='text-lg'>Đang xử lý</p>,
            didOpen: () => {
                MySwal.showLoading()

                examApi.submitExam({ data })
                    .then(() => {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                        window.localStorage.removeItem(`${COUNTER_KEY}`);
                        window.localStorage.removeItem('answers');
                        MySwal.fire({
                            title: <p className="text-2xl">Hoàn thành bài làm</p>,
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1000
                        }).then(() => {
                            router.push(`/exam/combo/${exam?.Combos[0]?.id}/list?exam=${params.id_exam}`)
                        })

                    }).catch((err: any) => {
                        MySwal.fire({
                            title: <p className="text-2xl">Đã xảy ra lỗi</p>,
                            icon: 'error',
                            showConfirmButton: false,
                            timer: 1000
                        })
                    })
            },
        })
        // examApi.submitExam({ data }).then(() => {
        //     clearInterval(intervalRef.current);
        //     intervalRef.current = null;
        //     window.localStorage.removeItem(`${COUNTER_KEY}`);
        //     window.localStorage.removeItem('answers');
        //     router.push(`/exam/combo/${exam?.Combos[0]?.id}/list?exam=${params.id_exam}`)
        // }).catch((err: any) => { });
    }


    useEffect(() => {
        // Lưu các đáp án vào localStorage mỗi khi state thay đổi
        localStorage.setItem('answers', JSON.stringify(answers));
    }, [answers])

    useEffect(() => {
        if (exam?.period) {
            var countDownTime = Number(window.localStorage.getItem(COUNTER_KEY)) || exam?.period * 60;
            countDown(countDownTime, function () {
                alert('Hết giờ làm bài!!!');

                submitTest(getValues());

            });
        }

    }, [exam?.period]);





    let listQuestion;
    if (exam) {
        listQuestion = exam?.questions?.map((question: any, index: number) => {
            if (question.multi_choice) {
                return (
                    <div id={`question${index + 1}`} key={index} className="mb-4">
                        <div className="text-lg  mb-[-10px] font-normal text-[#000] flex">
                            <span className="font-semibold text-[#153462] flex mr-1">Câu {index + 1}: </span>
                            {parse(question.content_text || '')}
                        </div >
                        {
                            question.content_image && <div className='relative w-1/2 h-64 mt-5 z-0'>
                                <Image
                                    src={question.content_image}
                                    fill
                                    className='w-full h-full overflow-hidden object-cover object-center'
                                    alt="logo"
                                />
                            </div>
                        }
                        <div>
                            <ul
                                className="mt-4 text-base text-gray-900 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                {question.answers.map((answer: any, index: number) => {
                                    return (
                                        <li key={index} className="flex items-center mb-4">

                                            <input
                                                {...register(`${question.id}`, {
                                                    required: "Câu hỏi chưa hoàn thành.",
                                                })}
                                                id={question.id}
                                                type="checkbox"
                                                value={answer.id}
                                                name={question.id}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(question.id, answer.id, e.target.checked, true)}
                                            />
                                            <p className='ml-2 mr-1'>{alphabet[index]}.</p>
                                            <label
                                                htmlFor={question.id}
                                                className="font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                {parse(answer.content_text || '')}
                                            </label>
                                            {
                                                answer.content_image && <div className='relative w-1/2 h-64 mt-5 z-0'>
                                                    <Image
                                                        src={answer.content_image}
                                                        fill
                                                        className='w-full h-full overflow-hidden object-cover object-center'
                                                        alt="logo"
                                                    />
                                                </div>
                                            }
                                        </li>
                                    );
                                })}
                                {errors?.[question.id]?.message && (
                                    <p className='text-sm text-red-400'>{`${errors?.[question.id]?.message}`}</p>
                                )}
                            </ul>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div id={`question${index + 1}`} key={index} className="mb-4">
                        <div className="text-lg  mb-[-10px] font-normal text-[#000] flex">
                            <span className="font-semibold text-[#153462] flex mr-1">Câu {index + 1}: </span> {parse(question.content_text || '')}
                        </div >
                        {
                            question.content_image && <div className='relative w-1/2 h-64 mt-5 z-0'>
                                <Image
                                    src={question.content_image}
                                    fill
                                    className='w-full h-full overflow-hidden object-cover object-center'
                                    alt="logo"
                                />
                            </div>
                        }
                        <div>
                            <ul
                                className="mt-6 text-base text-gray-900 rounded-lg dark:bg-gray-700 dark:text-white"

                            >
                                {question.answers.map((answer: any, index: number) => {
                                    return (
                                        <li key={index} className=" mb-5">
                                            <div className="flex items-center mb-2">
                                                <input  {...register(`${question.id}`, { required: "Câu hỏi chưa hoàn thành." })} id={answer.id} type="radio" value={answer.id} name={question.id} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(question.id, answer.id, e.target.checked, false)} />
                                                <p className='ml-2 mr-1'>{alphabet[index]}.</p>

                                                <label htmlFor="default-radio-1" className="font-medium text-gray-900 dark:text-gray-300">{parse(answer.content_text || '')}</label>
                                            </div>
                                            {
                                                answer.content_image && <div className='relative w-1/2 h-64 mt-5 z-0'>
                                                    <Image
                                                        src={answer.content_image}
                                                        fill
                                                        className='w-full h-full overflow-hidden object-cover object-center'
                                                        alt="logo"
                                                    />
                                                </div>
                                            }
                                        </li>
                                    );
                                })}
                                {errors?.[question.id]?.message && (
                                    <p className='text-sm text-red-400'>{`${errors?.[question.id]?.message}`}</p>
                                )}
                            </ul>
                        </div>
                    </div >
                );
            }
        });
    }


    return (
        <form onSubmit={handleSubmit((data) => {

            submitTest(data)

        })} className="bg-[#FBFAF9] relative py-10 min-h-screen">
            <div className="px-10 py-5 bg-[#153462] fixed w-full top-0 left-0 z-10">
                <div className="flex justify-between h-full items-center">
                    <div className="text-[#fff] text-[22px] font-medium text-center ">{exam?.title}</div>
                    <div className="text-white text-[22px] font-medium" id="displayDiv">{countDownTime}</div>
                </div>
            </div>

            <div className="flex flex-row j mx-3 mt-12">
                <div
                    className={`px-10 ${openSidebar ? "w-[74%]" : "flex-1 px-10 mr-12 ml-10"}  bg-white rounded-xl py-3`}
                    style={{
                        boxShadow: '0px 0px 4px 0px #00000040',
                    }}
                >
                    {listQuestion}
                </div>

                <div
                    className={`${openSidebar ? "" : "hidden"} ml-5 bg-white p-4 min-h-svh h-auto top-[75px] fixed right-0 w-1/4 shadow-lg`}

                >
                    <button type='button' onClick={() => setOpenSideBar(false)}>
                        <XMarkIcon className='w-5 h-5 absolute top-3 right-3 font-bold' />
                    </button>
                    <div className="border-[1px] border-[#ececec] shadow-sm rounded-xl p-3 mt-4">
                        <p className="rounded-md text-center font-medium text-lg text-[#153462] mb-5">Điều hướng bài kiểm tra</p>
                        <div className="grid grid-cols-5 justify-items-center gap-y-3">{
                            exam?.questions?.map((question: any, index: number) => {
                                if (answers[question.id]?.length === 0 || !answers[question.id]) {
                                    return (
                                        <Link
                                            href={`#question${index + 1}`}
                                            key={index}
                                            className="bg-[#f0efef] p-2 w-10 h-10 rounded-xl flex justify-center items-center font-normal"
                                            style={{
                                                boxShadow: '0px 1px 4px 0px #00000033 -1px -1px 4px 0px #00000026 inset 1px 1px 4px 0px #0000001A inset',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            {index + 1}
                                        </Link>
                                    );
                                } else {
                                    return (
                                        <Link
                                            href={`#question${index + 1}`}
                                            key={index}
                                            className="p-2 w-10 h-10 rounded-xl flex justify-center items-center font-normal text-[#2FD790]"
                                            style={{
                                                background: 'rgba(47, 215, 144, 0.15)',
                                                boxShadow: '1px 1px 2px 0px #2FD79040 1px 1px 3px 0px #2FD7905C inset -1px -1px 2px 0px #2FD79052 inset',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            {index + 1}
                                        </Link>
                                    );
                                }
                            })}</div>
                        <div className="text-center mt-10 mb-2">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => {
                                    setOpen(true);
                                }}
                                type='submit'
                            >
                                Nộp bài
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`${openSidebar ? "hidden" : ""}  top-[85px] fixed right-2`}>
                    <button type="button" className='p-2 bg-white flex shadow-md items-center justify-center rounded-lg' onClick={() => setOpenSideBar(true)}>
                        <ChevronLeftIcon className='w-5 h-5 font-bold ' />
                    </button>
                </div>
            </div>
        </form>
    );
}
