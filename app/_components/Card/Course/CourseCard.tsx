import Image from "next/image"
import { useEffect, useState } from "react"
import courseApi from '@/app/api/courseApi';
import Carousel from 'react-multi-carousel';
import { ClockIcon, Squares2X2Icon, FilmIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { convertTime, formatCash } from "@/app/helper/FormatFunction";
import { renderOnlyStar } from "@/app/helper/RenderFunction";
import Link from 'next/link';

export default function CourseCard({ course }: any) {
    return (
        <Link key={course.id} href={`course/${course.id}`} className=''>
            <div className='bg-white shadow-card_course rounded-2xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105  duration-300 border-[1px] border-slate-200' style={{
                boxShadow: '0 5px 12px 0 rgba(0, 0, 0, 0.1)'
            }}>
                <div className='relative w-full h-60'>
                    <Image
                        src={`${course.thumbnail}`}
                        fill
                        className='rounded-tl-2xl rounded-tr-2xl overflow-hidden object-cover object-center'
                        alt="logo"
                    />
                </div>
                <div className='px-3 py-4'>
                    <div className='flex items-center'>
                        <div className='mr-2 w-10 h-10 max-h-10 max-w-10 rounded-full relative'>
                            <Image
                                src={`${course.user?.avatar ? course.user.avatar : '/images/avatar-teacher.png'}`}
                                width={40}
                                height={40}
                                className='rounded-full overflow-hidden object-cover object-center'
                                alt="logo"
                            />
                        </div>
                        <div>
                            <p className='font-medium text-[#818894]'>{course.user?.name}</p>
                        </div>
                    </div>
                    <h3 className="overflow-hidden text-[#17134] mt-4 h-8 font-bold text-ellipsis whitespace-nowrap">
                        {course.name}
                    </h3>
                    <div className="flex items-center">
                        {renderOnlyStar(Math.floor(course?.average_rating))}
                        <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{(course?.average_rating || 0).toFixed(1)}</span>
                    </div>
                    {/* <div className='mt-2'>
                        Số người đăng ký khóa học: {course?.registrations}
                    </div> */}
                    <div className='grid grid-cols-2 mt-4'>
                        <div className='flex items-center'>
                            <span className='mr-1'>Lớp:</span>
                            <p className='font-semibold'>{course?.Categories[0]?.Class}</p>
                        </div>
                        <div className='flex items-center'>
                            <span className='mr-1'>Môn học:</span>
                            <p className='font-semibold'>{course?.Categories[1]?.Subject}</p>
                        </div>
                        <div className='flex items-center'>
                            <span className='mr-1'>Mức độ:</span>
                            <p className='font-semibold'>{course?.Categories[2]?.Level}</p>
                        </div>
                    </div>


                    {/* <div className='mt-4 grid grid-cols-2 gap-2'>
                        <div className='flex items-center'>
                            <ClockIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                            <span className='text-[#171347] font-medium text-sm'>{convertTime(course?.total_duration)} giờ</span>
                        </div>
                        <div className='flex items-center'>
                            <Squares2X2Icon className='w-5 h-5 text-secondary font-medium mr-1' />
                            <span className='text-[#171347] font-medium text-sm'>{course?.total_chapter} chương</span>
                        </div>
                        <div className='flex items-center'>
                            <FilmIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                            <span className='text-[#171347] font-medium text-sm'>{course?.total_lecture} bài giảng</span>
                        </div>
                        <div className='flex items-center'>
                            <DocumentTextIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                            <span className='text-[#171347] font-medium text-sm'>{course?.total_exam} đề thi</span>
                        </div>

                    </div> */}
                    <div className='mt-4'>
                        <span className='text-xl text-primary font-extrabold'>{formatCash(`${course.price}`)} VNĐ</span>
                    </div>
                </div>
            </div>
        </Link >
    )
}