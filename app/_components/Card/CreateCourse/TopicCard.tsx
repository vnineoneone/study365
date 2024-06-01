import { useEffect, useRef, useState } from 'react'
import {
    ExclamationCircleIcon, DocumentTextIcon, ArrowsPointingOutIcon,
    TrashIcon, ChevronDownIcon, ChevronUpIcon, BookOpenIcon, EllipsisVerticalIcon, XMarkIcon
} from "@heroicons/react/24/outline"
import uuid from 'react-uuid';
import { Dropdown, Label, TextInput } from 'flowbite-react';
import { Button, Modal } from 'flowbite-react';
// import { ToastContainer, toast } from 'react-toastify';
import ReactPlayer from 'react-player';
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

import { useFieldArray, useForm } from 'react-hook-form';
import Link from 'next/link';
import { AnswerCard } from './AnswerCard';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '../../React_Beautiful_Dnd/StrictModeDroppable';
import { QuestionCard } from './QuestionCard';
import CustomCKEditor from '../../Editor/CKEditor';

export const TopicCard = ({ chapter, topic, indexChapter, indexTopic, hanldeForm, innerRef, provided, data, setData,
    removeTopic, fieldsTopic, setTypeSubmit, id_course }: any) => {
    const initToggle: any = {}
    const [toggle, setToggle] = useState(initToggle)
    const [modal, setModal] = useState(initToggle)
    const [files, setFiles] = useState()
    const [questions, setQuestions] = useState(topic?.questions)
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        control,
        trigger,
        formState: { errors },
    } = hanldeForm
    const { fields: fieldsQuestion, append: appendQuestion, remove: removeQuestion } = useFieldArray({
        control,
        name: `chapters.${indexChapter}.topics.${indexTopic}.questions`
    });
    useEffect(() => {
        setQuestions(topic?.questions)
    }, [topic]);
    const reorder = (list: Array<any>, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    const notify = () => {

    };
    const handleDeleteTopic = async () => {
        removeTopic(indexTopic)

        setData((data: any) => {
            data.chapters[indexChapter].topics?.splice(indexTopic, 1)
            return data
        })
        setModal({ ...modal, [`delete-topic${topic.key}`]: false })
        notify()

    };
    const handleUpdateTopic = async (position: string) => {
        const isValid = await trigger(`${position}`);
        if (isValid) {
            setToggle({ ...toggle, [`edit_lecture_${topic.key}`]: false })
            notify()
        }
    };
    const handleAddQuestion = async (position: string) => {
        const isValid = await trigger(`${position}`);
        if (isValid) {
            setModal({ ...modal, [`add_question_${topic.key}`]: false })
            notify()
        }
    };


    return (
        <div ref={innerRef} {...provided.draggableProps}  >
            <>
                <Modal show={modal[`delete-topic${topic.key}`]} size="md" onClose={() => setModal({ ...modal, [`delete-topic${topic.key}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="space-y-6">
                            <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-center text-gray-500 dark:text-gray-400">
                                Bạn có chắc muốn xóa chủ đề này?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" type='submit' onClick={() => {
                                    handleDeleteTopic()
                                }}>
                                    Xóa
                                </Button>
                                <Button color="gray" onClick={() => {
                                    setModal({ ...modal, [`delete-topic${topic.key}`]: false })
                                }}>
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </>

            <>
                <Modal show={modal[`add_question_${topic.key}`]} size="3xl" onClose={() => setModal({ ...modal, [`add_question_${topic.key}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="space-y-6">

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Thêm câu hỏi</h3>

                            {fieldsQuestion?.map((field: any, indexQuestion: any) => (

                                indexQuestion == fieldsQuestion?.length - 1 ?
                                    <div key={field.id}>
                                        <div className='mb-5'>
                                            <div className="mb-2 block">
                                                <Label htmlFor="email" value="Tiêu đề câu hỏi" />
                                            </div>
                                            <CustomCKEditor className="h-50" setValue={setValue} value="" position={`chapters.${indexChapter}.topics.${indexTopic}.questions.${indexQuestion}.content_text`} />
                                            <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                                {errors?.chapters?.[indexChapter]?.topics?.[indexTopic]?.questions?.[indexQuestion]?.content_text?.message}
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <div className="mb-2 block">
                                                <Label htmlFor="email" value="Giải thích" />
                                            </div>

                                            <CustomCKEditor className="h-50" setValue={setValue} value="" position={`chapters.${indexChapter}.topics.${indexTopic}.questions.${indexQuestion}.explain`} />
                                            <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                                {errors?.chapters?.[indexChapter]?.topics?.[indexTopic]?.questions?.[indexQuestion]?.content_text?.explain}
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <div className="flex-1 flex items-center justify-end">
                                                <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">Câu hỏi có nhiều đáp án đúng</label>
                                                <input  {...register(`chapters.${indexChapter}.topics.${indexTopic}.questions.${indexQuestion}.multi_choice`)} id="default-checkbox" type="checkbox" className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            </div>

                                        </div>

                                        <AnswerCard indexChapter={indexChapter} indexTopic={indexTopic} hanldeForm={hanldeForm} indexQuestion={indexQuestion} setModal={setModal} modal={modal} topic={topic} />
                                    </div>
                                    : null

                            ))}


                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setModal({ ...modal, [`add_question_${topic.key}`]: false })
                                        removeQuestion(fieldsQuestion?.length - 1)
                                    }
                                    }
                                    type="button"
                                    className="mr-4 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                >
                                    Hủy
                                </button>
                                <div>
                                    <button
                                        onClick={() => {
                                            handleAddQuestion(`chapters.${indexChapter}.topics.${indexTopic}.questions.${fieldsQuestion?.length - 1}`)
                                        }
                                        }
                                        type="button"
                                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Tạo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </>

            <li className={`mt-6 pt-4 border-t-[1px] border-[#ececec]`}>
                <div className="px-5 py-6 bg-white rounded-[0.625rem] border-[1px] border-[#ececec]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="flex justify-center items-center w-10 h-10 bg-[#f1f1f1] rounded-full mr-[10px]">
                                {
                                    topic?.type == "lecture" ? <BookOpenIcon className="w-6 h-6 text-[#818894]" /> : <DocumentTextIcon className="w-6 h-6 text-[#818894]" />
                                }

                            </span>
                            <div>
                                <span className="font-bold text-[#171347] text-lg">
                                    {topic.type == "lecture" ? topic.name : topic.title}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <button type="button" className="mr-[10px] text-red-500">
                                <TrashIcon className="w-6 h-6"
                                    onClick={() => {
                                        setModal({ ...modal, [`delete-topic${topic.key}`]: true })
                                    }}
                                />
                            </button>
                            <div className='flex justify-center items-center'  {...provided.dragHandleProps} >
                                <button type="button" className="mr-[10px] text-[#a4c4fa]" style={{
                                }} >
                                    <ArrowsPointingOutIcon className="w-6 h-6" />
                                </button>
                            </div>
                            {
                                !toggle[`edit_${topic?.type}_${topic.key}`] ?
                                    <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                        setToggle({ ...toggle, [`edit_${topic?.type}_${topic.key}`]: true })
                                    }}>
                                        <ChevronDownIcon className="w-5 h-5" />
                                    </button>
                                    :
                                    <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                        setToggle({ ...toggle, [`edit_${topic?.type}_${topic.key}`]: false })
                                    }}>
                                        <ChevronUpIcon className="w-5 h-5" />
                                    </button>
                            }
                        </div>
                    </div>

                    <div className={`${toggle[`edit_lecture_${topic.key}`] ? "" : "hidden"}  mt-3 pt-4 border-t-[1px] border-[#ececec]`}>

                        {
                            topic?.type == "lecture" ?
                                <div className="mt-3">
                                    <div className="mb-5 w-1/3">
                                        <label
                                            htmlFor="title"
                                            className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                        >
                                            Tiêu đề
                                        </label>
                                        <input
                                            {...register(`chapters.${indexChapter}.topics.${indexTopic}.name`, {
                                                required: "Tên bài giảng không thể thiếu",
                                            })}
                                            type="text"
                                            className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                        />

                                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                            {errors.chapters?.[indexChapter]?.topics?.[indexTopic]?.name?.message}
                                        </p>
                                    </div>
                                    <div className="mb-5 w-1/2">
                                        <label
                                            htmlFor="title"
                                            className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                        >
                                            Mô tả
                                        </label>
                                        <textarea
                                            {...register(`chapters.${indexChapter}.topics.${indexTopic}.description`)}
                                            rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Viết mô tả cho chủ đề..."></textarea>

                                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                            {errors.chapters?.[indexChapter]?.topics?.[indexTopic]?.description?.message}
                                        </p>
                                    </div>
                                    <div className='w-1/2'>
                                        <label
                                            className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                                            htmlFor="video"
                                        >
                                            Video bài giảng
                                        </label>
                                        <FilePond
                                            files={files}
                                            onupdatefiles={() => setFiles}
                                            acceptedFileTypes={['video/*']}
                                            server={{
                                                process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                                                    const formData = new FormData();
                                                    formData.append(fieldName, file, `${indexChapter + 1}-${indexTopic + 1}-${file.name}`);
                                                    const data = { id_course: id_course }
                                                    console.log(formData.get('video'));

                                                    formData.append('data', JSON.stringify(data));

                                                    const request = new XMLHttpRequest();
                                                    request.open('POST', `${process.env.NEXT_PUBLIC_BASE_URL_COURSE_LOCAL}/videos`)

                                                    request.upload.onprogress = (e) => {
                                                        progress(e.lengthComputable, e.loaded, e.total);
                                                    };

                                                    request.onload = function () {
                                                        if (request.status >= 200 && request.status < 300) {
                                                            // the load method accepts either a string (id) or an object
                                                            load(request.responseText);
                                                        } else {
                                                            // Can call the error method if something is wrong, should exit after
                                                            error('oh no');
                                                        }
                                                    };
                                                    request.send(formData);
                                                    // courseApi.uploadVideo(formData)
                                                }
                                            }
                                            }

                                            name="video"
                                            labelIdle='Kéo & thả hoặc <span class="filepond--label-action">Tìm kiếm</span>'
                                        />
                                    </div>
                                    <div className='w-1/2'>
                                        <label
                                            className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                                            htmlFor="video"
                                        >
                                            Tài liệu
                                        </label>
                                        <FilePond
                                            files={files}
                                            onupdatefiles={() => setFiles}
                                            allowMultiple={true}
                                            server={{
                                                process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                                                    const formData = new FormData();
                                                    formData.append(fieldName, file, `${indexChapter + 1}-${indexTopic + 1}-${file.name}`);
                                                    const data = { id_course: id_course }

                                                    formData.append('data', JSON.stringify(data));

                                                    const request = new XMLHttpRequest();
                                                    request.open('POST', `${process.env.NEXT_PUBLIC_BASE_URL_COURSE_LOCAL}/document`)

                                                    request.upload.onprogress = (e) => {
                                                        progress(e.lengthComputable, e.loaded, e.total);
                                                    };

                                                    request.onload = function () {
                                                        if (request.status >= 200 && request.status < 300) {
                                                            // the load method accepts either a string (id) or an object
                                                            load(request.responseText);
                                                        } else {
                                                            // Can call the error method if something is wrong, should exit after
                                                            error('oh no');
                                                        }
                                                    };
                                                    request.send(formData);
                                                    // courseApi.uploadVideo(formData)
                                                }
                                            }
                                            }

                                            name="video"
                                            labelIdle='Kéo & thả hoặc <span class="filepond--label-action">Tìm kiếm</span>'
                                        />


                                        <div className="mb-5 w-full">
                                            <div
                                                className="block mr-2 text-sm font-semibold text-[14px] text-[#171347] "
                                            >
                                                Trạng thái
                                            </div>
                                            <div className="mt-2">
                                                <label className="relative inline-flex items-center me-5 cursor-pointer">
                                                    <div className="flex">
                                                        <div className="flex items-center me-4" >
                                                            <input
                                                                id="inline-radio"
                                                                type="radio"
                                                                defaultChecked={topic.status == "public" ? true : false}
                                                                {...register(`chapters.${indexChapter}.topics.${indexTopic}.status`)}
                                                                value="public"
                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            />
                                                            <label
                                                                htmlFor="inline-radio"
                                                                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                            >
                                                                Công khai
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center me-4" >
                                                            <input
                                                                id="inline-radio"
                                                                type="radio"
                                                                defaultChecked={topic.status == "paid" ? true : false}
                                                                {...register(`chapters.${indexChapter}.topics.${indexTopic}.status`)}
                                                                value="paid"
                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            />
                                                            <label
                                                                htmlFor="inline-radio"
                                                                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                            >
                                                                Tính phí
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center me-4">
                                                            <input
                                                                id="inline-2-radio"
                                                                type="radio"
                                                                defaultChecked={topic.status == "private" ? true : false}
                                                                {...register(`chapters.${indexChapter}.topics.${indexTopic}.status`)}
                                                                value="private"
                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            />
                                                            <label
                                                                htmlFor="inline-2-radio"
                                                                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                            >
                                                                Riêng tư
                                                            </label>
                                                        </div>

                                                    </div>
                                                </label>
                                            </div>

                                        </div>

                                        <div className="mb-2">
                                            <button
                                                onClick={() => {
                                                    setToggle({ ...toggle, [`edit_topic_${topic.key}`]: false })
                                                    reset({ [`chapters.${indexChapter}.topics.${indexTopic}`]: {} })

                                                }} type="button" className="mr-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Huỷ</button>
                                            <button type="button" onClick={() => {
                                                handleUpdateTopic(`chapters.${indexChapter}.topics.${indexTopic}`)
                                            }}
                                                className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">Lưu</button>
                                        </div>
                                    </div>
                                </div> : null
                        }
                    </div>
                    <div className={`${toggle[`edit_exam_${topic.key}`] ? "" : "hidden"}  mt-3 pt-4 border-t-[1px] border-[#ececec]`}>

                        {
                            topic?.type == "exam" ?
                                <div className="mt-3">
                                    <div className="mb-5 w-1/3">
                                        <label
                                            className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                        >
                                            Tiêu đề
                                        </label>
                                        <input
                                            {...register(`chapters.${indexChapter}.topics.${indexTopic}.name`, {
                                                required: "Tên bài giảng không thể thiếu",
                                            })}
                                            type="text"
                                            className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                        />

                                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                            {errors.chapters?.[indexChapter]?.topics?.[indexTopic]?.name?.message}
                                        </p>
                                    </div>
                                    <div className="mb-5 w-1/3">
                                        <label
                                            className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                        >
                                            Thời gian (phút)
                                        </label>
                                        <input
                                            {...register(`chapters.${indexChapter}.topics.${indexTopic}.duration`, {
                                                required: "Thời gian không thể thiếu",
                                            })}
                                            type="number"
                                            className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                        />

                                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                            {errors.chapters?.[indexChapter]?.topics?.[indexTopic]?.duration?.message}
                                        </p>
                                    </div>
                                    <div className="mb-5 w-1/3">
                                        <label
                                            className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                        >
                                            Điểm hoàn thành
                                        </label>
                                        <input
                                            {...register(`chapters.${indexChapter}.topics.${indexTopic}.pass_score`, {
                                                required: "Điểm hoàn thành không thể thiếu",
                                                min: {
                                                    value: 0,
                                                    message: "Điểm hoàn thành không thể nhỏ hơn 0"
                                                },
                                                max: {
                                                    value: 10,
                                                    message: "Điểm hoàn thành không thể lớn hơn 10"
                                                }
                                            })}
                                            type="number"
                                            className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                        />

                                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                            {errors.chapters?.[indexChapter]?.topics?.[indexTopic]?.pass_score?.message}
                                        </p>
                                    </div>

                                    <div className="mb-5 w-full">
                                        <div
                                            className="block mr-2 text-sm font-semibold text-[14px] text-[#171347] "
                                        >
                                            Trạng thái
                                        </div>
                                        <div className="mt-2">
                                            <div className="relative inline-flex items-center me-5 cursor-pointer">
                                                <div className="flex">
                                                    <div className="flex items-center me-4" >
                                                        <input
                                                            id="inline-radio"
                                                            type="radio"
                                                            defaultChecked={topic.status == "public" ? true : false}
                                                            {...register(`chapters.${indexChapter}.topics.${indexTopic}.status`)}
                                                            value="public"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                        <label
                                                            htmlFor="inline-radio"
                                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                        >
                                                            Công khai
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center me-4" >
                                                        <input
                                                            id="inline-radio"
                                                            type="radio"
                                                            defaultChecked={topic.status == "paid" ? true : false}
                                                            {...register(`chapters.${indexChapter}.topics.${indexTopic}.status`)}
                                                            value="paid"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                        <label
                                                            htmlFor="inline-radio"
                                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                        >
                                                            Tính phí
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center me-4">
                                                        <input
                                                            id="inline-2-radio"
                                                            type="radio"
                                                            defaultChecked={topic.status == "private" ? true : false}
                                                            {...register(`chapters.${indexChapter}.topics.${indexTopic}.status`)}
                                                            value="private"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                        <label
                                                            htmlFor="inline-2-radio"
                                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                        >
                                                            Riêng tư
                                                        </label>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        <div className='mt-4'>
                                            <h2 className="text-[#171347] font-bold section-title flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1]">Câu hỏi</h2>
                                            <button type="button" onClick={() => {
                                                setModal({ ...modal, [`add_question_${topic.key}`]: true })
                                                appendQuestion({
                                                    id: uuid(),
                                                    content_text: "",
                                                    multi_choice: false
                                                })
                                            }}
                                                className="mt-3 bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover">
                                                Thêm câu hỏi
                                            </button>
                                            <div className='mt-5'>
                                                <DragDropContext onDragEnd={(result) => {
                                                    if (!result.destination) return;
                                                    const items: any = reorder(
                                                        questions,
                                                        result.source.index,
                                                        result.destination.index
                                                    );
                                                    setQuestions(items)
                                                    setValue(`chapters.${indexChapter}.topics.${indexTopic}.questions`, items)
                                                }}>
                                                    <StrictModeDroppable droppableId="question">
                                                        {(provided) => (
                                                            <ul key={chapter.key} {...provided.droppableProps} ref={provided.innerRef}>
                                                                {
                                                                    topic?.questions?.map((question: any, indexQuestion: any) => {
                                                                        return (
                                                                            <Draggable key={question.key} index={indexQuestion} draggableId={`${question.key} `}>
                                                                                {
                                                                                    (provided) => (

                                                                                        <QuestionCard
                                                                                            indexChapter={indexChapter} indexTopic={indexTopic} hanldeForm={hanldeForm} indexQuestion={indexQuestion} provided={provided} question={question} removeQuestion={removeQuestion} modal={modal} setModal={setModal} topic={topic} />
                                                                                    )
                                                                                }
                                                                            </Draggable>

                                                                        )
                                                                    })

                                                                }
                                                                {provided.placeholder}
                                                            </ul>
                                                        )
                                                        }
                                                    </StrictModeDroppable>
                                                </DragDropContext>


                                            </div>
                                            {/* <div className='py-4 text-[#818894]'>
                                        Không có câu hỏi
                                    </div> */}
                                        </div>
                                    </div>

                                    <div className="">
                                        <button
                                            onClick={() => {
                                                removeTopic(indexTopic)
                                                setToggle({ ...toggle, [`edit_exam_${topic.key}`]: false })

                                            }} type="button" className="mr-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Huỷ</button>
                                        <button type="submit"
                                            onClick={() => {
                                                setToggle({ ...toggle, [`edit_exam_${topic.key}`]: false })
                                                setTypeSubmit(`edit_exam_${topic.key}`)
                                            }}
                                            className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">Lưu</button>
                                    </div>
                                </div> : null
                        }
                    </div>
                </div>
            </li >

        </div >

    )
}
