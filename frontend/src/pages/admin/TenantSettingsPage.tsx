import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const TenantSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Tenant Configuration</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage fiscal calendar, base currency, and company profile.</p>
      </div>

      <Card title="General Organization Profile">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tenant Name" defaultValue="CoreERP Global HQ" />
            <Input label="Subdomain" defaultValue="hq.coreerp.com" disabled />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Base Currency" defaultValue="USD" />
            <Input label="Fiscal Year Start Month" defaultValue="January (1)" />
          </div>
          <Button type="button">Save Changes</Button>
        </form>
      </Card>
    </div>
  );
};
