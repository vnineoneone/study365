import axiosConfig from "@/redux/axios.config"

const categoryApi = {
    getAllByCreateTeacher: (id_teacher: string) => {
        const url = `/coupons/teacher/${id_teacher}`;
        return axiosConfig.get(url);
    },

    get: (id: number) => {
        const url = `/courses/chapters/${id}`;
        return axiosConfig.get(url);
    },

    create: (data: object) => {
        const url = `/coupons`;
        return axiosConfig.post(url, { data });
    },

    update: (data: object, id_coupon: string) => {
        const url = `/coupons/${id_coupon}`;
        return axiosConfig.put(url, { data });
    },

    delete: (id: number) => {
        const url = `/coupons/${id}`;
        return axiosConfig.delete(url);
    },
}

export default categoryApi;