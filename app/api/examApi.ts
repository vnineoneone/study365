import axiosConfig from "@/redux/axios.config"
require('dotenv').config();

const examApi = {
    getAllExamByTeacher: (id_teacher: string, page: string) => {
        const url = `/exams/teacher/${id_teacher}/page/${page}?exam=true`;
        return axiosConfig.get(url);
    },
    getAllQuizByTeacher: (id_teacher: string, page: string) => {
        const url = `/exams/teacher/${id_teacher}/page/${page}?exam=false`;
        return axiosConfig.get(url);
    },

    getAllReviewExamByTeacher: (id_teacher: string) => {
        const url = `/reviews/teacher/${id_teacher}`;
        return axiosConfig.get(url, {
            baseURL: `${process.env.NEXT_PUBLIC_BASE_URL_EXAM_LOCAL}`
        });
    },
    getAllReviewComboByTeacher: (id_teacher: string) => {
        const url = `/reviews/combo/teacher/${id_teacher}`;
        return axiosConfig.get(url, {
            baseURL: `${process.env.NEXT_PUBLIC_BASE_URL_EXAM_LOCAL}`
        });
    },

    createReview: async (data: object) => {
        const url = `/reviews`;

        await axiosConfig.post(url, data, {
            baseURL: `${process.env.NEXT_PUBLIC_BASE_URL_EXAM_LOCAL}`
        });
        return
    },

    getReviewExam: (id_exam: string) => {
        const url = `/reviews/exam/${id_exam}/page/1`;
        return axiosConfig.get(url, {
            baseURL: `${process.env.NEXT_PUBLIC_BASE_URL_EXAM_LOCAL}`
        });
    },

    getReviewCombo: (id_combo: string, page: number) => {
        const url = `/reviews/combo/${id_combo}/page/${page}`;
        return axiosConfig.get(url, {
            baseURL: `${process.env.NEXT_PUBLIC_BASE_URL_EXAM_LOCAL}`
        });
    },

    get: async (id: string) => {
        const url = `/exams/full/${id}`;
        return await axiosConfig.get(url);
    },

    searchExam: async (query: string) => {
        const url = `/exams/search/page/1?query=${query}`;
        return await axiosConfig.get(url);
    },

    getAssigmnentByExamId: async (id_student: string, id_exam: string, page: number) => {
        const url = `/assignments/student/${id_student}/exam/${id_exam}/page/${page}`;
        return await axiosConfig.get(url);
    },

    getAssigmnentOfQuizzByTeacherId: async (id_teacher: string, page: number, filterString: string) => {
        const url = `/assignments/teacher/${id_teacher}/page/${page}?${filterString}exam=false`;
        return await axiosConfig.get(url);
    },
    getAssigmnentOfExamByTeacherId: async (id_teacher: string, page: number, filterString: string) => {
        const url = `/assignments/teacher/${id_teacher}/page/${page}?${filterString}exam=true`;
        return await axiosConfig.get(url);
    },

    getDetailAssigmnent: async (id_assignment: string) => {
        const url = `/assignments/full/${id_assignment}`;
        return await axiosConfig.get(url);
    },

    commentAssigmnent: async (id_assignment: string, data: object) => {
        const url = `/assignments/${id_assignment}/comments`;
        return await axiosConfig.put(url, data);
    },

    createKnowledge: async (data: object) => {
        const url = `/knowledges`;
        return await axiosConfig.post(url, data);
    },

    createComboExam: async (data: object) => {
        const url = `/combos`;
        return await axiosConfig.post(url, data);
    },

    updateComboExam: async (data: object, id_combo: string) => {
        const url = `/combos/${id_combo}`;
        return await axiosConfig.put(url, data);
    },

    deleteComboExam: async (id_combo: string) => {
        const url = `/combos/${id_combo}`;
        return await axiosConfig.delete(url);
    },

    getComboExam: async (id_teacher: string, page: string) => {
        const url = `/combos/teacher/${id_teacher}/page/${page}`;
        return await axiosConfig.get(url);
    },

    getComboExamOfStudent: async (id_student: string, page: string) => {
        const url = `/combos/student/${id_student}/page/${page}`;
        return await axiosConfig.get(url);
    },
    getAllCombo: async (page: string, filterString: string) => {
        const url = `/combos/page/${page}?${filterString}`;
        return await axiosConfig.get(url);
    },

    getComboDetail: async (id_combo: string) => {
        const url = `/combos/${id_combo}`;
        return await axiosConfig.get(url);
    },

    update: (id: string, data: object) => {
        const url = `/exams/${id}`;
        return axiosConfig.put(url, data);
    },

    create: async (data: object) => {
        const url = `/exams`;
        return axiosConfig.post(url, data);

    },
    submitExam: async (data: object) => {
        const url = `/assignments`;
        return axiosConfig.post(url, data);

    },

    delete: (id: string) => {
        const url = `/exams/${id}`;
        return axiosConfig.delete(url);
    },
    getKnowledge: async (filterString: string) => {
        const url = `/knowledges/filter?${filterString}`;
        return await axiosConfig.get(url);
    },
    getAllKnowledge: async () => {
        const url = `/knowledges`;
        return await axiosConfig.get(url);
    },


}

export default examApi;
