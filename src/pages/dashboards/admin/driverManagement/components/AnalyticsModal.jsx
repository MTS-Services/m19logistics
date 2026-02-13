import React from 'react';
import { X, Package, CheckCircle, Clock, Star, MapPin } from 'lucide-react';

const driverAnalytics = {
    weeklyDeliveries: [8, 12, 10, 14, 11, 12, 9],
    monthlyRevenue: [2400, 2800, 2600, 3200],
    topRoutes: [
        { route: 'Chester - Rhyl', count: 23 },
        { route: 'Wrexham - Nantwich', count: 18 },
        { route: 'Northwich - Newcastle', count: 15 },
    ],
};

const AnalyticsModal = ({ driver, onClose }) => (
    <div
        className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
        onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
        }}
    >
        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Driver Analytics</h2>
                    <p className="mt-1 text-sm text-gray-600">{driver.name} (@{driver.username})</p>
                </div>
                <button onClick={onClose} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-teal-50 p-4">
                        <Package className="h-8 w-8 text-teal-600" />
                        <p className="mt-2 text-2xl font-bold text-gray-900">{driver.totalDeliveries}</p>
                        <p className="text-sm text-gray-600">Total Deliveries</p>
                    </div>
                    <div className="rounded-lg bg-teal-50 p-4">
                        <CheckCircle className="h-8 w-8 text-teal-600" />
                        <p className="mt-2 text-2xl font-bold text-gray-900">{driver.completedThisMonth}</p>
                        <p className="text-sm text-gray-600">This Month</p>
                    </div>
                    <div className="rounded-lg bg-teal-50 p-4">
                        <Clock className="h-8 w-8 text-teal-600" />
                        <p className="mt-2 text-2xl font-bold text-gray-900">{driver.avgCompletionTime}</p>
                        <p className="text-sm text-gray-600">Avg. Time</p>
                    </div>
                    <div className="rounded-lg bg-teal-50 p-4">
                        <Star className="h-8 w-8 text-teal-600" />
                        <p className="mt-2 text-2xl font-bold text-gray-900">{driver.rating}/5.0</p>
                        <p className="text-sm text-gray-600">Rating</p>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 p-4">
                        <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Completed this week</span>
                                <span className="font-medium text-gray-900">{driver.completedThisWeek}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Late deliveries</span>
                                <span className="font-medium text-red-600">{driver.lateDeliveries}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Proof attachments</span>
                                <span className="font-medium text-gray-900">{driver.proofAttachments}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Feedback submitted</span>
                                <span className="font-medium text-gray-900">{driver.feedbackCount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                        <h3 className="font-semibold text-gray-900">Top Routes</h3>
                        <div className="mt-4 space-y-3">
                            {driverAnalytics.topRoutes.map((route, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{route.route}</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{route.count} trips</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900">Weekly Deliveries</h3>
                    <div className="mt-4 flex h-32 items-end justify-between space-x-2">
                        {driverAnalytics.weeklyDeliveries.map((count, index) => (
                            <div key={index} className="flex flex-1 flex-col items-center">
                                <div className="w-full rounded-t bg-blue-600 transition-all hover:bg-blue-700" style={{ height: `${(count / 14) * 100}%` }} />
                                <span className="mt-2 text-xs text-gray-500">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</span>
                                <span className="text-xs font-medium text-gray-900">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Close</button>
                </div>
            </div>
        </div>
    </div>
);

export default AnalyticsModal;
