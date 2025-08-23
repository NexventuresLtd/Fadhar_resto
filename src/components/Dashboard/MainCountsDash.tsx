import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    CheckCircle,
    AlertCircle,
    Calendar,
    TrendingUp,
    Clock,
    Utensils,
    Coins
} from 'lucide-react';
import mainAxios from '../../Instance/mainAxios';

interface DashboardData {
    total_tables: number;
    available_tables: number;
    booked_tables: number;
    total_bookings_today: number;
    total_revenue_today: number;
    active_bookings: number;
    upcoming_bookings: number;
    completed_bookings_today: number;
}

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    color,
    bgColor,
    borderColor,
    isLoading
}) => {
    if (isLoading) {
        return (
            <div className={`${bgColor} border-2 ${borderColor} rounded-lg p-6`}>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={`${bgColor} border-2 ${borderColor} rounded-lg p-6 hover:${borderColor.replace('border-', 'border-').replace('-200', '-300')} transition-colors cursor-pointer`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${color.replace('text-', 'text-').replace('-700', '-600')}`}>
                        {title}
                    </p>
                    <p className={`text-3xl font-bold ${color} mt-1`}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                </div>
                <div className={`${color.replace('text-', 'bg-').replace('-700', '-100')} p-3 rounded-lg`}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};

const Dashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await mainAxios.get('/dashboard/overview');
            setDashboardData(response.data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);

        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'RWF',
        }).format(amount);
    };

    const getOccupancyRate = () => {
        if (!dashboardData || dashboardData.total_tables === 0) return 0;
        return Math.round((dashboardData.booked_tables / dashboardData.total_tables) * 100);
    };

    const stats = [
        {
            title: 'Total Tables',
            value: dashboardData?.total_tables || 0,
            icon: <Utensils size={24} />,
            color: 'text-blue-700',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            title: 'Available Tables',
            value: dashboardData?.available_tables || 0,
            icon: <CheckCircle size={24} />,
            color: 'text-green-700',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            title: 'Booked Tables',
            value: dashboardData?.booked_tables || 0,
            icon: <AlertCircle size={24} />,
            color: 'text-red-700',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
        },
        {
            title: 'Occupancy Rate',
            value: `${getOccupancyRate() ? getOccupancyRate() : 0}%`,
            icon: <TrendingUp size={24} />,
            color: 'text-purple-700',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            title: 'Today\'s Bookings',
            value: dashboardData?.total_bookings_today || 0,
            icon: <Calendar size={24} />,
            color: 'text-indigo-700',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200'
        },
        {
            title: 'Active Bookings',
            value: dashboardData?.active_bookings || 0,
            icon: <Clock size={24} />,
            color: 'text-orange-700',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
        },
        {
            title: 'Today\'s Revenue',
            value: dashboardData ? formatCurrency(dashboardData.total_revenue_today || 0) : 'Rwf0.00',
            icon: <Coins size={24} />,
            color: 'text-green-700',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            title: 'Completed Today',
            value: dashboardData?.completed_bookings_today || 0,
            icon: <Users size={24} />,
            color: 'text-teal-700',
            bgColor: 'bg-teal-50',
            borderColor: 'border-teal-200'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            Fadhar Restaurant
                        </h1>
                        <p className="text-gray-600 text-lg">Dashboard Overview</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={fetchDashboardData}
                            disabled={loading}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 mb-2"
                        >
                            {loading ? 'Refreshing...' : 'Refresh Data'}
                        </motion.button>
                        <p className="text-sm text-gray-500">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            bgColor={stat.bgColor}
                            borderColor={stat.borderColor}
                            isLoading={loading}
                        />
                    ))}
                </div>

                {/* Quick Insights */}
                {!loading && dashboardData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white border-2 border-gray-200 rounded-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-700 mb-2">Table Utilization</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-gray-800">
                                        {dashboardData.total_tables > 0
                                            ? `${dashboardData.booked_tables}/${dashboardData.total_tables}`
                                            : '0/0'
                                        }
                                    </span>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getOccupancyRate() > 80
                                            ? 'bg-red-100 text-red-700'
                                            : getOccupancyRate() > 60
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                        {getOccupancyRate()}% occupied
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-700 mb-2">Booking Status</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Active:</span>
                                        <span className="font-medium">{dashboardData.active_bookings}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Upcoming:</span>
                                        <span className="font-medium">{dashboardData.upcoming_bookings}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-700 mb-2">Daily Performance</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Bookings:</span>
                                        <span className="font-medium">{dashboardData.total_bookings_today}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Revenue:</span>
                                        <span className="font-medium text-green-600">
                                            {formatCurrency(dashboardData.total_revenue_today)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Loading state for insights */}
                {loading && (
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                        <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-32"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-24"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Auto-refresh indicator */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Dashboard auto-refreshes every 30 seconds
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;