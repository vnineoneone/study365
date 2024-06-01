"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { signup, signupTeacher, reset } from '@/redux/features/authSlice';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import categoryApi from "@/app/api/category";
import { ToastContainer, toast } from "react-toastify";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function RegisterPage() {
    const [tab, setTab] = useState("student")
    const { isSuccess } = useAppSelector(state => state.authReducer);
    const dispatch = useDispatch<AppDispatch>();

    const handleRegisterSubmit = async (data: any) => {

        MySwal.fire({
            title: <p className='text-lg'>Đang xử lý</p>,
            didOpen: async () => {
                MySwal.showLoading()
                await dispatch(signup(data)).then(() => {
                    MySwal.fire({
                        title: <p className="text-2xl">Đăng ký thành công</p>,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    })
                }).catch(() => {
                    MySwal.fire({
                        title: <p className="text-2xl">Đăng ký thất bại</p>,
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 1000
                    })
                }
                )

            },
        })
    };
    const handleRegisterTeacherSubmit = async (data: any) => {
        data.subjects = [data.subject]
        MySwal.fire({
            title: <p className='text-lg'>Đang xử lý</p>,
            didOpen: async () => {
                MySwal.showLoading()
                await dispatch(signupTeacher(data)).then(() => {
                    MySwal.fire({
                        title: <p className="text-2xl">Đăng ký thành công</p>,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    })
                }).catch(() => {
                    MySwal.fire({
                        title: <p className="text-2xl">Đăng ký thất bại</p>,
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 1000
                    })
                }
                )

            },
        })

    };

    useEffect(() => {
        dispatch(reset());
        if (isSuccess) {

            redirect('/login');
        }
        dispatch(reset());
    });
    const [category, setCategory] = useState<any>()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: '',
            gender: '',
            grade: '',
        }
    })
    const {
        register: registerTeacher,
        handleSubmit: handleSubmitTeacher,
        formState: { errors: errorsTeacher }
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: '',
            gender: '',
            subject: '',
        }
    })
    useEffect(() => {
        async function fetchCategory() {
            await categoryApi.getAll().then((data: any) => setCategory(data)).catch((err: any) => { })
        }
        fetchCategory()
    }, []);

    return (
        <div className="container px-4 w-full mx-auto flex justify-center">
            <ToastContainer />
            <div className="flex flex-wrap mt-20 mb-16 w-[500px] rounded-2xl border-[1px] border-[#ececec] shadow-lg">
                <div className="w-full">
                    <div className="py-[25px] px-[45px]">
                        <div className="space-y-4 md:space-y-6">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Đăng ký
                            </h1>
                            <div className="">
                                <label className="text-sm font-medium text-gray-900 dark:text-white">
                                    Loại tài khoản
                                </label>
                                <ul style={{
                                    marginTop: "10px"
                                }} className="tems-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input
                                                id="horizontal-list-radio-license"
                                                type="radio"
                                                defaultChecked
                                                name="list-radio"
                                                onClick={() => setTab("student")
                                                }
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                            />
                                            <label
                                                htmlFor="horizontal-list-radio-license"
                                                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Học sinh
                                            </label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input
                                                id="horizontal-list-radio-id"
                                                type="radio"
                                                defaultValue=""
                                                name="list-radio"
                                                onClick={() => setTab("teacher")
                                                }
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                            />
                                            <label
                                                htmlFor="horizontal-list-radio-id"
                                                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Giáo viên
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className={`${tab === "student" ? "" : "hidden"} `}>
                                <form onSubmit={(handleSubmit(handleRegisterSubmit))} className="space-y-4 md:space-y-6" action="#">

                                    <div className="">
                                        <div className="mb-5">
                                            <label
                                                htmlFor="name"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Họ và tên
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                {...register('name', { required: "Họ và tên không thể thiếu" })}
                                                className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            />
                                            {errors?.name?.message && (
                                                <p className='mt-2 text-sm text-red-400'>{errors.name?.message}</p>
                                            )}
                                        </div>

                                        <div className="mb-5 w-1/2">
                                            <label
                                                htmlFor="grade"
                                                className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                            >
                                                Lớp học
                                            </label>
                                            <select id="grade" defaultValue={""} {...register('grade', { required: "Lớp học không thể thiếu" })} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                <option value="" >Chọn lớp học</option>

                                                {category?.Class?.map((cl: any, index: number) => {
                                                    return (
                                                        <option key={index} value={`${cl.name}`}>{cl.name}</option>
                                                    )
                                                })}
                                            </select>
                                            {errors?.grade?.message && (
                                                <p className='mt-2 text-sm text-red-400'>{errors.grade?.message}</p>
                                            )}
                                        </div>
                                        <div className="mb-5">
                                            <label
                                                htmlFor="email"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                {...register('email', { required: "Email không thể thiếu" })}
                                                className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="test@gmail.com"
                                            />
                                            {errors?.email?.message && (
                                                <p className='mt-2 text-sm text-red-400'>{errors.email?.message}</p>
                                            )}
                                        </div>
                                        <div className="mb-5">
                                            <label
                                                htmlFor="password"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Mật khẩu
                                            </label>
                                            <input
                                                type="password"
                                                {...register('password', { required: "Password không thể thiếu" })}
                                                id="password"
                                                placeholder="••••••••"
                                                className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            />
                                            {errors?.password?.message && (
                                                <p className='mt-2 text-sm text-red-400'>{errors.password?.message}</p>
                                            )}
                                        </div>
                                        <div className="mb-5">
                                            <label
                                                htmlFor="confirm-password"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Xác nhận mật khẩu
                                            </label>
                                            <input
                                                type="password"
                                                {...register('confirmPassword', { required: "Xác nhận lại mật khẩu không thể thiếu" })}
                                                id="confirm-password"
                                                placeholder="••••••••"
                                                className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            />
                                            {errors?.confirmPassword?.message && (
                                                <p className='mt-2 text-sm text-red-400'>{errors.confirmPassword?.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-5">
                                        <button
                                            type="submit"
                                            className="w-full text-white bg-primary shadow-primary_btn_shadow hover:bg-primary-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                        >
                                            Tạo tài khoản
                                        </button>
                                        <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-10">
                                            Bạn đã có tài khoản?{" "}
                                            <Link
                                                href="/login"
                                                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                            >
                                                Đăng nhập tại đây
                                            </Link>
                                        </p>
                                    </div>


                                </form>
                            </div>
                            <div className={`${tab === "teacher" ? "" : "hidden"} `}>
                                <form onSubmit={(handleSubmitTeacher(handleRegisterTeacherSubmit))} className="space-y-4 md:space-y-6" action="#">

                                    <div className="">
                                        <div className="">
                                            {/* <h2 className="text-lg font-semibold leading-7 text-gray-900">Thông tin cá nhân</h2> */}
                                            <div className="mt-5">
                                                <div className="mb-5">
                                                    <label
                                                        htmlFor="namet"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Họ và tên
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="namet"
                                                        {...registerTeacher('name', { required: "Họ và tên không thể thiếu" })}
                                                        className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    />
                                                    {errorsTeacher?.name?.message && (
                                                        <p className='mt-2 text-sm text-red-400'>{errorsTeacher.name?.message}</p>
                                                    )}
                                                </div>
                                                <div className="mb-5">
                                                    <>
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
                                                                className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                                                {...registerTeacher('phone', { required: "Số diện thoại không thể thiếu" })}
                                                            />
                                                        </div>
                                                    </>

                                                    {errorsTeacher?.phone?.message && (
                                                        <p className='mt-2 text-sm text-red-400'>{errorsTeacher.phone?.message}</p>
                                                    )}
                                                </div>
                                                <div className="mb-5 w-1/2">
                                                    <label
                                                        htmlFor="subject"
                                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                                    >
                                                        Môn học
                                                    </label>
                                                    <select id="subject" defaultValue="" {...registerTeacher('subject', { required: "Môn học không thể thiếu" })} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                        <option value="">Chọn môn học</option>

                                                        {category?.Subject?.map((sb: any, index: number) => {
                                                            return (
                                                                <option key={index} value={`${sb.id}`}>{sb.name}</option>
                                                            )
                                                        })}
                                                    </select>
                                                    {errorsTeacher?.subject?.message && (
                                                        <p className='mt-2 text-sm text-red-400'>{errorsTeacher.subject?.message}</p>
                                                    )}
                                                </div>

                                                <div className="mb-5">
                                                    <label
                                                        htmlFor="emailt"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="emailt"
                                                        {...registerTeacher('email', { required: "Email không thể thiếu" })}
                                                        className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="test@gmail.com"
                                                    />
                                                    {errorsTeacher?.email?.message && (
                                                        <p className='mt-2 text-sm text-red-400'>{errorsTeacher.email?.message}</p>
                                                    )}
                                                </div>
                                                <div className="mb-5">
                                                    <label
                                                        htmlFor="passwordt"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Mật khẩu
                                                    </label>
                                                    <input
                                                        type="password"
                                                        {...registerTeacher('password', { required: "Password không thể thiếu" })}
                                                        id="passwordt"
                                                        placeholder="••••••••"
                                                        className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    />
                                                    {errorsTeacher?.password?.message && (
                                                        <p className='mt-2 text-sm text-red-400'>{errorsTeacher.password?.message}</p>
                                                    )}
                                                </div>
                                                <div className="mb-5">
                                                    <label
                                                        htmlFor="confirm-passwordt"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Xác nhận mật khẩu
                                                    </label>
                                                    <input
                                                        type="confirm-password"
                                                        {...registerTeacher('confirmPassword', { required: "Xác nhận lại mật khẩu không thể thiếu" })}
                                                        id="confirm-passwordt"
                                                        placeholder="••••••••"
                                                        className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    />
                                                    {errorsTeacher?.confirmPassword?.message && (
                                                        <p className='mt-2 text-sm text-red-400'>{errorsTeacher.confirmPassword?.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>


                                        {/* <div className="">
                                            <h2 className="text-lg font-semibold leading-7 text-gray-900">Thông tin chuyên môn</h2>

                                            <div className="mt-5">


                                                <div className="col-span-full">
                                                    <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Giới thiệu
                                                    </label>
                                                    <div className="mt-2">
                                                        <textarea
                                                            id="about"
                                                            name="about"
                                                            rows={3}
                                                            className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            defaultValue={''}
                                                        />
                                                    </div>
                                                    <p className="mt-3 text-sm leading-6 text-gray-600">Viết một vài dòng về bản thân.</p>
                                                </div>

                                                <div className="col-span-full">
                                                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Bằng cấp
                                                    </label>
                                                    <div className="mt-2 flex justify-center rounded-base border border-dashed border-gray-900/25 px-6 py-10">
                                                        <div className="text-center">
                                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                                <label
                                                                    htmlFor="file-upload"
                                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                                >
                                                                    <span>Upload a file</span>
                                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                                                </label>
                                                                <p className="pl-1">or drag and drop</p>
                                                            </div>
                                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-full">
                                                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Chứng chỉ
                                                    </label>
                                                    <div className="mt-2 flex justify-center rounded-base border border-dashed border-gray-900/25 px-6 py-10">
                                                        <div className="text-center">
                                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                                <label
                                                                    htmlFor="file-upload"
                                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                                >
                                                                    <span>Upload a file</span>
                                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                                                </label>
                                                                <p className="pl-1">or drag and drop</p>
                                                            </div>
                                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>

                                    <div className="pt-5">
                                        <button
                                            type="submit"
                                            className="w-full text-white bg-primary shadow-primary_btn_shadow hover:bg-primary-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                        >
                                            Tạo tài khoản
                                        </button>
                                        <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-10">
                                            Bạn đã có tài khoản?{" "}
                                            <Link
                                                href="/login"
                                                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                            >
                                                Đăng nhập tại đây
                                            </Link>
                                        </p>
                                    </div>


                                </form>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

