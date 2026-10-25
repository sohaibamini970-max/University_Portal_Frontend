import React from 'react';

const StatCard = ({ icon: Icon, label, value, change, color = 'primary' }) => {
    const colorClasses = {
        primary: 'bg-primary-50 text-primary-600',
        green: 'bg-green-50 text-green-600',
        orange: 'bg-orange-50 text-orange-600',
        purple: 'bg-purple-50 text-purple-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
                    {change && (
                        <p className={`text-xs mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
                        </p>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;