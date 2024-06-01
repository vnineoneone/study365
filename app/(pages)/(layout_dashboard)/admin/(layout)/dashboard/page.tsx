"use client"
import React from "react";
import ChartOne from "@/app/_components/Charts/ChartOne";
import ChartThree from "@/app/_components/Charts/ChartThree";
import ChartTwo from "@/app/_components/Charts/ChartTwo";
import CardDataStats from "@/app/_components/Card/CardDataStats";
import ChartFour from "@/app/_components/Charts/ChartFour";
import Image from "next/image";

export default function TeacherDashboard() {
    return (
        <div className="">
            <div className="font-bold text-[#171347] text-lg mb-8">Dashboard</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats title="Tổng khóa học" total="$3.456K">
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
                <CardDataStats title="Tổng đề thi" total="$45,2K">
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
                <CardDataStats title="Tổng học viên" total="2.450">
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
                <CardDataStats title="Tổng đánh giá" total="3.456">
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
            <div className="bg-white px-9 py-3 rounded-md shadow-md relative mb-20 mt-32">
                <div className="text-primary text-3xl font-semibold">
                    Xin chào Mai Văn A,
                </div>
                <h2 className="text-secondary font-semibold text-lg mt-2">
                    Bạn có sự kiện mới:
                </h2>
                <ul className="mt-1 grid grid-cols-1 gap-y-1">
                    <li className="text-[#818894] text-lg ">
                        <span className="font-medium text-black">10</span> lượt bình luận mới
                    </li>
                    <li className="text-[#818894] text-lg">
                        <span className="font-medium text-black">10</span> lượt chủ đề được tạo mới
                    </li>
                    <li className="text-[#818894] text-lg">
                        <span className="font-medium text-black">10</span> lượt làm bài mới
                    </li>
                    <li className="text-[#818894] text-lg">
                        <span className="font-medium text-black">10</span> lượt đánh giá bạn mới
                    </li>
                    <li className="text-[#818894] text-lg">
                        <span className="font-medium text-black">10</span> lượt đánh giá khóa học mới
                    </li>
                    <li className="text-[#818894] text-lg">
                        <span className="font-medium text-black">10</span> lượt đánh giá đề thi mới
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
                    <ChartOne />
                </div>
                <div className="mb-10">
                    <ChartTwo />
                </div>
                <div className="mb-10">
                    <ChartThree />
                </div>
                <div className="mb-10">
                    <ChartFour />
                </div>
            </div>
        </div>
    );
};



