import React from 'react';
import { Card } from '../components/ui/Card';
import { User } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-neutral-900" />
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Student Profile</h1>
          <p className="text-sm text-neutral-600">Education, Experience, and Certifications</p>
        </div>
      </div>
      <Card className="border-dashed border-neutral-300 bg-white text-center py-12 text-neutral-600">
        <p className="text-base font-medium text-neutral-800">Profile Management Foundation Mounted</p>
        <p className="text-xs mt-1 text-neutral-500">Student education and skills management forms will be added in Step 2.</p>
      </Card>
    </div>
  );
};

