import { useAppSelector } from '@/redux/store';
import React, { createContext, useContext, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

// Tạo một context cho socket
const SocketContext = createContext<Socket<any, any> | null>(null);

// Tạo một provider cho socket
export function SocketProvider({ children, isLoggedIn }: { children: any, isLoggedIn: boolean }) {
    const socket = isLoggedIn ? io(`http://13.212.127.13:4005`, { transports: ["websocket"] }) : null;
    const { user } = useAppSelector(state => state.authReducer);

    useEffect(() => {
        if (socket) {
            socket.emit("new_user_online", user.id);
        }
    }, [socket, user.id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

// Tạo một hook tùy chỉnh để sử dụng socket
export function useSocket() {
    return useContext(SocketContext);
}