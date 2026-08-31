export interface UserProfile {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  departmentId?: string;
  departmentName?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'SUSPENDED';
  isSuperAdmin: boolean;
  isEmailVerified: boolean;
  roles: string[];
  permissions?: string[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: string;
  tenantId: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  requiresMfa: boolean;
}

export interface TenantInfo {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  subscriptionPlan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'UNLIMITED';
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED' | 'CANCELLED';
  currency: string;
  fiscalYearStartMonth: number;
  timeZone: string;
  taxIdentifier?: string;
  createdAt: string;
}
