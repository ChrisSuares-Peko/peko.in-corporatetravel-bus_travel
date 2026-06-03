import { CommonFileBuffer, SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    ApiResponse,
    activeResponse,
    categoryResponse,
    categorySearch,
    getCorporateUsers,
    kycResponse,
    packagesResponse,
    updateData,
    updateStatus,
} from '../types/corporateUserTypes';
import {
    RolesResponse,
    getAllRolesResp,
    getPermissionsResp,
    getSystemUsers,
    systemUserResponse,
    updateRole,
    userUpdateBody,
} from '../types/systemUserTypes';

export const getCorporateUserData = async (payload: UserPayload & getCorporateUsers) => {
    try {
        const resp: SuccessGenericResponse<ApiResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/users/corporate-users`,
            {
                params: {
                    partnerId: payload.partnerId,
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

export const getFileBufferReportCorporate = async (payload: UserPayload & getCorporateUsers) => {
    try {
        const resp: SuccessGenericResponse<CommonFileBuffer> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/users/corporate-users/${payload.type}`,
            {
                params: {
                    partnerId: payload.partnerId,
                    searchText: payload.searchText,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getUpdateStatus = async (payload: UserPayload & updateStatus) => {
    try {
        const { corporateId } = payload;
        delete payload.corporateId;
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/others/users/status-update/${corporateId}`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const getpartner = async (payload: UserPayload & categorySearch) => {
    try {
        const resp: SuccessGenericResponse<categoryResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/users/fetch-partner?q=${payload.searchText}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const updateUserData = async (payload: UserPayload & updateData) => {
    const reqbody: updateData = {
        name: payload.name,
        contactPersonName: payload.contactPersonName,
        activity: payload.activity,
        city: payload.city,
        email: payload.email,
        kycStatus: payload.kycStatus,
        mobileNo: payload.mobileNo,
        packageId: payload.packageId,
        passwordProtection: payload.passwordProtection,
        designation: payload.designation,
        tradeLicenseNo: payload.tradeLicenseNo,
        tradeLicenseExpiry: payload.tradeLicenseExpiry,
        trnNo: payload.trnNo,
        trnExpiry: payload.trnExpiry,
    };
    try {
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/others/users/${payload.id}`,
            reqbody
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getKycStatus = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<kycResponse> = await ApiClient.get(
            `user/general/corporateUser/kycStatus`
        );
        const { data } = resp;

        return data;
    } catch (err) {
        return false;
    }
};
export const getPackages = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<packagesResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/users/fetch-packages`
        );
        const { data } = resp;

        return data;
    } catch (err) {
        return false;
    }
};

export const getSystemUserData = async (payload: UserPayload & getSystemUsers) => {
    try {
        const resp: SuccessGenericResponse<systemUserResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/users/system-users`,
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

export const getFileBufferReportSystem = async (payload: UserPayload & getSystemUsers) => {
    try {
        const resp: SuccessGenericResponse<CommonFileBuffer> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/users/system-users/${payload.type}`,
            {
                params: {
                    searchText: payload.searchText,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getRoles = async (payload: UserPayload & getSystemUsers) => {
    try {
        const resp: SuccessGenericResponse<RolesResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/roleAndPermissions`,
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

export const getFileBufferReportRoles = async (payload: UserPayload & getSystemUsers) => {
    try {
        const resp: SuccessGenericResponse<CommonFileBuffer> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/roleAndPermissions/${payload.type}`,
            {
                params: {
                    searchText: payload.searchText,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const deleteRole = async (payload: UserPayload & { id: number }) => {
    try {
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.delete(
            `${payload.userType}/${payload.userId}/others/roleAndPermissions/${payload.id}`
        );
        return resp;
    } catch (err) {
        return false;
    }
};
export const deleteUser = async (payload: UserPayload & { id: number }) => {
    try {
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.delete(
            `${payload.userType}/${payload.userId}/others/users/system-users/${payload.id}`
        );
        return resp;
    } catch (err) {
        return false;
    }
};
export const resentEmail = async (payload: UserPayload & { id: number }) => {
    try {
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/users/system-users/resend-mail/${payload.id}`
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const updateUser = async (payload: UserPayload & userUpdateBody) => {
    try {
        const { id } = payload;
        delete payload.id;
        if (payload.registeredBy === null) delete payload.registeredBy;
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/others/users/system-users/${id}`,
            payload
        );
        return resp;
    } catch (err) {
        return false;
    }
};
export const createUser = async (payload: UserPayload & userUpdateBody) => {
    try {
        delete payload.id;
        if (!payload.passwordProtection) payload.passwordProtection = true;
        if (payload.registeredBy === null) delete payload.registeredBy;
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/others/users/system-users`,
            payload
        );
        return resp;
    } catch (err) {
        return false;
    }
};
export const getAllRoles = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<getAllRolesResp> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/roleAndPermissions/list`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getPermissionsApi = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<getPermissionsResp> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/roleAndPermissions/initial-roles`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const createRoles = async (payload: UserPayload & updateRole) => {
    try {
        delete payload.id;
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/others/roleAndPermissions`,
            payload
        );
        return resp;
    } catch (err) {
        return false;
    }
};
export const updateRoles = async (payload: UserPayload & updateRole) => {
    try {
        const { id } = payload;
        delete payload.id;
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/others/roleAndPermissions/${id}`,
            payload
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const getUpdateSystemUserStatus = async (payload: UserPayload & updateStatus) => {
    try {
        const { corporateId } = payload;
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/others/users/system-users/update-status/${corporateId}`,
            { isActive: payload.isActive }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const putUpdateRolesStatus = async (payload: UserPayload & updateStatus) => {
    try {
        const { corporateId } = payload;
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/others/roleAndPermissions/update-status/${corporateId}`,
            { status: payload.isActive }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
