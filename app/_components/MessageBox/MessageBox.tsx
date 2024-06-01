"use client"

import Link from 'next/link';
import Image from 'next/image';
import { User } from '@chatscope/use-chat';

export default function MessageBox({ conversations, user }: any) {

    return (
        <div
            id="dropdownChat"
            className="z-20 hidden w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700"
            aria-labelledby="dropdownChatButton"
        >
            <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
                Tin nhắn
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700 overflow-y-scroll max-h-[400px]">
                {
                    conversations?.map((conversation: any) => {
                        return (
                            <Link
                                key={conversation.id}
                                href={`/chat/${conversation.id}`}
                                className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <div className="flex-shrink-0 mt-1">
                                    <Image
                                        src={`${conversation.friend ? (conversation.friend.avatar ? conversation.friend.avatar : "/images/avatar.png") : '/images/avatar-group.jpg'} `}
                                        width={24}
                                        height={24}
                                        className="w-11 h-11 rounded-full"
                                        alt="avatar"
                                    />

                                </div>
                                <div className="w-full px-3">
                                    <div>

                                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                            {
                                                conversation.name || conversation.friend?.name
                                            }
                                        </span>
                                        {/* <span className="ml-1 inline-block rounded-full bg-red-500 h-2 w-2"></span> */}
                                    </div>
                                    <div className="text-gray-500 text-xs mb-1.5 dark:text-gray-400 whitespace-nowrap text-ellipsis overflow-hidden mr-8">

                                        <span className='mr-1'>
                                            {
                                                (conversation.lastSenderId === user.id || conversation.friend?.id === user.id) ? "Bạn:" : `${`${conversation.lastSenderName || "Không có tin nhắn"}`}`
                                            }
                                        </span>

                                        <span>
                                            {
                                                conversation.lastMessage
                                            }
                                        </span>

                                    </div>

                                </div>
                            </Link>
                        )
                    })
                }


            </div>
            <Link
                href={`/chat/${conversations[0]?.id || "init"}`}
                className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            >
                <div className="inline-flex items-center ">
                    <svg
                        className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 14"
                    >
                        <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                    </svg>
                    Xem tất cả
                </div>
            </Link>
        </div>
    )
}