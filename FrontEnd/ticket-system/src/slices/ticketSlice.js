import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createTicket = createAsyncThunk('tickets/create', async (ticketData, { getState }) => {
    const { user } = getState().user;
    console.log("ticketData",ticketData)
    const response = await axios.post('http://localhost:5000/api/tickets', ticketData, {
        headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
        },
    });
    return response.data;
});

export const fetchTickets = createAsyncThunk('tickets/fetch', async (_,{ getState }) => {
    const { user } = getState().user;
    const response = await axios.get('http://localhost:5000/api/tickets',{
        headers: { Authorization: `Bearer ${user.token}` },
    });
    return response.data;
});

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: { tickets: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createTicket.pending, (state) => { state.loading = true; })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets.push(action.payload);
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchTickets.pending, (state) => { state.loading = true; })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default ticketSlice.reducer;
