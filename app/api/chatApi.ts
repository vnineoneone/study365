import axiosConfig from "@/redux/axios.config"

const chatApi = {
    getMessageOfGroup: (id_group: string, lastMessage: string) => {
        const url = lastMessage === "" ? `/messages/group/${id_group}` : `/messages/group/${id_group}?lastMessage=${lastMessage}`;
        return axiosConfig.get(url);
    },

    getGroupOfUser: () => {
        const url = `/groups/list`;
        return axiosConfig.get(url);
    },

    getGroup: (id_group: string) => {
        const url = `/groups/${id_group}`;
        return axiosConfig.get(url);
    },

    createMessage: async (data: object) => {
        const url = `/messages`;

        return await axiosConfig.post(url, data);

    },
    createGroup: async (data: object) => {
        const url = `/groups`;

        return await axiosConfig.post(url, data);
    },
    updateGroup: async (data: object, id_group: string) => {
        const url = `/groups/${id_group}/update`;

        return await axiosConfig.put(url, data);
    },
    leaveGroup: async (id: string) => {
        const url = `/groups/${id}/leave-group`;

        return await axiosConfig.put(url);
    },
    deleteGroup: async (id: string) => {
        const url = `/groups/${id}`;

        return await axiosConfig.delete(url);
    },
    addUsertoGroup: async (id: string, data: object) => {
        const url = `/groups/${id}/add-new-users`;

        return await axiosConfig.put(url, data);
    },
    deleteUserGroup: async (id: string, data: object) => {
        const url = `/groups/${id}/remove-users`;

        return await axiosConfig.put(url, data);
    },

}

export default chatApi;