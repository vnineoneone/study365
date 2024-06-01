"use client"
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, StarIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Image from 'next/image';
import categoryApi from '@/app/api/category';
import { useSearchParams, useRouter } from 'next/navigation';
import userApi from '@/app/api/userApi';
import Paginate from '@/app/_components/Paginate/Paginate';


function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

export default function TeacherList() {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [category, setCategory] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const subjectFilters = searchParams.getAll('subject');
    // const classFilters = searchParams.getAll('class');
    const sortFilters = searchParams.get('sort');
    const orderFilters = searchParams.get('order');
    const [countPaginate, setCountPaginate] = useState(1)
    const page = searchParams.get('page') || '1'

    const sortOptions = [
        { name: 'Phổ biến nhất', href: '?sort=registration&order=desc', current: sortFilters === 'registration' },
        { name: 'Đánh giá tốt nhất', href: '?sort=rating&order=desc', current: sortFilters === 'rating' },
    ];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <StarIcon
                key={index + 1}
                className={`text-${index + 1 <= rating ? 'yellow-300' : 'gray-300'} w-5 h-5`}
            />
        ));
    };

    useEffect(() => {
        async function fetchData() {
            let filterString = ''
            subjectFilters?.map((s) => { filterString += `&subject=${s}` })
            // classFilters?.map((c) => { filterString += `&class=${c}` })
            sortFilters && orderFilters ? filterString += `&sort=${sortFilters}&order=${orderFilters}` : null


            await userApi.getAllTeacher(filterString, page).then((data: any) => {
                setTeachers(data.data.teachers)
                setCountPaginate(Math.ceil(data.data.count / 10))
            }
            ).catch((err: any) => { })
            await categoryApi.getAll().then((data: any) => {
                setCategory([
                    {
                        id: "subject",
                        name: "Môn học",
                        options: data?.Subject?.map((subject: any) => {
                            return { ...subject, checked: subjectFilters.includes(subject.id) }
                        })
                    },
                    // {
                    //     id: "class",
                    //     name: "Lớp",
                    //     options: data?.Class?.map((grade: any) => {
                    //         return { ...grade, checked: classFilters.includes(grade.id) }
                    //     })
                    // },
                ])
            }).catch((err: any) => { })

        }
        fetchData()
    }, [sortFilters, orderFilters])



    return (
        <div className="bg-white container px-10">
            <div>
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Khóa học</h1>

                        <div className="flex items-center">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Sắp xếp
                                        <ChevronDownIcon
                                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            {sortOptions?.map((option) => (
                                                <Menu.Item key={option.name}>
                                                    {({ active }) => (
                                                        <Link
                                                            href={option.href}
                                                            className={classNames(
                                                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                                active ? 'bg-gray-100' : '',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >

                                                            {option.name}
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>

                            <button
                                type="button"
                                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pb-24 pt-4">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="flex w-full">
                            <form className="hidden lg:block w-1/4 mr-10">
                                <h3 className="sr-only">Categories</h3>

                                {category?.map((section: any) => (
                                    <Disclosure as="div" key={section.id} className="border-b p-4 border-gray-200" defaultOpen>
                                        {({ open }) => (
                                            <>

                                                <h3 className="-my-3 flow-root">
                                                    <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                        <span className="font-medium text-gray-900">{section.name}</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel className={`pt-6`}>
                                                    <div className="space-y-4">
                                                        {
                                                            section.id !== 'maxPrice' ?
                                                                section?.options?.map((option: any, optionIdx: any) => (

                                                                    <div key={option.id} className="flex items-center">
                                                                        <input
                                                                            id={`filter-${section.id}-${optionIdx}`}
                                                                            name={`${section.id}`}
                                                                            defaultValue={option.id}
                                                                            type="checkbox"
                                                                            defaultChecked={option.checked}
                                                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:blue-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                            className="ml-3 text-sm text-gray-600"
                                                                        >
                                                                            {option.name}
                                                                        </label>
                                                                    </div>
                                                                )) : <div className="relative mb-6">
                                                                    <input name={section.id} id="labels-range-input" type="range" defaultValue={Number(section.value) || 5000000} min="0" max="5000000" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                                                    <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">0</span>
                                                                    <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">5.000.000</span>
                                                                </div>}
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}


                                <button className='px-5 h-11 w-full mt-5 bg-primary font-medium rounded-md border-primary text-white'>Lọc</button>
                            </form>

                            <div className="lg:col-span-3 flex-1">
                                <div className='grid grid-cols-2 gap-x-8 gap-y-8 mt-2'>
                                    {
                                        teachers?.map((teacher: any) => {
                                            return (
                                                <Link key={teacher.id} href={`teacher/profile/${teacher.id}`} className=''>
                                                    <div className='bg-white shadow-md rounded-2xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105  duration-300 border-[1px] border-slate-200'>
                                                        <div className='flex justify-center items-center bg-slate-50 py-5'>
                                                            <div className='relative w-40 h-40'>
                                                                <Image
                                                                    src={`${teacher?.avatar ? teacher?.avatar : "/images/avatar-teacher.png"}`}
                                                                    fill
                                                                    className='rounded-full overflow-hidden object-cover object-center'
                                                                    alt="logo"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='px-3 py-4'>

                                                            <h3 className="overflow-hidden text-[#17134] h-8">
                                                                Giáo viên: <span className='font-semibold'>{teacher.name}</span>
                                                            </h3>
                                                            <div className="overflow-hidden text-[#17134] h-8">
                                                                Môn học: <span className='font-semibold'>{teacher?.Categories[0]?.Subject}</span>
                                                            </div>
                                                            <div className="flex items-center mt-2">
                                                                {renderStars(Math.floor(teacher?.average_rating))}
                                                                <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{(teacher?.average_rating || 0).toFixed(1)}</span>
                                                            </div>

                                                            <div className='mt-4 grid grid-cols-2 gap-2'>
                                                                <div className='flex items-center'>
                                                                    <div className='w-5 h-5 relative mr-1'>
                                                                        <Image
                                                                            src={`/images/webinars.svg`}
                                                                            fill
                                                                            className='overflow-hidden object-cover object-center'
                                                                            alt="logo"
                                                                        />
                                                                    </div>
                                                                    <span className='text-[#171347] font-medium text-sm'>
                                                                        {teacher?.course_quantity || 0} khóa học
                                                                    </span>
                                                                </div>
                                                                <div className='flex items-center'>
                                                                    <div className='w-5 h-5 relative mr-1'>
                                                                        <Image
                                                                            src={`/images/appointments.svg`}
                                                                            fill
                                                                            className='overflow-hidden object-cover object-center'
                                                                            alt="logo"
                                                                        />
                                                                    </div>
                                                                    <span className='text-[#171347] font-medium text-sm'>{teacher?.exam_quantity || 0} đề thi</span>
                                                                </div>
                                                                <div className='flex items-center'>
                                                                    <div className='w-5 h-5 relative mr-1'>
                                                                        <Image
                                                                            src={`/images/reviews.svg`}
                                                                            fill
                                                                            className='overflow-hidden object-cover object-center'
                                                                            alt="logo"
                                                                        />
                                                                    </div>
                                                                    <span className='text-[#171347] font-medium text-sm'>{teacher?.total_review || 0} đánh giá</span>
                                                                </div>
                                                                <div className='flex items-center'>
                                                                    <div className='w-5 h-5 relative mr-1'>
                                                                        <Image
                                                                            src={`/images/students.svg`}
                                                                            fill
                                                                            className='overflow-hidden object-cover object-center'
                                                                            alt="logo"
                                                                        />
                                                                    </div>
                                                                    <span className='text-[#171347] font-medium text-sm'>{teacher?.student_quantity || 0} học viên</span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                                <Paginate countPaginate={countPaginate} currentPage={page} />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
