
import Link from 'next/link';
import { formatDateTime, convertTime } from '@/app/helper/FormatFunction';
import { ChevronDownIcon, ChevronUpIcon, Squares2X2Icon, FilmIcon, CheckIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';


export default function SidebarLearning({ course, id_course, progress }: any) {
    const initToggle: any = {}
    const [toggle, setToggle] = useState(initToggle)
    const searchParams = useSearchParams();
    const lectureId = searchParams.get('lecture')
    const examId = searchParams.get('exam')
    const topicId = lectureId || examId;

    return (
        <>
            <div className='w-[373px] min-w-[373px] mt-24 h-full fixed right-0 top-0 border-l-[1px] shadow-sm border-[#f1f1f1]'>
                <div className='text-left text-lg font-bold mx-4 py-2 mt-2 border-b-[1px] border-[#f1f1f1]'>
                    Nội dung
                </div>
                <div className='overflow-auto h-[400px] sidebar_learning'>
                    <div className=''>
                        <div className='p-4'>

                            {
                                course?.chapters?.map((chapter: any) => {
                                    return (
                                        <div key={chapter.id} className='mb-3'>

                                            <div className='border-[1px] border-[#f1f1f1] px-2 py-2 rounded-lg'>
                                                <div className={`flex justify-between items-center ${toggle[`open_chapter_${chapter.id}`] ? 'pb-3' : ''}`}>
                                                    <div className="flex justify-center items-center">
                                                        <span className="flex justify-center items-center w-10 h-10 min-w-10 min-h-10 bg-primary rounded-full mr-[10px]">
                                                            <Squares2X2Icon className="w-6 h-6 text-white" />
                                                        </span>
                                                        <div className=''>
                                                            <div className="font-bold text-[rgb(23,19,71)] text-sm leading-5">
                                                                {chapter.name}
                                                            </div>
                                                            <div className="font-normal text-[818894] text-xs flex mt-1">
                                                                {chapter.topics?.length} chủ đề
                                                                | {convertTime(chapter.totalDuration)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        {
                                                            !toggle[`open_chapter_${chapter.id}`] ?
                                                                <button type="button" className="mr-1 text-[#818894]" onClick={() => {
                                                                    setToggle({ ...toggle, [`open_chapter_${chapter.id}`]: true })
                                                                }}>
                                                                    <ChevronDownIcon className="w-5 h-5" />
                                                                </button>
                                                                :
                                                                <button type="button" className="mr-1 text-[#818894]" onClick={() => {
                                                                    setToggle({ ...toggle, [`open_chapter_${chapter.id}`]: false })
                                                                }}>
                                                                    <ChevronUpIcon className="w-5 h-5" />
                                                                </button>
                                                        }
                                                    </div>
                                                </div>
                                                <div className={`${toggle[`open_chapter_${chapter.id}`] ? '' : 'hidden'} border-t-[1px] border-[#f1f1f1] pt-4`}>
                                                    <div>
                                                        {
                                                            chapter.topics.map((topic: any) => {
                                                                if (topic.type == "lecture")
                                                                    return (
                                                                        <Link href={`/course/learning/${id_course}?lecture=${topic.id}`} key={topic.id} className={`${topicId == topic.id ? 'bg-[#f1f1f1]' : 'bg-white'} px-2 py-2 mb-1 cursor-pointer flex items-center rounded-sm`}>
                                                                            <span className='mr-3 bg-[#ececec] w-10 h-10 rounded-full flex justify-center items-center'>
                                                                                <FilmIcon className='w-4 h-4' />
                                                                            </span>
                                                                            <div className='flex flex-col w-3/4'>
                                                                                <span className='font-medium text-[#171347] text-ellipsis overflow-hidden whitespace-nowrap text-sm'>{topic.name}</span>
                                                                                <span className='text-[#818894] text-xs'>{convertTime(topic.duration)}</span>
                                                                            </div>
                                                                            {progress?.progress.map((pro: any) => {
                                                                                if (pro.id_topic === topic.id) {
                                                                                    return (
                                                                                        <div key={`${topic.id}-progress`} className='ml-2'>
                                                                                            <span className='bg-white w-5 h-5 rounded-full flex justify-center items-center'>

                                                                                                <CheckIcon className='w-4 h-4 text-primary' />

                                                                                            </span>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            })}

                                                                        </Link>
                                                                    )
                                                                else
                                                                    return (
                                                                        <Link href={`/course/learning/${id_course}/?exam=${topic.id_exam}`} key={topic.id} className={`${topicId == topic.id_exam ? 'bg-[#f1f1f1]' : 'bg-white'} px-2 py-2 mb-1 cursor-pointer flex items-center rounded-sm`}>
                                                                            <span className='mr-3 bg-[#ececec] w-10 h-10 rounded-full flex justify-center items-center'>
                                                                                <DocumentIcon className='w-4 h-4' />
                                                                            </span>
                                                                            <div className='flex flex-col w-2/3'>
                                                                                <span className='font-medium text-[#171347] text-ellipsis overflow-hidden whitespace-nowrap'>{topic.name}</span>
                                                                                <span className='text-[#818894] text-xs'>{topic.exam?.data.quantity_question} câu</span>
                                                                            </div>

                                                                        </Link>
                                                                    )
                                                            })
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
