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
import { formatCash } from '@/app/helper/FormatFunction';
// import { columns } from "@/app/_components/Table/Admin/StudentColumns/columns"

export default function CourseManageDashboard() {
    const [courses, setCourses] = useState([])
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
                        Tên khóa học
                        <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                    </button>
                )
            },
        },
        {
            accessorKey: "price",
            header: ({ column }: any) => {
                return (
                    <button
                        className="flex justify-center items-center font-semibold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Giá (VNĐ)
                        <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                    </button>
                )
            },
            cell: ({ cell }) => {
                return (
                    formatCash(String(cell.getValue()) || '0')
                )
            },
        },
        {
            accessorKey: "Categories.0.Class",
            header: ({ column }: any) => {
                return (
                    <button
                        className="flex justify-center items-center  font-semibold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Lớp
                        <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                    </button>
                )
            },
        },
        {
            accessorKey: "Categories.1.Subject",
            header: ({ column }: any) => {
                return (
                    <button
                        className="flex justify-center items-center  font-semibold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Môn
                        <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                    </button>
                )
            },
        },
        {
            accessorKey: "Categories.2.Level",
            header: ({ column }: any) => {
                return (
                    <button
                        className="flex justify-center items-center  font-semibold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Mức độ
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
                            setModal({ ...modal, [`edit_course`]: true })
                            setSelectedStudent(cell.row.original)
                        }}>
                        <PencilSquareIcon className="w-6 h-6" />
                    </button>
                    <button type="button" className=" text-red-500">
                        <TrashIcon className="w-6 h-6" onClick={() => {
                            setModal({ ...modal, [`delete_course`]: true })
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
            await courseApi.getAll('', `${page}`).then((data: any) => {
                setCourses(data.data.courses)
            }).catch((err: any) => { })
        }
        fetchData()


    }, [page, user.id]);


    return (
        <div className='w-full'>
            <ToastContainer />
            <>
                <Modal show={modal[`delete_course`] || false} size="md" onClose={() => setModal({ ...modal, [`delete_course`]: false })} popup>
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
                                Bạn có chắc muốn xóa khóa này?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" type='submit'>
                                    Xóa
                                </Button>
                                <Button color="gray" onClick={() => {
                                    setModal({ ...modal, [`delete_course`]: false })
                                }}>
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>

            </>
            <div>
                <div className="">
                    <div className="font-bold text-[#171347] text-lg">Danh sách khóa học</div>
                    <div className="container mx-auto rounded-lg mt-4">
                        <DataTable columns={columns} data={courses} page={page} setPage={setPage} pageCount={pageCount} />
                    </div>
                </div>

            </div>
        </div>

    )
}
