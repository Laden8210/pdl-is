import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserCheck,
  FileText,
  Gavel,
  Stethoscope,
  Eye,
  Building,
  Search,
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  FileCheck,
  Scale,
  Heart,
  EyeIcon,
  Home
} from 'lucide-react';

interface SearchResult {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  icon: string;
  data: any;
}

interface SearchResultsProps extends PageProps {
  query: string;
  results: Record<string, SearchResult[]>;
  totalResults: number;
  categories: string[];
}

export default function SearchResults({ query, results, totalResults, categories }: SearchResultsProps) {
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
    return <IconComponent className="h-5 w-5" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      pdl: 'bg-blue-100 text-blue-800',
      personnel: 'bg-green-100 text-green-800',
      case: 'bg-purple-100 text-purple-800',
      court_order: 'bg-orange-100 text-orange-800',
      medical_record: 'bg-red-100 text-red-800',
      physical_characteristic: 'bg-yellow-100 text-yellow-800',
      cell: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pdl: 'PDL',
      personnel: 'Personnel',
      case: 'Case',
      court_order: 'Court Order',
      medical_record: 'Medical Record',
      physical_characteristic: 'Physical Characteristic',
      cell: 'Cell',
    };
    return labels[type] || type;
  };

  return (
    <>
      <Head title={`Search Results for "${query}"`} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Search Results
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Found {totalResults} results for "<span className="font-medium">{query}</span>"
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {categories.length} categories
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {totalResults === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-6">
                No results found for "<span className="font-medium">{query}</span>".
                Try different keywords or check your spelling.
              </p>
              <Button onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(results).map(([category, categoryResults]) => (
                <div key={category}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center space-x-2">
                      {getIconComponent(categoryResults[0]?.icon || 'search')}
                      <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {categoryResults.length} results
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoryResults.map((result) => (
                      <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                {getIconComponent(result.icon)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg leading-tight">
                                  {result.title}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  {result.subtitle}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge className={getTypeColor(result.type)}>
                              {getTypeLabel(result.type)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-600 mb-4">
                            {result.description}
                          </p>

                          {/* Additional details based on type */}
                          {result.type === 'pdl' && result.data && (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>Age: {result.data.age || 'N/A'}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{result.data.city}, {result.data.province}</span>
                              </div>
                            </div>
                          )}

                          {result.type === 'personnel' && result.data && (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <User className="h-4 w-4" />
                                <span>{result.data.position}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Building className="h-4 w-4" />
                                <span>{result.data.agency}</span>
                              </div>
                            </div>
                          )}

                          {result.type === 'case' && result.data && (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <FileCheck className="h-4 w-4" />
                                <span>Status: {result.data.case_status}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {result.data.date_committed
                                    ? new Date(result.data.date_committed).toLocaleDateString()
                                    : 'No date'
                                  }
                                </span>
                              </div>
                            </div>
                          )}

                          {result.type === 'court_order' && result.data && (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Scale className="h-4 w-4" />
                                <span>{result.data.court_branch}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {result.data.order_date
                                    ? new Date(result.data.order_date).toLocaleDateString()
                                    : 'No date'
                                  }
                                </span>
                              </div>
                            </div>
                          )}

                          {result.type === 'medical_record' && result.data && (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Heart className="h-4 w-4" />
                                <span>{result.data.prognosis || 'No prognosis'}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {result.data.date
                                    ? new Date(result.data.date).toLocaleDateString()
                                    : 'No date'
                                  }
                                </span>
                              </div>
                            </div>
                          )}

                          {result.type === 'physical_characteristic' && result.data && (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <EyeIcon className="h-4 w-4" />
                                <span>Height: {result.data.height || 'N/A'}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <User className="h-4 w-4" />
                                <span>Weight: {result.data.weight || 'N/A'}</span>
                              </div>
                            </div>
                          )}

                          {result.type === 'cell' && result.data && (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Home className="h-4 w-4" />
                                <span>Capacity: {result.data.capacity}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Building className="h-4 w-4" />
                                <span>Status: {result.data.status}</span>
                              </div>
                            </div>
                          )}

                          <div className="mt-4 pt-4 border-t">
                            <Link href={result.url}>
                              <Button variant="outline" size="sm" className="w-full">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
