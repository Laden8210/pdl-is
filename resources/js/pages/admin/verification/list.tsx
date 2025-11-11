'use client';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { router } from '@inertiajs/react';
import { useState } from 'react';
import VerificationCard from '@/features/verification/verification-card';
import { Pdl, Personnel, Verification } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'PDL Transfer Requests',
    href: '/admin/verification',
  },
];

export default function VerificationList() {
  const { verifications, filters, userRole } = usePage().props as unknown as {
    verifications: (Verification & {
      pdl: Pdl;
      personnel: Personnel;
    })[];
    filters: {
      search: string;
    };
    userRole: string;
  };

  console.log(verifications);

  const [searchInput, setSearchInput] = useState(filters.search || '');

  const refetchVerifications = () => {
    const baseUrl = userRole === 'admin' ? '/admin/verification' : '/record-officer/verification';
    router.get(baseUrl, { search: searchInput }, { preserveState: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="PDL Transfer Requests" />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">PDL Transfer Requests</h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <Input
                id="search"
                placeholder="Search by PDL name or reason..."
                className="w-full sm:w-64"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && refetchVerifications()}
              />
              <Button variant="outline" onClick={refetchVerifications}>
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Document cards */}
        {verifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center text-muted-foreground">
              <p className="text-lg">No verification requests found</p>
              <p className="mt-2">All verification requests will appear here</p>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {verifications.map((verification) => (
              <VerificationCard
                key={verification.verification_id}
                verification={verification}
                onUpdate={refetchVerifications}
                updateRoute={userRole === 'admin' ? 'admin.verification.update' : 'record-officer.verification.update'}
              />
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
