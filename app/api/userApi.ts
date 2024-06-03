import axiosConfig from "@/redux/axios.config"
import { changePassword } from "@/redux/features/teacherSlice";
require('dotenv').config();

const userApi = {
    // admin
    getAllStudent: (page: string) => {
        const url = `/student/page/${page}`;
        return axiosConfig.get(url);
    },

    deleteStudent: (id: string) => {
        const url = `/student/${id}`;
        return axiosConfig.delete(url);
    },

    getAllTeacher: (filterstring: string, page: string) => {
        const url = `/teacher/page/${page}?${filterstring}`;
        return axiosConfig.get(url);
    },

    getAllReviewTeacher: (page: number) => {
        const url = `/reviews`;
        return axiosConfig.get(url, {
            baseURL: `${process.env.NEXT_PUBLIC_BASE_URL_LOCAL}`
        });
    },

    ////
    getProfileTeacher: (id_teacher: string) => {
        const url = `/teacher/get-profile-teacher/${id_teacher}`;
        return axiosConfig.get(url);
    },
    getTeacherById: (id_teacher: string) => {
        const url = `/teacher/get-teacher-by-id/${id_teacher}`;
        return axiosConfig.get(url);
    },
    getReviewOfTeacher: (id: string, page: number) => {
        const url = `/reviews/teacher/${id}/page/${page}`;
        return axiosConfig.get(url, {
            baseURL: `${process.env.NEXT_PUBLIC_BASE_URL_LOCAL}`
        });
    },
    createReviewTeacher: async (data: object) => {
        const url = `/reviews`;

        await axiosConfig.post(url, data, {
            baseURL: `${process.env.NEXT_PUBLIC_BASE_URL_LOCAL}`
        });
        return
    },

    changePasswordTeacher: async (data: object) => {
        const url = `/teacher/change-password`;

        await axiosConfig.put(url, data);
        return
    },

    updateProFileTeacher: async (id_teacher: string, data: object) => {
        const url = `/teacher/update/${id_teacher}`;
        await axiosConfig.put(url, data);
        return
    },

    changePasswordStudent: async (data: object) => {
        const url = `/teacher/change-password`;

        await axiosConfig.put(url, data);
        return
    },

    updateProFileStudent: async (id_student: string, data: object) => {
        const url = `/student/update/${id_student}`;
        await axiosConfig.put(url, data);
        return
    },

    searchUser: (query: string) => {
        const url = `/commons/search?query=${query}`;
        return axiosConfig.get(url);
    },
}

export default userApi;