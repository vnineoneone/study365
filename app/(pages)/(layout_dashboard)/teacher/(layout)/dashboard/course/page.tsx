"use client"

import Image from "next/image"
import Link from "next/link"
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from "react"
import courseApi from "@/app/api/courseApi"
import { useAppSelector } from "@/redux/store";
import { formatCash } from "@/app/helper/FormatFunction"
import { Dropdown } from 'flowbite-react';
import { ExclamationCircleIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Button, Modal } from 'flowbite-react';
import { useSearchParams } from 'next/navigation'
import Paginate from "@/app/_components/Paginate/Paginate"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


export default function CourseDashboard() {
    const authUser = useAppSelector(state => state.authReducer.user);
    const [courses, setCourses] = useState<any>([])
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState<boolean>(false)
    const [countPaginate, setCountPaginate] = useState(1)
    const searchParams = useSearchParams()
    const page = searchParams.get('page')
    const search = searchParams.get('search')
    const [searchInput, setSearchInput] = useState('')
    const { user } = useAppSelector(state => state.authReducer);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <StarIcon
                    key={i}
                    className={`text-${i <= rating ? 'yellow-300' : 'gray-300'} w-5 h-5`}
                />
            );
        }
        return stars;
    };

    useEffect(() => {
        async function fetchData() {
            await courseApi.getAllByTeacher(`${authUser.id}`, page || '1').then((data: any) => {
                setCourses(data.data.courses)
                setCountPaginate(Math.ceil(data.data.count / 10))
            }).catch((err: any) => { })
        }
        fetchData()
    }, [authUser.id, change, page]);

    return (
        <div className="">
            <div className="">
                <div className="font-bold text-[#171347] text-lg">Khóa học của tôi</div>
                <div className="flex justify-between items-center mt-10 mb-10 w-full ">
                    <form className="flex items-center w-1/3"
                        onSubmit={async (e: any) => {
                            e.preventDefault()
                            await courseApi.searchCourseByCreateTeacher(`${user.id}`, { query: searchInput }).then((data: any) => {
                                setCourses(data.data.result)
                            }).catch((err: any) => { })
                        }}
                    >
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <input onChange={async (e: any) => {
                                setSearchInput(e.target.value)
                            }} type="text" id="simple-search" className="w-full text-sm text-[#343434]  rounded-md border-[1px] border-[#ececec] focus:ring-0 focus:border-primary_border" placeholder="Tìm kiếm khóa học" />
                        </div>
                        <button type="submit" className="ml-2 bg-primary p-2.5 rounded-md shadow-primary_btn_shadow border-primary text-white hover:bg-primary_hover">
                            <MagnifyingGlassIcon className='w-4 h-4' />
                            <span className="sr-only">Search</span>
                        </button>
                    </form>
                </div>

            </div>
            <div className="mt-8">
                {
                    courses?.map((course: any) => {
                        return (
                            <div key={course.id} className="relative rounded-[10px] flex bg-white mb-8">


                                <div className="h-[200px] w-[320px] relative">
                                    <Image
                                        src={`${course.thumbnail ? course.thumbnail : '/images/cousre-thumnail-1.jpg'}`}
                                        fill
                                        alt="logo"
                                        className="rounded-l-[10px] h-full w-full overflow-hidden object-center object-cover"
                                    />
                                </div>
                                <div className="flex flex-col py-3 pl-[25px] pr-[17px] flex-1">
                                    <div className="flex justify-between items-center w-full">
                                        <div className="flex ">
                                            <h3 className="text-[#171347] font-bold text-lg mr-3">
                                                {course.name}
                                            </h3>
                                            <div>
                                                {
                                                    course.status == 'public' ? <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-700 dark:text-green-300">Công khai</span> : (course?.status == "draft" ? <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Bản nháp</span> :
                                                        (course.status == "private" ? <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Riêng tư</span> : <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Tính phí</span>))
                                                }

                                            </div>
                                        </div>

                                        <Dropdown label="" renderTrigger={() => <EllipsisVerticalIcon className="w-7 h-7" />} placement="left">
                                            <Dropdown.Item onClick={() => {

                                            }}>
                                                <Link href={`course/edit/${course.id}`} >
                                                    Sửa khóa học
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item><Link href={`/course/learning/${course.id}`}>Đến trang học</Link></Dropdown.Item>
                                            <Dropdown.Item><Link href={`course/${course.id}/student`}>Danh sách học sinh</Link></Dropdown.Item>
                                            <Dropdown.Item><div className="text-red-600" onClick={() => {
                                                MySwal.fire({
                                                    title: <p className="text-2xl">Bạn có chắc muốn xóa khóa học này?</p>,
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#3085d6",
                                                    cancelButtonColor: "#d33",
                                                    confirmButtonText: "Xóa",
                                                    cancelButtonText: "Hủy",
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        MySwal.fire({
                                                            title: <p className='text-lg'>Đang xử lý</p>,
                                                            didOpen: async () => {
                                                                MySwal.showLoading()
                                                                await courseApi.delete(course.id).then(() => {
                                                                    MySwal.close()

                                                                    MySwal.fire({
                                                                        title: <p className="text-2xl">Khóa học đã được xóa thành công</p>,
                                                                        icon: 'success',
                                                                        showConfirmButton: false,
                                                                        timer: 1500
                                                                    })
                                                                    setChange(!change)
                                                                }).catch((err: any) => {
                                                                    MySwal.close()
                                                                    MySwal.fire({
                                                                        title: <p className="text-2xl">Xóa khóa học thất bại</p>,
                                                                        icon: 'error',
                                                                        showConfirmButton: false,
                                                                        timer: 1500
                                                                    })
                                                                })
                                                            },
                                                        })


                                                    }
                                                });
                                            }}>Xóa khóa học</div></Dropdown.Item>
                                        </Dropdown>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        {
                                            renderStars(Math.floor(course?.average_rating || 0))
                                        }
                                        <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{course.average_rating.toFixed(1)}</span>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-[20px] font-bold text-primary">{formatCash(`${course.price}`)} VNĐ</span>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between flex-wrap">
                                        {
                                            course?.Categories.map((category: any, index: number) => {
                                                if (category.Class) {
                                                    return (
                                                        <div key={category.id} className="flex items-center flex-col mt-[20px] mr-[15px]">
                                                            <span className="text-sm text-[#818894]">Lớp:</span>
                                                            <span className="text-sm text-[#171347]">{category.Class}</span>
                                                        </div>
                                                    )
                                                }
                                                else if (category.Subject) {
                                                    return (
                                                        <div key={category.id} className="flex items-center flex-col mt-[20px] mr-[15px]">
                                                            <span className="text-sm text-[#818894]">Môn học:</span>
                                                            <span className="text-sm text-[#171347]">{category.Subject}</span>
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div key={category.id} className="flex items-center flex-col mt-[20px] mr-[15px]">
                                                            <span className="text-sm text-[#818894]">Mức độ:</span>
                                                            <span className="text-sm text-[#171347]">{category.Level}</span>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                                {/* <div
                                    role="status"
                                    className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div> */}
                            </div>
                        )
                    })
                }
            </div>
            < Paginate countPaginate={countPaginate} currentPage={page} />

        </div>
    )
}
