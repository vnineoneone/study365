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
import { Controller, useForm } from "react-hook-form"
import { initFlowbite } from "flowbite"
// import comboApi from "@/app/api/comboApi"
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import CustomCKEditor from "@/app/_components/Editor/CKEditor"
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)

export default function ExamDashboard() {
    const authUser = useAppSelector(state => state.authReducer.user);
    const [exams, setExams] = useState<[any]>()
    const [students, setStudents] = useState<any>([])
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState<boolean>(false)
    const [listExam, setListExam] = useState<any>({})
    const {
        register,
        reset,
        handleSubmit,
        control,
        setError,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<any>()

    const [files, setFiles] = useState([])
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
            await examApi.getAllExamByTeacher(`${authUser.id}`, '1').then((data: any) => setExams(data.data.exams)).catch((err: any) => { })
            // await courseApi.getAllStudenBuySpecificCourseOfTeacher(currentCourse, `${user.id}`, page).then((data: any) => {
            //     setStudents(data.data)
            // }).catch((err: any) => { })
        }
        fetchData()
    }, [authUser.id, change]);
    console.log(listExam);

    return (
        <div className="">
            <>
                <Modal show={modal[`add-combo`] || false} size="3xl" onClose={() => setModal({ ...modal, [`add-combo`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={handleSubmit(async (data: any) => {
                            const startTime = getValues("start_time");
                            const endTime = getValues("end_time");
                            if (startTime !== undefined && endTime !== undefined && startTime > endTime) {
                                setError("time", {
                                    type: "validate",
                                    message: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc."
                                });
                                return;
                            }

                            if (!(Object.entries(errors).length === 0)) return
                            const dataForm = {
                                name: data.name,
                                percent: Number(data.percent),
                                start_time: data.start_time,
                                expire: data.end_time,
                                courses: [data.courses]
                            }

                            // await comboApi.create(dataForm).then(() => {

                            // }).catch((err: any) => { })

                            setChange(!change)
                            reset()
                            setModal({ ...modal, [`add-combo`]: false })
                        })}>

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Thêm combo đề thi</h3>
                            <div className="w-1/2">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Tên combo
                                </label>
                                <input
                                    {...register("name", {
                                        required: "Ten không thể trống."
                                    })}
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`bg-white border border-gray-300 text-[#343434] text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                />
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors?.name?.message?.toString()}
                                </p>
                            </div>

                            <div className={`w-full`}>
                                <label
                                    htmlFor="exam"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Danh sách đề thi
                                </label>
                                <button
                                    onClick={() => setModal({ ...modal, [`dropdownSearch`]: !modal[`dropdownSearch`] })}
                                    id="dropdownSearchButton"
                                    // data-dropdown-toggle="dropdownSearch"
                                    data-dropdown-placement="bottom"
                                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 justify-between flex items-center"
                                    type="button"
                                >
                                    Chọn đề thi {" "}
                                    <svg
                                        className="w-2.5 h-2.5 ms-3"
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
                                {/* Dropdown menu */}
                                <div
                                    id="dropdownSearch"
                                    className={`${modal['dropdownSearch'] ? "" : "hidden"} z-10 w-full mt-3 bg-white rounded-lg shadow dark:bg-gray-700`}
                                >
                                    {/* <div className="p-3">
                                        <label htmlFor="input-group-search" className="sr-only">
                                            Search
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                                <svg
                                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                                    />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="input-group-search"
                                                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Tìm kiếm người dùng"
                                            />
                                        </div>
                                    </div> */}
                                    <ul
                                        className="h-auto p-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownSearchButton"

                                    >
                                        <li >

                                            <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                <input
                                                    onChange={(e) => setListExam({ ...listExam, [123]: (e.target as HTMLInputElement).checked ? "Abc" : "" })
                                                    }
                                                    type="checkbox"
                                                    defaultChecked
                                                    id={'all'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                />
                                                <label
                                                    htmlFor="checkbox-item-11"
                                                    className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                                >
                                                    Tất cả đề thi
                                                </label>
                                            </div>
                                        </li>
                                        {
                                            exams ? exams?.map((exam: any, index: number) => {
                                                return (
                                                    <li key={exam.id}>
                                                        <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                            <input


                                                                type="checkbox"
                                                                defaultValue=""
                                                                id={exam.id}
                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                            />
                                                            <label
                                                                htmlFor="checkbox-item-11"
                                                                className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                                            >
                                                                {exam.title}
                                                            </label>
                                                        </div>
                                                    </li>
                                                )
                                            }) : <p className='text-center'>Không có người dùng</p>

                                        }

                                    </ul>
                                </div>
                                <div className="mt-5">
                                    {

                                        listExam ? Object.entries(listExam).map(([key, value]: any) => {
                                            if (value !== "")
                                                return (
                                                    <div key={key} className="border-[1px] border-slate-200 px-4 py-2 rounded-lg">{value}</div>
                                                )
                                        }) : null
                                    }
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Ảnh đại diện
                                </label>

                                <FilePond
                                    files={files}
                                    onupdatefiles={() => setFiles}
                                    acceptedFileTypes={['image/*']}

                                    server={{
                                        process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                                            const formData = new FormData();
                                            formData.append(fieldName, file, file.name);
                                            // formData.append('data', JSON.stringify({
                                            //     id_exam: exam.id,
                                            //     type: "exam"
                                            // }));


                                            const request = new XMLHttpRequest();
                                            request.open('POST', `${process.env.NEXT_PUBLIC_BASE_URL_EXAM_LOCAL}/images`)


                                            request.upload.onprogress = (e) => {
                                                progress(e.lengthComputable, e.loaded, e.total);
                                            };

                                            request.onload = function (res: any) {

                                                if (request.status >= 200 && request.status < 300) {
                                                    // the load method accepts either a string (id) or an object
                                                    // setImage({ ...image, [exam.id]: JSON.parse(request.response).url });

                                                    load(request.responseText);
                                                } else {
                                                    // Can call the error method if something is wrong, should exit after
                                                    error('oh no');
                                                }
                                            };
                                            request.send(formData)

                                            // courseApi.uploadVideo(formData)
                                        },

                                    }
                                    }

                                    name="image"
                                    labelIdle='Kéo & thả hoặc <span class="filepond--label-action">Tìm kiếm</span>'
                                />
                                {/* {
                                    image[exam.id] || exam.content_image ? <div className="w-full h-[240px] relative">
                                        <Image
                                            src={`${image[exam.id] || exam.content_image}`}
                                            fill={true}
                                            className='w-full h-full absolute top-0 left-0 overflow-hidden object-cover object-center'
                                            alt="logo"
                                        />
                                    </div>
                                        : null
                                } */}
                            </div>
                            <div className="mb-5">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Mô tả
                                </label>

                                <CustomCKEditor className="h-50" setValue={setValue} value="" position={`description`} />
                                <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors?.description?.message?.toString() ?? ''}
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setModal({ ...modal, [`add-combo`]: false })
                                        reset()
                                    }
                                    }
                                    type="button"
                                    className="mr-4 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                >
                                    Hủy
                                </button>
                                <div>
                                    <button
                                        type="submit"
                                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Tạo
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>
            <div className="">
                <div className="font-bold text-[#171347] text-lg">Combo đề thi của tôi</div>

                <button onClick={() => setModal({ ...modal, [`add-combo`]: true })} type="button" className="mt-3 bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover">

                    <div className="flex justify-center items-center">
                        Thêm combo
                    </div>

                </button>

            </div>
            <div className="mt-8">
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
                                            <Dropdown.Item onClick={() => {

                                            }}>
                                                <Link href={`/teacher/dashboard/exam/edit/${exam.id}`} >
                                                    Sửa đề thi
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item><p className="text-red-600" onClick={() => setModal({ ...modal, [`delete-exam${exam.id}`]: true })}>Xóa đề thi</p></Dropdown.Item>
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
            </div>

        </div>
    )
}
