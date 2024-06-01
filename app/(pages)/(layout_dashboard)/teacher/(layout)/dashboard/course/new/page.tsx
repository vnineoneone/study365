'use client'

import Image from "next/image"
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { useMultistepForm } from "@/app/hooks/useMultiStep"
import { useRouter } from 'next/navigation'
import { BasicInfomationForm } from "@/app/_components/Form/CreateCourse/BasicInfomationForm"
import { ContentForm } from "@/app/_components/Form/CreateCourse/ContentForm"
import { useForm } from "react-hook-form"
import courseApi from "@/app/api/courseApi"
import uuid from 'react-uuid';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const id_course: string = uuid()

type CourseData = {
    name: string
    subject: string
    grade: string
    level: string
    goal: string
    object: string
    description: string
    requirement: string
    price: string
    thumbnail: Array<File>
    cover: Array<File>
    chapters: Array<ChapterData>
    start_time: string
    end_time: string
    status: string
}

type ChapterData = {
    key: string
    name: string
    topics: Array<TopicData>
    status: string
}

type TopicData = {
    id: string
    name: string
    description: string
    status: string
    link_video: Array<File>
}


const INITIAL_DATA: CourseData = {
    name: "",
    subject: "",
    grade: "",
    level: "",
    goal: "",
    requirement: "",
    object: "",
    price: "",
    description: "",
    thumbnail: [],
    cover: [],
    start_time: "",
    end_time: "",
    status: "",
    chapters: [
    ]
}



export default function CreateCourse() {
    const [data, setData] = useState(INITIAL_DATA)
    const [images, setImages] = useState()
    const [toggle, setToggle] = useState<any>({})
    const [typeSubmit, setTypeSubmit] = useState("")
    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    const handleForm = useForm<CourseData>(
        {
            defaultValues: data
        }
    )

    const {
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
    } = handleForm

    const router = useRouter()
    const { steps, step, isFirstStep, isLastStep, back, next, goTo } =
        useMultistepForm([
            <BasicInfomationForm key={'step1'} id_course={id_course} handleForm={handleForm} images={images} setImages={setImages} />,
            <ContentForm key={'step2'} data={data} id_course={id_course} setData={setData} handleForm={handleForm} toggle={toggle} setToggle={setToggle} typeSubmit={typeSubmit} setTypeSubmit={setTypeSubmit} />,
        ], currentStepIndex, setCurrentStepIndex)


    return (
        < div className="" >
            <form>
                <div className="p-4 shadow-progress_bar_course flex rounded-md items-center bg-white">
                    <div className="flex items-center pr-6 ">
                        <button
                            onClick={() => {
                                goTo(0)
                            }}
                            type="button" className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStepIndex + 1 == 1 ? 'bg-[#9effc1]' : 'bg-[#f1f1f1]'}`}>
                            <Image
                                src="/images/icon-paper.svg"
                                width={28}
                                height={28}
                                alt="avatar"
                                className=''
                            />
                        </button>
                        <div className="ml-[10px]">
                            <span className="text-[0.875rem] text-[#818894]">Bước 1/2</span>
                            <h4 className="text-secondary font-bold">Thông tin cơ bản</h4>
                        </div>
                    </div>
                    <div className="flex items-center border-l-[1px] border-[#ececec] px-6">
                        <button onClick={() => goTo(1)} type="button" className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStepIndex + 1 == 2 ? 'bg-[#9effc1]' : 'bg-[#f1f1f1]'}`}>
                            <Image
                                src="/images/folder.svg"
                                width={28}
                                height={28}
                                alt="avatar"
                                className=''
                            />
                        </button>
                        <div className="ml-[10px]">
                            <span className="text-[0.875rem] text-[#818894]">Bước 2/2</span>
                            <h4 className="text-secondary font-bold">Nội dung khóa học</h4>
                        </div>
                    </div>
                </div>
            </form>

            <div className="flex flex-col ">
                <form onSubmit={
                    handleSubmit(async (dataForm: any) => {
                        const startTime = dataForm["start_time"];
                        const endTime = dataForm["end_time"];
                        if (startTime !== undefined && endTime !== undefined && startTime > endTime) {
                            setError("start_time", {
                                type: "validate",
                                message: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc."
                            });
                            return;
                        }
                        if (!(Object.entries(errors).length === 0)) return
                        setToggle({ ...toggle, [`${typeSubmit}`]: false })
                        setData(dataForm)

                        if (typeSubmit === "submit") {
                            const formData = new FormData();

                            const { thumbnail, cover, subject, grade, level, ...data1 } = dataForm
                            data1.categories = []

                            data1.categories.push(dataForm.grade)
                            data1.categories.push(dataForm.subject)
                            data1.categories.push(dataForm.level)
                            data1.id = id_course

                            data1.chapters.map((chapter: any, indexChapter: any) => {
                                chapter.topics.map((topic: any, indexTopic: any) => {
                                    if (topic.type == "exam") {
                                        data1.chapters[indexChapter].topics[indexTopic] = {
                                            name: topic.title,
                                            type: "exam",
                                            exam: {
                                                data: {
                                                    period: topic.duration,
                                                    questions: topic.questions,
                                                    pass_score: topic.pass_score,
                                                    status: topic.status
                                                }
                                            }
                                        }
                                    }
                                })
                            })

                            console.log(data1);

                            formData.append("thumbnail", dataForm.thumbnail[0])
                            formData.append("cover", dataForm.cover[0])


                            MySwal.fire({
                                title: <p className='text-lg'>Đang xử lý</p>,
                                didOpen: async () => {
                                    MySwal.showLoading()
                                    await courseApi.create({ data: data1 }).then(() => {
                                        // MySwal.close()
                                        MySwal.fire({
                                            title: <p className="text-2xl">Khóa học đã được tạo thành công</p>,
                                            icon: 'success',
                                            showConfirmButton: false,
                                            timer: 1500
                                        }).then(() => {
                                            router.push("/teacher/dashboard/course")
                                        })
                                    }).catch(() => {
                                        MySwal.close()
                                        MySwal.fire({
                                            title: <p className="text-2xl">Tạo khóa học thất bại</p>,
                                            icon: 'error',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                        setTypeSubmit("")
                                    }
                                    )

                                },
                            })

                            return
                        }
                        if (!isLastStep) return next()
                    })
                }>

                    <div className="mt-5">
                        {step}
                    </div>

                    <div className="flex flex-row justify-between mt-5 pt-4 border-t-[1px] border-[#ececec]">
                        <div>
                            <button disabled={isFirstStep ? true : false} className={`${isFirstStep ? 'opacity-60' : ''} bg-primary mr-5 border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover" type="button`} onClick={back}>
                                Trang trước
                            </button>
                            <button disabled={isLastStep ? true : false} className={`${isLastStep ? 'opacity-60' : ''} bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover`} type="submit">
                                Tiếp theo
                            </button>
                        </div>
                        <div>
                            {/* <button type="submit" className="bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover mr-5" onClick={() => {
                                setValue("status", "draft")
                                setTypeSubmit("submit")
                            }
                            }>Lưu bản nháp</button> */}
                            <button type="submit" className="bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover" onClick={() => {
                                setTypeSubmit("submit")
                            }}>Hoàn thành</button>
                        </div>
                    </div>
                </form>
            </div >
        </ div >
    )

}



