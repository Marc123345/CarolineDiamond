import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Clock, Filter, Eye, Target } from 'lucide-react';
import { getFilterAnalyticsSummary, getPopularFilters } from '../../lib/filterDb';
import { useAuth } from '../../context/AuthContext';
import { analyzeFilterEffectiveness, FilterEffectiveness } from '../../utils/advancedFilterOptimizer';
import { ProductFilters } from '../../config/filterConfig';
import { ProcessedProduct } from '../../types/shopify';

interface FilterAnalyticsDashboardProps {
  currentFilters: ProductFilters;
  allProducts: ProcessedProduct[];
  filteredProducts: ProcessedProduct[];
}

export const FilterAnalyticsDashboard: React.FC<FilterAnalyticsDashboardProps> = ({
  currentFilters,
  allProducts,
  filteredProducts,
}) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<{
    totalSearches: number;
    avgResultCount: number;
    avgQueryTime: number;
    mostUsedFilters: Array<{ filter: string; count: number }>;
  } | null>(null);
  const [popularFilters, setPopularFilters] = useState<Array<{
    filter_type: string;
    filter_value: string;
    usage_count: number;
    avg_result_count: number;
  }>>([]);
  const [effectiveness, setEffectiveness] = useState<FilterEffectiveness[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (user) {
        const summary = await getFilterAnalyticsSummary(user.id);
        setAnalytics(summary);

        const popular = await getPopularFilters(5);
        setPopularFilters(popular);
      }
    };

    loadAnalytics();
  }, [user]);

  useEffect(() => {
    if (Object.keys(currentFilters).length > 0 && filteredProducts.length > 0) {
      const analysis = analyzeFilterEffectiveness(
        currentFilters,
        allProducts,
        filteredProducts
      );
      setEffectiveness(analysis);
    }
  }, [currentFilters, allProducts, filteredProducts]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-Color-Champagne-Gold" />
        <h3 className="text-lg font-bold text-Color-Netural-Black">
          Filter Analytics
        </h3>
      </div>

      {/* Overview Stats */}
      {analytics && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Eye className="h-4 w-4" />}
            label="Total Searches"
            value={analytics.totalSearches.toLocaleString()}
            color="text-blue-600"
          />
          <StatCard
            icon={<Target className="h-4 w-4" />}
            label="Avg Results"
            value={Math.round(analytics.avgResultCount).toString()}
            color="text-green-600"
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            label="Avg Time"
            value={`${Math.round(analytics.avgQueryTime)}ms`}
            color="text-orange-600"
          />
        </div>
      )}

      {/* Current Filter Effectiveness */}
      {effectiveness.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Filter className="h-4 w-4" />
            <span>Current Filter Effectiveness</span>
          </div>
          <div className="space-y-2">
            {effectiveness.slice(0, 5).map((item, index) => (
              <FilterEffectivenessBar key={index} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Popular Filters */}
      {popularFilters.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <TrendingUp className="h-4 w-4" />
            <span>Most Popular Filters</span>
          </div>
          <div className="space-y-1">
            {popularFilters.map((filter, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {formatFilterType(filter.filter_type)}:
                  </span>
                  <span className="text-gray-600">{filter.filter_value}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">
                    {filter.usage_count} uses
                  </span>
                  <span className="text-gray-500">
                    ~{Math.round(filter.avg_result_count)} results
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Your Most Used Filters */}
      {analytics && analytics.mostUsedFilters.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <BarChart3 className="h-4 w-4" />
            <span>Your Most Used Filters</span>
          </div>
          <div className="space-y-1">
            {analytics.mostUsedFilters.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 text-xs"
              >
                <span className="text-gray-900">{item.filter}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-Color-Champagne-Gold"
                      style={{
                        width: `${Math.min(
                          100,
                          (item.count / analytics.totalSearches) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-500 w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {analytics && analytics.totalSearches > 10 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-semibold mb-1">💡 Insight</p>
              {analytics.avgResultCount < 5 && (
                <p>
                  Your searches are very specific. Consider broadening filters to see
                  more options.
                </p>
              )}
              {analytics.avgResultCount > 50 && (
                <p>
                  You tend to get many results. Try adding more specific filters like
                  clarity or certification.
                </p>
              )}
              {analytics.avgQueryTime > 500 && (
                <p>
                  Your searches are taking longer than average. Consider using fewer
                  simultaneous filters.
                </p>
              )}
              {analytics.avgResultCount >= 5 &&
                analytics.avgResultCount <= 50 &&
                analytics.avgQueryTime <= 500 && (
                  <p>
                    Your filter usage is well-optimized! You're finding relevant products
                    efficiently.
                  </p>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="p-3 bg-white rounded-lg border border-gray-200">
    <div className={`flex items-center gap-2 mb-1 ${color}`}>{icon}</div>
    <div className="text-xs text-gray-600 mb-1">{label}</div>
    <div className={`text-lg font-bold ${color}`}>{value}</div>
  </div>
);

interface FilterEffectivenessBarProps {
  item: FilterEffectiveness;
}

const FilterEffectivenessBar: React.FC<FilterEffectivenessBarProps> = ({ item }) => {
  const percentage = Math.round(item.effectiveness * 100);
  const color = item.isUseful ? 'bg-green-500' : 'bg-gray-400';

  return (
    <div className="p-2 bg-white rounded border border-gray-200">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-900">
          {formatFilterType(item.filterKey)}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">{percentage}% effective</span>
          {!item.isUseful && (
            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
              Low impact
            </span>
          )}
        </div>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

function formatFilterType(type: string): string {
  return type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
