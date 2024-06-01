"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DocumentTextIcon, QuestionMarkCircleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, ChevronUpIcon, StarIcon } from '@heroicons/react/20/solid'
import paymentApi from '@/app/api/paymentApi';
import { useForm, SubmitHandler } from "react-hook-form"
import parse from 'html-react-parser';
import { formatCash, convertTime, formatDateTime } from '@/app/helper/FormatFunction';
// import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import { useAppSelector } from '@/redux/store';
import { renderOnlyStar } from '@/app/helper/RenderFunction';
import examApi from '@/app/api/examApi';
import { useSearchParams } from 'next/navigation';
import PaginateButton from '@/app/_components/Paginate/PaginateButton';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


export default function ComboList({ params }: { params: { slug: string } }) {
    const [tab, setTab] = useState(1)
    const [toggle, setToggle] = useState<any>({})

    const [reviews, setReviews] = useState([]);
    const [changeData, setChangeData] = useState(false);
    const [combos, setCombos] = useState<any>();
    const [rating, setRating] = useState(0);
    const [avgReview, setAvgReview] = useState(0);
    const [reviewExams, setReviewExams] = useState<any>({});
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
    } = useForm<any>()

    useEffect(() => {
        async function fetchData() {
            await examApi.getComboDetail(params.slug).then((data: any) => {
                setCombos(data.data)
            }
            ).catch((err: any) => { })
            await examApi.getReviewCombo(params.slug, currentPage).then((data: any) => {
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
    }, [changeData, currentPage, params.slug])

    async function fetchReview(id: string) {
        await examApi.getReviewExam(id).then((data: any) => {
            setReviewExams({ ...reviewExams, [id]: data.data.reviews })
        }
        ).catch((err: any) => { })
    }



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
            <ToastContainer />
            <div className="relative h-[530px] block overflow-hidden">
                <Image
                    src={`${combos?.cover_image ? combos?.cover_image : '/'}`}
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
                                {combos?.name}
                            </h1>
                            <div className="flex items-center mt-10">
                                {renderStars(Math.floor(avgReview))}
                                <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-2 py-0.5 rounded">{avgReview.toFixed(1)}</span>
                                <span className='text-white'>({reviews.length} Đánh giá)</span>
                            </div>
                            <div className='mt-4 text-white text-sm font-medium'>
                                <span className='mr-2'>Tạo bởi</span>
                                <Link href={`/teacher/profile/${combos?.teacher?.id}`} className='underline decoration-1'>{combos?.teacher?.name}</Link>
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
                                            Mô tả
                                        </button>
                                    </li>
                                    <li className="me-2">
                                        <button
                                            onClick={() => setTab(2)}
                                            type='button'
                                            className={`text-white inline-flex items-center justify-center p-4 ${tab == 2 ? 'border-b-2 border-primary rounded-t-lg active' : 'border-b-4 border-transparent rounded-t-lg hover:text-gray-300'} group`}
                                            aria-current="page"
                                        >
                                            Danh sách đề thi ({combos?.Exams?.length})
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

                                    <div className=''>
                                        <h2 className="text-[#171347] font-bold flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1]">
                                            Mô tả
                                        </h2>
                                        <div className='mt-2 text-[#818894]'>
                                            <p>
                                                {parse(combos?.description || '')}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                                <div className={`${tab == 2 ? '' : 'hidden'}`}>
                                    <ul>
                                        {combos?.Exams?.map((combo: any) => {
                                            return (
                                                <li key={combo.id} className='bg-white py-3 pl-[20px] pr-6 rounded-lg mb-5 list-none border-[1px] border-slate-300'>
                                                    <div className={`flex items-center justify-between ${toggle[`open_chapter_${combo.id}`] ? 'pb-2 border-b-[1px] border-slate-200' : ''}`}>
                                                        <div className="flex justify-between items-center">
                                                            <div className="">

                                                                <div className="font-bold text-[rgb(23,19,71)] text-lg">
                                                                    {combo.title}
                                                                </div>
                                                                <div className="font-normal text-[818894] text-xs">
                                                                    {combo.quantity_question} câu
                                                                    | {combo.period} phút
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center ml-[-4px] mt-2">
                                                                        {renderOnlyStar(Math.floor(combo?.average_rating || 0))}
                                                                        <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-2 py-0.5 rounded">{(combo?.average_rating || 0).toFixed(1)}</span>
                                                                        <span className='text-white'>({reviews.length} Đánh giá)</span>
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                        <div className="ml-5 flex items-center justify-center">

                                                            <div className="" >
                                                                {
                                                                    !toggle[`open_chapter_${combo.id}`] ?
                                                                        <button type="button" className=" text-[#818894]" onClick={async () => {
                                                                            setToggle({ ...toggle, [`open_chapter_${combo.id}`]: true })
                                                                            fetchReview(combo.id)

                                                                        }}>

                                                                            <ChevronDownIcon className="w-6 h-6" />
                                                                        </button>
                                                                        :
                                                                        <button type="button" className=" text-[#818894]" onClick={() => {
                                                                            setToggle({ ...toggle, [`open_chapter_${combo.id}`]: false })
                                                                        }}>
                                                                            <ChevronUpIcon className="w-6 h-6" />
                                                                        </button>
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`${toggle[`open_chapter_${combo.id}`] ? '' : 'hidden'}`}>
                                                        <form onSubmit={handleSubmit(async (dataReview) => {
                                                            if (rating == 0) return
                                                            const formData = {
                                                                data: {
                                                                    content: dataReview[combo.id],
                                                                    "id_exam": combo.id,
                                                                    rating
                                                                }
                                                            }

                                                            MySwal.fire({
                                                                title: <p className='text-lg'>Đang xử lý</p>,
                                                                didOpen: async () => {
                                                                    MySwal.showLoading()
                                                                    await examApi.createReview(formData)
                                                                        .then(() => {
                                                                            reset()
                                                                            setRating(0)
                                                                            fetchReview(combo.id)
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


                                                        })} className="flex flex-col items-start mt-4 mb-6">
                                                            <div className=''>
                                                                <div className='flex items-center mb-4'>
                                                                    <div className=''>
                                                                        <Image
                                                                            src={`${user.avatar ? user.avatar : '/images/avatar.png'}`}
                                                                            width={20}
                                                                            height={20}
                                                                            className='w-10 h-10 rounded-full'
                                                                            alt="logo"
                                                                        />
                                                                    </div>
                                                                    <div className='flex flex-col ml-2'>
                                                                        <span className='font-medium text-secondary text-sm'>
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
                                                                {...register(`${combo.id}`)}
                                                                className="w-full p-2 border rounded focus:ring-0 focus:border-primary_border"
                                                                rows={2}
                                                            ></textarea>
                                                            <button
                                                                type="submit"

                                                                className="mt-3 px-3 py-1 bg-primary text-white rounded hover:bg-primary_hover"
                                                            >
                                                                Đánh giá
                                                            </button>
                                                        </form>
                                                        <div className=''>
                                                            {
                                                                reviewExams[combo.id]?.map((review: any) => (
                                                                    <div key={review.id} className="bg-white px-3 py-2 mb-3 border rounded-lg shadow-md">
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
                                                        </div>
                                                    </div>
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
                                        <form onSubmit={handleSubmit(async (dataReview) => {
                                            if (rating == 0) return
                                            const formData = {
                                                data: {
                                                    content: dataReview.content,
                                                    "id_combo": params.slug,
                                                    rating
                                                }
                                            }
                                            MySwal.fire({
                                                title: <p className='text-lg'>Đang xử lý</p>,
                                                didOpen: async () => {
                                                    MySwal.showLoading()
                                                    await await examApi.createReview(formData)
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
                                        </form>
                                        <div className='mt-12'>
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
                        <div className='rounded-2xl '>
                            <div className='h-[200px] relative'>
                                <Image
                                    src={`${combos?.thumbnail ? combos?.thumbnail : '/'}`}
                                    fill={true}
                                    className='w-full h-full overflow-hidden object-center object-cover rounded-tl-2xl rounded-tr-2xl'
                                    alt="logo"
                                />
                            </div>
                            <div className='px-5 border-[1px] border-slate-200 pb-5  rounded-bl-2xl rounded-br-2xl shadow-md'>
                                <div className='flex items-center justify-center mt-5'>
                                    <span className='text-3xl text-primary font-bold'>{formatCash(`${combos?.price}`)} VNĐ</span>
                                </div>
                                <div className='mt-5 flex flex-col'>
                                    {
                                        combos?.cart_or_bought ? (
                                            combos?.cart_or_bought === 'bought' ?
                                                <Link href={`/exam/combo/${combos.id}/list`} className='px-8 font-medium rounded-lg flex items-center justify-center bg-primary text-white h-12'>Đi đến trang làm bài</Link>
                                                : <button disabled className='px-8 font-medium rounded-lg flex items-center justify-center bg-primary text-white h-12'>Đã thêm vào giỏ hàng</button>
                                        )
                                            : <button onClick={async () => {
                                                MySwal.fire({
                                                    title: <p className='text-lg'>Đang xử lý</p>,
                                                    didOpen: async () => {
                                                        MySwal.showLoading()
                                                        await paymentApi.addToCart(combos?.id, 'id_combo').then(() => {
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
                                    <strong className='text-[#343434]'>Combo này bao gồm</strong>
                                    <div className='mt-4 grid grid-cols-2 gap-2'>
                                        <div className='flex items-center'>
                                            <DocumentTextIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                            <span className='text-[#171347] font-medium text-sm'>{combos?.quantity_exam} đề thi</span>
                                        </div>
                                        <div className='flex items-center'>
                                            <QuestionMarkCircleIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                            <span className='text-[#171347] font-medium text-sm'>{combos?.quantity_question} câu hỏi</span>
                                        </div>
                                        {/* <div className='flex items-center'>
                                            <ClipboardDocumentIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                            <span className='text-[#171347] font-medium text-sm'>{combos?.total_exam} dạng</span>
                                        </div> */}

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

