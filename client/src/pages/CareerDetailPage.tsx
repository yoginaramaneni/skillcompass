import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Briefcase } from 'lucide-react';

export const CareerDetailPage: React.FC = () => {
  const { careerId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Briefcase className="w-8 h-8 text-neutral-900" />
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Career Role Detail</h1>
          <p className="text-sm text-neutral-600">Role ID: {careerId}</p>
        </div>
      </div>
      <Card className="border-dashed border-neutral-300 bg-white text-center py-12 text-neutral-600">
        <p className="text-base font-medium text-neutral-800">Career Role Detail Foundation Mounted</p>
      </Card>
    </div>
  );
};

