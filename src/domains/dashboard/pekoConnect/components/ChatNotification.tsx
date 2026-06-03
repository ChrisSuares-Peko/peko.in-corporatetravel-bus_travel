/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';

import { Avatar, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { dismissNotification } from '@src/slices/connectSlice';

const ChatNotification: React.FC = () => {
    const [api, contextHolder] = notification.useNotification();
    const { notification: newNotification, profiles } = useAppSelector(state => state.reducer.chat);

    const { acs_user_id } = useAppSelector(state => state.reducer.auth);

    const profile = profiles?.find(
        it => it.acs_user_id === newNotification?.sender?.communicationUserId
    );
    const profileImage = profile?.logo;

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (acs_user_id === newNotification?.sender?.communicationUserId) return;
        const type = newNotification?.metadata?.type;
        if (type === 'call') return;
        if (newNotification) {
            api.open({
                key: newNotification.chatId,
                message: '',
                description: (
                    <div className="flex items-center gap-4 cursor-pointer">
                        {profileImage ? (
                            <Avatar src={<img src={profileImage} alt="N/A" />} />
                        ) : (
                            <Avatar
                                style={{
                                    backgroundColor: '#fde3cf',
                                    color: '#ff7875',
                                    fontWeight: 'bolder',
                                }}
                            >
                                {profile?.name?.[0].toUpperCase()}
                            </Avatar>
                        )}
                        <div>
                            <div className="flex gap-1">
                                <p className="font-medium">
                                    {profile?.name || newNotification.senderDisplayName}
                                </p>
                            </div>
                            <p>
                                {type === 'image'
                                    ? '📷 image'
                                    : type === 'file'
                                      ? '📁 file'
                                      : newNotification?.message || 'NA'}
                            </p>
                        </div>
                    </div>
                ),
                placement: 'bottomRight',
                onClick: () => {
                    navigate(`/more-services/peko-connect?id=${newNotification.threadId}`);
                    api.destroy(newNotification.chatId);
                },
                onClose: () => {
                    dispatch(dismissNotification());
                },
            });
            dispatch(dismissNotification());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api, dispatch, newNotification]);

    return contextHolder;
};
export default ChatNotification;
