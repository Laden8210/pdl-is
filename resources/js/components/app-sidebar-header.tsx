import { Breadcrumbs } from '@/components/breadcrumbs';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Personnel } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserCheck,
  FileText,
  Gavel,
  Stethoscope,
  Eye,
  Building,
  Search,
  Clock,
  ArrowRight,
  FileCheck,
  Scale,
  Heart,
  EyeIcon,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface SystemNotification {
  id: number;
  title: string;
  message: string;
  notification_type?: string;
  action_url?: string;
  personnel_id: number;
  pdl_id: number | null;
  created_at: string;
  read_at: string | null;
  is_read: boolean;
  sender?: Personnel;
  pdl?: {
    id: number;
    name: string;
  };
}

interface SearchResult {
  type: string;
  id: number;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  icon: string;
  category: string;
}

interface SearchResponse {
  results: Record<string, SearchResult[]>;
  total: number;
  query: string;
  categories: string[];
  error?: string;
}

interface AppSidebarHeaderProps {
  breadcrumbs?: BreadcrumbItemType[];
  notifications?: SystemNotification[];
  auth: PageProps['auth'];
}

export function AppSidebarHeader({ breadcrumbs = [], notifications = [], auth }: AppSidebarHeaderProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<SystemNotification | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<SystemNotification[]>(notifications);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update local notifications when props change
  useEffect(() => {
    setLocalNotifications(notifications);
    setIsRefreshing(false); // Stop refreshing indicator when new data arrives
  }, [notifications]);

  // Sort notifications: unread first, then by creation date
  const sortedNotifications = [...localNotifications].sort((a, b) => {
    if (a.is_read !== b.is_read) {
      return a.is_read ? 1 : -1; // Unread first
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const unreadCount = sortedNotifications.filter(n => !n.is_read).length;
  const displayedNotifications = showAll ? sortedNotifications : sortedNotifications.slice(0, 5);

  const getPdlManagementUrl = (pdlId: number) => {
    // Get current user's role from the auth data
    const userRole = auth?.user?.position;

    switch (userRole) {
      case 'admin':
        return `/admin/pdl-management/personal-information?pdl_id=${pdlId}`;
      case 'record-officer':
        return `/record-officer/pdl-management/personal-information?pdl_id=${pdlId}`;
      case 'law-enforcement':
        return `/law-enforcement/pdl-management/personal-information?pdl_id=${pdlId}`;
      default:
        return `/admin/pdl-management/personal-information?pdl_id=${pdlId}`;
    }
  };

  const handleNotificationClick = (notification: SystemNotification) => {
    setIsPopoverOpen(false);

    // Mark as read first if not already read
    if (!notification.is_read) {
      // Mark as read locally immediately for better UX
      setLocalNotifications(prev =>
        prev.map(n =>
          n.id === notification.id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );

      router.post(`/notifications/${notification.id}/read`, {}, {
        preserveScroll: true,
        onSuccess: () => {
          // Refresh notifications to get updated data
          setIsRefreshing(true);
          router.reload({ only: ['notifications'] });

          // Always open in modal instead of redirecting
          setSelectedNotification(notification);
        },
        onError: () => {
          // Revert local state if server request fails
          setLocalNotifications(prev =>
            prev.map(n =>
              n.id === notification.id
                ? { ...n, is_read: false, read_at: null }
                : n
            )
          );

          // Still open modal even if marking as read fails
          setSelectedNotification(notification);
        }
      });
    } else {
      // Already read, just open modal
      setSelectedNotification(notification);
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

  const handleRefreshNotifications = () => {
    setIsRefreshing(true);
    router.reload({ only: ['notifications'] });
  };

  // Search functions
  const performSearch = async (query: string) => {
    if (!query || query.length < 1) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching for:', query);
      const response = await fetch(`/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Search results:', data);
      setSearchResults(data);

      // Add to recent searches
      if (data.total > 0) {
        const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(newRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({
        results: {},
        total: 0,
        query: query,
        categories: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Always keep dropdown open when there's text or when user is typing
    if (query.length > 0) {
      setIsSearchDropdownOpen(true);
    }

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search (only if query is long enough)
    if (query.length >= 1) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    } else {
      setSearchResults(null);
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    setIsSearchDropdownOpen(false);
    setSearchQuery('');
    router.visit(result.url);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery) {
      e.preventDefault();
      performSearch(searchQuery);
    } else if (e.key === 'Escape') {
      setIsSearchDropdownOpen(false);
      setSearchQuery('');
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
    // Prevent any other key events from interfering with input
    e.stopPropagation();
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      users: Users,
      'user-check': UserCheck,
      'file-text': FileText,
      gavel: Gavel,
      stethoscope: Stethoscope,
      eye: Eye,
      building: Building,
    };
    const IconComponent = icons[iconName] || Search;
    return <IconComponent className="h-4 w-4" />;
  };

  const getNotificationIcon = (notificationType: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      pdl_created: Users,
      pdl_updated: UserCheck,
      pdl_transferred: ArrowRight,
      case_created: FileText,
      case_updated: FileCheck,
      court_order_created: Gavel,
      court_order_updated: Scale,
      medical_record_created: Stethoscope,
      medical_record_updated: Heart,
      physical_characteristic_created: Eye,
      physical_characteristic_updated: EyeIcon,
      cell_assigned: Building,
      time_allowance_updated: Clock,
      jail_event_created: AlertCircle,
      verification_status_changed: CheckCircle,
    };
    return icons[notificationType] || Search;
  };

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing recent searches:', error);
      }
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />

      </div>
      <div className="ml-auto flex items-center gap-4">
        {/* Search Component */}
        <div className="relative">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search PDL, cases, personnel..."
              className="w-full pl-10 pr-10"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setIsSearchDropdownOpen(true)}
              onBlur={() => {
                // Delay closing to allow clicking on results
                setTimeout(() => setIsSearchDropdownOpen(false), 200);
              }}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {isSearching && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
              )}
              {searchQuery && (
                <button
                  className="h-6 w-6 p-0 hover:bg-gray-100 rounded flex items-center justify-center"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults(null);
                    setIsSearchDropdownOpen(false);
                  }}
                >
                  <span className="text-gray-400">×</span>
                </button>
              )}
            </div>
          </div>

          {/* Simple Dropdown */}
          {isSearchDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[500px] overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h4 className="font-medium text-sm">
                  {searchResults && searchQuery.length >= 2
                    ? `Search Results for "${searchQuery}" (${searchResults.total})`
                    : 'Search'
                  }
                </h4>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {/* Loading State */}
                {isSearching && searchQuery.length >= 2 && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-3" />
                    <span className="text-sm text-gray-500">Searching...</span>
                  </div>
                )}

                {/* Search Results */}
                {!isSearching && searchResults && searchQuery.length >= 2 && (
                  <>
                    {searchResults.error ? (
                      <div className="p-6 text-center">
                        <div className="text-red-500 mb-2">
                          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="font-medium">Search Error</p>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{searchResults.error}</p>
                        <p className="text-xs text-gray-400">Please try again or contact support</p>
                      </div>
                    ) : searchResults.total > 0 ? (
                      <div className="divide-y">
                        {Object.entries(searchResults.results).map(([category, results]) => (
                          <div key={category}>
                            <div className="px-4 py-2 bg-gray-50 border-b">
                              <h5 className="font-medium text-sm text-gray-600 uppercase tracking-wide">
                                {category} ({results.length})
                              </h5>
                            </div>
                            {results.map((result) => (
                              <div
                                key={`${result.type}-${result.id}`}
                                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
                                onClick={() => handleSearchResultClick(result)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                                    {getIconComponent(result.icon)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900 truncate">
                                      {result.title}
                                    </p>
                                    <p className="text-sm text-gray-600 truncate">
                                      {result.subtitle}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {result.description}
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <ArrowRight className="h-4 w-4 text-gray-400" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="font-medium text-gray-500 mb-1">No results found</p>
                        <p className="text-sm text-gray-400">Try different keywords or check spelling</p>
                      </div>
                    )}
                  </>
                )}

                {/* Empty State */}
                {searchQuery.length === 0 && (
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Recent searches</span>
                      </div>
                      {recentSearches.length > 0 ? (
                        <div className="space-y-2">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                              onClick={() => {
                                setSearchQuery(search);
                                performSearch(search);
                              }}
                            >
                              <Clock className="h-3 w-3" />
                              <span>{search}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No recent searches</p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-600">Search suggestions:</p>
                        <div className="flex flex-wrap gap-1">
                          {['PDL', 'Case', 'Personnel', 'Court Order', 'Medical'].map((suggestion) => (
                            <span
                              key={suggestion}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200"
                              onClick={() => {
                                setSearchQuery(suggestion);
                                performSearch(suggestion);
                              }}
                            >
                              {suggestion}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium leading-none">Notifications</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{unreadCount} unread</span>
                        <span>•</span>
                        <span>{sortedNotifications.length} total</span>
                        {isRefreshing && (
                          <span className="text-blue-500">Refreshing...</span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefreshNotifications}
                        disabled={isRefreshing}
                        className="h-6 w-6 p-0"
                      >
                        <svg className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
                <ScrollArea className="h-[400px]">
                  {sortedNotifications.length > 0 ? (
                    <div className="divide-y">
                      {displayedNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 transition-all duration-200 ${
                            notification.is_read
                              ? 'bg-white hover:bg-gray-50'
                              : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500'
                          } cursor-pointer`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                  {notification.notification_type && (
                                    <div className={`p-1 rounded ${
                                      notification.is_read ? 'bg-gray-100' : 'bg-blue-100'
                                    }`}>
                                      {React.createElement(getNotificationIcon(notification.notification_type), {
                                        className: `h-3 w-3 ${notification.is_read ? 'text-gray-600' : 'text-blue-600'}`
                                      })}
                                    </div>
                                  )}
                                  <h3 className={`font-medium text-sm ${
                                    notification.is_read ? 'text-gray-900' : 'text-blue-900'
                                  }`}>
                                    {notification.title}
                                  </h3>
                                </div>
                                {notification.pdl_id && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    PDL Related
                                  </span>
                                )}
                                {!notification.is_read && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className={`text-sm line-clamp-2 ${
                                notification.is_read ? 'text-gray-600' : 'text-blue-700'
                              }`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 font-medium">
                                Click to view details →
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
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
                {sortedNotifications.length > 5 && (
                  <div className="px-4 py-2 border-t text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? 'Show Recent Only' : `Show All ${sortedNotifications.length} Notifications`}
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Notification Detail Dialog */}
          <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {selectedNotification?.notification_type && (
                    <div className={`p-2 rounded-lg ${
                      selectedNotification.is_read ? 'bg-gray-100' : 'bg-blue-100'
                    }`}>
                      {React.createElement(getNotificationIcon(selectedNotification.notification_type), {
                        className: `h-5 w-5 ${selectedNotification.is_read ? 'text-gray-600' : 'text-blue-600'}`
                      })}
                    </div>
                  )}
                  <div>
                    <DialogTitle className="text-left">{selectedNotification?.title}</DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {selectedNotification && formatTimeAgo(selectedNotification.created_at)}
                      </span>
                      {!selectedNotification?.is_read && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Main Message */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {selectedNotification?.message}
                  </div>
                </div>

                {/* Notification Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-500 text-xs uppercase tracking-wide">Created At</h4>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedNotification && formatDateTime(selectedNotification.created_at)}
                      </p>
                    </div>

                    {selectedNotification?.sender && (
                      <div>
                        <h4 className="font-medium text-gray-500 text-xs uppercase tracking-wide">From</h4>
                        <p className="text-sm text-gray-900 mt-1">
                          {selectedNotification.sender.fname} {selectedNotification.sender.lname}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedNotification?.pdl && selectedNotification?.notification_type !== 'upcoming_event' && (
                      <div>
                        <h4 className="font-medium text-gray-500 text-xs uppercase tracking-wide">Related PDL</h4>
                        <p className="text-sm text-gray-900 mt-1">{selectedNotification.pdl.name}</p>
                      </div>
                    )}

                    {selectedNotification?.notification_type && (
                      <div>
                        <h4 className="font-medium text-gray-500 text-xs uppercase tracking-wide">Type</h4>
                        <p className="text-sm text-gray-900 mt-1 capitalize">
                          {selectedNotification.notification_type.replace(/_/g, ' ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    {/* hide if the type is upcoming_event */}

                    {selectedNotification?.pdl_id && selectedNotification?.notification_type !== 'upcoming_event' && (
                      <Button
                        onClick={() => {
                          setSelectedNotification(null);
                          router.visit(getPdlManagementUrl(selectedNotification.pdl_id!));
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View PDL Details
                      </Button>
                    )}

                    {selectedNotification?.action_url && selectedNotification?.notification_type !== 'upcoming_event' && (
                      <Button
                        onClick={() => {
                          setSelectedNotification(null);
                          router.visit(selectedNotification.action_url!);
                        }}
                        variant="outline"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        View Related Page
                      </Button>
                    )}
                  </div>

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
