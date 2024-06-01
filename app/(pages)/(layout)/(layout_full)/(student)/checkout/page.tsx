"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import paymentApi from '@/app/api/paymentApi';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { formatCash } from '@/app/helper/FormatFunction';
export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<any>([]);
    const [total, setTotal] = useState(0);
    const { user } = useAppSelector(state => state.authReducer);
    useEffect(() => {
        async function fetchData() {
            await paymentApi.getCartOfStudent().then((data: any) => {
                const tmp = [...data.data.courses, ...data.data.combos];
                setCartItems(tmp);
                setTotal(tmp?.reduce((total: any, item: any) => total + item.price, 0))
            }
            ).catch((err: any) => { })
        }
        fetchData()
    }, [user.cart])

    return (
        <div className='mx-16 my-24'>
            <div className="flex justify-center items-center border-b-[1px] border-gray-200 p-4">
                <div className="text-2xl font-bold text-gray-800">
                    Thông tin đơn hàng
                </div>
            </div>
            <div className="flex w-full">
                <div className="px-2 pt-8 flex-1 mr-10">
                    <p className="text-xl font-medium">Đơn hàng</p>
                    <p className="text-gray-400">
                        Kiểm tra đơn hàng của bạn.
                    </p>
                    {
                        cartItems.map((item: any) => {
                            return (
                                <div key={item.id} className="mt-4 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                                    <div className="flex flex-col rounded-lg bg-white sm:flex-row ">
                                        <div className='relative flex-1 h-28 w-28'>
                                            <Image
                                                src={`${'/images/cousre-thumnail-1.jpg'}`}
                                                fill
                                                className='rounded-md overflow-hidden object-cover object-center'
                                                alt="logo"
                                            />
                                        </div>
                                        <div className="flex w-3/4 flex-col px-4 py-4">
                                            <span className="font-semibold ">
                                                {item.name}
                                            </span>
                                            <p className="text-lg font-bold">{formatCash(`${item.price}`)} VNĐ</p>
                                        </div>
                                    </div>

                                </div>
                            )
                        })
                    }

                </div>
                <div className="px-2 pt-8 w-1/2 ">
                    {/* <p className="text-xl font-medium">Thông tin thanh toán</p>
                    <p className="text-gray-400">
                        Hoàn thành đơn hàng của bạn bằng cách điền thông tin bên dưới.
                    </p>
                    <div className="">
                        <div className='mb-5'>

                            <label htmlFor="email" className="mt-4 mb-2 block text-sm font-medium">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="your.email@gmail.com"
                                />
                                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div>

                            <label
                                htmlFor="phone-input"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Số điện thoại
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 19 18"
                                    >
                                        <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="phone-input"
                                    aria-describedby="helper-text-explanation"
                                    className="border pl-11 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                    placeholder="123-456-7890"
                                    required
                                />
                            </div>
                        </div>
                    </div> */}
                    <p className="mt-8 text-lg font-medium">Phương thức thanh toán</p>
                    <form className="mt-5 grid gap-6">
                        <div className="relative">
                            <input
                                className="peer hidden"
                                id="radio_1"
                                type="radio"
                                name="radio"
                                defaultChecked
                            />
                            <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                            <label
                                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                                htmlFor="radio_1"
                            >
                                <div className='relative w-12 h-12'>
                                    <Image
                                        src={`${'/images/momo.png'}`}
                                        fill
                                        className='rounded-md overflow-hidden object-cover object-center'
                                        alt="logo"
                                    />
                                </div>
                                <div className="ml-5">
                                    <span className="mt-2 font-semibold">MOMO</span>
                                    <p className="text-slate-500 text-sm leading-6">
                                        Thanh toán qua ví điện tử momo.
                                    </p>
                                </div>
                            </label>
                        </div>
                        {/* <div className="relative">
                            <input
                                className="peer hidden"
                                id="radio_2"
                                type="radio"
                                name="radio"
                            />
                            <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                            <label
                                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                                htmlFor="radio_2"
                            >
                                <div className='relative w-12 h-12'>
                                    <Image
                                        src={`${'/images/credit_card.png'}`}
                                        fill
                                        className='rounded-md overflow-hidden object-cover object-center'
                                        alt="logo"
                                    />
                                </div>
                                <div className="ml-5">
                                    <span className="mt-2 font-semibold">Ngân hàng</span>
                                    <p className="text-slate-500 text-sm leading-6">
                                        Thanh toán bằng cách chuyển khoản.
                                    </p>
                                </div>
                            </label>
                        </div> */}
                    </form>
                    <div className="mt-6 border-t border-b py-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-900">Tổng phụ</p>
                            <p className="font-semibold text-gray-900">{formatCash(`${total}` || '0')} VNĐ</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Khuyển mãi</p>
                            <p className="font-semibold text-gray-900">0</p>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Tổng</p>
                        <p className="text-2xl font-semibold text-gray-900">{formatCash(`${total}` || '0')} VNĐ</p>
                    </div>
                    <button onClick={async () => {
                        let res: any
                        await paymentApi.getPayment(`${total}`).then((data) => {
                            res = data.data
                        }).catch((err: any) => { })

                        router.push(res?.payUrl);

                    }} className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">
                        Thanh toán
                    </button>
                </div>


            </div>
        </div>

    );
};
