export interface AuditLog {
  id: string;
  tenantId?: string;
  userId?: string;
  userEmail?: string;
  action: string;
  entityName: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  oldState?: string;
  newState?: string;
  details?: string;
  status: string;
  createdAt: string;
}
