"use client"
import React, { useEffect, useState } from "react";
import ChartThreeAdmin from "@/app/_components/Charts/ChartThreeAdmin";
import CardDataStats from "@/app/_components/Card/CardDataStats";
import Image from "next/image";
import userApi from "@/app/api/userApi";
import { useAppSelector } from "@/redux/store";

export default function AdminDashboard() {
    const { user } = useAppSelector(state => state.authReducer);
    const [dashboard, setDashboard] = useState<any>({});


    return (
        <div className="">
            <div className="font-bold text-[#171347] text-lg mb-8">Dashboard</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats title="Tổng khóa học" total={`10`}>
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
                </CardDataStats>
                <CardDataStats title="Tổng đề thi" total={`20`}>
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
                </CardDataStats>
                <CardDataStats title="Tổng học viên" total={`150`}>
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
                </CardDataStats>
                <CardDataStats title="Tổng đánh giá" total={`200`}>
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
                </CardDataStats>
            </div>
            <div className="bg-white px-9 py-3 rounded-md shadow-md relative mb-20 mt-40">
                <div className="text-primary text-3xl font-semibold">
                    Xin chào {user?.name},
                </div>
                <h2 className="text-secondary font-semibold text-lg mt-2">
                    Bạn có sự kiện mới:
                </h2>
                <ul className="mt-1 grid grid-cols-1 gap-y-1">
                    <li className="text-[#818894] text-lg ">
                        <span className="font-medium text-black">{dashboard?.newCommentOnDay || 10}</span> lượt bình luận mới
                    </li>
                    <li className="text-[#818894] text-lg">
                        <span className="font-medium text-black">{dashboard?.newTopicInForumOnDay || 10}</span> lượt chủ đề được tạo mới
                    </li>
                    <li className="text-[#818894] text-lg">
                        <span className="font-medium text-black">{dashboard?.newAssignmentOnDay || 10}</span> lượt làm bài mới
                    </li>
                    <li className="text-[#818894] text-lg">
                        <span className="font-medium text-black">{dashboard?.newReviewCourseOnDay || 20}</span> lượt đánh giá khóa học mới
                    </li>
                    <li className="text-[#818894] text-lg">
                        <span className="font-medium text-black">{dashboard?.newReviewExamOnDay || 20}</span> lượt đánh giá đề thi mới
                    </li>
                </ul>
                <div className="w-[564px] h-[375px] absolute right-0 bottom-0">
                    <Image
                        src={`/images/dashboard_banner.png`}
                        fill
                        className='overflow-hidden object-cover object-center'
                        alt="logo"
                    />
                </div>
            </div>


            <div className="mt-10">
                <div className="mb-10">
                    <ChartThreeAdmin />
                </div>
                {/* <div className="mb-10">
                    <ChartTwo />
                </div> */}
            </div>
        </div>
    );
};



