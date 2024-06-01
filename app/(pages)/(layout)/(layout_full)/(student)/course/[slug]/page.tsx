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
// import { useSession } from 'next-auth/react';
import { useAppSelector } from '@/redux/store';
import PaginateButton from '@/app/_components/Paginate/PaginateButton';
type Review = {
    content: string
    rating: number
}
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function CourseDetail({ params }: { params: { slug: string } }) {
    const [tab, setTab] = useState(1)
    const [toggle, setToggle] = useState<any>({})

    const [reviews, setReviews] = useState([]);
    const [changeData, setChangeData] = useState(false);
    const [course, setCourse] = useState<any>({});
    const [rating, setRating] = useState(0);
    const [avgReview, setAvgReview] = useState(0);
    const [starDetails, setStarDetails] = useState<any>({});
    const [hoverRating, setHoverRating] = useState(0);
    const { user } = useAppSelector(state => state.authReducer);
    const [countPaginate, setCountPaginate] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Review>()

    useEffect(() => {
        async function fetchData() {
            await courseApi.get(params.slug).then((data: any) => {
                setCourse(data.data)
            }
            ).catch((err) => {
                console.log(err)
            })
            await courseApi.getReview(params.slug, currentPage).then((data: any) => {
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
        }
        fetchData()
    }, [changeData, params.slug, currentPage])


    const handleHover = (hoverRating: any) => {
        setHoverRating(hoverRating);
    };

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

    return (
        <div className="">
            <div className="relative h-[530px] block overflow-hidden">
                <Image
                    src={`${course?.cover_image ? course?.cover_image : '/'}`}
                    fill={true}
                    className='w-full h-full absolute top-0 left-0 object-cover object-center'
                    alt="logo"
                />
                <div className='h-full w-full'>
                    <div className="relative z-0 after:content-['*'] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-black after:opacity-60 after:h-[530px]"></div>
                </div>
            </div>
            <div className='container relative top-[-200px] mx-auto px-16 w-full'>
                <div className='flex'>
                    <div className='px-4 w-2/3 flex flex-col'>
                        <div className=''>
                            <h1 className='font-black text-3xl text-white h-22 ovet text-ellipsis overflow-hidden'>
                                {course?.name}
                            </h1>
                            <div className="flex items-center mt-10">
                                {renderStars(Math.floor(avgReview))}
                                <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-2 py-0.5 rounded">{avgReview.toFixed(1)}</span>
                                <span className='text-white'>({reviews.length} Đánh giá)</span>
                            </div>
                            <div className='mt-4 text-white text-sm font-medium'>
                                <span className='mr-2'>Tạo bởi</span>
                                <Link href={`/teacher/profile/${course?.id_teacher}`} className='underline decoration-1'>{course?.teacher?.name}</Link>
                            </div>
                        </div>
                        <div className='mt-9'>
                            <div className="bg-secondary rounded-lg border-b border-gray-200 dark:border-gray-700">
                                <ul className="flex flex-wrap justify-between px-2 text-sm font-semibold text-center text-gray-500 dark:text-gray-400">
                                    <li className="me-2">
                                        <button
                                            onClick={() => setTab(1)}
                                            className={`text-white inline-flex items-center justify-center p-4 ${tab == 1 ? 'border-b-2 border-primary rounded-t-lg active' : 'border-b-4 border-transparent rounded-t-lg hover:text-gray-300'} group`}
                                        >
                                            Thông tin chung
                                        </button>
                                    </li>
                                    <li className="me-2">
                                        <button
                                            onClick={() => setTab(2)}
                                            type='button'
                                            className={`text-white inline-flex items-center justify-center p-4 ${tab == 2 ? 'border-b-2 border-primary rounded-t-lg active' : 'border-b-4 border-transparent rounded-t-lg hover:text-gray-300'} group`}
                                            aria-current="page"
                                        >
                                            Nội dung khóa học ({course?.chapters?.length})
                                        </button>
                                    </li>
                                    <li className="me-2">
                                        <button
                                            onClick={() => setTab(3)}
                                            className={`text-white inline-flex items-center justify-center p-4 ${tab == 3 ? 'border-b-2 border-primary rounded-t-lg active' : 'border-b-4 border-transparent rounded-t-lg hover:text-gray-300'} group`}
                                        >
                                            Đánh giá ({reviews?.length})
                                        </button>
                                    </li>

                                </ul>
                            </div>
                            <div className='pt-5'>
                                <div className={`${tab == 1 ? '' : 'hidden'}`}>
                                    <div className='rounded-md p-4 bg-[#f7fafd]'>
                                        <h3 className='text-secondary font-bold'>Mục tiêu</h3>
                                        <p className='flex items-start text-[14px] text-[#818894] mt-2'>
                                            {parse(course?.goal || '')}
                                        </p>

                                    </div>
                                    <div className='mt-5'>
                                        <h2 className="text-[#171347] font-bold flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1]">
                                            Thông tin về khóa học
                                        </h2>
                                        <div className='mt-5 text-[#818894]'>
                                            <p>
                                                {parse(course?.description || '')}
                                            </p>
                                        </div>
                                        <div className='mt-5'>
                                            <h3 className='font-bold text-secondary'>Yêu cầu</h3>
                                            <p className='flex items-start mt-2 text-[14px] text-[#818894]'>
                                                {parse(course?.requirement || "")}
                                            </p>
                                        </div>
                                        <div className='mt-5'>
                                            <h3 className='font-bold text-secondary'>Đối tượng</h3>
                                            <p className='flex items-start mt-2 text-[14px] text-[#818894]'>
                                                {parse(course?.object || "")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${tab == 2 ? '' : 'hidden'}`}>
                                    <ul>
                                        {course?.chapters?.map((chapter: any) => {
                                            return (
                                                <li key={chapter.id} className='bg-white py-3 pl-[20px] pr-6 rounded-lg mb-5 list-none border-[1px] border-[#ececec]'>
                                                    <div className='flex items-center justify-between'>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex justify-center items-center">
                                                                <span className="flex justify-center items-center w-10 h-10 min-w-10 min-h-10 bg-primary rounded-full mr-[10px]">
                                                                    <Squares2X2Icon className="w-6 h-6 text-white" />
                                                                </span>
                                                                <div>
                                                                    <span className="font-bold text-[rgb(23,19,71)] text-base">
                                                                        {chapter.name}
                                                                    </span>
                                                                    <span className="font-normal text-[818894] text-xs flex">
                                                                        {chapter.topics?.length} chủ đề
                                                                        | {convertTime(chapter.totalDuration)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="ml-5 flex items-center justify-center">

                                                            <div className="mr-[10px]" >
                                                                {
                                                                    !toggle[`open_chapter_${chapter.id}`] ?
                                                                        <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                                                            setToggle({ ...toggle, [`open_chapter_${chapter.id}`]: true })
                                                                        }}>
                                                                            <ChevronDownIcon className="w-5 h-5" />
                                                                        </button>
                                                                        :
                                                                        <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                                                            setToggle({ ...toggle, [`open_chapter_${chapter.id}`]: false })
                                                                        }}>
                                                                            <ChevronUpIcon className="w-5 h-5" />
                                                                        </button>
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ul className={`${toggle[`open_chapter_${chapter.id}`] ? '' : 'hidden'} mt-4 pt-8 border-t-[1px] border-[#ececec]`}>
                                                        {
                                                            chapter.topics?.map((topic: any) => {
                                                                return (
                                                                    <li key={topic.id} className='bg-white py-3 pl-[20px] pr-6 rounded-lg mb-5 list-none border-[1px] border-[#ececec]'>
                                                                        <div className='flex items-center justify-between'>
                                                                            <div className="flex justify-between items-center">
                                                                                <div className="flex justify-center items-center">
                                                                                    <span className='mr-3 bg-[#ececec] w-10 h-10 rounded-full flex justify-center items-center'>
                                                                                        <FilmIcon className='w-4 h-4' />
                                                                                    </span>
                                                                                    <span className="font-bold text-[rgb(23,19,71)] text-base">
                                                                                        {topic.name}
                                                                                    </span>

                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </li>
                                            )

                                        })}
                                    </ul>

                                </div>
                                <div className={`${tab == 3 ? '' : 'hidden'}`}>
                                    <div className='flex items-center text-center'>
                                        <div className='w-1/4 px-4'>
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
                                                <div className="w-3/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                    <div className="h-5 bg-yellow-300 rounded" style={{ width: `${starDetails?.['5star']?.quantity == 0 ? 0 : starDetails?.['5star']?.percentage}%` }} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {0 || Math.floor(starDetails?.['5star']?.percentage)}%
                                                </span>
                                            </div>
                                            <div className="flex items-center mt-4">
                                                <div
                                                    className="text-sm font-medium text-primary"
                                                >
                                                    4 sao
                                                </div>
                                                <div className="w-3/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                    <div className="h-5 bg-yellow-300 rounded" style={{ width: `${starDetails?.['4star']?.quantity == 0 ? 0 : starDetails?.['4star']?.percentage}%` }} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {0 || Math.floor(starDetails?.['4star']?.percentage)}%
                                                </span>
                                            </div>
                                            <div className="flex items-center mt-4">
                                                <div
                                                    className="text-sm font-medium text-primary"
                                                >
                                                    3 sao
                                                </div>
                                                <div className="w-3/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                    <div className="h-5 bg-yellow-300 rounded" style={{ width: `${starDetails?.['3star']?.quantity == 0 ? 0 : starDetails?.['3star']?.percentage}%` }} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {0 || Math.floor(starDetails?.['3star']?.percentage)}%
                                                </span>
                                            </div>
                                            <div className="flex items-center mt-4">
                                                <div
                                                    className="text-sm font-medium text-primary"
                                                >
                                                    2 sao
                                                </div>
                                                <div className="w-3/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                    <div className="h-5 bg-yellow-300 rounded" style={{ width: `${starDetails?.['2star']?.quantity == 0 ? 0 : starDetails?.['2star']?.percentage}%` }} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {0 || Math.floor(starDetails?.['2star']?.percentage)}%
                                                </span>
                                            </div>
                                            <div className="flex items-center mt-4">
                                                <div
                                                    className="text-sm font-medium text-primary"
                                                >
                                                    1 sao
                                                </div>
                                                <div className="w-3/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                    <div className="h-5 bg-yellow-300 rounded" style={{ width: `${starDetails?.['1star']?.quantity == 0 ? 0 : starDetails?.['1star']?.percentage}%` }} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {0 || Math.floor(starDetails?.['1star']?.percentage)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-10'>
                                        <div className="text-[#171347] font-bold flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1]">
                                            Đánh giá ({reviews.length})
                                        </div>
                                        {
                                            course?.cart_or_bought === 'bought' ? <form onSubmit={handleSubmit(async (dataReview) => {
                                                if (rating == 0) return
                                                const formData = {
                                                    data: {
                                                        ...dataReview,
                                                        "id_course": params.slug,
                                                        rating,
                                                    }
                                                }
                                                MySwal.fire({
                                                    title: <p className='text-lg'>Đang xử lý</p>,
                                                    didOpen: async () => {
                                                        MySwal.showLoading()
                                                        await courseApi.createReview(formData)
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


                                            })} className="flex flex-col items-start mt-5">
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
                                            </form> : null
                                        }

                                        <div className='mt-5'>
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
                    <div className='flex-1 mx-4'>
                        <div className='rounded-2xl shadow-card_course'>
                            <div className='h-[200px] relative'>
                                <Image
                                    src={`${course?.thumbnail ? course?.thumbnail : '/'}`}
                                    fill={true}
                                    className='w-full h-full overflow-hidden object-center object-cover rounded-tl-2xl rounded-tr-2xl'
                                    alt="logo"
                                />
                            </div>
                            <div className='px-5  border-[1px] border-slate-200 pb-5  rounded-bl-2xl rounded-br-2xl shadow-md'>
                                <div className='flex items-center justify-center mt-5'>
                                    <span className='text-3xl text-primary font-bold'>{formatCash(`${course?.price}`)} VNĐ</span>
                                </div>
                                <div className='mt-5 flex flex-col'>
                                    {
                                        course?.cart_or_bought ? (
                                            course?.cart_or_bought === 'bought' ?
                                                <Link href={`/course/learning/${course.id}`} className='px-8 font-medium rounded-lg flex items-center justify-center bg-primary text-white h-12'>Đi đến trang học</Link>
                                                : <button disabled className='px-8 font-medium rounded-lg flex items-center justify-center bg-primary text-white h-12'>Đã thêm vào giỏ hàng</button>
                                        )
                                            : <button onClick={async () => {
                                                MySwal.fire({
                                                    title: <p className='text-lg'>Đang xử lý</p>,
                                                    didOpen: async () => {
                                                        MySwal.showLoading()
                                                        await paymentApi.addToCart(course?.id, 'id_course').then(() => {
                                                            MySwal.fire({
                                                                title: <p className="text-2xl">Thêm vào giỏ hàng thành công</p>,
                                                                icon: 'success',
                                                                showConfirmButton: false,
                                                                timer: 1500
                                                            })
                                                        }).catch((err: any) => {
                                                            MySwal.fire({
                                                                title: <p className="text-2xl">Thêm vào giỏ hàng thất bại</p>,
                                                                icon: 'error',
                                                                showConfirmButton: false,
                                                                timer: 1500
                                                            })
                                                        })
                                                        reset()
                                                    },
                                                })


                                            }} className='px-8 font-medium rounded-lg flex items-center justify-center bg-primary text-white h-12'>Thêm vào giỏ hàng</button>
                                    }

                                </div>
                                <div className='mt-9'>
                                    <strong className='text-[#343434]'>Khóa học này bao gồm</strong>
                                    <div className='mt-4 grid grid-cols-2 gap-2'>
                                        <div className='flex items-center'>
                                            <ClockIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                            <span className='text-[#171347] font-medium text-sm'>{convertTime(course?.apparentDuration)}</span>
                                        </div>
                                        <div className='flex items-center'>
                                            <Squares2X2Icon className='w-5 h-5 text-secondary font-medium mr-1' />
                                            <span className='text-[#171347] font-medium text-sm'>{course?.chapters?.length} chương</span>
                                        </div>
                                        <div className='flex items-center'>
                                            <FilmIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                            <span className='text-[#171347] font-medium text-sm'>{course?.total_lecture} bài giảng</span>
                                        </div>
                                        <div className='flex items-center'>
                                            <DocumentTextIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                            <span className='text-[#171347] font-medium text-sm'>{course?.total_exam} bài tập</span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

