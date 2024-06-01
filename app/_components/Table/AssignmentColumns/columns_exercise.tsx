"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"
import { ReactNode } from "react"
import Link from "next/link"

// export type Assignment = {
//     name: string,
//     price: number,
//     status: string
// }

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "Exam.title",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tên bài kiểm tra
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },
    {
        accessorKey: "course_name",
        header: ({ column }) => {
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
        accessorKey: "student.name",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Học sinh
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },

    {
        accessorKey: "score",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center  font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Điểm
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: ({ cell }) => {
            <span className="font-semibold">{(Number(cell.getValue()) || 0).toFixed(1) as ReactNode}</span>
        },
    },
    {
        accessorKey: "time_end",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center  font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Thời gian hoàn thành
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },
    {
        accessorKey: "passed",
        header: ({ column }) => {
            return (
                <div className=" font-semibold">Trạng thái</div>
            )
        },
        cell: ({ cell }) => {
            if (!cell.getValue())
                return <span className="bg-red-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Chưa hoàn thành</span>
            else
                return <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Hoàn thành</span>
        },
    },
    {
        accessorKey: "reviewed",
        header: ({ column }) => {
            return (
                <div className=" font-semibold">Đánh giá</div>
            )
        },
        cell: ({ cell }) => {
            if (cell.getValue() === 2)
                return <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Đã đánh giá</span>
            else if (cell.getValue() === 1)
                return <span className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Đang đánh giá</span>
            else
                return <span className="bg-red-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Chưa đánh giá</span>
        },
    },
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <div className=" font-semibold">Tác vụ</div>
            )
        },
        cell: ({ cell }) => {
            return <Link href={`/teacher/quizz/assignment/${cell.getValue()}/review?type=exercise`} className="underline text-blue-500">Đánh giá</Link>
        },
    },
]
