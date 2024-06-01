"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"
import { ReactNode } from "react"
import { convertToVietnamTime } from "@/app/helper/FormatFunction"

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "student.name",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tên học sinh
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },
    {
        accessorKey: "student.email",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },

    {
        accessorKey: "item.name",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center  font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Mặt hàng
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: ({ cell }) => {
            if (cell.row.original?.item?.delete || cell.row.original?.combo?.delete)
                return (
                    <span className="font-medium">Mặt hàng đã bị xóa</span>
                )
            else
                return (
                    <span>{cell.getValue() as ReactNode || cell.row.original?.combo?.name}</span>
                )
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center  font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Loại giao dịch
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span>Momo</span>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center  font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Thời gian
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span>{convertToVietnamTime(cell.getValue() as string)}</span>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <div className=" font-semibold">Trạng thái</div>
            )
        },
        cell: ({ cell }) => {
            if (cell.row.original.course?.status !== "paid")
                return <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Thành công</span>
            else
                return <span className="bg-red-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Thất bại</span>
        },
    },
]
