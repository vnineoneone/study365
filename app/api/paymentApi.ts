import axiosConfig from "@/redux/axios.config"

const paymentApi = {
    getPayment: (amount: string) => {
        const url = `/payment/pay`;
        return axiosConfig.post(url, {
            amount: amount,
            orderInfo: 'Thanh toán'
        });
    },
    addToCart: (id: any, type: string) => {
        const url = `/cart/student`;
        const formData = {
            data: { [`${type}`]: id }
        }
        return axiosConfig.post(url, formData);
    },
    deleteCart: (data: any) => {
        const url = `/cart/student`;
        return axiosConfig.delete(url, { data });
    },
    getCartOfStudent: () => {
        const url = `/cart/student`;
        return axiosConfig.get(url);
    },
    getTransactionOfTeacher: (id_teacher: string) => {
        const url = `/payment/transactions/teacher/${id_teacher}/page/1`;
        return axiosConfig.get(url);
    },
    sendInfoTransaction: (data: object) => {
        const url = `/payment/receive-ipn`;
        return axiosConfig.post(url, data);
    },

}

export default paymentApi;