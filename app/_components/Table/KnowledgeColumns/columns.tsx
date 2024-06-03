"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowsUpDownIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tên kiến thức
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },
    {
        accessorKey: "Categories.1.Subject",
        header: ({ column }) => {
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
        accessorKey: "Categories.0.Class",
        header: ({ column }) => {
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
    // {
    //     accessorKey: "progress",
    //     header: ({ column }) => {
    //         return (
    //             <button
    //                 className="flex justify-center items-center  font-semibold"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Mức độ
    //                 <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
    //             </button>
    //         )
    //     },
    //     cell: ({ cell }) => {
    //         return <span className="">{`${Number(cell.getValue()) * 100}%`}</span>
    //     },
    // },
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
                        // setModal({ ...modal, [`edit_teacher`]: true })
                        // setSelectedStudent(cell.row.original)
                    }}>
                    <PencilSquareIcon className="w-6 h-6" />
                </button>
                <button type="button" className=" text-red-500">
                    <TrashIcon className="w-6 h-6" onClick={() => {
                        // setModal({ ...modal, [`delete_teacher`]: true })
                        // setSelectedStudent(cell.row.original)
                    }} />
                </button>

            </div>
        },
    },


]
