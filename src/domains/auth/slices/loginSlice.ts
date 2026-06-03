import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface LoginState {
    token: string;
    refreshToken: string;
    sessionId: string;
    isAuthenticated?: boolean;
    role: string;
    id: number;
    username: string;
    roleName: string;
    redirectUrl: string;
    packageName: string;
    acs_user_id: string;
    corporateId: number;
    subCorporateId?: number;
}

// Prototype: initialState seeds a mock authenticated corporate user so the
// app opens directly on the dashboard without a backend login flow.
const initialState: LoginState = {
    token: 'mock-token',
    refreshToken: 'mock-refresh-token',
    sessionId: 'mock-session',
    isAuthenticated: true,
    role: 'corporate',
    id: 1,
    username: 'demo@peko.one',
    roleName: 'corporate',
    redirectUrl: '',
    packageName: 'Business',
    acs_user_id: '',
    corporateId: 1,
    subCorporateId: 0,
};

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<Partial<LoginState>>) => {
            state = { ...state, ...action.payload };
            return state;
        },
        setRedirectUrl: (state, action: PayloadAction<string>) => {
            state.redirectUrl = action.payload;
            return state;
        },
        setLogout: state => {
            state = initialState;
            return state;
        },
    },
});

export const { loginSuccess, setLogout, setRedirectUrl } = loginSlice.actions;

export default loginSlice.reducer;
