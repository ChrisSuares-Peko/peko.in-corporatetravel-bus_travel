import { useEffect, useState, useCallback } from 'react';

import { useAppSelector } from '@src/hooks/store';

import socket from './socket';
import { getSingleTicket } from '../api';
import { Chat, singleTicketData, singleTicketResponse } from '../types/type';

const useSocketChat = (roomId: number | null, reload: boolean) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [ticketDetails, setTicketDetails] = useState<singleTicketData>();
    const [messages, setMessages] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchInitialMessages = useCallback(async () => {
        setIsLoading(true);
        const data: singleTicketResponse | false = await getSingleTicket({
            userId: id,
            userType: role,
            ticketId: roomId,
        });
        if (data) {
            const ticketDetailData = data as singleTicketResponse;

            setTicketDetails(ticketDetailData);
        }

        if (data && 'chats' in data) {
            setMessages(data.chats);
        }
        setIsLoading(false);
    }, [id, role, roomId]);

    useEffect(() => {
        if (roomId) {
            socket.emit('join-room', roomId);
            socket.on('message', message => {
                setMessages(prevMessages => [...prevMessages, message]);
            });
        }

        return () => {};
    }, [roomId, id]);

    const sendMessage = useCallback(
        (messageData: Chat) => {
            if (socket) {
                socket.emit('user-send-message', messageData, roomId);
            }
        },
        [roomId]
    );

    useEffect(() => {
        if (roomId) {
            fetchInitialMessages();
        }
    }, [fetchInitialMessages, roomId, reload]);

    return { data: ticketDetails, isLoading, messages, sendMessage };
};

export default useSocketChat;
