import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { downloadStageResponse } from '../types';
import { ESRProcessData, EsrStageDataResp, FisicalYearResp, Stage } from '../types/types';

export const getQuestionUsingStageID = async (payload: UserPayload & { stageId: string }) => {
    try {
        const res: SuccessGenericResponse<ESRProcessData> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/esr/questions?id=${payload.stageId}`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const submitAnswers = async (
    payload: UserPayload & { stageData: Stage & { fisicalYear: string | undefined } }
) => {
    try {
        const year = payload.stageData.fisicalYear;
        delete payload.stageData.fisicalYear;
        const resp: SuccessGenericResponse<any> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/esr/updateEsrStage/${year}`,
            payload.stageData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const submitStage1Steps = async (payload: UserPayload & { stageData: any }) => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/esr/update/stage1`,
            payload.stageData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getDataUsingFisicalYear = async (payload: UserPayload & { fisicalYear: string }) => {
    try {
        const res: SuccessGenericResponse<FisicalYearResp> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/esr/fetchByYear/${payload.fisicalYear}`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};
export const getStageData = async (
    payload: UserPayload & { fisicalYear: string; stageNo: string }
) => {
    try {
        const res: SuccessGenericResponse<EsrStageDataResp> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/esr/esrDetails?fiscalYear=${payload.fisicalYear}&stageNo=${payload.stageNo}`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const getStageDetails = async (
    payload: UserPayload & { fiscalYear: string; stageId: string }
) => {
    try {
        const resp: SuccessGenericResponse<Stage> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/esr/getStageByFiscalYear?fiscalYear=${payload.fiscalYear}&stageId=${payload.stageId}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const downloadStageDetails = async (
    payload: UserPayload & { fiscalYear: string; stageId: number }
) => {
    try {
        const resp: SuccessGenericResponse<downloadStageResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/esr/stageData/download?fiscalYear=${payload.fiscalYear}&stageId=${payload.stageId}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const createStageDataApi = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/esr/addNewEsrStage`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
