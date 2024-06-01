"use client"

import FlowbiteClient from '@/app/_components/Flowbite/FlowbiteClient';
import Footer from '@/app/_components/Footer/footer';
import HeaderStudent from '@/app/_components/Header/HeaderStudent'
import HeaderTeacher from '@/app/_components/Header/HeaderTeacher';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from "@/redux/store";
import { SocketProvider } from '../socket/SocketProvider';

export default function LayoutExtra({
    children,
}: {
    children: React.ReactNode
}) {

    const { user } = useAppSelector(state => state.authReducer);
    return (
        <SocketProvider isLoggedIn={user.id != 0}>
            {children}
        </SocketProvider>
    )
}
