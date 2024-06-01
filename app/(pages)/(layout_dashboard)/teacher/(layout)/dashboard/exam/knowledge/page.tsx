'use client'
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { Controller, set, useForm } from "react-hook-form"
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { convertToVietnamTime } from '@/app/helper/FormatFunction';
import { Label, Modal, TextInput, Textarea, Button } from 'flowbite-react';
import categoryApi from '@/app/api/category';
import examApi from '@/app/api/examApi';
import { columns } from '@/app/_components/Table/KnowledgeColumns/columns';
import { DataTable } from "@/app/_components/Table/TableFormat"

export default function CreateKnowledge() {
    const [modal, setModal] = useState<any>({})
    const searchParams = useSearchParams()
    const [knowledges, setKnowledges] = useState<any>([])

    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const queries = Object.fromEntries(searchParams.entries());

    const [category, setCategory] = useState<any>({})
    const {
        register,
        reset,
        control,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        async function fetchCategory() {
            await categoryApi.getAll().then((data: any) => setCategory(data)).catch((err: any) => { })
        }
        fetchCategory()
    }, []);

    useEffect(() => {
        async function fetchData() {
            await examApi.getAllKnowledge().then((data: any) => {
                setKnowledges(data.data)
            }).catch((err: any) => { })
        }
        fetchData()
    }, []);

    return (
        <div>
            <ToastContainer />

            <div>
                <h2 className="text-[#171347] font-bold section-title text-lg flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1] mb-5">Danh mục kiến thức</h2>
                <button type="button" onClick={() => {
                    setModal({ ...modal, [`add-discount`]: true })

                }} className=" bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover">

                    <div className="flex justify-center items-center">
                        Thêm
                    </div>

                </button>
                <div className={`${modal[`add-discount`] ? '' : 'hidden'} w-1/2 mt-5 bg-white p-4 px-6 rounded-lg`}>
                    <form className="space-y-6" onSubmit={handleSubmit(async (data: any) => {

                        let categories = []

                        categories.push(data.grade)
                        categories.push(data.subject)

                        const dataForm = {
                            data: [{
                                name: data.name,
                                categories: categories
                            }]
                        }

                        await examApi.createKnowledge(dataForm).then(() => {

                        }).catch((err: any) => { })

                    })}>

                        <div className="">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                            >
                                Tên danh mục kiến thức
                            </label>
                            <input
                                {...register("name", {
                                    required: "Tên danh mục kiến thức không thể trống."
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
                        <div className="mb-5 w-1/2">
                            <label
                                htmlFor="grade"
                                className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                            >
                                Lớp học
                            </label>
                            <Controller
                                control={control}
                                name="grade"
                                rules={{ required: "Lớp học không thể trống" }}
                                render={({ field }) => (
                                    <select id="grade" {...field} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="" defaultChecked>Chọn lớp học</option>

                                        {category.Class?.map((cl: any, index: any) => {
                                            return (
                                                <option key={index} value={`${cl.id}`}>{cl.name}</option>
                                            )
                                        })}
                                    </select>
                                )}
                            />
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors?.grade?.message?.toString()}
                            </p>
                        </div>
                        <div className="mb-5 w-1/2">
                            <label
                                htmlFor="subject"
                                className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                            >
                                Môn học
                            </label>

                            <Controller
                                control={control}
                                name="subject"
                                rules={{ required: "Môn học không thể trống" }}
                                render={({ field }) => (
                                    <select {...field} id="subject" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="" defaultChecked>Chọn môn học</option>

                                        {category.Subject?.map((subject: any, index: any) => {
                                            return (
                                                <option key={index} value={`${subject.id}`} >{subject.name}</option>
                                            )
                                        })}
                                    </select>
                                )}
                            />
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors?.subject?.message?.toString()}
                            </p>
                        </div>
                        {/* <div className="mb-5 w-1/2">
                            <label
                                htmlFor="level"
                                className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                            >
                                Mức độ
                            </label>
                            <Controller
                                control={control}
                                name="level"
                                rules={{ required: "Mức độ không thể trống" }}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        id="level" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="" defaultChecked>Chọn mức độ</option>

                                        {category.Level?.map((level: any, index: any) => {
                                            return (
                                                <option key={index} value={`${level.id}`} >{level.name}</option>
                                            )
                                        })}
                                    </select>
                                )}
                            />
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors?.level?.message?.toString()}
                            </p>
                        </div> */}

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
                </div>
            </div>
            <div className="container mx-auto rounded-lg mt-8">
                <DataTable columns={columns} data={knowledges} page={page} setPage={setPage} pageCount={pageCount} />
            </div>

        </div >
    )

}



