"use client"
import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/redux/store';
import paymentApi from '@/app/api/paymentApi';
import { useSearchParams } from 'next/navigation';

export default function CheckoutResultPage() {
    const { user } = useAppSelector(state => state.authReducer);
    const searchParams = useSearchParams();
    const info: any = useMemo(() => ({}), []);

    const obj = Object.fromEntries(searchParams.entries());

    for (const key of Object.keys(obj)) {
        info[key] = obj[key]
    }

    useEffect(() => {
        async function fetchData() {
            await paymentApi.sendInfoTransaction({
                data: {
                    ...info
                }
            }).catch((err: any) => { })

        }
        fetchData()
    }, [info, user.id])

    return (
        <div className="bg-gray-100 h-screen">
            <div className="bg-white h-full p-6 md:mx-auto flex flex-col items-center justify-center">
                <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                    <path
                        fill="currentColor"
                        d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                    ></path>
                </svg>
                <div className="text-center">
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                        Thanh toán thành công!
                    </h3>
                    <p className="text-gray-600 my-2">
                        Cảm ơn bạn đã mua hàng trên hệ thống của chúng tôi.
                    </p>
                    <p> Chúc bạn một ngày tốt lành!</p>
                    <div className="py-10 text-center">
                        <Link
                            href="/"
                            className="px-12 bg-blue-700 hover:bg-blue-500 text-white font-semibold py-3"
                        >
                            Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>


    );
};
