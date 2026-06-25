import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'brand',
  onClick 
}) => {
  const colorClasses = {
    brand: 'bg-gradient-to-br from-brand-50 to-brand-100 border-brand-200 dark:from-brand-950 dark:to-brand-900 dark:border-brand-800',
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950 dark:to-green-900 dark:border-green-800',
    amber: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-950 dark:to-amber-900 dark:border-amber-800',
    red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-950 dark:to-red-900 dark:border-red-800',
  };

  const iconColorClasses = {
    brand: 'text-brand-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
  };

  const trendColorClasses = {
    brand: 'text-brand-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
  };

  const isTrendingUp = trend && trend > 0;

  return (
    <div
      onClick={onClick}
      className={`${colorClasses[color]} border rounded-2xl p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1 truncate dark:text-slate-300">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2 dark:text-white">{value}</h3>
          {subtitle && (
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-slate-600 text-xs dark:text-slate-400">{subtitle}</p>
              {trend !== undefined && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${trendColorClasses[color]}`}>
                  {isTrendingUp ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  <span>{Math.abs(trend)}%</span>
                </div>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${iconColorClasses[color]} p-2 sm:p-3 bg-white rounded-xl flex-shrink-0 dark:bg-slate-800`}>
            <Icon size={20} className="sm:hidden" />
            <Icon size={24} className="hidden sm:block" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
