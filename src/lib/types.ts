export type ContactStatus = "Lead" | "Prospect" | "Customer" | "Inactive";
export type DealStage = "Lead" | "Qualified" | "Proposal" | "Won" | "Lost";
export type DealPriority = "Low" | "Medium" | "High";
export type ActivityType = "Note" | "Call" | "Meeting" | "Email";

export type UserRole = "ADMIN" | "MANAGER" | "SALES_REP" | "SUPPORT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string | null;
  avatarColor: string | null;
  isActive: boolean;
  lastLogin: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface RolePermissions {
  canDeleteContacts: boolean;
  canDeleteDeals: boolean;
  canExportCSV: boolean;
  canManageUsers: boolean;
  canReassignDeals: boolean;
  canViewAllRevenue: boolean;
  canTriggerRoleAgents: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  ADMIN: {
    canDeleteContacts: true,
    canDeleteDeals: true,
    canExportCSV: true,
    canManageUsers: true,
    canReassignDeals: true,
    canViewAllRevenue: true,
    canTriggerRoleAgents: true,
  },
  MANAGER: {
    canDeleteContacts: false,
    canDeleteDeals: false,
    canExportCSV: true,
    canManageUsers: false,
    canReassignDeals: true,
    canViewAllRevenue: true,
    canTriggerRoleAgents: true,
  },
  SALES_REP: {
    canDeleteContacts: false,
    canDeleteDeals: false,
    canExportCSV: false,
    canManageUsers: false,
    canReassignDeals: false,
    canViewAllRevenue: true,
    canTriggerRoleAgents: true,
  },
  SUPPORT: {
    canDeleteContacts: false,
    canDeleteDeals: false,
    canExportCSV: false,
    canManageUsers: false,
    canReassignDeals: false,
    canViewAllRevenue: false,
    canTriggerRoleAgents: false,
  },
};

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  position: string | null;
  status: ContactStatus;
  avatarColor: string | null;
  notes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  deals?: Deal[];
  activities?: Activity[];
  _count?: {
    deals: number;
    activities: number;
  };
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  priority: DealPriority;
  expectedClose: string | Date | null;
  contactId: string;
  contact?: Contact;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  content: string | null;
  contactId: string | null;
  contact?: Contact;
  dealId: string | null;
  deal?: Deal;
  createdAt: string | Date;
}

export interface DashboardStats {
  totalLeads: number;
  totalContacts: number;
  activeDealsCount: number;
  activeDealsValue: number;
  wonDealsCount: number;
  totalRevenueWon: number;
  conversionRate: number;
  pipelineStages: {
    stage: DealStage;
    label: string;
    count: number;
    value: number;
    color: string;
  }[];
  recentActivities: Activity[];
  recentDeals: Deal[];
}

