/* eslint-disable import/no-cycle */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@store/store';

export const updateNotifications = createAsyncThunk(
    'notification/update',
    async (newMessage: any, { getState }) => {
        if (!newMessage) throw new Error('Invalid data');
        const { notifications } = (getState() as RootState).reducer.chat;
        const updatedChat = [newMessage, ...notifications];
        return updatedChat;
    }
);
