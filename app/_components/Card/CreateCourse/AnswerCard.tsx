import { XMarkIcon } from "@heroicons/react/24/outline"
import { Label, TextInput } from 'flowbite-react';
import { useFieldArray, useForm } from 'react-hook-form';
import uuid from "react-uuid";
import CustomCKEditor from "../../Editor/CKEditor";
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { useEffect, useState } from "react";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)

export const AnswerCard = ({ indexChapter, indexTopic, hanldeForm, indexQuestion, setModal, modal, topic, quesiton, setImage, image }: any) => {
    const [files, setFiles] = useState([])
    const {
        register,
        control,
        setValue,
        getValues,
        formState: { errors },
    } = hanldeForm

    const { fields: fieldsAnswer, append: appendAnswer, remove: removeAnswer } = useFieldArray({
        control,
        name: `chapters.${indexChapter}.topics.${indexTopic}.questions.${indexQuestion}.answers`
    });

    return (
        <div className='mt-5'>
            <h2 className="text-[#171347] font-bold section-title flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1]">Câu trả lời</h2>
            <button type="button" onClick={() => {
                setModal({ ...modal, [`add_question_${topic.key}`]: true })

                appendAnswer({
                    id: uuid(),
                    content_text: "",
                    is_correct: false,
                })

            }}
                className="mt-3 bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover">
                Thêm câu trả lời
            </button>
            <div className='mt-8'>
                {fieldsAnswer?.map((field: any, indexAnswer: any) => {
                    return (
                        <div key={field.id} className='relative border-[1px] border-[#ececec] p-3 rounded-[10px] mb-10'>
                            <div className='mb-5'>
                                <div className="mb-2 block">
                                    <Label htmlFor="title" value="Nội dung câu trả lời" />
                                </div>
                                <CustomCKEditor className="h-50" setValue={setValue} value={getValues().chapters[indexChapter].topics[indexTopic].questions[indexQuestion].answers[indexAnswer].content_text} position={`chapters.${indexChapter}.topics.${indexTopic}.questions.${indexQuestion}.answers.${indexAnswer}.content_text`} />
                                <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors?.chapters?.[indexChapter]?.topics?.[indexTopic]?.questions?.[indexQuestion]?.answers?.[indexAnswer]?.content_text?.message}
                                </div>
                            </div>
                            <div className="mb-5">
                                <div className="mb-2 block">
                                    <Label htmlFor="email" value="Ảnh (tùy chọn)" />
                                </div>

                                <FilePond
                                    files={files}
                                    onupdatefiles={() => setFiles}
                                    acceptedFileTypes={['image/*']}
                                    server={{
                                        process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                                            const formData = new FormData();
                                            formData.append(fieldName, file, file.name);
                                            formData.append('data', JSON.stringify({
                                                id_answer: getValues().questions[indexQuestion]?.answers[indexAnswer]?.id,
                                                type: "answer"
                                            }));


                                            const request = new XMLHttpRequest();
                                            request.open('POST', `${process.env.NEXT_PUBLIC_BASE_URL_EXAM_LOCAL}/images`)



                                            request.upload.onprogress = (e) => {
                                                progress(e.lengthComputable, e.loaded, e.total);
                                            };

                                            request.onload = function () {
                                                if (request.status >= 200 && request.status < 300) {
                                                    setImage({ ...image, [`${getValues().chapters?.[indexChapter].topics?.[indexTopic].questions[indexQuestion]?.answers[indexAnswer]?.id}`]: JSON.parse(request.response).url });
                                                    // the load method accepts either a string (id) or an object
                                                    load(request.responseText);
                                                } else {
                                                    // Can call the error method if something is wrong, should exit after
                                                    error('oh no');
                                                }
                                            };
                                            request.send(formData)

                                        }
                                    }
                                    }

                                    name="image"
                                    labelIdle='Kéo & thả hoặc <span class="filepond--label-action">Tìm kiếm</span>'
                                />
                                {/* {
                                    getValues().questions[indexQuestion]?.answers[indexAnswer].content_image || image?.[`${getValues().questions[indexQuestion]?.answers[indexAnswer]?.id}`] ? <div className="w-full h-[240px] relative">
                                        <Image
                                            src={`${image[`${getValues().questions[indexQuestion]?.answers[indexAnswer]?.id}`] || getValues().questions[indexQuestion]?.answers[indexAnswer].content_image} `}
                                            fill={true}
                                            className='w-full h-full absolute top-0 left-0 overflow-hidden object-cover object-center'
                                            alt="logo"
                                        />
                                    </div>
                                        : null
                                } */}
                            </div>

                            <div className=' mb-2'>
                                <div className="flex-1 flex items-center ">
                                    <input {...register(`chapters.${indexChapter}.topics.${indexTopic}.questions.${indexQuestion}.answers.${indexAnswer}.is_correct`)}
                                        id="default-checkbox" type="checkbox" className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">Câu trả lời đúng</label>
                                </div>
                            </div>
                            <button onClick={() => removeAnswer(indexAnswer)} className='w-8 h-8 flex justify-center items-center rounded-full bg-[#f63c3c] absolute right-2 top-[-16px]'>
                                <XMarkIcon className='w-5 h-5 text-white' />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>

    )
}
