import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ProductTour, UserInfoResponse, notificationListResponse } from '@customtypes/general';

interface ApiState {
    user: UserInfoResponse | null;
    notifications: notificationListResponse | null;
}

const initialState: ApiState = {
    user: null,
    notifications: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<Partial<ApiState>>) => {
            state = { ...state, ...action.payload };
            return state;
        },
        setNotifications: (state, action: PayloadAction<Partial<ApiState>>) => {
            state = { ...state, ...action.payload };
            return state;
        },
        resetNotificationCounter: state => {
            if (state.notifications) {
                state.notifications.count = 0;
            }
        },
        alterProductTour: (state, action: PayloadAction<ProductTour>) => {
            if (state.user) {
                state.user.productTour = action.payload;
            }
        },
        resetUser: state => {
            state = initialState;
            return state;
        },
    },
});

export const {
    setUserInfo,
    setNotifications,
    resetNotificationCounter,
    resetUser,
    alterProductTour,
} = userSlice.actions;

export default userSlice.reducer;
