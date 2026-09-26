import React from 'react';
import { Card } from '../components/ui/Card';
import { Settings } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-neutral-900" />
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">User Settings</h1>
          <p className="text-sm text-neutral-600">Account preferences and notifications</p>
        </div>
      </div>
      <Card className="border-dashed border-neutral-300 bg-white text-center py-12 text-neutral-600">
        <p className="text-base font-medium text-neutral-800">Settings Foundation Mounted</p>
      </Card>
    </div>
  );
};

