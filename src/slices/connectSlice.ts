import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Chat, ChatState } from '@customtypes/general';

// eslint-disable-next-line import/no-cycle
import { fetchChats } from './thunks/fetchChats';
import { fetchProfiles } from './thunks/fetchProfiles';
import { getRealtimeUpdates } from './thunks/getRealtimeUpdates';
import { updateLastMessage } from './thunks/updateLastMessage';
import { updateNotifications } from './thunks/updateNotifications';

const initialState: ChatState = {
    chats: [],
    profiles: [],
    isLoading: false,
    error: null,
    status: 'idle',
    unreadChats: 0,
    notification: null,
    notifications: [],
    acsUserId: '',
    page: 'chat',
    mode: '',
    pendingRequests: 0,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChats(state, action) {
            state.chats = action.payload;
        },
        dismissNotification(state) {
            state.notification = null;
        },
        dismissAllNotifications(state) {
            state.notifications = [];
        },
        setAcsUserId: (state, action: PayloadAction<string>) => {
            state.acsUserId = action.payload;
        },
        setPage: (state, action: PayloadAction<string>) => {
            state.page = action.payload;
        },
        setMode: (state, action: PayloadAction<string>) => {
            state.mode = action.payload;
        },
        markChatAsRead(state, action: PayloadAction<string>) {
            const chatIndex = state.chats.findIndex(chat => chat.threadId === action.payload);
            if (chatIndex >= 0) {
                state.chats[chatIndex].unreadCount = 0;
            }
            state.unreadChats = state.chats.reduce(
                (acc, chat) => acc + (chat.unreadCount ? 1 : 0),
                0
            );
        },
        markAllChatsAsRead(state) {
            state.chats.forEach(chat => {
                chat.unreadCount = 0;
            });
            state.unreadChats = 0;
        },
        setPendingRequests: (state, action: PayloadAction<number>) => {
            state.pendingRequests = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchChats.pending, state => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchChats.fulfilled, (state, action) => {
            const { chats } = action.payload;
            state.chats = chats as Chat[];
            state.unreadChats = action.payload.unreadChats as any;
            state.isLoading = false;
        });
        builder.addCase(fetchChats.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        });
        builder.addCase(updateNotifications.fulfilled, (state, action: PayloadAction<any>) => {
            const updatedChat = action.payload;
            if (!updatedChat) return;
            state.notifications = updatedChat;
        });
        builder.addCase(fetchProfiles.fulfilled, (state, action) => {
            state.profiles = action.payload;
        });
        builder.addCase(updateLastMessage.fulfilled, (state, action) => {
            state.chats = action.payload as any;
        });
        builder.addCase(getRealtimeUpdates.fulfilled, (state, action) => {
            if (action.payload.updatedChats) {
                state.chats = action.payload.updatedChats;
            }
            if (action.payload.unreadCount === 1) state.unreadChats += 1;
            state.notification = action.payload.message;
        });
    },
});

export const {
    setChats,
    dismissNotification,
    markChatAsRead,
    markAllChatsAsRead,
    dismissAllNotifications,
    setAcsUserId,
    setPage,
    setMode,
    setPendingRequests,
} = chatSlice.actions;

export default chatSlice.reducer;
