"use client"
import Link from 'next/link';
import Image from 'next/image';
import { ArrowsUpDownIcon, TrashIcon, PencilSquareIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';
import { Controller, useForm } from "react-hook-form"
import { Label, Modal, TextInput, Textarea, Button, Toast } from 'flowbite-react';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import courseApi from '@/app/api/courseApi';
import { DataTable } from '@/app/_components/Table/TableFormat';
import { ColumnDef } from '@tanstack/react-table';
import userApi from '@/app/api/userApi';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { renderOnlyStar } from '@/app/helper/RenderFunction';
// import { columns } from "@/app/_components/Table/Admin/StudentColumns/columns"

export default function TeacherManageDashboard() {
    const [teachers, setTeachers] = useState([])
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState(false)
    const searchParams = useSearchParams()
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const {
        register,
        reset,
        handleSubmit,
        control,
        setError,
        getValues,
        formState: { errors },
    } = useForm<any>()

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: ({ column }: any) => {
                return (
                    <button
                        className="flex justify-center items-center font-semibold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tên giáo viên
                        <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                    </button>
                )
            },
        },
        {
            accessorKey: "email",
            header: ({ column }: any) => {
                return (
                    <button
                        className="flex justify-center items-center  font-semibold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                    </button>
                )
            },
        },
        {
            accessorKey: "course_quantity",
            header: ({ column }: any) => {
                return (
                    <button
                        className="flex justify-center items-center  font-semibold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Số khóa học
                        <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                    </button>
                )
            },
        },
        {
            accessorKey: "exam_quantity",
            header: ({ column }: any) => {
                return (
                    <button
                        className="flex justify-center items-center  font-semibold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Số đề thi
                        <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                    </button>
                )
            },
        },
        {
            accessorKey: "average_rating",
            header: ({ column }: any) => {
                return (
                    <button
                        className="flex justify-center items-center  font-semibold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Sao trung bình
                        <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                    </button>
                )
            },
            cell: ({ cell }) => {
                return (
                    renderOnlyStar(Number(cell.getValue() || 0))
                )
            },
        },
        {
            accessorKey: "id",
            header: ({ column }) => {
                return (
                    <div className=" font-semibold text-center">Tác vụ</div>
                )
            },
            cell: ({ cell }) => {
                return <div className="flex items-center justify-center">
                    <button type="button" className="mr-[10px] text-blue-400"
                        onClick={() => {
                            setModal({ ...modal, [`edit_teacher`]: true })
                            setSelectedStudent(cell.row.original)
                        }}>
                        <PencilSquareIcon className="w-6 h-6" />
                    </button>
                    <button type="button" className=" text-red-500">
                        <TrashIcon className="w-6 h-6" onClick={() => {
                            setModal({ ...modal, [`delete_teacher`]: true })
                            setSelectedStudent(cell.row.original)
                        }} />
                    </button>

                </div>
            },
        },
    ]

    const { user } = useAppSelector(state => state.authReducer);
    useEffect(() => {
        async function fetchData() {
            await userApi.getAllTeacher('', `${page}`).then((data: any) => {
                setTeachers(data.data.teachers)
            }).catch((err: any) => { })
        }
        fetchData()


    }, [page, user.id]);


    return (
        <div className='w-full'>
            <ToastContainer />
            <>
                <Modal show={modal[`delete_teacher`] || false} size="md" onClose={() => setModal({ ...modal, [`delete_teacher`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={async (e) => {
                            e.preventDefault()
                            if (selectedStudent)
                                await userApi.deleteStudent(selectedStudent?.id).then(() => {
                                    toast.success('Học sinh đã bị xóa', {
                                        position: "bottom-right",
                                        autoClose: 1000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                        transition: Bounce,
                                    });
                                }).catch((err: any) => { })

                            setChange(!change)
                            setModal(false)
                        }}>
                            <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-center text-gray-500 dark:text-gray-400">
                                Bạn có chắc muốn xóa giáo viên này?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" type='submit'>
                                    Xóa
                                </Button>
                                <Button color="gray" onClick={() => {
                                    setModal({ ...modal, [`delete_teacher`]: false })
                                }}>
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>

                <Modal show={modal[`edit_teacher`] || false} size="xl" onClose={() => setModal({ ...modal, [`edit_teacher`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={handleSubmit(async (data: any) => {
                            const dataForm = {
                                name: data.name,
                                percent: Number(data.percent),
                                start_time: data.start_time,
                                expire: data.end_time,
                                courses: [data.courses]
                            }

                            // await discountApi.update(dataForm, item.id).then(() => {

                            // }).catch((err: any) => { })

                            setChange(!change)
                            reset()
                            setModal({ ...modal, [`edit_teacher`]: false })
                        })}>

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sửa giáo viên</h3>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {

                                        setModal({ ...modal, [`edit_teacher`]: false })
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
            <div>
                <div className="">
                    <div className="font-bold text-[#171347] text-lg">Danh sách giáo viên</div>
                    <div className="container mx-auto rounded-lg mt-4">
                        <DataTable columns={columns} data={teachers} page={page} setPage={setPage} pageCount={pageCount} />
                    </div>
                </div>

            </div>
        </div>

    )
}
