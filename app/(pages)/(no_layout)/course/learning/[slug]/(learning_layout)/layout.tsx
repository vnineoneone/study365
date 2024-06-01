"use client"

import { Suspense } from 'react'
import { HeaderLearning } from '@/app/_components/Header/HeaderLearning'
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useState } from 'react';
import courseApi from '@/app/api/courseApi';
import SidebarLearning from '@/app/_components/Sidebar/SidebarLearning';
import { useSearchParams } from 'next/navigation';

export default function LearninngLayout({
    children,
    params,
}: {
    children: React.ReactNode,
    params: { slug: string }
}) {
    const [course, setCourse] = useState<any>()
    const [progress, setProgress] = useState<any>()
    const { user } = useAppSelector(state => state.authReducer);

    useEffect(() => {
        async function fetchData() {
            await courseApi.get(params.slug).then((data: any) => {
                setCourse(data.data)
            }
            ).catch((err: any) => { })

            await courseApi.getProgress(`${user?.id}`, params.slug).then((data: any) => {
                setProgress(data.data)
            }
            ).catch((err: any) => { })
        }
        fetchData()


    }, [params.slug, user?.id]);
    return (
        <section className="">
            <HeaderLearning params={params} course={course} progress={progress} />
            <div className='mt-24'>
                <Suspense fallback={<p>Loading data...</p>}>
                    <div className='relative flex w-[calc(100%-373px)] mt-24'>
                        {children}
                    </div>
                </Suspense>
                <SidebarLearning course={course} id_course={params.slug} progress={progress} />
            </div>
        </section>
    )
}
