"use client"
import { useEffect, useState } from "react"
import { useAppSelector } from "@/redux/store";
import { convertToVietnamTime, formatCash } from "@/app/helper/FormatFunction"
import { DataTable } from "@/app/_components/Table/TableFormat"
import { columns } from "@/app/_components/Table/ReviewColumns/teacher_columns"
import courseApi from "@/app/api/courseApi"
import { useSearchParams } from "next/navigation"


export default function AssignmentDashboard() {

    const user = useAppSelector(state => state.authReducer.user);
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [reviews, setReviews] = useState<any>([])
    const searchParams = useSearchParams();
    const queries = Object.fromEntries(searchParams.entries());
    let filterString = ''
    for (const key of Object.keys(queries)) {
        filterString += `${key}=${queries[key]}&`
    }

    useEffect(() => {
        async function fetchData() {
            await courseApi.getAllReview('').then((data: any) => {
                setReviews(data.data)
            }).catch((err: any) => { })
        }
        fetchData()
    }, []);

    console.log(reviews);

    return (
        <div>
            <div>
                <div className="font-bold text-[#171347] text-lg">Lọc kết quả</div>
                <form className="p-5 bg-white mt-4 rounded-lg flex justify-between items-center">
                    <div>
                        <div className="flex items-center">
                            <div className="">
                                <input date-rangepicker="true" defaultValue="" name="preDate" type="date" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start" />
                            </div>
                            <span className="mx-4 text-gray-500">đến</span>
                            <div className="">

                                <input date-rangepicker="true" defaultValue="" name="postDate" type="date" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <select id="courses" name="id_course" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="" defaultChecked>Chọn khóa học</option>
                            {reviews?.map((course: any, index: number) => {
                                return (
                                    <option key={course.id} value={`${course.id}`}>{course.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div>
                        <select id="status" name="status" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="" defaultChecked>Chọn trạng thái</option>
                            <option value={`pass`}>Hoàn thành</option>
                            <option value={`pass`}>Thất bại</option>
                        </select>
                    </div>
                    <button type="submit">Lọc</button>
                </form>
            </div>
            <div className="mt-5">
                <div className="font-bold text-[#171347] text-lg">Danh sách đánh giá</div>
                <div className="container mx-auto rounded-lg mt-4">
                    <DataTable columns={columns} data={reviews} page={page} setPage={setPage} pageCount={pageCount} />
                </div>
            </div>
        </div>
    )
}

