"use client"

import { useMemo, useCallback } from "react";

import { MainContainer, Sidebar, ConversationList, Conversation, Avatar, ChatContainer, ConversationHeader, MessageGroup, Message, MessageList, MessageInput, TypingIndicator, Status, ExpansionPanel, Search, Loader, AddUserButton, EllipsisButton } from "@chatscope/chat-ui-kit-react";

import {
    useChat,
    ChatMessage,
    MessageContentType,
    MessageDirection,
    MessageStatus,
    Presence,
    UserStatus
} from "@chatscope/use-chat";
import { MessageContent, TextContent, User } from "@chatscope/use-chat";
import chatApi from "@/app/api/chatApi";
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'flowbite-react';
import { Label, Modal, TextInput, Textarea, Button } from 'flowbite-react';
import { set, useForm } from "react-hook-form";
import React from "react";
import courseApi from "@/app/api/courseApi";
import Image from "next/image";
import { useSocket } from "@/app/socket/SocketProvider";
import { Bounce, ToastContainer, toast } from "react-toastify";
import uuid from "react-uuid";
import userApi from "@/app/api/userApi";
import { useAppSelector } from "@/redux/store";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function Chat({ user, params, change, setChange, userStorage, createConversation, unseen }: any) {
    const socket = useSocket();

    const [lastMessage, setLastMessage] = useState('');
    // const [page, setPage] = useState(1);
    const loadingRef = useRef(null);;
    const [hasMore, setHasMore] = useState(true);
    const [chats, setChats] = useState<any>([])
    const [userOnline, setUserOnline] = useState<any>({})
    const [modal, setModal] = useState<any>({})
    const [listStudent, setListStudent] = useState<any>({})
    const [isAllStudent, setIsAllStudent] = useState(true)
    const [courses, setCourses] = useState<any>([])
    const [students, setStudents] = useState<any>([])
    const [members, setMembers] = useState<any>([])
    const [currGroup, setCurrGroup] = useState<any>({})
    const [users, setUsers] = useState<any>([])
    const [messages, setMessages] = useState<any>([]);
    const [blurTimeoutId, setBlurTimeoutId] = useState<any>(null);

    const [converStudent, setConverStudent] = useState<any>([]);
    const [converTeacher, setConverTeacher] = useState<any>([]);
    const [converGroup, setConverGroup] = useState<any>([]);
    // Get all chat related values and methods from useChat hook 
    const {
        currentMessages, conversations, activeConversation, setActiveConversation, sendMessage, getUser, currentMessage, setCurrentMessage,
        sendTyping, setCurrentUser, getConversation
    } = useChat();

    const authUser = useAppSelector(state => state.authReducer.user);


    useEffect(() => {
        socket?.on("new_message_created", (data: any) => {
            console.log(data);

            if (user.id === data.author?.id) {
                return
            }

            else {
                if (data.id_group === activeConversation?.id) {
                    setMessages((prev: any) => [data, ...prev]);
                }
                const conversation = getConversation(data.id_group)
                if (conversation) {
                    conversation.data.userLast = {
                        lastSenderId: data.author?.id,
                        lastSenderName: data.author?.name,
                        lastMessage: data.message
                    }
                }



                const audio = new Audio("/audio/audio-notification.mp3");
                let audioPlay = audio.play();

            }
        })

        socket?.on("new_individual_group_created", (data: any) => {
            socket.emit("join_group", `${data.id_group}`)

            if (user.id === data.author?.id) {
                return
            }
            else {
                const audio = new Audio("/audio/audio-notification.mp3");
                let audioPlay = audio.play();

                userStorage.addUser(new User({
                    id: data.author?.id,
                    presence: new Presence({ status: UserStatus.Available, description: "" }),
                    firstName: "",
                    lastName: "",
                    username: data.author?.name,
                    email: "",
                    avatar: `${data.author.avatar ? data.author?.avatar : '/images/avatar.png'}`,
                    bio: ""
                }));
                const newConversation = createConversation(data.id_group, data.author?.id, data.author?.name, data.author?.role, {
                    lastSenderId: data.author?.id,
                    lastSenderName: data.author?.name,
                    lastMessage: data.message
                })

                if (data.author?.role === "teacher") {
                    setConverTeacher([newConversation, ...converTeacher])
                }
                else {
                    setConverStudent([newConversation, ...converStudent])
                }
                userStorage.addConversation(newConversation);



            }
        })

        socket?.on("new_group_created", (data: any) => {

            socket.emit("join_group", `${data.id_group}`)

            if (user.id === data.admin) {
                return
            }
            else {
                const audio = new Audio("/audio/audio-notification.mp3");
                let audioPlay = audio.play();

                userStorage.addUser(new User({
                    id: data.id_group,
                    presence: new Presence({ status: UserStatus.Available, description: "" }),
                    firstName: "",
                    lastName: "",
                    username: data.group_name,
                    email: "",
                    avatar: `${'/images/avatar-group.jpg'}`,
                    bio: ""
                }));
                const newConversation = createConversation(data.id_group, data.id_group, data.group_name, "group", {})

                setConverGroup([newConversation, ...converGroup])

                userStorage.addConversation(newConversation);
            }
        })
        socket?.on("new_user_online", (data: any) => {

            setUserOnline({ ...userOnline, [data.userId]: true })
        })
        socket?.on("userDisconnected", (data: any) => {

            setUserOnline({ ...userOnline, [data.id]: false })
        })


        return () => {
            if (socket) {
                socket.off('new_message_created');
            }
        };
    }, [activeConversation?.id, converGroup, converStudent, converTeacher, createConversation, getConversation, socket, user.id, userOnline, userStorage]);


    useEffect(() => {
        setConverStudent(userStorage.conversations.filter((c: any) => c.data.type === "student"))
        setConverTeacher(userStorage.conversations.filter((c: any) => c.data.type === "teacher"))
        setConverGroup(userStorage.conversations.filter((c: any) => c.data.type === "group"))
    }, [userStorage.conversations]);





    const fetchMessages = async (lastMess: any) => {
        // Fetch notifications from API here

        if (user) {
            const tempMessage = lastMess?.id || '';
            setLastMessage(lastMess);

            await chatApi.getMessageOfGroup(params.id, tempMessage).then((res) => {
                if (res.data.length === 0) {
                    setHasMore(false); // No more notifications

                } else {
                    setMessages((prevMessages: any) => [...prevMessages, ...res.data]);
                    setLastMessage(res.data[res.data.length - 1]);
                }
            }).catch((err) => {
                setHasMore(false);
            })
        }
    };

    useEffect(() => {

        var options = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0
        }

        let observer = new IntersectionObserver(async (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && hasMore) { // Only call API if there are more notifications
                    fetchMessages(lastMessage);
                }
            });
        }, options);

        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }

        return () => {
            if (loadingRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(loadingRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore, lastMessage]);






    const {
        register,
        reset,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        setCurrentUser(user);

        if (messages) {

            const tempChat = messages?.map((message: any) => {
                return {
                    id: message.id || message.author?.id_message, // Id will be generated by storage generator, so here you can pass an empty string
                    content: message.body || message.message as unknown as MessageContent<TextContent>,
                    contentType: MessageContentType.TextHtml,
                    senderId: message.author?.id || message.author,
                    direction: user.id === (message.author?.id || message.author) ? MessageDirection.Outgoing : MessageDirection.Incoming,
                    status: MessageStatus.Sent,
                    name: message.author?.name,
                    avtar: message.author?.avatar
                };
            })
            tempChat.reverse();
            setChats(groupAdjacentMessagesBySender(tempChat))
        }

    }, [user, setCurrentUser, messages]);

    useEffect(() => {
        setActiveConversation(params.id);
    }, [params.id, setActiveConversation]);

    // console.log(converGroup);



    // Get current user data
    const [currentUserAvatar, currentUserName] = useMemo(() => {

        if (activeConversation) {
            if (activeConversation.data?.type === "group") {
                return [<Avatar key="avatar" src={'/images/avatar-group.jpg'} />, <span key="username">{activeConversation.data.name}</span>]
            } else {

                const participant = activeConversation.participants.length > 0 ? activeConversation.participants[0] : undefined;

                if (participant) {
                    const user = getUser(participant.id);
                    if (user) {
                        return [<Avatar key="avatar" src={user.avatar ? user.avatar : '/images/avatar.png'} />, <span key="username">{user.username}</span>]
                    }
                }
            }
        }

        return [undefined, undefined];

    }, [activeConversation, getUser]);

    const handleChange = (value: string) => {
        // Send typing indicator to the active conversation
        // You can call this method on each onChange event
        // because sendTyping method can throttle sending this event
        // So typing event will not be send to often to the server
        setCurrentMessage(value);
        if (activeConversation) {
            sendTyping({
                conversationId: activeConversation?.id,
                isTyping: true,
                userId: user.id,
                content: value, // Note! Most often you don't want to send what the user types, as this can violate his privacy!
                throttle: true
            });
        }

    }

    const handleSend = (text: string) => {

        const message = new ChatMessage({
            id: "", // Id will be generated by storage generator, so here you can pass an empty string
            content: text as unknown as MessageContent<TextContent>,
            contentType: MessageContentType.TextHtml,
            senderId: user.id,
            direction: MessageDirection.Outgoing,
            status: MessageStatus.Sent
        });

        if (activeConversation) {
            sendMessage({
                message,
                conversationId: activeConversation.id,
                senderId: user.id,
            });

            const formData = activeConversation.data?.userLast?.type === "temp" ? {
                data: {
                    id_group: activeConversation.id,
                    user: activeConversation.participants[0]?.id,
                    body: text
                }
            } : {
                data: {
                    id_group: activeConversation.id,
                    body: text
                }
            }
            chatApi.createMessage(formData).then((res) => {
                const data = res.data
                activeConversation.data.userLast = {
                    lastSenderId: user.id,
                    lastSenderName: user.username,
                    lastMessage: text
                }

                setMessages((prev: any) => [data, ...prev]);
            }).catch(() => { });
        }

    };

    const getTypingIndicator = useCallback(
        () => {

            if (activeConversation) {

                const typingUsers = activeConversation.typingUsers;

                if (typingUsers.length > 0) {

                    const typingUserId = typingUsers.items[0].userId;

                    // Check if typing user participates in the conversation
                    if (activeConversation.participantExists(typingUserId)) {

                        const typingUser = getUser(typingUserId);

                        if (typingUser) {
                            return <TypingIndicator content={`${typingUser.username} is typing`} />
                        }

                    }

                }

            }


            return undefined;

        }, [activeConversation, getUser],
    );
    function groupAdjacentMessagesBySender(messages: any) {
        return messages.reduce((groups: any, message: any) => {
            const lastGroup = groups[groups.length - 1];

            if (!lastGroup || lastGroup[lastGroup.length - 1].senderId !== message.senderId) {
                groups.push([message]);
            } else {
                lastGroup.push(message);
            }

            return groups;
        }, []);
    }


    return (
        <div className="h-[calc(100vh-80px)] px-2">

            <ToastContainer />
            <>
                <Modal show={modal[`add-group`] || false} size="xl" onClose={() => {
                    reset()
                    setModal({ ...modal, [`add-group`]: false })
                }} popup>
                    <Modal.Header />
                    <Modal.Body>

                        <form className="space-y-6" onSubmit={handleSubmit(async (data: any) => {
                            const studentIds = Object.keys(listStudent).filter(key => listStudent[key]);


                            const dataForm = {
                                data: {
                                    name: data.name,
                                    members: studentIds,
                                    individual: false
                                }
                            }

                            await chatApi.createGroup(dataForm).then(() => {
                                setChange(!change)
                                setModal({ ...modal, [`add-group`]: false })
                                reset()
                                toast.success('Nhóm đã được tạo thành công', {
                                    position: "top-center",
                                    autoClose: 800,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "light",
                                    transition: Bounce,
                                });

                            }).catch((err: any) => { })
                        })}>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Thêm nhóm</h3>
                            <div className="">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Tên nhóm
                                </label>
                                <input
                                    {...register("name", {
                                        required: "Tên nhóm không thể trống."
                                    })}
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`bg-white border border-gray-300 text-[#343434] text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                />
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors?.name?.message?.toString()}
                                </p>
                            </div>
                            <div className='w-full'>
                                <label
                                    htmlFor="course"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Chọn khóa học
                                </label>
                                <select {...register("course", {
                                    // required: 'Hãy chọn khóa học'
                                })}
                                    id="courses" name="course" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={async (e) => {
                                        if (e.target.value) {
                                            if (e.target.value === 'all_course')
                                                await courseApi.getAllStudenBuyCourseOfTeacher(`${user.id}`, '1').then((data: any) => {
                                                    setStudents(data.data)
                                                    let temp: any = {}
                                                    data.data?.map((student: any) => {
                                                        temp[student.id] = true
                                                    });

                                                    setListStudent(temp)


                                                }).catch((err: any) => { })
                                            else
                                                await courseApi.getAllStudenBuySpecificCourseOfTeacher(e.target.value, `${user.id}`, '1').then((data: any) => {
                                                    setStudents(data.data)
                                                    data.data?.map((student: any) => {
                                                        setListStudent({ ...listStudent, [student.id]: true })
                                                    })
                                                }).catch((err: any) => { })
                                        }


                                    }}>
                                    <option value="" defaultChecked>Chọn khóa học</option>
                                    <option value="all_course" >Tất cả khóa học</option>
                                    {courses?.map((course: any, index: number) => {
                                        return (
                                            <option key={course.id} value={`${course.id}`}>{course.name}</option>
                                        )
                                    })}
                                </select>
                                <div className="mt-1 text-sm text-red-600 dark:text-red-500">
                                    {errors?.course?.message && (
                                        <React.Fragment>{errors.course.message.toString()}</React.Fragment>
                                    )}
                                </div>
                            </div>
                            <div className={`${!students || students?.length === 0 ? "hidden" : ""} mt-5`}>
                                <div className="mb-4 font-semibold">
                                    Danh sách người dùng
                                </div>
                                <div className="flex justify-between items-center border-[1px] border-slate-200 px-4 py-2 rounded-lg mb-2">
                                    <div className="font-semibold text-sm">
                                        Tất cả
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            onChange={(e) => {
                                                setIsAllStudent((e.target as HTMLInputElement).checked)

                                            }}
                                            type="checkbox"
                                            checked={isAllStudent}
                                            id={'all'}
                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                        />
                                    </div>

                                </div>
                                <div className="sidebar py-2 max-h-80 overflow-y-auto">
                                    {
                                        students ? students?.map((student: any) => {
                                            return (
                                                <div key={student.id} className="border-[1px] flex items-center justify-between border-slate-200 px-4 py-2 rounded-lg mb-2">
                                                    <div className="flex justify-center items-center">
                                                        <div className="mr-2">
                                                            <Image src={student.avatar ? student.avatar : '/images/avatar.png'} alt="" width={40} height={40} className="rounded-full" />
                                                        </div>
                                                        <div className="text-sm">
                                                            <div className="font-semibold">
                                                                {student.name}
                                                            </div>
                                                            <div>
                                                                {student.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center ">
                                                        <input
                                                            onChange={(e) => {

                                                                setListStudent({ ...listStudent, [student.id]: (e.target as HTMLInputElement).checked })
                                                                if (!e.target.checked)
                                                                    setIsAllStudent(false)
                                                            }}
                                                            checked={listStudent[student.id] ? true : isAllStudent}
                                                            type="checkbox"
                                                            defaultValue=""
                                                            id={student.id}
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                        />

                                                    </div>
                                                </div>
                                            )
                                        }) : null
                                    }
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setModal({ ...modal, [`add-group`]: false })
                                        reset()
                                    }
                                    }
                                    type="button"
                                    className="mr-4 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                >
                                    Hủy
                                </button>
                                <div>
                                    <button
                                        type="submit"
                                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Tạo
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>
            <>
                <Modal show={modal[`edit-group`] || false} size="xl" onClose={() => {

                    setModal({ ...modal, [`edit-group`]: false })
                    reset()
                }
                } popup>
                    <Modal.Header />
                    <Modal.Body>

                        <form className="space-y-6" onSubmit={handleSubmit(async (data: any) => {
                            const dataForm = {
                                data: {
                                    name: data.name,
                                }
                            }

                            await chatApi.updateGroup(dataForm, activeConversation?.id || '').then((data: any) => {
                                setChange(!change)
                                setModal({ ...modal, [`edit-group`]: false })

                                userStorage.updateConversation({
                                    ...activeConversation,
                                    data: {
                                        ...activeConversation?.data,
                                        name: dataForm.data.name
                                    }
                                })
                                reset()
                                toast.success('Nhóm đã được cập nhập thành công', {
                                    position: "top-center",
                                    autoClose: 800,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "light",
                                    transition: Bounce,
                                });

                            }).catch((err: any) => { })
                        })}>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sửa nhóm</h3>
                            <div className="">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Tên nhóm
                                </label>
                                <input
                                    {...register("name", {
                                        required: "Tên nhóm không thể trống."
                                    })}
                                    type="text"
                                    defaultValue={activeConversation?.data.name}
                                    id="name"
                                    name="name"
                                    className={`bg-white border border-gray-300 text-[#343434] text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                />
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors?.name?.message?.toString()}
                                </p>
                            </div>

                            <div className={` mt-5`}>
                                <div className="mb-4 font-semibold">
                                    Danh sách người dùng
                                </div>
                                <div className="relative">
                                    <Search placeholder="Tìm kiếm..." className="h-10"
                                        onFocus={() => {
                                            setModal({ ...modal, [`dropdownSearch2`]: true })

                                        }}
                                        onBlur={() => {
                                            // Trì hoãn việc tắt dropdown
                                            const timeoutId = setTimeout(() => {
                                                setModal({ ...modal, [`dropdownSearch2`]: false });
                                            }, 500);
                                            setBlurTimeoutId(timeoutId);
                                        }}
                                        onChange={(value: any) => {
                                            userApi.searchUser(value).then((data: any) => {
                                                setUsers(data.data)
                                            }).catch((err: any) => { })
                                        }}
                                    />
                                    <div
                                        style={{
                                            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
                                        }}
                                        onMouseDown={() => {
                                            // Hủy bỏ việc tắt dropdown nếu người dùng nhấp vào nó
                                            clearTimeout(blurTimeoutId);
                                        }}
                                        id="dropdownSearch2"
                                        className={`${modal['dropdownSearch2'] ? "" : "hidden"} absolute top-14 left-4 z-10 w-[90%] overflow-auto bg-white rounded-lg shadow-lg dark:bg-gray-700`}
                                    >
                                        <ul
                                            className={`h-auto p-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200`}
                                            aria-labelledby="dropdownSearchButton"

                                        >
                                            {
                                                users?.length != 0 ?
                                                    <div className="sidebar py-2 max-h-80 overflow-auto">
                                                        {
                                                            users ? users?.map((user: any) => {
                                                                const tempId = uuid()
                                                                return (
                                                                    <div key={user.id} onClick={() => {

                                                                    }} className=" flex items-center justify-between border-slate-200 px-2 py-2 rounded-lg mb-2 hover:bg-slate-100">
                                                                        <div className="flex justify-center items-center">
                                                                            <div className="mr-2">
                                                                                <Image src={user.avatar ? user.avatar : '/images/avatar.png'} alt="" width={40} height={40} className="rounded-full" />
                                                                            </div>
                                                                            <div className="text-sm">
                                                                                <div className="font-semibold">
                                                                                    {user.name}
                                                                                </div>
                                                                                <div>
                                                                                    {user.email}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className=" text-blue-500">
                                                                            <button type="button" className="underline" onClick={() => {
                                                                                const dataForm = {
                                                                                    data: {
                                                                                        users: [user.id]
                                                                                    }
                                                                                }

                                                                                MySwal.fire({
                                                                                    title: <p className='text-lg'>Đang xử lý</p>,
                                                                                    didOpen: async () => {
                                                                                        MySwal.showLoading()
                                                                                        await chatApi.addUsertoGroup(activeConversation?.id || '', dataForm).then(() => {
                                                                                            MySwal.fire({
                                                                                                title: <p className="text-2xl">Thêm người dùng thành công</p>,
                                                                                                icon: 'success',
                                                                                                showConfirmButton: false,
                                                                                                timer: 1500
                                                                                            })
                                                                                            setMembers([...members, user])
                                                                                        }).catch(() => {
                                                                                            MySwal.fire({
                                                                                                title: <p className="text-2xl">Thêm người dùng thất bại</p>,
                                                                                                icon: 'error',
                                                                                                showConfirmButton: false,
                                                                                                timer: 1500
                                                                                            })
                                                                                        }
                                                                                        )

                                                                                    },
                                                                                })
                                                                            }}>
                                                                                Thêm
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }) : null
                                                        }
                                                    </div> : <p className='text-center'>Không có người dùng</p>

                                            }

                                        </ul>
                                    </div>
                                </div>
                                <div className={`${members?.length === 0 ? "hidden" : ""} sidebar py-2 max-h-80 overflow-y-auto mt-5`}>
                                    {
                                        members?.map((student: any) => {
                                            return (
                                                <div key={student.id} className="border-[1px] flex items-center justify-between border-slate-200 px-4 py-2 rounded-lg mb-2">
                                                    <div className="flex justify-center items-center">
                                                        <div className="mr-2">
                                                            <Image src={student.avatar ? student.avatar : '/images/avatar.png'} alt="" width={40} height={40} className="rounded-full" />
                                                        </div>
                                                        <div className="text-sm">
                                                            <div className="font-semibold">
                                                                {student.name}
                                                            </div>
                                                            <div>
                                                                {student.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className=" text-red-500">
                                                        <button type="button" className="underline" onClick={() => {
                                                            const dataForm = {
                                                                data: {
                                                                    users: [student.id]
                                                                }
                                                            }
                                                            MySwal.fire({
                                                                title: <p className='text-lg'>Đang xử lý</p>,
                                                                didOpen: async () => {
                                                                    MySwal.showLoading()
                                                                    await chatApi.deleteUserGroup(activeConversation?.id || '', dataForm).then(() => {
                                                                        MySwal.fire({
                                                                            title: <p className="text-2xl">Xóa người dùng thành công</p>,
                                                                            icon: 'success',
                                                                            showConfirmButton: false,
                                                                            timer: 1500
                                                                        })
                                                                        setMembers(members.filter((member: any) => member.id !== student.id));
                                                                    }).catch(() => {
                                                                        MySwal.fire({
                                                                            title: <p className="text-2xl">Xóa người dùng thất bại</p>,
                                                                            icon: 'error',
                                                                            showConfirmButton: false,
                                                                            timer: 1500
                                                                        })
                                                                    }
                                                                    )

                                                                },
                                                            })
                                                        }}>
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setModal({ ...modal, [`edit-group`]: false })
                                        reset()
                                    }
                                    }
                                    type="button"
                                    className="mr-4 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                >
                                    Hủy
                                </button>
                                <div>
                                    <button
                                        type="submit"
                                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>
            <MainContainer responsive className="">
                <Sidebar position="left" scrollable={!modal['dropdownSearch']} className="">
                    <ConversationHeader style={{ backgroundColor: "#fff" }}>
                        <Avatar src={user.avatar} status="available" />
                        <ConversationHeader.Content>
                            {user.username}
                        </ConversationHeader.Content>
                        {
                            authUser?.role === "teacher" && <ConversationHeader.Actions>
                                <AddUserButton onClick={async () => {
                                    await courseApi.getAllByTeacher(`${user.id}`, '1').then((data: any) => {
                                        setCourses(data.data.courses)
                                    }).catch((err: any) => { })
                                    setModal({ ...modal, [`add-group`]: true })
                                }} />
                            </ConversationHeader.Actions>
                        }



                    </ConversationHeader>
                    <div className="relative">
                        <Search placeholder="Tìm kiếm..." className="h-10"
                            onFocus={() => {
                                setModal({ ...modal, [`dropdownSearch`]: true })

                            }}
                            onBlur={() => {
                                // Trì hoãn việc tắt dropdown
                                const timeoutId = setTimeout(() => {
                                    setModal({ ...modal, [`dropdownSearch`]: false });
                                }, 500);
                                setBlurTimeoutId(timeoutId);
                            }}
                            onChange={(value: any) => {
                                userApi.searchUser(value).then((data: any) => {
                                    setUsers(data.data)
                                }).catch((err: any) => { })
                            }}
                        />
                        <div
                            style={{
                                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
                            }}
                            onMouseDown={() => {
                                // Hủy bỏ việc tắt dropdown nếu người dùng nhấp vào nó
                                clearTimeout(blurTimeoutId);
                            }}
                            id="dropdownSearch"
                            className={`${modal['dropdownSearch'] ? "" : "hidden"} absolute top-14 left-4 z-10 w-[90%] overflow-auto bg-white rounded-lg shadow-lg dark:bg-gray-700`}
                        >
                            <ul
                                className="h-auto p-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                                aria-labelledby="dropdownSearchButton"

                            >
                                {
                                    users?.length != 0 ?
                                        <div className="sidebar py-2 max-h-80 overflow-auto">
                                            {
                                                users ? users?.map((user: any) => {
                                                    const tempId = uuid()
                                                    return (
                                                        <Link onClick={() => {
                                                            userStorage.addUser(new User({
                                                                id: user.id,
                                                                presence: new Presence({ status: UserStatus.Available, description: "" }),
                                                                firstName: "",
                                                                lastName: "",
                                                                username: user.name,
                                                                email: "",
                                                                avatar: `${user.avatar ? user.avatar : '/images/avatar.png'}`,
                                                                bio: ""
                                                            }));
                                                            userStorage.addConversation(createConversation(tempId, user.id, user.name, user.role, { type: "temp" }));
                                                        }} href={`/chat/${tempId}`} key={user.id} className=" flex items-center justify-between border-slate-200 px-2 py-2 rounded-lg mb-2 hover:bg-slate-100">
                                                            <div className="flex justify-center items-center">
                                                                <div className="mr-2">
                                                                    <Image src={user.avatar ? user.avatar : '/images/avatar.png'} alt="" width={40} height={40} className="rounded-full" />
                                                                </div>
                                                                <div className="text-sm">
                                                                    <div className="font-semibold">
                                                                        {user.name}
                                                                    </div>
                                                                    <div>
                                                                        {user.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    )
                                                }) : null
                                            }
                                        </div> : <p className='text-center'>Không có người dùng</p>

                                }

                            </ul>
                        </div>
                    </div>
                    <ExpansionPanel
                        open
                        title={`Giáo viên (${unseen?.teacher || 0})`}
                        className=""
                    >
                        <ConversationList>
                            {converTeacher.map((c: any, index: any) => {

                                // Helper for getting the data of the first participant
                                const [avatar, name] = (() => {

                                    const participant = c.participants.length > 0 ? c.participants[0] : undefined;

                                    if (participant) {
                                        const user = getUser(participant.id);

                                        if (user) {

                                            return [<Avatar key={user.id} src={user.avatar ? user.avatar : '/images/avatar.png'} status={`${userOnline[participant.id] ? "available" : "unavailable"}`} />, user.username]

                                        }
                                    }

                                    return [undefined, undefined]
                                })();

                                return (
                                    <Link href={`/chat/${c.data.id_group}`} key={c.data.id_group}>
                                        <Conversation
                                            name={name}
                                            lastSenderName={c.data.userLast.lastSenderId === user.id ? "Bạn" : c.data.userLast.lastSenderName}
                                            info={c.data.userLast.lastMessage}
                                            // info={c.draft ? `Draft: ${c.draft.replace(/<br>/g, "\n").replace(/&nbsp;/g, " ")}` : ""}
                                            active={activeConversation?.id === c.id}
                                            unreadCnt={c.unreadCounter}
                                            onClick={() => setActiveConversation(c.data.id_group)}
                                        >
                                            {avatar}
                                        </Conversation>
                                    </Link>

                                );
                            })}
                        </ConversationList>
                    </ExpansionPanel>
                    <ExpansionPanel
                        open
                        title={`Học sinh (${unseen?.student || 0})`}
                        className=""
                    >
                        <ConversationList>
                            {converStudent.map((c: any, index: any) => {

                                // Helper for getting the data of the first participant
                                const [avatar, name] = (() => {

                                    const participant = c.participants.length > 0 ? c.participants[0] : undefined;

                                    if (participant) {
                                        const user = getUser(participant.id);

                                        if (user) {

                                            return [<Avatar key={user.id} src={user.avatar ? user.avatar : '/images/avatar.png'} status={`${userOnline[participant.id] ? "available" : "unavailable"}`} />, user.username]

                                        }
                                    }

                                    return [undefined, undefined]
                                })();

                                return (
                                    <Link href={`/chat/${c.data.id_group}`} key={c.data.id_group}>
                                        <Conversation
                                            name={name}
                                            lastSenderName={c.data.userLast.lastSenderId === user.id ? "Bạn" : c.data.userLast.lastSenderName}
                                            info={c.data.userLast.lastMessage}
                                            // info={c.draft ? `Draft: ${c.draft.replace(/<br>/g, "\n").replace(/&nbsp;/g, " ")}` : ""}
                                            active={activeConversation?.id === c.id}
                                            unreadCnt={c.unreadCounter}
                                            onClick={() => setActiveConversation(c.data.id_group)}
                                        >
                                            {avatar}
                                        </Conversation>
                                    </Link>

                                );
                            })}
                        </ConversationList>
                    </ExpansionPanel>
                    <ExpansionPanel
                        open
                        title={`Nhóm (${unseen?.mix || 0})`}
                        className=""
                    >
                        <ConversationList>
                            {converGroup.map((c: any, index: any) => {

                                // Helper for getting the data of the first participant
                                const [avatar, name] = (() => {
                                    const user = c.data
                                    return [<Avatar key={user.id} src={'/images/avatar-group.jpg'} />, user.name]

                                    return [undefined, undefined]
                                })();

                                return (
                                    <Link href={`/chat/${c.data.id_group}`} key={c.data.id_group}>
                                        <Conversation
                                            name={name}
                                            lastSenderName={c.data.userLast.lastSenderId === user.id ? "Bạn" : c.data.userLast.lastSenderName}
                                            info={c.data.userLast.lastMessage}
                                            // info={c.draft ? `Draft: ${c.draft.replace(/<br>/g, "\n").replace(/&nbsp;/g, " ")}` : ""}
                                            active={activeConversation?.id === c.id}
                                            unreadCnt={c.unreadCounter}
                                            onClick={() => setActiveConversation(c.data.id_group)}
                                        >
                                            {avatar}
                                        </Conversation>
                                    </Link>

                                );
                            })}
                        </ConversationList>
                    </ExpansionPanel>



                </Sidebar>

                <ChatContainer>
                    {activeConversation && <ConversationHeader>
                        {currentUserAvatar}
                        <ConversationHeader.Content userName={currentUserName} />
                        {
                            activeConversation?.data?.type === "group" && <ConversationHeader.Actions>
                                {
                                    authUser?.role === "teacher" ?
                                        <Dropdown label="" renderTrigger={() => <EllipsisVerticalIcon className="w-8 h-8" />} placement="left">
                                            <Dropdown.Item onClick={async () => {

                                                await chatApi.getGroup(activeConversation.id).then((data: any) => {
                                                    setCurrGroup(data.data)
                                                    setMembers(data.data.members)
                                                }).catch((err: any) => { })
                                                setModal({ ...modal, [`edit-group`]: true })
                                            }}>
                                                Sửa nhóm
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => {
                                                MySwal.fire({
                                                    title: <p className="text-2xl">Bạn có chắc muốn xóa nhóm này?</p>,
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#3085d6",
                                                    cancelButtonColor: "#d33",
                                                    confirmButtonText: "Xóa",
                                                    cancelButtonText: "Hủy",
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        MySwal.fire({
                                                            title: <p className='text-lg'>Đang xử lý</p>,
                                                            didOpen: async () => {
                                                                MySwal.showLoading()
                                                                await chatApi.deleteGroup(activeConversation.id).then(() => {
                                                                    MySwal.fire({
                                                                        title: <p className="text-2xl">Nhóm đã được xóa thành công</p>,
                                                                        icon: 'success',
                                                                        showConfirmButton: false,
                                                                        timer: 1500
                                                                    })
                                                                    setChange(!change)
                                                                }).catch((err: any) => {
                                                                    MySwal.fire({
                                                                        title: <p className="text-2xl">Xóa nhóm thất bại</p>,
                                                                        icon: 'error',
                                                                        showConfirmButton: false,
                                                                        timer: 1500
                                                                    })
                                                                })
                                                            },
                                                        })


                                                    }
                                                });
                                            }}><p className="text-red-500">Xóa nhóm</p></Dropdown.Item>
                                        </Dropdown>
                                        :
                                        <Dropdown label="" renderTrigger={() => <EllipsisVerticalIcon className="w-8 h-8" />} placement="left">
                                            <Dropdown.Item onClick={async () => {
                                                await chatApi.leaveGroup(activeConversation.id).then(() => {
                                                    setChange(!change);
                                                    const updatedConverGroup = converGroup.filter((c: any) => c.data.id_group !== activeConversation.id);
                                                    setConverGroup(updatedConverGroup);
                                                    toast.success('Rời nhóm thành công', {
                                                        position: "top-center",
                                                        autoClose: 800,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        progress: undefined,
                                                        theme: "light",
                                                        transition: Bounce,
                                                    });
                                                }).catch((err: any) => {
                                                    toast.error('Rời nhóm thất bại', {
                                                        position: "top-center",
                                                        autoClose: 800,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        progress: undefined,
                                                        theme: "light",
                                                        transition: Bounce,
                                                    });
                                                })
                                            }}><p className="text-red-500">Rời nhóm</p></Dropdown.Item>
                                        </Dropdown>
                                }

                            </ConversationHeader.Actions>
                        }




                    </ConversationHeader>}


                    <MessageList typingIndicator={getTypingIndicator()}>
                        {
                            hasMore && <div ref={loadingRef} className="w-full flex justify-center items-center py-5">
                                <Loader className="">
                                </Loader>
                            </div>
                        }

                        {chats?.map((chat: any) => (
                            <MessageGroup key={chat[0].id} direction={chat[0].direction}>
                                {chat[0].direction === MessageDirection.Incoming ? <Avatar key="avatar" src={chat[0].avatar ? chat[0].avatar : '/images/avatar.png'} /> || currentUserAvatar : null}
                                {chat[0].direction === MessageDirection.Incoming ? <MessageGroup.Header>{(<span>{chat[0].name}</span>) || currentUserName} </MessageGroup.Header> : null}

                                <MessageGroup.Messages>
                                    {chat?.map((m: ChatMessage<MessageContentType>) => (
                                        <Message key={m.id} model={{
                                            type: "html",
                                            payload: m.content,
                                            direction: m.direction,
                                            position: "normal",
                                        }}>
                                        </Message>
                                    ))}
                                </MessageGroup.Messages>
                            </MessageGroup>

                        ))}


                        {/* {activeConversation && currentMessages.map((g) => <MessageGroup key={g.id} direction={g.direction}>
                            <Avatar src={user.avatar} status="available" />

                            <MessageGroup.Messages>
                                {g.messages.map((m: ChatMessage<MessageContentType>) => (
                                    <Message key={m.id} model={{
                                        type: "html",
                                        payload: m.content,
                                        direction: m.direction,
                                        position: "normal",
                                    }}>

                                    </Message>
                                ))}
                            </MessageGroup.Messages>
                        </MessageGroup>)} */}


                    </MessageList>
                    <MessageInput className="mb-2" value={currentMessage} onChange={handleChange} onSend={handleSend} disabled={!activeConversation} attachButton={false} placeholder="Nhập ở đây..." />
                </ChatContainer>

            </MainContainer>
        </div>
    )
}