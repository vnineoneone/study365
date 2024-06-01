"use client"

/* eslint-disable react/jsx-no-undef */
import Link from 'next/link';
import Image from 'next/image';


export function HeaderExam({ combo, params }: any) {

    return (
        <div className="fixed top-0 left-0 h-24 w-full flex z-10 bg-white items-center justify-between px-9 py-4 shadow-sm">
            <div className="flex items-center">
                <div>
                    <Link href="/" className=''>
                        <Image
                            src="/images/logo.png"
                            width={170}
                            height={39}
                            alt="logo"
                        />
                    </Link>
                </div>
                <div className='flex justify-center items-center ml-10 text-2xl text-secondary font-semibold'>
                    {combo?.name}
                </div>
            </div>

            <div className='flex items-center mt-[5px]'>
                <div className='flex items-center'>
                    <Link href={`/student/dashboard/exam`} className='bg-white mr-2 text-[#343434] cursor-pointer px-4 py-1 rounded border-[1px] border-[#e3e1e1]'>
                        Đề thi của tôi
                    </Link>
                </div>
            </div>
        </div>
    )
}
