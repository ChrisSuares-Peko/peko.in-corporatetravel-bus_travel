import { CallAgent, CallClient } from '@azure/communication-calling';
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import axios from 'axios';

import { SERVER_URL } from '@src/config-global';
// eslint-disable-next-line import/no-cycle
import { store, RootState } from '@store/store';

const endpoint: string | undefined = import.meta.env.VITE_AZURE_END_POINT_URL;

let chatClient: ChatClient | undefined;
let callClient: CallClient | undefined;
let callAgent: CallAgent | undefined;
let acsToken: string = '';

export const getChatClient = async () => {
    if (!endpoint) throw new Error('Azure Communication Services endpoint not found');
    const token = await getToken();
    if (!token) throw new Error('Token not found');
    const tokenCredential = new AzureCommunicationTokenCredential(token);
    if (!chatClient) chatClient = new ChatClient(endpoint, tokenCredential);
    return chatClient;
};

export const getCallAgent = async (companyName: string) => {
    if (!endpoint) throw new Error('Azure Communication Services endpoint not found');
    const token = await getToken();
    if (!token) throw new Error('Token not found');
    if (!callAgent) {
        callClient = new CallClient();
        const tokenCredential = new AzureCommunicationTokenCredential(token);
        const newCallAgent = await callClient.createCallAgent(tokenCredential, {
            displayName: companyName,
        });
        callAgent = newCallAgent;
    }
    return callAgent;
};

const getToken = async (): Promise<string> => {
    if (!acsToken) {
        const { token, sessionId } = (store.getState() as RootState).reducer.auth;
        const res = await axios.get(`${SERVER_URL}/user/chat`, {
            headers: {
                Authorization: `Bearer ${token}`,
                sessionid: sessionId,
            },
        });
        acsToken = res.data.data.token;
    }
    return acsToken;
};
