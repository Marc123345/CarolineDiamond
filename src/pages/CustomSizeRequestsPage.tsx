import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import { getUserCustomSizeRequests, CustomSizeRequest } from '../lib/customSizeDb';
import { Package, Clock, CheckCircle, XCircle, AlertCircle, Sparkles } from 'lucide-react';

export const CustomSizeRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CustomSizeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const data = await getUserCustomSizeRequests(user.id);
    setRequests(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const getStatusIcon = (status: CustomSizeRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'contacted':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      case 'quoted':
        return <Package className="h-5 w-5 text-purple-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: CustomSizeRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'quoted':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <Breadcrumbs items={[{ label: 'My Custom Requests' }]} />
          <div className="text-center py-16">
            <p className="text-lg text-Color-Gray-700">Please sign in to view your custom size requests.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <Breadcrumbs items={[{ label: 'My Custom Requests' }]} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-Color-Netural-Black mb-2">
            My Custom Size Requests
          </h1>
          <p className="text-Color-Gray-700">
            Track the status of your custom lab-grown diamond requests
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin h-12 w-12 border-4 border-Color-Champagne-Gold border-t-transparent rounded-full"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 bg-Color-Primary-Beige/20 rounded-2xl">
            <Sparkles className="h-16 w-16 text-Color-Champagne-Gold mx-auto mb-4" />
            <h3 className="text-xl font-bold text-Color-Netural-Black mb-2">
              No Custom Requests Yet
            </h3>
            <p className="text-Color-Gray-700 mb-6">
              Start creating your dream diamond with custom specifications
            </p>
            <a
              href="/shop"
              className="inline-block px-6 py-3 bg-Color-Champagne-Gold text-white rounded-lg font-semibold hover:bg-Color-Netural-Black transition-colors"
            >
              Browse Lab-Grown Diamonds
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white border-2 border-Color-Light-300 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <h3 className="text-lg font-bold text-Color-Netural-Black">
                        {request.desired_carat} ct {request.shape || 'Diamond'} Request
                      </h3>
                      <p className="text-sm text-Color-Gray-700">
                        Requested on {formatDate(request.created_at)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border-2 capitalize ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-Color-Gray-700 mb-1">Carat Weight</p>
                    <p className="text-sm font-semibold text-Color-Netural-Black">
                      {request.desired_carat} ct
                    </p>
                  </div>

                  {request.shape && (
                    <div>
                      <p className="text-xs text-Color-Gray-700 mb-1">Shape</p>
                      <p className="text-sm font-semibold text-Color-Netural-Black">
                        {request.shape}
                      </p>
                    </div>
                  )}

                  {request.clarity_grade && (
                    <div>
                      <p className="text-xs text-Color-Gray-700 mb-1">Clarity</p>
                      <p className="text-sm font-semibold text-Color-Netural-Black">
                        {request.clarity_grade}
                      </p>
                    </div>
                  )}

                  {request.certification && (
                    <div>
                      <p className="text-xs text-Color-Gray-700 mb-1">Certification</p>
                      <p className="text-sm font-semibold text-Color-Netural-Black">
                        {request.certification}
                      </p>
                    </div>
                  )}

                  {request.metal_color && (
                    <div>
                      <p className="text-xs text-Color-Gray-700 mb-1">Metal Color</p>
                      <p className="text-sm font-semibold text-Color-Netural-Black">
                        {request.metal_color}
                      </p>
                    </div>
                  )}

                  {(request.budget_min || request.budget_max) && (
                    <div>
                      <p className="text-xs text-Color-Gray-700 mb-1">Budget Range</p>
                      <p className="text-sm font-semibold text-Color-Netural-Black">
                        {request.budget_min && request.budget_max
                          ? `€${request.budget_min} - €${request.budget_max}`
                          : request.budget_min
                          ? `€${request.budget_min}+`
                          : `Up to €${request.budget_max}`}
                      </p>
                    </div>
                  )}
                </div>

                {request.additional_notes && (
                  <div className="bg-Color-Primary-Beige/20 p-4 rounded-lg mb-4">
                    <p className="text-xs text-Color-Gray-700 mb-1 font-semibold">Your Notes:</p>
                    <p className="text-sm text-Color-Netural-Black">{request.additional_notes}</p>
                  </div>
                )}

                {request.quote_amount && (
                  <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                    <p className="text-xs text-green-700 mb-1 font-semibold">Quote Received:</p>
                    <p className="text-2xl font-bold text-green-800">€{request.quote_amount}</p>
                    {request.quoted_at && (
                      <p className="text-xs text-green-700 mt-1">
                        Quoted on {formatDate(request.quoted_at)}
                      </p>
                    )}
                  </div>
                )}

                {request.admin_notes && (
                  <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg mt-4">
                    <p className="text-xs text-blue-700 mb-1 font-semibold">Message from our team:</p>
                    <p className="text-sm text-blue-800">{request.admin_notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
