
'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { loginAdmin, reset } from '@/redux/features/authSlice';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { redirect } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
// import { toastError, toastSuccess } from '@/utils/toast';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function Login() {
    const [error, setError] = useState<any>()
    const { isSuccess, isFailed, message } = useAppSelector(state => state.authReducer);
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const handleLoginSubmit: SubmitHandler<{ email: string, password: string }> = async (data) => {
        let res: any = await dispatch(loginAdmin(data))



        MySwal.fire({
            title: <p className='text-lg'>Đang xử lý</p>,
            didOpen: async () => {
                MySwal.showLoading()
                if (!res.payload?.success) {
                    MySwal.fire({
                        title: <p className="text-2xl">Đăng nhập thất bại</p>,
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 1000
                    })

                }
                else {
                    MySwal.fire({
                        title: <p className="text-2xl">Đăng nhập thành công</p>,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    // redirect('/admin/dashboard')
                }


            },
        })

    };
    console.log(isSuccess, isFailed);

    useEffect(() => {
        dispatch(reset());
        if (isSuccess) {
            redirect('/admin/dashboard')
        }
        if (isFailed) {
            dispatch(reset());
            redirect('/login');
        }
    }, [dispatch, isFailed, isSuccess, message]);



    return (
        <div className="container px-4 w-full mx-auto flex justify-center">
            <div className="flex justify-center items-center mt-20 mb-16 w-[500px] rounded-2xl border-[1px] border-[#ececec] shadow-lg">
                <div className="w-full">
                    <div className="py-[75px] px-[45px]">
                        <div className="space-y-4 md:space-y-6">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Đăng nhập
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit(handleLoginSubmit)}>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register('email', { required: "Email không thể trống" })}
                                        className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="test@gmail.com"
                                    />
                                    {errors?.email?.message && (
                                        <p className='mt-2 text-sm text-red-400'>{errors.email?.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        {...register('password', { required: "Mật khẩu không thể trống" })}
                                        id="password"
                                        placeholder="••••••••"
                                        className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                    {errors?.password?.message && (
                                        <p className='mt-2 text-sm text-red-400'>{errors.password?.message}</p>
                                    )}
                                </div>
                                <div className="flex items-center justify-end">
                                    <Link
                                        href="#"
                                        className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Quên mật khẩu
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white shadow-primary_btn_shadow bg-primary hover:bg-primary-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Đăng nhập
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Bạn chưa có tài khoản?{" "}
                                    <Link
                                        href="/register"
                                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Đăng ký
                                    </Link>
                                </p>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
};
