'use client'

import Image from "next/image"
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { useMultistepForm } from "@/app/hooks/useMultiStep"
import { BasicInfomationForm } from "@/app/_components/Form/EditCourse/BasicInfomationForm"
import { ContentForm } from "@/app/_components/Form/EditCourse/ContentForm"
import { useForm } from "react-hook-form"
import courseApi from "@/app/api/courseApi"
import { useRouter } from 'next/navigation'



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
    thumbnail: File
    cover: File
    chapters: Array<ChapterData>
}

type ChapterData = {
    key: string
    name: string
    topics: Array<TopicData>
    status: Boolean
}

type TopicData = {
    id: string
    name: string
    description: string
    status: Boolean
    link_video: Array<File>
}


export default function Edit({ id, course }: any) {
    const router = useRouter()
    const [data, setData] = useState<CourseData>()
    const [images, setImages] = useState()
    const [toggle, setToggle] = useState<any>({})
    const [typeSubmit, setTypeSubmit] = useState("")
    const [currentStepIndex, setCurrentStepIndex] = useState(0)



    const handleForm = useForm<CourseData>(
        {
            defaultValues: course
        }
    )

    const {
        handleSubmit,
        formState: { errors },
    } = handleForm

    console.log(errors);

    const { steps, step, isFirstStep, isLastStep, back, next, goTo } =
        useMultistepForm([
            <BasicInfomationForm key={'step1'} handleForm={handleForm} course={course} id_course={id} />,
            <ContentForm key={'step2'} data={data} setData={setData} handleForm={handleForm} toggle={toggle} setToggle={setToggle} typeSubmit={typeSubmit} setTypeSubmit={setTypeSubmit} id_course={id} />,
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

                        if (!(Object.entries(errors).length === 0)) return
                        setToggle({ ...toggle, [`${typeSubmit}`]: false })
                        setData(dataForm)

                        const { thumbnail, cover, ...data1 } = dataForm
                        data1.categories = []

                        data1.categories.push(dataForm.grade)
                        data1.categories.push(dataForm.subject)
                        data1.categories.push(dataForm.level)


                        console.log('submit', dataForm, data, typeSubmit);

                        if (!isLastStep) return next()


                        if (typeSubmit === "submit") {
                            const formData = new FormData();

                            formData.append("data", JSON.stringify(data1))

                            courseApi.update(id, formData).then(() => {
                                router.push("/teacher/dashboard/course")
                            })

                        }
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
                        <button type="submit" className="bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover" onClick={() => setTypeSubmit("submit")}>Hoàn thành</button>
                    </div>
                </form>
            </div >
        </ div >
    )

}






