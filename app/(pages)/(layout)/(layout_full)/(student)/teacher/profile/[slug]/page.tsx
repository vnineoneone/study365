"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ClockIcon, Squares2X2Icon, FilmIcon, DocumentTextIcon, CheckIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, ChevronUpIcon, StarIcon } from '@heroicons/react/20/solid'
import courseApi from '@/app/api/courseApi';
import paymentApi from '@/app/api/paymentApi';
import { useForm, SubmitHandler } from "react-hook-form"
import parse from 'html-react-parser';
import { formatCash, convertTime, formatDateTime } from '@/app/helper/FormatFunction';
import { ToastContainer, toast } from 'react-toastify';
import { useAppSelector } from '@/redux/store';
import userApi from '@/app/api/userApi';
import PaginateButton from '@/app/_components/Paginate/PaginateButton';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function TeacherProfile({ params }: { params: { slug: string } }) {
    const [tab, setTab] = useState(1)
    const [toggle, setToggle] = useState<any>({})

    const [reviews, setReviews] = useState([]);
    const [changeData, setChangeData] = useState(false);
    const [courses, setCourses] = useState<any>([]);
    const [profile, setProfile] = useState<any>({});
    const [rating, setRating] = useState(0);
    const [avgReview, setAvgReview] = useState(0);
    const [starDetails, setStarDetails] = useState<any>();
    const [hoverRating, setHoverRating] = useState(0);
    const { user } = useAppSelector(state => state.authReducer);
    const [countPaginate, setCountPaginate] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<any>()

    useEffect(() => {
        async function fetchData() {
            await userApi.getProfileTeacher(params.slug).then((data: any) => {
                setProfile(data.data)
            }
            ).catch((err: any) => { })
            await userApi.getReviewOfTeacher(params.slug, currentPage).then((data: any) => {
                setReviews(data.data.reviews)
                setCountPaginate(Math.ceil(data.data.count / 10))
                if (data.data.averageRating) {
                    setAvgReview(data.data.averageRating)
                }
                if (data.data.starDetails) {
                    setStarDetails(data.data.starDetails)
                }
            }
            ).catch((err: any) => { })
            await courseApi.getAllByTeacher(`${params.slug}`, '1').then((data: any) => {
                setCourses(data.data.courses)
            }).catch((err: any) => { })
        }
        fetchData()
    }, [changeData, params.slug, currentPage])

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <StarIcon
                key={index + 1}
                className={`text-${index + 1 <= rating ? 'yellow-300' : 'gray-300'} w-5 h-5`}
            />
        ));
    };

    const handleHover = (hoverRating: any) => {
        setHoverRating(hoverRating);
    };




    return (
        <div className="mx-20 mt-28">
            <div className='rounded-xl shadow-lg px-12 py-9 relative bg-white border-[1px] border-slate-200'>
                <div className='flex items-center'>
                    <div className='w-[190px] h-[190px] rounded-full relative'>
                        <Image
                            src={`${profile?.avatar ? profile?.avatar : "/images/avatar-teacher.png"}`}
                            fill
                            className='rounded-full overflow-hidden object-cover object-center'
                            alt="logo"
                        />
                    </div>
                    <div className='ml-10'>
                        <h1 className='font-bold text-2xl text-[#171347]'>
                            {profile?.name}
                        </h1>
                        <div className="flex items-center mt-4">
                            {renderStars(Math.floor(profile?.average_rating || 0))}
                            <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{(profile?.average_rating || 0).toFixed(1)}</span>
                        </div>
                        <div className='mt-5 flex justify-around items-center'>
                            <div className='w/1/4 flex flex-col items-center mr-10'>
                                <div className='p-3 rounded-md border-2 border-[#ef9d69]'>
                                    <div className='w-8 h-8 relative'>
                                        <Image
                                            src={`/images/students.svg`}
                                            fill
                                            className='overflow-hidden object-cover object-center'
                                            alt="logo"
                                        />
                                    </div>
                                </div>
                                <span className='font-bold text-[#171347] text-xl'>
                                    {profile?.student_quantity || 0}
                                </span>
                                <span className='text-[#818894] text-sm'>
                                    Học viên
                                </span>
                            </div>
                            <div className='w/1/4 flex flex-col items-center mr-10'>
                                <div className='p-3 rounded-md border-2 border-[#00a1d9]'>
                                    <div className='w-8 h-8 relative'>
                                        <Image
                                            src={`/images/webinars.svg`}
                                            fill
                                            className='overflow-hidden object-cover object-center'
                                            alt="logo"
                                        />
                                    </div>
                                </div>
                                <span className='font-bold text-[#171347] text-xl'>
                                    {profile?.course_quantity || 0}
                                </span>
                                <span className='text-[#818894] text-sm'>
                                    Khóa học
                                </span>
                            </div>
                            <div className='w/1/4 flex flex-col items-center mr-10'>
                                <div className='p-3 rounded-md border-2  border-[#4fb949]'>
                                    <div className='w-8 h-8 relative'>
                                        <Image
                                            src={`/images/reviews.svg`}
                                            fill
                                            className='overflow-hidden object-cover object-center'
                                            alt="logo"
                                        />
                                    </div>
                                </div>
                                <span className='font-bold text-[#171347] text-xl'>
                                    {profile?.total_review || 0}
                                </span>
                                <span className='text-[#818894] text-sm'>
                                    Đánh giá
                                </span>
                            </div>
                            <div className='w/1/4 flex flex-col items-center mr-10'>
                                <div className='p-3 rounded-md border-2 border-[#a855ff]'>
                                    <div className='w-8 h-8 relative'>
                                        <Image
                                            src={`/images/appointments.svg`}
                                            fill
                                            className='overflow-hidden object-cover object-center'
                                            alt="logo"
                                        />
                                    </div>
                                </div>
                                <span className='font-bold text-[#171347] text-xl'>
                                    {profile?.exam_quantity || 0}
                                </span>
                                <span className='text-[#818894] text-sm'>
                                    Đề thi
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className='mt-9 border rounded-xl px-4 py-2 mb-10 border-gray-200'>
                <div className=" rounded-lg border-b border-gray-200">
                    <ul className="flex flex-wrap justify-between px-2 text-sm font-semibold text-center text-gray-500 dark:text-gray-400">
                        <li className="me-2">
                            <button
                                onClick={() => setTab(1)}
                                className={`text-[#171347] font-medium text-lg inline-flex items-center justify-center p-4 px-12 ${tab == 1 ? 'border-b-4 border-primary rounded-t-lg active' : 'border-b-4 border-transparent rounded-t-lg hover:text-gray-300'} group`}
                            >
                                Thông tin
                            </button>
                        </li>
                        <li className="me-2">
                            <button
                                onClick={() => setTab(2)}
                                className={`text-[#171347] font-medium text-lg inline-flex items-center justify-center p-4 px-12 ${tab == 2 ? 'border-b-4 border-primary rounded-t-lg active' : 'border-b-4 border-transparent rounded-t-lg hover:text-gray-300'} group`}
                            >
                                Khóa học
                            </button>
                        </li>
                        <li className="me-2">
                            <button
                                onClick={() => setTab(3)}
                                className={`text-[#171347] font-medium text-lg inline-flex items-center justify-center p-4 px-12 ${tab == 3 ? 'border-b-4 border-primary rounded-t-lg active' : 'border-b-4 border-transparent rounded-t-lg hover:text-gray-300'} group`}
                            >
                                Đánh giá
                            </button>
                        </li>
                    </ul>
                </div>
                <div className='pt-5 px-4'>
                    <div className={`${tab == 1 ? '' : 'hidden'}`}>

                        <div className=''>
                            <div className=''>
                                <h3 className='font-bold text-secondary'>Giới thiệu</h3>
                                <p className='flex items-start mt-2 text-[14px] text-[#818894]'>
                                    {profile?.biostory}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={`${tab == 2 ? '' : 'hidden'}`}>
                        <ul>
                            {
                                courses?.map((course: any) => {
                                    return (
                                        <div key={course.id} className="border-[1px] border-slate-200 relative rounded-[10px] flex bg-white mb-8">

                                            <div className="h-[200px] w-[300px] relative">
                                                <Image
                                                    src={`${course.thumbnail ? course.thumbnail : '/images/cousre-thumnail-1.jpg'}`}
                                                    fill
                                                    alt="logo"
                                                    className="rounded-l-[10px] h-full w-full overflow-hidden object-center object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col py-3 pl-[25px] pr-[17px] flex-1">
                                                <div className="flex justify-between items-center w-full">
                                                    <Link href="#" >
                                                        <h3 className="text-[#171347] font-bold text-lg">
                                                            {course.name}
                                                        </h3>
                                                    </Link>
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
                                                    <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                                        <span className="text-sm text-[#818894]">Lớp:</span>
                                                        <span className="text-sm text-[#171347]">{course.Categories[0]?.Class}</span>
                                                    </div>
                                                    <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                                        <span className="text-sm text-[#818894]">Môn học:</span>
                                                        <span className="text-sm text-[#171347]">{course.Categories[1]?.Subject}</span>
                                                    </div>
                                                    <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                                        <span className="text-sm text-[#818894]">Mức độ:</span>
                                                        <span className="text-sm text-[#171347]">{course.Categories[2]?.Level}</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                })
                            }
                        </ul>

                    </div>
                    <div className={`${tab == 3 ? '' : 'hidden'}`}>

                        <div className='flex items-center text-center'>
                            <div className='px-4 mx-10'>
                                <div className='font-bold text-4xl text-primary text-center'>
                                    {avgReview.toFixed(1)}
                                </div>
                                <div className="flex items-center justify-center mt-2">
                                    {renderStars(Math.floor(avgReview))}
                                </div>
                                <div className='mt-4 text-[#343434]'>{reviews?.length} đánh giá</div>
                            </div>
                            <div className='flex-1'>
                                <div className="flex items-center mt-4">
                                    <div
                                        className="text-sm font-medium text-primary"
                                    >
                                        5 sao
                                    </div>
                                    <div className="w-1/2  h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div className="h-5 bg-yellow-300 rounded" style={{ width: `${starDetails?.['5star']?.quantity == 0 ? 0 : starDetails?.['5star'].percentage}%` }} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {0 || Math.floor(starDetails?.['5star'].percentage)}%
                                    </span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div
                                        className="text-sm font-medium text-primary"
                                    >
                                        4 sao
                                    </div>
                                    <div className="w-1/2  h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div className="h-5 bg-yellow-300 rounded" style={{ width: `${starDetails?.['4star']?.quantity == 0 ? 0 : starDetails?.['4star'].percentage}%` }} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {0 || Math.floor(starDetails?.['4star'].percentage)}%
                                    </span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div
                                        className="text-sm font-medium text-primary"
                                    >
                                        3 sao
                                    </div>
                                    <div className="w-1/2  h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div className="h-5 bg-yellow-300 rounded" style={{ width: `${starDetails?.['3star']?.quantity == 0 ? 0 : starDetails?.['3star'].percentage}%` }} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {0 || Math.floor(starDetails?.['3star'].percentage)}%
                                    </span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div
                                        className="text-sm font-medium text-primary"
                                    >
                                        2 sao
                                    </div>
                                    <div className="w-1/2  h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div className="h-5 bg-yellow-300 rounded" style={{ width: `${starDetails?.['2star']?.quantity == 0 ? 0 : starDetails?.['2star'].percentage}%` }} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {0 || Math.floor(starDetails?.['2star'].percentage)}%
                                    </span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div
                                        className="text-sm font-medium text-primary"
                                    >
                                        1 sao
                                    </div>
                                    <div className="w-1/2  h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div className="h-5 bg-yellow-300 rounded" style={{ width: `${starDetails?.['1star']?.quantity == 0 ? 0 : starDetails?.['1star'].percentage}%` }} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {0 || Math.floor(starDetails?.['1star'].percentage)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10'>
                            <div className="text-[#171347] font-bold flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1]">
                                Đánh giá ({reviews.length})
                            </div>
                            <form onSubmit={handleSubmit(async (dataReview) => {
                                if (rating == 0) return
                                const formData = {
                                    data: {
                                        ...dataReview,
                                        id_teacher: params.slug,
                                        rating
                                    }
                                }
                                MySwal.fire({
                                    title: <p className='text-lg'>Đang xử lý</p>,
                                    didOpen: async () => {
                                        MySwal.showLoading()
                                        await userApi.createReviewTeacher(formData)
                                            .then(() => {
                                                reset()
                                                setRating(0)
                                                setChangeData(!changeData)
                                                MySwal.fire({
                                                    title: <p className="text-2xl">Thành công</p>,
                                                    icon: 'success',
                                                    showConfirmButton: false,
                                                    timer: 1000
                                                })
                                            }).catch((err: any) => {
                                                MySwal.fire({
                                                    title: <p className="text-2xl">Thất bại</p>,
                                                    icon: 'error',
                                                    showConfirmButton: false,
                                                    timer: 1000
                                                })
                                            })
                                    },
                                })

                            })} className="flex flex-col items-start mt-5 w-2/3">
                                <div className=''>
                                    <div className='flex items-center mb-4'>
                                        <div className=''>
                                            <Image
                                                src={`${user.avatar ? user.avatar : '/images/avatar.png'}`}
                                                width={40}
                                                height={40}
                                                className='w-10 h-10 rounded-full'
                                                alt="logo"
                                            />
                                        </div>
                                        <div className='flex flex-col ml-2'>
                                            <span className='font-medium text-secondary'>
                                                {user.name}
                                            </span>
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarIcon
                                                        key={star}
                                                        className={`h-5 w-5 cursor-pointer ${(hoverRating || rating) >= star ? 'text-yellow-300' : 'text-gray-300'
                                                            }`}
                                                        onMouseEnter={() => handleHover(star)}
                                                        onMouseLeave={() => handleHover(0)}
                                                        onClick={() => setRating(star)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <textarea
                                    placeholder="Nhập đánh giá của bạn..."
                                    {...register("content")}
                                    className="w-full p-2 border rounded focus:ring-0 focus:border-primary_border"
                                    rows={4}
                                ></textarea>
                                <button
                                    type="submit"

                                    className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary_hover"
                                >
                                    Đánh giá
                                </button>
                            </form>
                            <div className='mt-12 w-2/3'>
                                {
                                    reviews?.map((review: any) => (
                                        <div key={review.id} className="bg-white px-4 py-4 mb-5 border rounded-lg shadow-md">
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center mt-2'>
                                                    <div>
                                                        <Image
                                                            src={`${review?.user?.avatar ? review?.user?.avatar : '/images/avatar.png'}`}
                                                            width={40}
                                                            height={40}
                                                            className='w-10 h-10 rounded-full'
                                                            alt="logo"
                                                        />
                                                    </div>
                                                    <div className='flex flex-col ml-2'>
                                                        <span className='font-medium text-secondary'>
                                                            {review?.user?.name}
                                                        </span>
                                                        <div className="flex items-center">{renderStars(review.rating)}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className='text-[#818894] text-sm'>
                                                        {formatDateTime(review.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='text-[#818894] mt-4 font-normal'>
                                                {review.content}
                                            </div>
                                        </div>
                                    ))}
                                <PaginateButton countPaginate={countPaginate} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

