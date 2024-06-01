'use client'

import examApi from "@/app/api/examApi";
import { useEffect, useState } from "react";
import Edit from './edit'

export default function EditExam({ params }: { params: { slug: string } }) {
    const [data, setData] = useState<any>()
    useEffect(() => {
        async function fetchData() {
            await examApi.get(params.slug).then((data: any) => setData(data.data)).catch((err: any) => { })
        }
        fetchData()
    }, [params.slug]);
    if (data) {
        data.Categories?.map((category: any) => {
            if (category.Class) {
                data.grade = category.id
            }
            if (category.Subject) {
                data.subject = category.id
            }
            if (category.Level) {
                data.level = category.id
            }
        })
        return (
            <Edit id={params.slug} exam={data} />
        )
    }
    else {
        return null
    }

}



