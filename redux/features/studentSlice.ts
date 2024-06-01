import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosConfig, { setAuthToken } from '../axios.config';

type UploadAvatarData = {
    file: File,
    id: number
}

type StudentData = {
    
}

export const updateStudent = createAsyncThunk('/student/updateStudent', async (student: any, thunkAPI) => {
    try {
        const response = await axiosConfig.put('/student/:studentId', student);

        if (response.status !== 201) return thunkAPI.rejectWithValue(response.data.message);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const uploadAvatar = createAsyncThunk('/student/upload-avatar', async (data: UploadAvatarData, thunkAPI) => {
    try {
        const formData = new FormData();

        formData.append('avatar', data.file);

        const studentId = data.id;

        const response = await axiosConfig.post(`/student/upload-avatar/${studentId}`, formData);

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const changePassword = createAsyncThunk('/student/change-password', async (data: any, thunkAPI) => {
    try {
        const response = await axiosConfig.put('/student/change-password', data);
        
        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const forgotPassword = createAsyncThunk('/student/forgot-password', async (email: string, thunkAPI) => {
    try {
        const response = await axiosConfig.post('/student/forgot-password', { email });
        
        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const resetPassword = createAsyncThunk('/student/reset-password', async (data: any, thunkAPI) => {
    try {
        const resetToken = [...data.resetToken];
        delete data.resetToken;
        const response = await axiosConfig.put(`/student/reset-password/${resetToken}`, data);
        
        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const setStudent = createAsyncThunk('/student', async (data, thunkAPI) => {
    try {
        
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

export const student = createSlice({
    name: 'student',
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
            .addCase(updateStudent.pending, (state, action) => {
                state.isLoading = true;
                console.log("Pending");
            })
            .addCase(updateStudent.rejected, (state, action) => {
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
            .addCase(updateStudent.fulfilled, (state, action) => {
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
                state.user.avatar = action.payload?.avatar;
                console.log(action.payload);
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

export const { reset } = student.actions;
export default student.reducer;