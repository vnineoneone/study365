
import { useEffect, useRef, useState } from 'react'
import {
    ExclamationCircleIcon, PencilSquareIcon, ArrowsPointingOutIcon, Squares2X2Icon,
    PlusCircleIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, BookOpenIcon
} from "@heroicons/react/24/outline"
import { convertTime } from '@/app/helper/FormatFunction'
import { Dropdown } from 'flowbite-react';
import { Button, Checkbox, Label, Modal, TextInput, Radio } from 'flowbite-react';
// import { ToastContainer, toast } from 'react-toastify';
import { set, useFieldArray, useForm } from 'react-hook-form';
import { DragDropContext, Draggable, Droppable, DroppableProps } from 'react-beautiful-dnd';
import { StrictModeDroppable } from "../../React_Beautiful_Dnd/StrictModeDroppable";
import { TopicCard } from './TopicCard';
import uuid from 'react-uuid';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import courseApi from "@/app/api/courseApi";


// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)


export const ChapterCard = ({ chapter, handleForm, indexChapter, innerRef, provided, data, setData, removeChapter, setTypeSubmit, toggle, setToggle, id_course }: any) => {
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState<any>(false)
    const notify = () => {
        // toast.success('Thành công', {
        //     position: "bottom-right",
        //     autoClose: 800,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "colored",
        // });
    };

    const {
        register,
        control,
        getValues,
        setValue,
        watch,
        trigger,
        reset,
        handleSubmit,
        formState: { errors },
    } = handleForm

    const { fields: fieldsLecture, append: appendLecture, remove: removeLecture } = useFieldArray({
        control,
        name: `chapters.${indexChapter}.topics`,
    });

    // const { fields: fieldsLecture, append: appendExam, remove: removeExam } = useFieldArray({
    //     control,
    //     name: `chapters.${indexChapter}.exams`
    // });
    const [topicsData, setTopicsData] = useState<any>([])
    const [files, setFiles] = useState([])

    useEffect(() => {
        // const currLectures = getValues().chapters[indexChapter]?.lectures || []
        // const currExams = getValues().chapters[indexChapter]?.exams || []
        // const tmp = [...currLectures?.filter((topic: any) => topic.modify != "delete" && topic.name != '' && topic.name), ...(currExams?.filter((topic: any) => topic.modify != "delete" && topic.name != ''))]
        const tmp = getValues().chapters[indexChapter]?.topics?.filter((topic: any) => topic.modify != "delete" && topic.name != '')
        setTopicsData(tmp)

        // setValue(`chapters.${indexChapter}.topics`, [...currLectures, ...currExams])

    }, [getValues, indexChapter, change, setValue, chapter.topics]);


    const reorder = (list: Array<any>, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const handleDeleteSection = async () => {
        setModal({ ...modal, [`delete_section${chapter.id || chapter.key}`]: false })

        if (chapter.modify != "create") {
            setValue(`chapters.${indexChapter}.modify`, "delete")
        } else {
            removeChapter(indexChapter)

            setData((data: any) => {
                data.chapters.splice(indexChapter, 1)
                return data
            })
        }

        notify()

    };
    const handleUpdateSection = async (position: string) => {
        const isValid = await trigger(`${position}`);
        if (isValid) {
            setModal({ ...modal, [`edit_section_${chapter.id || chapter.key}`]: false })
            setData((data: any) => {
                data.chapters[indexChapter].name = getValues().chapters[indexChapter].name
                data.chapters[indexChapter].status = getValues().chapters[indexChapter].status
                if (getValues().chapters[indexChapter].modify != "create") {
                    setValue(`chapters.${indexChapter}.modify`, "change")
                }
                return data
            })
            notify()
        }
    };
    const handleAddLecture = async (position: string) => {
        const isValid = await trigger(`${position}`);

        if (isValid) {
            setToggle({ ...toggle, [`add_lecture_${chapter.id || chapter.key}`]: false })
            setChange(!change)
            if (chapter.modify != "create") {
                setValue(`chapters.${indexChapter}.modify`, "change")
            }
        }


    };
    const handleAddExam = async (position: string) => {
        const isValid = await trigger(`${position}`);

        if (isValid) {
            setToggle({ ...toggle, [`add_exam_${chapter.id || chapter.key}`]: false })
            setChange(!change)
            if (chapter.modify != "create") {
                setValue(`chapters.${indexChapter}.modify`, "change")
            }
        }
    };

    console.log(fieldsLecture, errors, 231);


    return (
        <div ref={innerRef}  {...provided.draggableProps}  >
            <>
                <Modal show={modal[`delete_section${chapter.id || chapter.key}`]} size="md" onClose={() => setModal({ ...modal, [`delete_section${chapter.id || chapter.key}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" >
                            <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg text-center font-normal text-gray-500 dark:text-gray-400">
                                Bạn có chắc muốn xóa mục này?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" type='submit' onClick={() => {
                                    handleDeleteSection()
                                }}>
                                    Xóa
                                </Button>
                                <Button color="gray" onClick={() => {
                                    setModal({ ...modal, [`delete_section${chapter.id || chapter.key}`]: false })

                                }}>
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>

            <>
                <Modal show={modal[`edit_section_${chapter.id || chapter.key}`]} size="md" onClose={() => setModal({ ...modal, [`edit_section_${chapter.id || chapter.key}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6">

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sửa mục</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="email" value="Tên mục" />
                                </div>
                                <TextInput
                                    type="text"
                                    {...register(`chapters.${indexChapter}.name`, {
                                        required: "Tên mục không thể thiếu."
                                    })}
                                />
                                <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors?.chapters?.[indexChapter]?.name?.message}
                                </div>
                            </div>

                            <div className="mt-2 w-full">
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
                                                    {...register(`chapters.${indexChapter}.status`)}
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
                                                    {...register(`chapters.${indexChapter}.status`)}
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
                                                    {...register(`chapters.${indexChapter}.status`)}
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
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        reset({ [`chapters.${indexChapter}`]: {} })
                                        setModal({ ...modal, [`edit_section_${chapter.id || chapter.key}`]: false })
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
                                            handleUpdateSection(`chapters.${indexChapter}`)
                                        }}
                                        type="submit"
                                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>

            <li className="bg-white py-[30px] pl-[20px] pr-6 rounded-xl mb-5" >
                <div className="flex justify-between items-center">
                    <div className="flex justify-center items-center">
                        <span className="flex justify-center items-center w-10 h-10 min-w-10 min-h-10 bg-primary rounded-full mr-[10px]">
                            <Squares2X2Icon className="w-6 h-6 text-white" />
                        </span>
                        <div>
                            <span className="font-bold text-[rgb(23,19,71)] text-lg">
                                {chapter.name}
                            </span>
                            <span className="font-normal text-[818894] text-xs flex">
                                {chapter?.topics?.length} chủ đề
                                | {convertTime(chapter.totalDuration || '0')}
                            </span>

                        </div>
                    </div>
                    <div className="ml-5 flex items-center justify-center">

                        <div className="mr-[10px]" >

                            <Dropdown label="" renderTrigger={() => <PlusCircleIcon className="w-7 h-7 text-primary" />} placement="left">
                                <Dropdown.Item onClick={() => {

                                    appendLecture({
                                        id: uuid(),
                                        name: "",
                                        description: "",
                                        status: "paid",
                                        type: "lecture",
                                        modify: "create"
                                    })
                                    setToggle({ ...toggle, [`add_lecture_${chapter.id || chapter.key}`]: true, [`open_chapter_${chapter.id || chapter.key}`]: true })
                                }}>
                                    Thêm bài giảng
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => {

                                    appendLecture({
                                        id: uuid(),
                                        period: "",
                                        status: "paid",
                                        type: "exam",
                                        name: "",
                                        modify: "create"
                                    })
                                    setToggle({ ...toggle, [`add_exam_${chapter.id || chapter.key}`]: true, [`open_chapter_${chapter.id || chapter.key}`]: true })
                                }}>Thêm bài tập</Dropdown.Item>
                            </Dropdown>

                        </div>
                        <button type="button" className="mr-[10px] text-yellow-400"
                            onClick={() => { setModal({ ...modal, [`edit_section_${chapter.id || chapter.key}`]: true }) }}>
                            <PencilSquareIcon className="w-6 h-6" />
                        </button>
                        <button type="button" className="mr-[10px] text-red-500">
                            <TrashIcon className="w-6 h-6" onClick={() => setModal({ ...modal, [`delete_section${chapter.id || chapter.key}`]: true })} />
                        </button>

                        <div className='flex justify-center items-center'  {...provided.dragHandleProps} >
                            <button type="button" className="mr-[10px] text-[#a4c4fa]" style={{
                            }} >
                                <ArrowsPointingOutIcon className="w-6 h-6" />
                            </button>
                        </div>
                        {
                            !toggle[`open_chapter_${chapter.id || chapter.key}`] ?
                                <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                    setToggle({ ...toggle, [`open_chapter_${chapter.id || chapter.key}`]: true })
                                }}>
                                    <ChevronDownIcon className="w-5 h-5" />
                                </button>
                                :
                                <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                    setToggle({ ...toggle, [`open_chapter_${chapter.id || chapter.key}`]: false })
                                }}>
                                    <ChevronUpIcon className="w-5 h-5" />
                                </button>
                        }

                    </div>
                </div>




                <div className={`${toggle[`add_lecture_${chapter.id || chapter.key}`] ? "" : "hidden"} mt-3 pt-4 border-t-[1px] border-[#ececec]`}>
                    {fieldsLecture.map((field: any, indexFieldTopic: any) => (

                        indexFieldTopic == fieldsLecture.length - 1 && field.type === "lecture" ?
                            <div key={field.id} className="mt-3">
                                <div className="mb-5 w-1/3">
                                    <label
                                        htmlFor="title"
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Tiêu đề
                                    </label>
                                    <input
                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.name`, {
                                            required: "Tên bài giảng không thể thiếu",
                                        })}
                                        type="text"
                                        className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                    />

                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors.chapters?.[indexChapter]?.topics?.[indexFieldTopic]?.name?.message}
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
                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.description`)}
                                        rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Viết mô tả cho chủ đề..."></textarea>

                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors.chapters?.[indexChapter]?.topics?.[indexFieldTopic]?.description?.message}
                                    </p>
                                </div>

                                <div className="mb-5 w-1/2">
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
                                                formData.append(fieldName, file, `${indexChapter + 1}-${indexFieldTopic + 1}-${file.name}`);
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

                                <div className="mb-5 w-1/2">
                                    <label
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                                        htmlFor="video"
                                    >
                                        Tài liệu
                                    </label>
                                    <FilePond
                                        files={files}
                                        onupdatefiles={() => setFiles}
                                        allowMultiple
                                        server={{
                                            process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                                                const formData = new FormData();
                                                formData.append(fieldName, file, `${indexChapter + 1}-${indexFieldTopic + 1}-${file.name}`);
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

                                        name="document"
                                        labelIdle='Kéo & thả hoặc <span class="filepond--label-action">Tìm kiếm</span>'
                                    />
                                    <p>{getValues().chapters?.indexChapter?.topics?.indexTopic?.link_video}</p>
                                </div>

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

                                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.status`)}
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

                                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.status`)}
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
                                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.status`)}
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
                                            removeLecture(indexFieldTopic)
                                            setToggle({ ...toggle, [`add_lecture_${chapter.id || chapter.key}`]: false })

                                        }} type="button" className="mr-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Huỷ</button>
                                    <button type="button"
                                        onClick={() => {

                                            handleAddLecture(`chapters.${indexChapter}.topics.${indexFieldTopic}`)
                                        }}
                                        className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">Lưu</button>
                                </div>
                            </div>
                            : null
                    ))}

                </div>

                <div className={`${toggle[`add_exam_${chapter.id || chapter.key}`] ? "" : "hidden"} mt-3 pt-4 border-t-[1px] border-[#ececec]`}>
                    {fieldsLecture.map((field: any, indexFieldTopic: any) => (

                        indexFieldTopic == fieldsLecture.length - 1 && field.type === "exam" ?
                            <div key={field.id} className="mt-3">
                                <div className="mb-5 w-1/3">
                                    <label
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Tiêu đề
                                    </label>
                                    <input
                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.name`, {
                                            required: "Tiêu đề bài tập không thể thiếu",
                                        })}
                                        type="text"
                                        className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                    />

                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors.chapters?.[indexChapter]?.topics?.[indexFieldTopic]?.name?.message}
                                    </p>
                                </div>
                                <div className="mb-5 w-1/3">
                                    <label
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Thời gian (phút)
                                    </label>
                                    <input
                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.exam.data.period`, {
                                            required: "Thời gian không thể thiếu",
                                            min: {
                                                value: 0,
                                                message: "Thời gian hoàn thành không thể nhỏ hơn 0"
                                            },
                                            max: {
                                                value: 180,
                                                message: "Thời gian hoàn thành không thể lớn hơn 180 phút"
                                            }
                                        })}
                                        type="number"
                                        className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                    />

                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors.chapters?.[indexChapter]?.topics?.[indexFieldTopic]?.exam?.data?.period?.message}
                                    </p>
                                </div>
                                <div className="mb-5 w-1/3">
                                    <label
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Điểm hoàn thành
                                    </label>
                                    <input
                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.exam.data.pass_score`, {
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
                                        {errors.chapters?.[indexChapter]?.topics?.[indexFieldTopic]?.exam?.data?.pass_score?.message}
                                    </p>
                                </div>
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
                                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.status`)}
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
                                                        defaultChecked
                                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.status`)}
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
                                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.status`)}
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
                                            removeLecture(indexFieldTopic)
                                            setToggle({ ...toggle, [`add_exam_${chapter.id || chapter.key}`]: false })

                                        }} type="button" className="mr-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Huỷ</button>
                                    <button type="button"
                                        onClick={() => {

                                            handleAddExam(`chapters.${indexChapter}.topics.${indexFieldTopic}`)

                                        }}
                                        className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">Lưu</button>
                                </div>
                            </div>
                            : null
                    ))}

                </div>





                <div className={`${toggle[`open_chapter_${chapter.id || chapter.key}`] ? "" : "hidden"} `}>

                    <DragDropContext onDragEnd={(result) => {
                        if (!result.destination) return;
                        const items: any = reorder(
                            topicsData,
                            result.source.index,
                            result.destination.index
                        );
                        setTopicsData(items)
                        setValue(`chapters.${indexChapter}.topics`, items)
                        if (chapter.modify != "create") {
                            setValue(`chapters.${indexChapter}.modify`, "change")
                        }
                    }}>
                        <StrictModeDroppable droppableId="topic">
                            {(provided) => (
                                <ul  {...provided.droppableProps} ref={provided.innerRef}>
                                    {
                                        topicsData?.map((topic: any, indexTopic: any) => {
                                            return (
                                                <Draggable key={topic.id} index={indexTopic} draggableId={`${topic.id} `}>
                                                    {
                                                        (provided) => (

                                                            <TopicCard
                                                                chapter={chapter} topic={topic} indexChapter={indexChapter} indexTopic={indexTopic} indexLecture={indexTopic} indexExam={indexTopic} hanldeForm={handleForm} innerRef={provided.innerRef} provided={provided} data={data} setData={setData}
                                                                removeLecture={removeLecture} fieldsLecture={fieldsLecture} setTypeSubmit={setTypeSubmit} id_course={id_course} setChange={setChange} change={change}
                                                            />
                                                        )
                                                    }
                                                </Draggable>

                                            )
                                        })

                                    }
                                    {/* {
                                        getValues().chapters[indexChapter]?.exams?.filter((topic: any) => topic.modify != "delete" && topic.name != '').map((topic: any, indexTopic: any) => {
                                            return (
                                                <Draggable key={topic.id} index={indexTopic} draggableId={`${topic.id} `}>
                                                    {
                                                        (provided) => (

                                                            <TopicCard
                                                                chapter={chapter} topic={topic} indexChapter={indexChapter} indexTopic={indexTopic} indexLecture={topic.type === "lecture" ? fieldsLecture.indexOf({ id: topic.id }) : 0} indexExam={topic.type === "exam" ? fieldsLecture.indexOf({ id: topic.id }) : 0} hanldeForm={handleForm} innerRef={provided.innerRef} provided={provided} data={data} setData={setData}
                                                                removeLecture={removeLecture} fieldsLecture={fieldsLecture} setTypeSubmit={setTypeSubmit} id_course={id_course} setChange={setChange} change={change}
                                                            />
                                                        )
                                                    }
                                                </Draggable>

                                            )
                                        })

                                    } */}
                                    {provided.placeholder}
                                </ul>
                            )
                            }
                        </StrictModeDroppable>
                    </DragDropContext>
                </div>
            </li>
        </div>

    )
}
