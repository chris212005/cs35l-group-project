import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
    name: 'user',
    initialState: { 
        user: null, 
        allUsers: [],
        allCharts: [] 
    },
    reducers: {
        setUser: (state, action) => { state.user = action.payload; },
        setAllUsers: (state, action) => { state.allUsers = action. payload; },
        setAllChats: (state, action) => { state.allCharts = action.payload; }
    }
});

export const { setUser, setAllUsers, setAllChats } = usersSlice.actions;
export default usersSlice.reducer;