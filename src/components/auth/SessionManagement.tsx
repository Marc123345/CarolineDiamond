import React, { useEffect, useState } from 'react';
import { Monitor, Smartphone, Tablet, MapPin, Clock, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { terminateSession, AuthSession } from '../../lib/authDb';

export const SessionManagement: React.FC = () => {
  const { user, sessions: authSessions, refreshSessions, terminateOtherSessions } = useAuth();
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSessions(authSessions);
  }, [authSessions]);

  if (!user) return null;

  const handleTerminateSession = async (sessionId: string) => {
    setLoading(true);
    const success = await terminateSession(sessionId);
    if (success) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      await refreshSessions();
    }
    setLoading(false);
  };

  const handleTerminateAll = async () => {
    if (!confirm('Are you sure you want to sign out from all other devices?')) {
      return;
    }

    setLoading(true);
    const success = await terminateOtherSessions();
    if (success) {
      await refreshSessions();
    }
    setLoading(false);
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getLoginMethodBadge = (method: string) => {
    const badges = {
      password: { label: 'Password', color: 'bg-blue-100 text-blue-800' },
      magic_link: { label: 'Magic Link', color: 'bg-purple-100 text-purple-800' },
      social: { label: 'Social', color: 'bg-green-100 text-green-800' },
    };

    const badge = badges[method as keyof typeof badges] || badges.password;

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-Color-Netural-Black">Active Sessions</h3>
          <p className="text-sm text-Color-Gray-700 mt-1">
            Manage your active sessions across all devices
          </p>
        </div>
        {sessions.length > 1 && (
          <button
            onClick={handleTerminateAll}
            disabled={loading}
            className="px-4 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            Sign Out All Others
          </button>
        )}
      </div>

      {/* Security Notice */}
      {sessions.length > 3 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-900 mb-1">
              Multiple Active Sessions Detected
            </h4>
            <p className="text-sm text-amber-800">
              You have {sessions.length} active sessions. If you don't recognize any of these, please sign out from all devices and change your password.
            </p>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.length === 0 && (
          <div className="text-center py-8 text-Color-Gray-700">
            <Monitor className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No active sessions found</p>
          </div>
        )}

        {sessions.map((session, index) => {
          const isCurrentSession = index === 0;
          const deviceInfo = session.device_info || {};

          return (
            <div
              key={session.id}
              className={`border rounded-lg p-4 transition-all ${
                isCurrentSession
                  ? 'border-Color-Champagne-Gold bg-Color-Primary-Beige/10'
                  : 'border-Color-Light-300 hover:border-Color-Champagne-Gold/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {/* Device Icon */}
                  <div className={`p-2 rounded-lg ${
                    isCurrentSession ? 'bg-Color-Champagne-Gold text-white' : 'bg-Color-Light-300 text-Color-Gray-700'
                  }`}>
                    {getDeviceIcon(deviceInfo.device)}
                  </div>

                  {/* Session Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-Color-Netural-Black">
                        {deviceInfo.browser || 'Unknown Browser'} on {deviceInfo.os || 'Unknown OS'}
                      </h4>
                      {isCurrentSession && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-Color-Champagne-Gold text-white rounded-full">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {deviceInfo.device && (
                        <div className="flex items-center gap-2 text-xs text-Color-Gray-700">
                          <span className="font-medium">Device:</span>
                          <span>{deviceInfo.device}</span>
                        </div>
                      )}

                      {session.location && (
                        <div className="flex items-center gap-2 text-xs text-Color-Gray-700">
                          <MapPin className="h-3 w-3" />
                          <span>{session.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-Color-Gray-700">
                        <Clock className="h-3 w-3" />
                        <span>Last active {formatDate(session.last_activity_at)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        {getLoginMethodBadge(session.login_method)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terminate Button */}
                {!isCurrentSession && (
                  <button
                    onClick={() => handleTerminateSession(session.id)}
                    disabled={loading}
                    className="p-2 text-Color-Gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Sign out this session"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Expiry Info */}
              <div className="mt-3 pt-3 border-t border-Color-Light-300">
                <p className="text-xs text-Color-Gray-700">
                  Expires on {new Date(session.expires_at).toLocaleDateString()} at {new Date(session.expires_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
