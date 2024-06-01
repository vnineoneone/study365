import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosConfig, { setAuthToken } from '../axios.config';

interface LogInData {
    email: string,
    password: string,
}

interface SignUpData {
    name: string,
    email: string,
    password: string,
    phone: string,
    address: string,
    gender: string,
    grade: number,
}

export const signup: any = createAsyncThunk('auth/register', async (user: SignUpData, thunkAPI) => {
    try {
        const response = await axiosConfig.post('auth/register', user);
        if (response.data) {
            localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
            localStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));
        }
        if (response.status !== 201) return thunkAPI.rejectWithValue(response.data.message);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const signupTeacher = createAsyncThunk('auth-teacher/register', async (user: SignUpData, thunkAPI) => {
    try {
        const response = await axiosConfig.post('auth-teacher/register', user);
        if (response.data) {
            localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
            localStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));
        }
        if (response.status !== 201) return thunkAPI.rejectWithValue(response.data.message);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const login = createAsyncThunk('auth/login', async (user: LogInData, thunkAPI) => {
    try {
        const response = await axiosConfig.post('auth/login', user);
        if (response.data) {
            localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
            localStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));
        }
        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const loginTeacher = createAsyncThunk('auth-teacher/login', async (user: LogInData, thunkAPI) => {
    try {

        const response = await axiosConfig.post('auth-teacher/login', user);
        if (response.data) {
            localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
            localStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));
        }
        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const loginAdmin = createAsyncThunk('admin/login', async (user: LogInData, thunkAPI) => {
    try {

        const response = await axiosConfig.post('admin/login', user);
        if (response.data) {
            localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
            localStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));
        }
        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const signout = createAsyncThunk('/auth/signout', async (arg, thunkAPI) => {
    console.log(2);

    try {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('persist:authReducer');
        localStorage.removeItem('persist:studentReducer');
        localStorage.removeItem('persist:root');
        return initialState;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

type InitialState = {
    isAuth: boolean,
    isAuthTeacher: boolean,
    isLoading: boolean,
    isSuccess: boolean,
    isFailed: boolean,
    message: string,
    user: UserState,
    accessToken: string,
};

type UserState = {
    cart: string;
    role: string;
    id: number,
    name: string,
    email: string,
    phone: string,
    address: string,
    avatar: string,
    gender: string,
    grade: number,
    status: boolean,
};

const initialState = {
    isAuth: false as boolean,
    isAuthTeacher: false as boolean,
    isLoading: false as boolean,
    isSuccess: false as boolean,
    isFailed: false as boolean,
    message: "" as string,
    user: {
        id: 0,
        name: "",
        email: "",
        phone: "",
        address: "",
        avatar: "",
        gender: "",
        grade: 0,
        status: true,
    } as UserState,
    accessToken: '' as string,
} as InitialState;

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isFailed = false;
            state.isSuccess = false;
            state.message = "";
        },
    },
    extraReducers(builder) {
        builder
            .addCase(signup.pending, (state) => {
                console.log("Pending");
                state.isLoading = true;
            })
            .addCase(signup.rejected, (state, action) => {
                console.log("Rejected");
                state.isLoading = false;
                state.isFailed = true;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(signup.fulfilled, (state, action) => {
                console.log('Fullfilled');
                state.isAuth = true;
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(login.pending, (state) => {
                console.log("Pending");
                state.isLoading = true;
            })
            .addCase(login.rejected, (state, action) => {
                console.log("Rejected");
                state.isLoading = false;
                state.isFailed = true;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isAuth = true;
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                console.log("Fullfiled")
            })
            .addCase(signupTeacher.pending, (state) => {
                console.log("Pending");
                state.isLoading = true;
            })
            .addCase(signupTeacher.rejected, (state, action) => {
                console.log("Rejected");
                state.isLoading = false;
                state.isFailed = true;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
                console.log(action.payload);
            })
            .addCase(signupTeacher.fulfilled, (state, action) => {
                console.log('Fullfilled');
                state.isAuth = true;
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(loginTeacher.pending, (state) => {
                console.log("Pending");
                state.isLoading = true;
            })
            .addCase(loginTeacher.rejected, (state, action) => {
                console.log("Rejected");
                state.isLoading = false;
                state.isFailed = true;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
                console.log(action.payload);
            })
            .addCase(loginTeacher.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isAuthTeacher = true;
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
            })
            .addCase(loginAdmin.pending, (state) => {
                console.log("Pending");
                state.isLoading = true;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                console.log("Rejected");
                state.isLoading = false;
                state.isFailed = true;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
                console.log(action.payload);
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isAuthTeacher = true;
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
            })
            .addCase(signout.pending, (state, action) => {
                console.log("Pending");
                state.isLoading = true;
            })
            .addCase(signout.rejected, (state, action) => {
                console.log("Rejected");
                state.isFailed = true;
                state.isLoading = false;
            })
            .addCase(signout.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isSuccess = true;
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuth = false;
                state.isAuthTeacher = false;
            })
    },
});

export const { reset } = auth.actions;
export default auth.reducer;