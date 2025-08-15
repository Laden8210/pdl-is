import { Breadcrumbs } from '@/components/breadcrumbs';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Personnel } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SystemNotification {
  id: number;
  title: string;
  message: string;
  personnel_id: number;
  pdl_id: number | null;
  created_at: string;
  read_at: string | null;
  sender?: Personnel;
  pdl?: {
    id: number;
    name: string;
  };
}

interface AppSidebarHeaderProps {
  breadcrumbs?: BreadcrumbItemType[];
  notifications?: SystemNotification[];
  auth: PageProps['auth'];
}

export function AppSidebarHeader({ breadcrumbs = [], notifications = [] }: AppSidebarHeaderProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<SystemNotification | null>(null);
  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications.filter(n => !n.read_at).length;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  const handleNotificationClick = (notification: SystemNotification) => {
    setSelectedNotification(notification);
    setIsPopoverOpen(false);

    if (!notification.read_at) {
      router.post(`/notifications/${notification.id}/read`, {}, {
        preserveScroll: true,
        onSuccess: () => {
          router.reload({ only: ['notifications'] });
        }
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Input type="search" placeholder="Search..." className="w-64" aria-label="Search" />

        <div className="relative">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative rounded-full p-2 hover:bg-gray-100 focus:outline-none"
                aria-label="Notifications"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end" sideOffset={10}>
              <div className="grid gap-1">
                <div className="px-4 py-3 border-b">
                  <h4 className="font-medium leading-none">Notifications</h4>
                </div>
                <ScrollArea className="h-[400px]">
                  {notifications.length > 0 ? (
                    <div className="divide-y">
                      {displayedNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 ${notification.read_at ? 'bg-white' : 'bg-blue-50'} hover:bg-gray-50 cursor-pointer`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="font-medium text-sm">{notification.title}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                          </div>
                          {(notification.sender || notification.pdl) && (
                            <div className="mt-2 flex gap-2 text-xs text-gray-500">
                              {notification.sender && (
                                <span>From: {notification.sender.fname} {notification.sender.lname}</span>
                              )}
                              {notification.pdl && (
                                <span>• PDL: {notification.pdl.name}</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  )}
                </ScrollArea>
                {notifications.length > 5 && (
                  <div className="px-4 py-2 border-t text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? 'Show Less' : `Show All (${notifications.length})`}
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Notification Detail Dialog */}
          <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedNotification?.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="text-sm text-gray-600 whitespace-pre-line">
                  {selectedNotification?.message}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-500">Created At</h4>
                    <p>{selectedNotification && formatDateTime(selectedNotification.created_at)}</p>
                  </div>

                  {selectedNotification?.sender && (
                    <div>
                      <h4 className="font-medium text-gray-500">From</h4>
                      <p>{selectedNotification.sender.fname} {selectedNotification.sender.lname}</p>
                    </div>
                  )}

                  {selectedNotification?.pdl && (
                    <div className="col-span-2">
                      <h4 className="font-medium text-gray-500">Related PDL</h4>
                      <p>{selectedNotification.pdl.name}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedNotification(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
