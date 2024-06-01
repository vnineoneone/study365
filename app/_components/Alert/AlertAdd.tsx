"use client"
import Link from 'next/link';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


export default function AlertAdd({ text }: any) {
    return (
        MySwal.fire({
            title: <p className='text-lg'>Đang xử lý</p>,
            didOpen: async () => {
                MySwal.showLoading()

                MySwal.hideLoading()
            },

            timer: 1000,
        }).then(() => {
            return MySwal.fire({
                title: <p className="text-2xl">Tạo khóa học thất bại</p>,
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
            })
        })

    )
}
