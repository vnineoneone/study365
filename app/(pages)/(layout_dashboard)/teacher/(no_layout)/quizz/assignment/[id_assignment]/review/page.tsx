"use client"
import axios from 'axios';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import parse from 'html-react-parser';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon, ChevronLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import examApi from '@/app/api/examApi';
import { useForm } from 'react-hook-form';
import { convertToHourMinuteSecond, convertToVietnamTime } from '@/app/helper/FormatFunction';
import { useRouter } from 'next/navigation';
import TinyMceEditorComment from '@/app/_components/Editor/TinyMceEditorComment';
import CommentAssignment from './comment';


export default function ReviewExam({ params }: { params: { slug: string, id_assignment: string } }) {

    const [assignment, setAssignment] = useState<any>({})
    const [details, setDetails] = useState<any>([])


    useEffect(() => {
        async function fetchData() {
            examApi.getDetailAssigmnent(params.id_assignment).then((data) => {
                setAssignment(data.data)
                setDetails(data.data.details.sort((a: any, b: any) => a.order - b.order).map((detail: any) => {
                    return {
                        ...detail,
                        Answers: detail.Answers.sort((a: any, b: any) => a.selected_answer.order - b.selected_answer.order)
                    };
                }));
            })
        }
        fetchData()
    }, [params.id_assignment]);


    if (assignment.id) {
        return (
            <CommentAssignment assignment={assignment} params={params} details={details} />
        );
    }
}
