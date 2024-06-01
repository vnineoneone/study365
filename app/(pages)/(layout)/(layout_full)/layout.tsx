"use client"

import FlowbiteClient from '@/app/_components/Flowbite/FlowbiteClient';
import Footer from '@/app/_components/Footer/footer';
import HeaderStudent from '@/app/_components/Header/HeaderStudent'
import HeaderTeacher from '@/app/_components/Header/HeaderTeacher';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from "@/redux/store";



export default function StudentLayoutFull({
  children,
}: {
  children: React.ReactNode
}) {

  const { user } = useAppSelector(state => state.authReducer);
  return (
    <section className="">
      {
        user?.role == "teacher" ? <HeaderTeacher /> : <HeaderStudent />
      }

      <div className='mt-20'>
        {children}
      </div>
      <Footer />


    </section>
  )
}
