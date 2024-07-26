import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export const registerUser = createAsyncThunk('user/register', async (userData) => {
    const response = await axios.post('http://localhost:5000/api/users/register', userData);
    return response.data;
});

export const loginUser = createAsyncThunk('user/login', async (userData) => {
    const response = await axios.post('http://localhost:5000/api/users/login', userData);
    return response.data;
});

const userSlice = createSlice({
    name: 'user',
    initialState: { user: null, loading: false, error: null },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem("loggedInUser");
            
            
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => { state.loading = true; })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem("loggedInUser", JSON.stringify(state.user));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(loginUser.pending, (state) => { state.loading = true; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem("loggedInUser", JSON.stringify(state.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
