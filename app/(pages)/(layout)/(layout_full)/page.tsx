"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import courseApi from '@/app/api/courseApi';
import Carousel from 'react-multi-carousel';
import { ClockIcon, Squares2X2Icon, FilmIcon, DocumentTextIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import { convertTime, formatCash } from "@/app/helper/FormatFunction";
import { renderOnlyStar, renderStars } from "@/app/helper/RenderFunction";
import CourseCard from "@/app/_components/Card/Course/CourseCard";
import userApi from "@/app/api/userApi";
import examApi from "@/app/api/examApi";

export default function Home() {

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  const responsiveTeacher = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 5 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  const [courses, setCourses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [coursesRating, setCoursesRating] = useState([])
  const [coursesResgistion, setCoursesRegistion] = useState([])
  const [combos, setCombos] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      await courseApi.getAll('', '1').then((data: any) => {
        setCourses(data.data.courses)
      }
      ).catch((err: any) => { })
      await courseApi.getAll('sort=rating&order=desc', '1').then((data: any) => {
        setCoursesRating(data.data.courses)
      }
      ).catch((err: any) => { })
      await courseApi.getAll('sort=resgistion&order=desc', '1').then((data: any) => {
        setCoursesRegistion(data.data.courses)
      }
      ).catch((err: any) => { })
      await userApi.getAllTeacher('sort=rating&order=desc', '1').then((data: any) => {
        setTeachers(data.data.teachers)
      }
      ).catch((err: any) => { })
      await examApi.getAllCombo('1', 'sort=rating&order=desc').then((data: any) => {
        setCombos(data.data.combos)
      }).catch((err: any) => { })
    }
    fetchData()
  }, [])

  return (
    <div className="mx-16">
      <section className="">
        <div className="flex relative h-[460px] mb-16">
          <Image
            src="/images/background.png"
            width={1920}
            height={933}
            alt="login"
            className='absolute top-0 left-0 z-0 overflow-hidden object-cover object-center'
          />
          <div className="w-1/2 px-4 mt-48 z-10">
            <h1 className="text-secondary font-bold text-[44px]">
              Tham gia học tập và & giảng dạy...
            </h1>
            <p className="mt-5 text-[20px] text-[#818894]">
              Study365 là một nền tảng giáo dục đầy đủ tính năng giúp giảng viên tạo và phát hành các khóa học video, lớp học trực tiếp và khóa học văn bản, kiếm tiền và giúp học sinh học tập theo cách dễ dàng nhất.
            </p>
          </div>
        </div>
      </section>
      <section className="pt-12">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[24px] text-secondary font-bold">Khóa học mới nhất</h2>
          </div>
          <Link href='/course' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2 hover:bg-slate-300">Xem tất cả</Link>
        </div>
        <div className="pt-4 pb-12 relative">
          <Carousel
            swipeable={false}
            draggable={true}
            showDots={true}
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            deviceType={"desktop"}
            dotListClass="bottom-10"
            itemClass="px-4 py-5"
            arrows={false}
            renderDotsOutside={true}
          >
            {courses.map((course: any) => {
              return (
                <CourseCard course={course} key={course.id} />
              )
            })}
          </Carousel>
        </div>
      </section>
      <section className="pt-12">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[24px] text-secondary font-bold">Khóa học phổ biến nhất</h2>
          </div>
          <Link href='/course?sort=registration&order=desc' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2 hover:bg-slate-300">Xem tất cả</Link>
        </div>
        <div className="pt-4 pb-12 relative">
          <Carousel
            swipeable={false}
            draggable={true}
            showDots={true}
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            deviceType={"desktop"}
            dotListClass="bottom-10"
            itemClass="px-4 py-5"
            arrows={false}
            renderDotsOutside={true}
          >
            {coursesResgistion.map((course: any) => {
              return (
                <CourseCard course={course} key={course.id} />
              )
            })}
          </Carousel>
        </div>
      </section>
      <section className="pt-12">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[24px] text-secondary font-bold">Khóa học đánh giá tốt nhất</h2>
          </div>
          <Link href='/course?sort=rating&order=desc' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2 hover:bg-slate-300">Xem tất cả</Link>
        </div>
        <div className="pt-4 pb-12 relative">
          <Carousel
            swipeable={false}
            draggable={true}
            showDots={true}
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            deviceType={"desktop"}
            dotListClass="bottom-10"
            itemClass="px-4 py-5"
            arrows={false}
            renderDotsOutside={true}
          >
            {coursesRating.map((course: any) => {
              return (
                <CourseCard course={course} key={course.id} />
              )
            })}
          </Carousel>
        </div>
      </section>
      <section className="pt-12">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[24px] text-secondary font-bold">Đề thi đánh giá tốt nhất</h2>
          </div>
          <Link href='/exam?sort=rating&order=desc' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2 hover:bg-slate-300">Xem tất cả</Link>
        </div>
        <div className="pt-4 pb-12 relative">
          <Carousel
            swipeable={false}
            draggable={true}
            showDots={true}
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            deviceType={"desktop"}
            dotListClass="bottom-10"
            itemClass="px-4 py-5"
            arrows={false}
            renderDotsOutside={true}
          >
            {
              combos?.map((combo: any) => {
                return (
                  <Link key={combo.id} href={`exam/combo/${combo.id}`} className=''>
                    <div className='bg-white shadow-md rounded-2xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105  duration-300 border-[1px] border-slate-200'>
                      <div className='relative w-full h-60'>
                        <Image
                          src={`${combo.thumbnail ? combo.thumbnail : '/'}`}
                          fill
                          className='rounded-tl-2xl rounded-tr-2xl overflow-hidden object-cover object-center'
                          alt="logo"
                        />
                      </div>
                      <div className='px-3 py-4'>
                        <div className='flex items-center'>
                          <div className='mr-2 w-10 h-10 max-h-10 max-w-10 rounded-full relative'>
                            <Image
                              src={`${combo.teacher?.avatar ? combo.teacher.avatar : '/images/avatar-teacher.png'}`}
                              width={40}
                              height={40}
                              className='rounded-full overflow-hidden object-cover object-center'
                              alt="logo"
                            />
                          </div>
                          <div>
                            <p className='font-medium text-[#818894]'>{combo.teacher.name}</p>
                          </div>
                        </div>
                        <h3 className="overflow-hidden text-[#17134] mt-4 h-8 font-bold text-ellipsis whitespace-nowrap">
                          {combo.name}
                        </h3>
                        <div className="flex items-center">
                          {renderOnlyStar(Math.floor(combo?.average_rating))}
                          <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{combo?.average_rating.toFixed(1)}</span>
                        </div>
                        <div className='mt-2'>
                          Số người đã mua: {combo?.total_registration}
                        </div>
                        <div className='mt-4 grid grid-cols-2 gap-2'>
                          <div className='flex items-center'>
                            <DocumentTextIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                            <span className='text-[#171347] font-semibold text-sm'>{combo?.exam_quantity} đề thi</span>
                          </div>
                          <div className='flex items-center'>
                            <QuestionMarkCircleIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                            <span className='text-[#171347] font-semibold text-sm'>{combo?.question_quantity} câu hỏi</span>
                          </div>
                          {/* <div className='flex items-center'>
                                                                    <ClipboardDocumentIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                                                    <span className='text-[#171347] font-semibold text-sm'>{combo?.total_exam} dạng</span>
                                                                </div> */}

                        </div>
                        <div className='mt-6'>
                          <span className='text-xl text-primary font-extrabold'>{formatCash(`${combo.price}`)} VNĐ</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            }
          </Carousel>
        </div>
      </section>
      <section className="pt-12">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[24px] text-secondary font-bold">Giáo viên nổi bật</h2>
          </div>
          <Link href='/course?sort=rating&order=desc' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2 hover:bg-slate-300">Xem tất cả</Link>
        </div>
        <div className="pt-4 pb-12 relative">
          <Carousel
            swipeable={false}
            draggable={true}
            showDots={true}
            responsive={responsiveTeacher}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            deviceType={"desktop"}
            dotListClass="bottom-10"
            itemClass="px-4 py-5"
            arrows={false}
            renderDotsOutside={true}
          >

            {teachers.map((teacher: any) => {
              return (
                <div key={teacher.id} className="bg-white p-5 rounded-lg text-center" style={{
                  boxShadow: "0 19px 38px rgba(0, 0, 0, 0.05), 0 15px 12px rgba(0, 0, 0, 0.02)"
                }}>
                  <div className="w-full flex justify-center items-center">
                    <div className="w-[100px] h-[100px] relative">
                      <Image
                        src={`${teacher?.avatar ? teacher.avatar : '/images/avatar-teacher.png'} `}
                        fill
                        alt="avatar"
                        className="rounded-full overflow-hidden object-cover object-center w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col justify-center items-center">
                    <div className="text-[#343434] font-bold text-lg">
                      {teacher?.name}
                    </div>
                    <div className="text-[#818894]">
                      {
                        teacher.Categories[0]?.Subject || "T"
                      }
                    </div>
                    <div className="mt-2">
                      {renderOnlyStar(Math.floor(teacher?.average_rating))}
                    </div>
                    <Link href={`/teacher/profile/${teacher.id}`} className="mt-4">
                      <button type='submit' className='px-3 py-1 bg-primary shadow-primary_btn_shadow border-primary text-white rounded-md hover:bg-primary_hover'>Xem hồ sơ</button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </Carousel>
        </div>
      </section>
    </div>

  )
}
