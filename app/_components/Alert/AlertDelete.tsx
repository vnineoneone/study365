"use client"
import Link from 'next/link';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


export default function Paginate({ text }: any) {
    return (
        MySwal.fire({
            title: <p className="text-2xl">{text}</p>,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",

        })

    )
}
