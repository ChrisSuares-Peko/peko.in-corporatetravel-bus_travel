import { CommonFileBuffer, SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { UserPayload } from '../../accounts/types/SelfTransferTypes';
import { getSystemUsers, Partner } from '../types/systemUserTypes';

export const getPartners = async (payload: UserPayload & getSystemUsers) => {
    try {
        const resp: SuccessGenericResponse<Partner> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/partner`,
            {
                params: {
                    page: payload.page,
                    itemsPerPage: payload.itemsPerPage,
                    searchText: payload.searchText,
                    sort: payload.sort,
                    sortField: payload.sortField,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const putUpdatePartnerStatus = async (payload: any) => {
    try {
        const res: any = await ApiClient.put(
            `${payload.userType}/${payload.userId}/others/partner/udpateStatus/${payload.partnerId}`,
            {
                isActive: payload.isActive,
            }
        );
        const { data } = res;
        return data;
    } catch (err) {
        return false;
    }
};

export const putUpdatePartner = async (payload: any) => {
    try {
        const body = {
            name: payload.name,
            portalUrl: payload.portalUrl,
            isActive: payload.isActive,
        };
        const res: any = await ApiClient.put(
            `${payload.userType}/${payload.userId}/others/partner/${payload.id}`,
            body
        );
        return res;
    } catch (err) {
        return false;
    }
};

export const postCreatePartner = async (payload: any) => {
    try {
        const body = {
            name: payload.name,
            portalUrl: payload.portalUrl,
            isActive: payload.isActive,
        };
        const res: any = await ApiClient.post(
            `${payload.userType}/${payload.userId}/others/partner/`,
            body
        );
        return res;
    } catch (err) {
        return false;
    }
};

export const downloadPartnerReport = async (payload: any) => {
    try {
        const resp: SuccessGenericResponse<CommonFileBuffer> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/partner/${payload.type}`,
            {
                params: {
                    searchText: payload.searchText,
                    sort: payload.sort,
                    sortField: payload.sortField,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (error) {
        return false;
    }
};
