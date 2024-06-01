"use client"
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';
import { Controller, useForm } from "react-hook-form"
import { Label, Modal, TextInput, Textarea, Button } from 'flowbite-react';
import discountApi from '@/app/api/discountApi';
import { convertToVietnamTime, formatDateTime, formatDateTimeEng } from '@/app/helper/FormatFunction';
import { useSearchParams } from 'next/navigation';
import { Dropdown } from 'flowbite-react';
import { useAppSelector } from '@/redux/store';
import courseApi from '@/app/api/courseApi';


export default function DiscountDashboard({ params }: { params: { slug: string } }) {
    const [discounts, setDiscounts] = useState<any>()
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState(false)
    const [content, setContent] = useState<any>('')
    const searchParams = useSearchParams()
    const page = searchParams.get('page')
    const [paginate, setPaginate] = useState(1)
    const list: any = []
    const [courses, setCourses] = useState<any>()
    const {
        register,
        reset,
        handleSubmit,
        control,
        setError,
        getValues,
        formState: { errors },
    } = useForm<any>()
    const { user } = useAppSelector(state => state.authReducer);
    useEffect(() => {
        async function fetchData() {
            await discountApi.getAllByCreateTeacher(`${user.id}`).then((data: any) => {
                setDiscounts(data.data)
            }).catch((err: any) => { })
            await courseApi.getAllByTeacher(`${user.id}`, '1').then((data: any) => {
                setCourses(data.data.courses)
            }).catch((err: any) => { })

        }
        fetchData()


    }, [params.slug, change, user.id, page]);

    for (let i = 1; i <= paginate; i++) {
        list.push(i)
    }


    return (
        <div className='w-full'>
            <>
                <Modal show={modal[`add-discount`] || false} size="xl" onClose={() => setModal({ ...modal, [`add-discount`]: false })} popup>
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

                            await discountApi.create(dataForm).then(() => {

                            }).catch((err: any) => { })

                            setChange(!change)
                            reset()
                            setModal({ ...modal, [`add-discount`]: false })
                        })}>

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Thêm khuyến mãi</h3>
                            <div className="">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Tên khuyến mãi
                                </label>
                                <input
                                    {...register("name", {
                                        required: "Tên khuyến mãi không thể trống."
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
                            <div className="">
                                <label
                                    htmlFor="grade"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Khóa học
                                </label>
                                <Controller
                                    control={control}
                                    name="courses"
                                    rules={{ required: "Lớp học không thể trống" }}
                                    render={({ field }) => (
                                        <select id="courses" {...field} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option value="" defaultChecked>Chọn khóa học</option>

                                            {courses?.map((course: any, index: number) => {
                                                return (
                                                    <option key={course.id} value={`${course.id}`}>{course.name}</option>
                                                )
                                            })}
                                        </select>
                                    )}
                                />
                                {errors?.courses?.message && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors.courses.message.toString()}
                                    </p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label
                                    htmlFor="percent"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Phần trăm
                                </label>
                                <input
                                    {...register("percent", {
                                        required: "Phần trăm không thể trống.",
                                        min: {
                                            value: 0,
                                            message: "Phần trăm không phù hợp."
                                        },
                                        max: {
                                            value: 100,
                                            message: "Phần trăm không phù hợp."
                                        }
                                    })}
                                    type="number"
                                    id="percent"
                                    name="percent"
                                    className={`bg-white border border-gray-300 text-[#343434] text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                />
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors?.percent?.message?.toString()}
                                </p>

                            </div>
                            <div className="">
                                <label
                                    htmlFor="time"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Thời gian diễn ra khuyến mãi
                                </label>
                                <div className="flex items-center">
                                    <div className="">
                                        <input {...register("start_time", {
                                            required: "Thời gian bắt đầu và thời gian kết thúc không thể thiếu."
                                        })} date-rangepicker="true" type="date" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start" />
                                    </div>
                                    <span className="mx-4 text-gray-500">đến</span>
                                    <div className="">

                                        <input {...register("end_time", {
                                            required: "Thời gian bắt đầu và thời gian kết thúc không thể thiếu."
                                        })} date-rangepicker="true" type="date" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end" />
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors?.start_time?.message?.toString() || errors?.end_time?.message?.toString()}
                                    {errors?.time?.message?.toString()}
                                </p>

                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setModal({ ...modal, [`add-discount`]: false })
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

            <div>
                <div className="font-bold text-[#171347] text-lg">Khuyến mãi của tôi</div>
                <button type="button" onClick={() => {
                    setModal({ ...modal, [`add-discount`]: true })

                }} className="mt-3 bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover">

                    <div className="flex justify-center items-center">
                        Thêm khuyến mãi
                    </div>

                </button>
                <div className="flex flex-col bg-white p-4 mt-10 rounded-lg">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Tên khuyến mãi</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Khóa học</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Phần trăm</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Trạng thái</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Ngày bắt đầu</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Ngày kết thúc</th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Tác vụ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">

                                        {discounts?.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                                                <>
                                                    <Modal show={modal[`delete-discount${item.id}`] || false} size="md" onClose={() => setModal({ ...modal, [`delete-discount${item.id}`]: false })} popup>
                                                        <Modal.Header />
                                                        <Modal.Body>
                                                            <form className="space-y-6" onSubmit={async (e) => {
                                                                e.preventDefault()
                                                                await discountApi.delete(item.id).catch((err: any) => { })
                                                                setChange(!change)
                                                                setModal(false)
                                                            }}>
                                                                <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                                                <h3 className="mb-5 text-lg font-normal text-center text-gray-500 dark:text-gray-400">
                                                                    Bạn có chắc muốn xóa khuyến mãi này?
                                                                </h3>
                                                                <div className="flex justify-center gap-4">
                                                                    <Button color="failure" type='submit'>
                                                                        Xóa
                                                                    </Button>
                                                                    <Button color="gray" onClick={() => {
                                                                        setModal({ ...modal, [`delete-discount${item.id}`]: false })
                                                                    }}>
                                                                        Hủy
                                                                    </Button>
                                                                </div>
                                                            </form>
                                                        </Modal.Body>
                                                    </Modal>

                                                    <Modal show={modal[`edit-discount${item.id}`] || false} size="xl" onClose={() => setModal({ ...modal, [`edit-discount${item.id}`]: false })} popup>
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
                                                                if (!(Object.entries(errors).length === 0)) return;
                                                                const dataForm = {
                                                                    name: data.name,
                                                                    percent: Number(data.percent),
                                                                    start_time: data.start_time,
                                                                    expire: data.end_time,
                                                                    courses: [data.courses]
                                                                }

                                                                await discountApi.update(dataForm, item.id).then(() => {

                                                                }).catch((err: any) => { })

                                                                setChange(!change)
                                                                reset()
                                                                setModal({ ...modal, [`edit-discount${item.id}`]: false })
                                                            })}>

                                                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sửa khuyến mãi</h3>
                                                                <div className="">
                                                                    <label
                                                                        htmlFor="name"
                                                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                                                    >
                                                                        Tên khuyến mãi
                                                                    </label>
                                                                    <input
                                                                        defaultValue={item.name}
                                                                        {...register("name", {
                                                                            required: "Tên khuyến mãi không thể trống."
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
                                                                <div className="">
                                                                    <label
                                                                        htmlFor="grade"
                                                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                                                    >
                                                                        Khóa học
                                                                    </label>
                                                                    <Controller
                                                                        control={control}
                                                                        name="courses"
                                                                        defaultValue={item.Courses[0].id}
                                                                        rules={{ required: "Lớp học không thể trống" }}
                                                                        render={({ field }) => (
                                                                            <select id="courses" {...field} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                                                <option value="" defaultChecked>Chọn khóa học</option>

                                                                                {courses?.map((course: any, index: number) => {
                                                                                    return (
                                                                                        <option key={course.id} value={`${course.id}`}>{course.name}</option>
                                                                                    )
                                                                                })}
                                                                            </select>
                                                                        )}
                                                                    />
                                                                    {errors?.courses?.message && (
                                                                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                                                            {errors.courses.message.toString()}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="w-1/2">
                                                                    <label
                                                                        htmlFor="percent"
                                                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                                                    >
                                                                        Phần trăm
                                                                    </label>
                                                                    <input
                                                                        defaultValue={item.percent}
                                                                        {...register("percent", {
                                                                            required: "Phần trăm không thể trống.",
                                                                            min: {
                                                                                value: 0,
                                                                                message: "Phần trăm không phù hợp."
                                                                            },
                                                                            max: {
                                                                                value: 100,
                                                                                message: "Phần trăm không phù hợp."
                                                                            }
                                                                        })}
                                                                        type="number"
                                                                        id="percent"
                                                                        name="percent"
                                                                        className={`bg-white border border-gray-300 text-[#343434] text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                                                    />
                                                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                                                        {errors?.percent?.message?.toString()}
                                                                    </p>

                                                                </div>
                                                                <div className="">
                                                                    <label
                                                                        htmlFor="price"
                                                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                                                    >
                                                                        Thời gian diễn ra khuyến mãi
                                                                    </label>
                                                                    <div className="flex items-center">
                                                                        <div className="">

                                                                            <input defaultValue={`${formatDateTimeEng(item.createdAt)}`} {...register("start_time", {
                                                                                required: "Thời gian bắt đầu và thời gian kết thúc không thể thiếu."
                                                                            })} date-rangepicker="true" type="date" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start" />
                                                                        </div>
                                                                        <span className="mx-4 text-gray-500">đến</span>
                                                                        <div className="">

                                                                            <input defaultValue={`${formatDateTimeEng(item.expire)}`} {...register("end_time", {
                                                                                required: "Thời gian bắt đầu và thời gian kết thúc không thể thiếu."
                                                                            })} date-rangepicker="true" type="date" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end" />
                                                                        </div>
                                                                    </div>
                                                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                                                        {errors?.start_time?.message?.toString()}
                                                                        {errors?.time?.message?.toString()}
                                                                    </p>

                                                                </div>

                                                                <div className="mt-6 flex justify-end">
                                                                    <button
                                                                        onClick={() => {

                                                                            setModal({ ...modal, [`edit-discount${item.id}`]: false })
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
                                                                            Lưu
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </Modal.Body>
                                                    </Modal>

                                                </>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-800 dark:text-neutral-200">{item.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{item.Courses[0]?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{item.percent}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{(new Date(item.expire).getTime()) > Date.now() ? "Đang diễn ra" : "Hết hạn"}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{formatDateTime(item.createdAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{formatDateTime(item.expire)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <Dropdown label="" renderTrigger={() => <button className='text-center'><EllipsisVerticalIcon className="w-7 h-7" /></button>} placement="left">
                                                        <Dropdown.Item
                                                            onClick={() => setModal({ ...modal, [`edit-discount${item.id}`]: true })}
                                                        >
                                                            Sửa
                                                        </Dropdown.Item>
                                                        <Dropdown.Item><button type="button" className="text-red-600" onClick={() => setModal({ ...modal, [`delete-discount${item.id}`]: true })}>Xóa</button></Dropdown.Item>
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
            </div >
        </div >

    )
}
