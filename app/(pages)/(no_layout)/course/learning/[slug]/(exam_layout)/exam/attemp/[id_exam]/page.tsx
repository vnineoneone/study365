"use client"
import { useState, useEffect } from 'react';
import examApi from '@/app/api/examApi';
import AttempExam from './attemp';

export default function Exam({ params }: { params: { slug: string, id_exam: string } }) {
    const [exam, setExam] = useState<any>();


    useEffect(() => {
        const getExam = async () => {
            await examApi.get(params.id_exam).then((data) => {
                setExam(data.data)
            }).catch((err: any) => { })
        };
        getExam()
    }, [params.id_exam]);

    return (
        <AttempExam params={params} exam={exam} />
    );
}
