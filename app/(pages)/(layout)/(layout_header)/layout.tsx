"use client"
import HeaderStudent from '@/app/_components/Header/HeaderStudent'
import HeaderTeacher from '@/app/_components/Header/HeaderTeacher';
import { useAppSelector } from "@/redux/store";



export default function StudentLayoutHeader({
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


    </section>
  )
}
