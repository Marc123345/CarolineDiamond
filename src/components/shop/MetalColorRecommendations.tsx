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
      setInsights(userInsights);

      // Auto-generate recommendation if none exist
      if (recs.length === 0 && userInsights.interactionCount >= 3) {
        const newRec = await generateMetalColorRecommendation(user.id);
        if (newRec) {
          setRecommendations([newRec]);
        }
      }
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
    <div className="space-y-3">
      {/* User Insights Banner */}
      {insights && insights.preferredMetal && (
        <div className="bg-gradient-to-r from-Color-Champagne-Gold/20 to-Color-Primary-Beige/20 p-4 rounded-lg border border-Color-Champagne-Gold/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-Color-Champagne-Gold" />
            <h4 className="text-sm font-semibold text-Color-Netural-Black">
              Your Metal Preferences
            </h4>
          </div>
          <p className="text-xs text-Color-Gray-700">
            You seem to love <strong>{insights.preferredMetal}</strong>
            {insights.secondChoice && (
              <>
                {' '}
                and <strong>{insights.secondChoice}</strong>
              </>
            )}
            . Based on your {insights.interactionCount} interactions, here are our recommendations:
          </p>
        </div>
      )}

      {/* Recommendations */}
      {visibleRecommendations.map(recommendation => {
        const metalInfo = getMetalColorDisplayInfo(recommendation.recommended_metal);
        const confidencePercent = Math.round(recommendation.confidence_score * 100);

        return (
          <div
            key={recommendation.id}
            className="border-2 border-Color-Champagne-Gold bg-gradient-to-br from-white to-Color-Primary-Beige/10 rounded-xl p-4 shadow-lg animate-fade-in"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full border-3 border-white shadow-md flex-shrink-0"
                  style={{ backgroundColor: metalInfo.hexColor }}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-Color-Champagne-Gold" />
                    <span className="text-xs font-semibold text-Color-Champagne-Gold uppercase tracking-wide">
                      Recommended for You
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-Color-Netural-Black">
                    {metalInfo.name}
                  </h4>
                  <p className="text-xs text-Color-Gray-700">{metalInfo.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleDismiss(recommendation.id)}
                className="p-1 hover:bg-Color-Light-300/30 rounded transition-colors flex-shrink-0"
                aria-label="Dismiss recommendation"
              >
                <X className="h-4 w-4 text-Color-Gray-700" />
              </button>
            </div>

            {/* Reason */}
            <div className="bg-white/60 p-3 rounded-lg mb-3">
              <p className="text-sm text-Color-Gray-700 leading-relaxed">
                {recommendation.reason}
              </p>
            </div>

            {/* Confidence Score */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-Color-Gray-700">Match Confidence</span>
                <span className="font-semibold text-Color-Champagne-Gold">
                  {confidencePercent}%
                </span>
              </div>
              <div className="w-full bg-Color-Light-300 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-Color-Champagne-Gold to-Color-Light-300 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(recommendation)}
                className="flex-1 py-2.5 bg-Color-Champagne-Gold text-white rounded-lg font-medium hover:bg-Color-Netural-Black transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <ThumbsUp className="h-4 w-4" />
                Explore {recommendation.recommended_metal}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
