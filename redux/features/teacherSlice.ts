import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosConfig, { setAuthToken } from '../axios.config';

export const updateTeacher = createAsyncThunk('/teacher/updateteacher', async (teacher: any, thunkAPI) => {
    try {
        const response = await axiosConfig.put('/teacher/:teacherId', teacher);

        if (response.status !== 201) return thunkAPI.rejectWithValue(response.data.message);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const uploadAvatar = createAsyncThunk('/teacher/upload-avatar', async (file: File, thunkAPI) => {
    try {
        const formData = new FormData();

        formData.append('avatar', file);

        const response = await axiosConfig.post('/teacher/upload-avatar/:teacherId', formData);

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const changePassword = createAsyncThunk('/teacher/change-password', async (data: any, thunkAPI) => {
    try {
        const response = await axiosConfig.put('/teacher/change-password', data);
        
        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const forgotPassword = createAsyncThunk('/teacher/forgot-password', async (email: string, thunkAPI) => {
    try {
        const response = await axiosConfig.post('/teacher/forgot-password', { email });
        
        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const resetPassword = createAsyncThunk('/teacher/reset-password', async (data: any, thunkAPI) => {
    try {
        const resetToken = [...data.resetToken];
        delete data.resetToken;
        const response = await axiosConfig.put(`/teacher/reset-password/${resetToken}`, data);
        
        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

type InitialState = {
    isLoading: boolean,
    isSuccess: boolean,
    isFailed: boolean,
    message: string,
    user: UserState,
};

type UserState = {
    uid: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    address: string,
    avatar: string,
    gender: string,
    grade: number,
    status: boolean,
    resetToken: string,
};

const initialState = {
    isLoading: false as boolean,
    isSuccess: false as boolean,
    isFailed: false as boolean,
    message: "" as string,
    user: {
        uid: 0,
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        avatar: "",
        gender: "",
        grade: 0,
        status: true,
        resetToken: "",
    } as UserState,
} as InitialState;

export const teacher = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isFailed = false;
            state.isSuccess = false;
            state.message = "";
        }
    },
    extraReducers(builder) {
        builder
            .addCase(updateTeacher.pending, (state, action) => {
                state.isLoading = true;
                console.log("Pending");
            })
            .addCase(updateTeacher.rejected, (state, action) => {
                console.log("Rejected");
                state.isFailed = true;
                state.isLoading = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(updateTeacher.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isSuccess = true;
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(uploadAvatar.pending, (state, action) => {
                state.isLoading = true;
                console.log("Pending");
            })
            .addCase(uploadAvatar.rejected, (state, action) => {
                console.log("Rejected");
                state.isFailed = true;
                state.isLoading = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isSuccess = true;
                state.isLoading = false;
                state.user.avatar = action.payload;
            })
            .addCase(changePassword.pending, (state, action) => {
                state.isLoading = true;
                console.log("Pending");
            })
            .addCase(changePassword.rejected, (state, action) => {
                console.log("Rejected");
                state.isFailed = true;
                state.isLoading = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isSuccess = true;
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(forgotPassword.pending, (state, action) => {
                state.isLoading = true;
                console.log("Pending");
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                console.log("Rejected");
                state.isFailed = true;
                state.isLoading = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isSuccess = true;
                state.isLoading = false;
                state.user.resetToken = action.payload;
            })
            .addCase(resetPassword.pending, (state, action) => {
                state.isLoading = true;
                console.log("Pending");
            })
            .addCase(resetPassword.rejected, (state, action) => {
                console.log("Rejected");
                state.isFailed = true;
                state.isLoading = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isSuccess = true;
                state.isLoading = false;
                state.user = action.payload;
            })
    }
});

export const { reset } = teacher.actions;
export default teacher.reducer;