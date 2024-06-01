"use client"

import { useCallback, useEffect, useState } from "react"
import { ChapterCard } from "../../Card/CreateCourse/ChapterCard"
import { ToastContainer, toast } from 'react-toastify';
import { useFieldArray, useForm } from "react-hook-form";
import { DragDropContext, Draggable, Droppable, DroppableProps } from 'react-beautiful-dnd';
import { StrictModeDroppable } from "../../React_Beautiful_Dnd/StrictModeDroppable";
import Image from "next/image";

export function ContentForm({
    data,
    setData,
    handleForm,
    toggle,
    setToggle,
    typeSubmit,
    setTypeSubmit,
    id_course
}: any) {

    const {
        register,
        control,
        reset,
        setValue,
        getValues,
        watch,
        trigger,
        formState: { errors },
    } = handleForm


    const { fields, append: appendChapter, remove: removeChapter } = useFieldArray({
        control,
        name: "chapters"
    });

    const reorder = (list: Array<any>, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const handleSValidateSection = async (position: string, type: string) => {
        const isValid = await trigger(`${position}`);
        if (isValid) {
            setToggle({ ...toggle, [`${type}`]: false })
        }
    };

    return (
        <div className="mb-10">
            <ToastContainer />
            <h2 className="text-[#171347] font-bold section-title text-lg flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1]">Nội dung (tùy chọn)</h2>
            <div>
                <button type="button" onClick={() => {
                    appendChapter({
                        key: `chapter-${getValues().chapters.length}`,
                        name: "",
                        status: "",
                        topics: []
                    })
                    setToggle({ ...toggle, "add-section": true })

                }} className="mt-3 bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover">

                    <div className="flex justify-center items-center">
                        Thêm mục
                    </div>

                </button>
            </div>

            <div className={`${toggle["add-section"] ? '' : 'hidden'} bg-white py-4 pl-[20px] pr-6 rounded-xl mb-5 mt-5`}>
                <div className="">
                    <div className="w-1/3">

                        {fields.map((field: any, index: any) => (

                            index == fields.length - 1 ?
                                <div key={field.id}>
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Tiêu đề
                                    </label>
                                    <input
                                        className="bg-white border border-gray-300 text-[#343434] text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5"
                                        type="text"
                                        {...register(`chapters.${index}.name` as const, {
                                            required: "Tên mục không thể thiếu."
                                        })}
                                    />
                                    <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors?.chapters?.[index]?.name?.message}
                                    </div>

                                    <div className="mt-4 w-[400px]">
                                        <div
                                            className="block mr-2 text-sm font-semibold text-[14px] text-[#171347] "
                                        >
                                            Trạng thái
                                        </div>
                                        <div className="mt-2">
                                            <label className="relative inline-flex items-center me-5 cursor-pointer">
                                                <div className="flex ">

                                                    <div className="flex items-center me-4" >
                                                        <input
                                                            id="inline-radio"
                                                            type="radio"
                                                            {...register(`chapters.${index}.status`)}
                                                            value="public"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                        <label
                                                            htmlFor="inline-radio"
                                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                        >
                                                            Công khai
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center me-4" >
                                                        <input
                                                            id="inline-radio"
                                                            type="radio"
                                                            {...register(`chapters.${index}.status`)}
                                                            value="paid"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                        <label
                                                            htmlFor="inline-radio"
                                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                        >
                                                            Tính phí
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center me-4">
                                                        <input
                                                            id="inline-2-radio"
                                                            type="radio"
                                                            {...register(`chapters.${index}.status`)}
                                                            value="private"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                        <label
                                                            htmlFor="inline-2-radio"
                                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                        >
                                                            Riêng tư
                                                        </label>
                                                    </div>

                                                </div>
                                            </label>
                                        </div>

                                    </div>
                                </div>
                                : null

                        ))}

                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => {
                                setToggle({ ...toggle, "add-section": false })
                                removeChapter(fields.length - 1)
                            }}
                            type="button" className="mr-5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Hủy</button>
                        <button
                            type="button"
                            onClick={
                                () => {
                                    handleSValidateSection(`chapters.${fields.length - 1}`, 'add-section')
                                }
                            }
                            className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                            Lưu
                        </button>
                    </div>
                </div>

            </div>

            <div className="mt-8">
                {
                    getValues()?.chapters?.length == 0 ?
                        <div>
                            <div className="mt-12 flex flex-col items-center justify-center">
                                <div className="w-[175px] h-[175px] rounded-full" style={{
                                    "backgroundImage": "linear-gradient(to bottom, #dbffe8, #43d477)"
                                }}>
                                    <Image
                                        src="/images/no-content-course.png"
                                        width={300}
                                        height={200}
                                        alt="logo"
                                        className="rounded-l-[10px] h-full w-full``"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center flex-col text-center mt-7">
                                <h2 className="text-[#171347] font-bold">
                                    Không có nội dung
                                </h2>
                                <p className="text-center mt-1 font-medium text-[#818894]">Hãy tạo nội dung cho khóa học</p>
                            </div>
                        </div>
                        :
                        <div className="">
                            <DragDropContext onDragEnd={(result) => {
                                if (!result.destination) return;
                                const items: any = reorder(
                                    getValues().chapters,
                                    result.source.index,
                                    result.destination.index
                                );
                                setValue('chapters', items)
                            }}>
                                <StrictModeDroppable droppableId="chapter">
                                    {(provided) => (
                                        <ul  {...provided.droppableProps} ref={provided.innerRef}>
                                            {
                                                getValues().chapters?.filter((chapter: any) => chapter.modify != "delete" && chapter.name != '').map((chapter: any, index: any) => {

                                                    return (

                                                        <Draggable key={chapter.key} index={index} draggableId={`${chapter.key}`}>
                                                            {
                                                                (provided) => (
                                                                    <ChapterCard chapter={getValues().chapters[index]} handleForm={handleForm} indexChapter={index} innerRef={provided.innerRef} provided={provided} data={data} setData={setData} removeChapter={removeChapter} setTypeSubmit={setTypeSubmit} toggle={toggle} setToggle={setToggle} getValues={getValues} id_course={id_course} />
                                                                )
                                                            }
                                                        </Draggable>
                                                    )
                                                })
                                            }
                                            {provided.placeholder}
                                        </ul>
                                    )
                                    }
                                </StrictModeDroppable>
                            </DragDropContext>

                        </div>
                }

            </div>

        </ div>
    )
}