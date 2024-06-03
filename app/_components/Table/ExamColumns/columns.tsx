"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"
import { ReactNode } from "react"
import { renderOnlyStar } from "@/app/helper/RenderFunction"
import { formatCash } from "@/app/helper/FormatFunction"

export type Course = {
    name: string,
    price: number,
    status: string
}


export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "title",
        header: ({ column }: any) => {
            return (
                <button
                    className="flex justify-center items-center font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tên đề thi
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },
    {
        accessorKey: "Class",
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
        accessorKey: "Subject",
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
        accessorKey: "Level",
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

]
