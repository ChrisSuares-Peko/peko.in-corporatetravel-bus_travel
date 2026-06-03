import { PlanMode } from '.';
import { PlanType } from '../../plans/types';

export interface PlanDetailsResponse {
    _id: string;
    defaultPlan: string;
    plans: {
        [key: string]: {
            name: string;
            duration: number;
            INR: number;
            USD: number;
        };
    };
}
export interface Project {
    type: 'project';
    id: string;
    name: string;
    business_id: string;
    partner_id: string;
    plan_activated_on: number | null;
    status: string;
    sandbox: boolean;
    credit: number;
    active_plan: string;
    created_at: number;
    updated_at: number;
    plan_renewal_on: number | null;
    scheduled_subscription_changes: string;
    wa_number: string;
    wa_messaging_tier: string;
    billing_currency: string;
    timezone: string;
    subscription_started_on: number | null;
    is_whatsapp_verified: boolean;
    subscription_status: string;
    daily_template_limit: number;
    remainingQuota: number;
    mau_usage?: number; // Optional property as it only appears in some projects
}

export interface prjectInfo {
    projects: Project[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
        totalProjects: number;
    };
}

export interface GenerateURLResponse {
    embeddedSignupURL: string;
}

export interface ProjectDetailsResponse {
    projects: Project[];
}

export interface projectPayload {
    userId: number;
    userType: string;
    name: string;
    plan: PlanMode;
    duration: PlanType;
}
export interface projectPayloadWithId {
    userId: number;
    userType: string;
    id: string;
}
export interface projectPayloadWithIds {
    userId: number;
    userType: string;
}
export interface orderPayload {
    userId: number;
    userType: string;
    searchText: string;
    pageSize: number;
    page: number;
}
export interface updateWccPayload {
    userId: number;
    userType: string;
    id: string;
    amount: number;
    action: string;
}
export type ProjectBillingResponse = {
    projectId: string;
    success: boolean;
    message: string;
};
