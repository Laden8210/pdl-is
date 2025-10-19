import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    userType?: string;
    children?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface PageProps extends InertiaPageProps {
    auth: {
        user: User | null;
    };
    errors: Record<string, string>;
    success?: string;
}

export type Personnel = {
    id: number;
    fname: string;
    mname: string | null;
    lname: string;
    contactnum: string;
    avatar: string | null;
    username: string;
    password: string;
    position: string;
    agency: string;
};

export type CellAssignment = {
    assignment_id: number;
    cell_number: string;
    cell_id: number;
    pdl_id: number;
    pdl_name: string;
    assigned_date: string;
};

// types/index.ts
export interface Cells {
    cell_id: number;
    cell_name: string;
    capacity: number;
    gender: 'male' | 'female';
    description?: string | null;
    cell_type?: string | null;
    status: string;
    created_at?: string;
    updated_at?: string;
    assignments?: CellAssignment[];
    assignments_count?: number;
}

export interface Pdl {
    id: number;
    name: string;
    fname: string;
    lname: string;
    alias?: string | null;
    status?: string | null;
    birthdate: string;
    age: number;
    gender?: string | null;
    ethnic_group?: string | null;
    civil_status?: string | null;
    brgy?: string | null;
    city?: string | null;
    province?: string | null;
    mugshot_path?: string | null;
    mugshot_original_filename?: string | null;
    personnel_id?: number | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    physical_characteristics?: PhysicalCharacteristic[];
    court_orders?: CourtOrder[];
    medical_records?: MedicalRecord[];
    cases?: CaseInformation[];
    personnel?: Personnel;
    verifications?: Verification[];
    case_no: string;
    crime_committed: string;
    date_of_birth: string;
    date_committed: string;
    no_of_cases: number;
}

export interface CellAssignment {
    assignment_id: number;
    cell_id: number;
    pdl_id: number;
    created_at: string;
    updated_at?: string;
    cell?: Cells;
    pdl?: Pdl;
}

export type CourtOrder = {
    court_order_id: number;
    court_order_number: string;
    order_type: string;
    order_date: string;
    received_date: string;
    remarks: string;
    document_type: string;
    document_path: string;
    court_branch: string;
    pdl_id: number;
    pdl?: Pdl;
};

export interface PhysicalCharacteristic {
    characteristic_id: number;
    pdl_id: number;
    height: number;
    weight: number;
    build: string;
    complexion: string;
    hair_color: string;
    eye_color: string;
    identification_marks: string;
    mark_location: string;
    remark: string | null;
    created_at?: string;
    updated_at?: string;
    pc_remark: string;
    pdl?: {
        fname: string;
        lname: string;
        agency: string;
        id: number;
    };
}

export interface Verification {
    verification_id: number;
    pdl_id: number;
    personnel_id: number;
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
    created_at: string;
    updated_at: string;
    pdl?: Pdl;
    personnel?: Personnel;
}

export interface Agency {
    id: number;
    agency_name: string;
}

export interface Court {
    court_id: number;
    branch_code: string;
    branch: string;
    station: string;
    court_type: string;
    location: string;
    created_at: string;
    updated_at: string;
    added_by: string;
    added_at: string;
}


export interface RequestLog {
    id: number;
    method: string;
    url: string;
    status_code: number;
    request_headers: any;
    request_body: any;
    response_headers: any;
    response_body: any;
    success_message: string | null;
    error_message: string | null;
    ip_address: string;
    user_agent: string;
    user_id: number | null;
    user_name: string | null;
    user_email?: string | null;
    duration: number;
    created_at: string;
    updated_at: string;
}

export interface RequestLogsPageProps {
    request_logs: {
        data: RequestLog[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        method?: string;
        status?: string;
        user_id?: string;
    };
}

export interface RequestLogsTableProps {
    logs: RequestLogsPageProps['request_logs'];
    filters: RequestLogsPageProps['filters'];
}
