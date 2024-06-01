"use client"
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { XMarkIcon, ClockIcon, Squares2X2Icon, FilmIcon, DocumentTextIcon, QuestionMarkCircleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, StarIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Image from 'next/image';
import courseApi from '@/app/api/courseApi';
import categoryApi from '@/app/api/category';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatCash, convertTime } from '@/app/helper/FormatFunction';
import Paginate from '@/app/_components/Paginate/Paginate';
import examApi from '@/app/api/examApi';
import { useAppSelector } from '@/redux/store';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}



export default function ComboList() {
    const [combos, setCombos] = useState<any>([]);
    const [category, setCategory] = useState<any>([]);
    const searchParams = useSearchParams();
    const subjectFilters = searchParams.getAll('subject') || [];
    const levelFilters = searchParams.getAll('level') || [];
    const classFilters = searchParams.getAll('class') || [];
    const priceFilters = searchParams.get('maxPrice');
    const sortFilters = searchParams.get('sort');
    const orderFilters = searchParams.get('order');
    const [countPaginate, setCountPaginate] = useState(1)
    const page = searchParams.get('page') || '1'
    const authUser = useAppSelector(state => state.authReducer.user);

    const sortOptions = [
        { name: 'Mới nhất', href: '?sort=date&order=desc', current: sortFilters === 'date' },
        { name: 'Phổ biến nhất', href: '?sort=registration&order=desc', current: sortFilters === 'registration' },
        { name: 'Đánh giá tốt nhất', href: '?sort=rating&order=desc', current: sortFilters === 'rating' },
        { name: 'Giá: Thấp đến cao', href: '?sort=price&order=asc', current: sortFilters === 'price' && orderFilters === 'asc' },
        { name: 'Giá: Cao đến thấp', href: '?sort=price&order=desc', current: sortFilters === 'price' && orderFilters === 'desc' },
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
            subjectFilters?.map((s) => { filterString += `subject=${s}&` })
            levelFilters?.map((l) => { filterString += `level=${l}&` })
            classFilters?.map((c) => { filterString += `class=${c}&` })
            priceFilters ? filterString += `minPrice=0&maxPrice=${priceFilters}` : null

            sortFilters && orderFilters ? filterString += `sort=${sortFilters}&order=${orderFilters}` : null


            await examApi.getAllCombo(page, filterString).then((data: any) => {
                setCombos(data.data.combos)
                setCountPaginate(Math.ceil(data.data.count / 10))
            }).catch((err: any) => { })
            await categoryApi.getAll().then((data: any) => {
                setCategory([
                    {
                        id: "subject",
                        name: "Môn học",
                        options: data?.Subject?.map((subject: any) => {
                            return { ...subject, checked: subjectFilters.includes(subject.id) }
                        })
                    },
                    {
                        id: "level",
                        name: "Mức độ",
                        options: data?.Level?.map((level: any) => {
                            return { ...level, checked: levelFilters.includes(level.id) }
                        })
                    },
                    {
                        id: "class",
                        name: "Lớp",
                        options: data?.Class?.map((grade: any) => {
                            return { ...grade, checked: classFilters.includes(grade.id) }
                        })
                    },
                    {
                        id: "maxPrice",
                        name: "Giá",
                        value: priceFilters
                    }

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
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Đề thi</h1>

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
                                        combos?.map((combo: any) => {
                                            return (
                                                <Link key={combo.id} href={`exam/combo/${combo.id}`} className=''>
                                                    <div className='bg-white shadow-md rounded-2xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105  duration-300 border-[1px] border-slate-200'>
                                                        <div className='relative w-full h-60'>
                                                            <Image
                                                                src={`${combo.thumbnail ? combo.thumbnail : ''}`}
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
                                                                {renderStars(Math.floor(combo?.average_rating))}
                                                                <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{combo?.average_rating.toFixed(1)}</span>
                                                            </div>
                                                            <div className='mt-2'>
                                                                Số người đã mua: {combo?.total_registration}
                                                            </div>
                                                            <div className='grid grid-cols-2 mt-4'>


                                                                {
                                                                    combo?.Categories?.map((category: any, index: number) => {
                                                                        if (category.Class) {
                                                                            return (
                                                                                <div key={category.id} className='flex items-center'>
                                                                                    <span className='mr-1'>Lớp:</span>
                                                                                    <p className='font-semibold'>{category?.Class}</p>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        else if (category.Subject) {
                                                                            return (
                                                                                <div key={category.id} className='flex items-center'>
                                                                                    <span className='mr-1'>Môn học:</span>
                                                                                    <p className='font-semibold'>{category?.Subject}</p>
                                                                                </div>
                                                                            )
                                                                        } else {
                                                                            return (
                                                                                <div key={category.id} className='flex items-center'>
                                                                                    <span className='mr-1'>Mức độ:</span>
                                                                                    <p className='font-semibold'>{category?.Level}</p>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    })
                                                                }
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
