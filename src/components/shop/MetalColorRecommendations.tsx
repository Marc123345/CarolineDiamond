import React, { useState, useEffect } from 'react';
import { Sparkles, ThumbsUp, X, TrendingUp } from 'lucide-react';
import { MetalColor } from '../../config/filterConfig';
import { getMetalColorDisplayInfo } from '../../utils/metalColorUtils';
import {
  getMetalColorRecommendations,
  generateMetalColorRecommendation,
  acceptRecommendation,
  getMetalColorInsights,
  MetalColorRecommendation,
} from '../../lib/metalColorDb';
import { useAuth } from '../../context/AuthContext';

interface MetalColorRecommendationsProps {
  onAcceptRecommendation?: (color: MetalColor) => void;
}

export const MetalColorRecommendations: React.FC<MetalColorRecommendationsProps> = ({
  onAcceptRecommendation,
}) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<MetalColorRecommendation[]>([]);
  const [insights, setInsights] = useState<{
    preferredMetal: MetalColor | null;
    secondChoice: MetalColor | null;
    interactionCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [recs, userInsights] = await Promise.all([
        getMetalColorRecommendations(user.id),
        getMetalColorInsights(user.id),
      ]);

      setRecommendations(recs);
      // @ts-ignore
      setInsights(userInsights);

      // Auto-generate recommendation if none exist and user has enough history
      if (recs.length === 0 && userInsights.interactionCount >= 3) {
        const newRec = await generateMetalColorRecommendation(user.id);
        if (newRec) {
          // @ts-ignore
          setRecommendations([newRec]);
        }
      }
    } catch (err) {
        console.error("Failed to load metal recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (recommendation: MetalColorRecommendation) => {
    await acceptRecommendation(recommendation.id);
    setDismissedIds(prev => new Set(prev).add(recommendation.id));

    if (onAcceptRecommendation) {
      onAcceptRecommendation(recommendation.recommended_metal);
    }
  };

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
  };

  if (!user || loading || recommendations.length === 0) {
    return null;
  }

  const visibleRecommendations = recommendations.filter(rec => !dismissedIds.has(rec.id));

  if (visibleRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {/* User Insights Banner */}
      {insights && insights.preferredMetal && (
        <div className="bg-gradient-to-r from-Color-Champagne-Gold/10 to-transparent p-4 rounded-lg border-l-4 border-Color-Champagne-Gold">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-Color-Champagne-Gold" />
            <h4 className="text-sm font-bold text-gray-900">
              Your Preferences
            </h4>
          </div>
          <p className="text-xs text-gray-600">
            You seem to prefer <strong>{insights.preferredMetal}</strong>
            {insights.secondChoice && (
              <> and <strong>{insights.secondChoice}</strong></>
            )}
            . Based on your activity, we've found some matches:
          </p>
        </div>
      )}

      {/* Recommendations Cards */}
      {visibleRecommendations.map(recommendation => {
        const metalInfo = getMetalColorDisplayInfo(recommendation.recommended_metal);
        const confidencePercent = Math.round(recommendation.confidence_score * 100);

        return (
          <div
            key={recommendation.id}
            className="border border-Color-Champagne-Gold/30 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow animate-fadeIn"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: metalInfo.hexColor }}
                />
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Sparkles className="h-3 w-3 text-Color-Champagne-Gold" />
                    <span className="text-[10px] font-bold text-Color-Champagne-Gold uppercase tracking-wider">
                      Smart Match
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">
                    {metalInfo.name}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => handleDismiss(recommendation.id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4 italic line-clamp-2">
              "{recommendation.reason}"
            </p>

            {/* Confidence Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-gray-400 font-medium">Confidence Match</span>
                <span className="font-bold text-Color-Champagne-Gold">
                  {confidencePercent}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-Color-Champagne-Gold h-full transition-all duration-1000"
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => handleAccept(recommendation)}
              className="w-full py-2 bg-Color-Netural-Black text-white text-xs font-bold rounded-lg hover:bg-Color-Champagne-Gold transition-all flex items-center justify-center gap-2"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Show me {recommendation.recommended_metal}
            </button>
          </div>
        );
      })}
    </div>
  );
};