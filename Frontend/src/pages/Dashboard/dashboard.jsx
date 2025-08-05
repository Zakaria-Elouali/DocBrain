// pages/Dashboard/dashboard.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid
} from 'recharts';
import { getActivityIcon } from 'components/constants/dashboardActivitiesType';
import {useTranslation} from "react-i18next";

// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in Dashboard:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>{this.props.t('Something went wrong. Please refresh the page.')}</div>;
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const ROLE_COLORS = {
    'SUPER_ADMIN': '#8884d8',
    'ADMIN': '#0088FE',
    'VIEWER': '#00C49F',
    'CLIENT': '#FFBB28'
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardResponse = await axios.get('/dashboard/overview');
        setDashboardData(dashboardResponse);
        const activityResponse = await axios.get('/dashboard/recent-activity');
        setRecentActivity(activityResponse);
        setError(null);
      } catch (err) {
        setError(t('Failed to load dashboard data. Please try again later.'));
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(intervalId);
  }, [t]);

  // Memoized utility functions
  const formatStorage = useCallback((mbValue) => {
    if (mbValue < 1) return `${(mbValue * 1024).toFixed(2)} ${t('KB')}`;
    if (mbValue < 1024) return `${mbValue.toFixed(2)} ${t('MB')}`;
    return `${(mbValue / 1024).toFixed(2)} ${t('GB')}`;
  }, [t]);

  const formatDate = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  const prepareRoleData = useCallback((roleDistribution) => {
    return roleDistribution
        ? Object.entries(roleDistribution).map(([name, value]) => ({
          name: t(name),
          value
        }))
        : [];
  }, [t]);

  // Memoized data
  const roleData = useMemo(() => {
    return dashboardData?.roleDistribution ? prepareRoleData(dashboardData.roleDistribution) : [];
  }, [dashboardData, prepareRoleData]);

  const aiProcessingData = useMemo(() => {
    return dashboardData?.aiProcessingStats
        ? [
          { name: t('Processed'), value: dashboardData.aiProcessingStats.processed },
          { name: t('Unprocessed'), value: dashboardData.aiProcessingStats.unprocessed }
        ]
        : [];
  }, [dashboardData, t]);

  const memoizedFileTypeDistribution = useMemo(() => dashboardData?.fileTypeDistribution || [], [dashboardData]);
  const memoizedRecentActivity = useMemo(() => recentActivity.slice(0, 5), [recentActivity]);

  if (loading) {
    return (
        <div className="dashboard-container">
          <div className="main-area-wrapper" data-id="dashboard">
            <div className="main-area-content">
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
              </div>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="dashboard-container">
          <div className="main-area-wrapper" data-id="dashboard">
            <div className="main-area-content">
              <div className="flex justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 mt-4 px-4 py-3 rounded max-w-md w-full card">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

  if (!dashboardData) {
    console.log('No dashboardData, rendering null'); // Debug
    return null;
  }

  const {
    storageMetrics,
    totalFolders,
    totalDocuments,
    totalEmployees,
    totalClients,
    generatedAt
  } = dashboardData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
          <div className="bg-white p-3 shadow-md rounded border border-gray-200 card">
            <p className="font-semibold">{payload[0].name}</p>
            <p>{`${t('Count')}: ${payload[0].value}`}</p>
          </div>
      );
    }
    return null;
  };

  const renderAIProcessingLegend = (props) => {
    const { payload } = props;
    return (
        <div className="flex justify-center items-center text-xs">
          {payload.map((entry, index) => (
              <div key={`item-${index}`} className="flex items-center mx-2 text-gray-800">
                <div className="w-3 h-3 mr-1" style={{ backgroundColor: entry.color }}></div>
                <span>{entry.value}</span>
              </div>
          ))}
        </div>
    );
  };

  return (
      <ErrorBoundary t={t}>
        <div className="dashboard-container">
          <div className="main-area-wrapper" data-id="dashboard">
            <div className="dashboard-content">
              <div className="dashboard-grid">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold text-gray-700">{t('Company Dashboard')}</h1>
                  <div className="text-xs text-gray-500">
                    {t('Last updated')}: {new Date(generatedAt).toLocaleString()}
                  </div>
                </div>

                {/* Top stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white p-3 rounded-lg shadow border-l-4 border-blue-500 card"
                       aria-label={t('Total Documents: {{count}}', {count: totalDocuments})}>
                    <div className="text-xs font-medium text-gray-500">{t('Total Documents')}</div>
                    <div className="text-lg font-bold text-gray-800">{totalDocuments}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow border-l-4 border-green-500 card"
                       aria-label={t('Total Folders: {{count}}', {count: totalFolders})}>
                    <div className="text-xs font-medium text-gray-500">{t('Total Folders')}</div>
                    <div className="text-lg font-bold text-gray-800">{totalFolders}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow border-l-4 border-purple-500 card"
                       aria-label={t('Total Employees: {{count}}', {count: totalEmployees})}>
                    <div className="text-xs font-medium text-gray-500">{t('Total Employees')}</div>
                    <div className="text-lg font-bold text-gray-800">{totalEmployees}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow border-l-4 border-yellow-500 card"
                       aria-label={t('Total Clients: {{count}}', {count: totalClients})}>
                    <div className="text-xs font-medium text-gray-500">{t('Total Clients')}</div>
                    <div className="text-lg font-bold text-gray-800">{totalClients}</div>
                  </div>
                </div>

                {/* Charts section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Storage metrics */}
                  <div className="bg-white p-4 rounded-lg shadow card">
                    <h2 className="text-sm font-semibold text-gray-800 mb-3">{t('Storage Usage')}</h2>
                    <div className="flex items-center mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-blue-600 h-3 rounded-full"
                            style={{width: `${(storageMetrics?.usagePercentage || 0) * 100}%`}}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium text-gray-800">
                      {((storageMetrics?.usagePercentage || 0) * 100).toFixed(2)}%
                    </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500">{t('Used')}</div>
                        <div
                            className="font-medium text-gray-800">{formatStorage(storageMetrics?.usedStorageInMB || 0)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">{t('Available')}</div>
                        <div
                            className="font-medium text-gray-800">{formatStorage(storageMetrics?.availableStorageInMB || 0)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">{t('Total')}</div>
                        <div
                            className="font-medium text-gray-800">{formatStorage(storageMetrics?.totalStorageInMB || 0)}</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Processing metrics */}
                  <div className="bg-white p-4 rounded-lg shadow card">
                    <h2 className="text-sm font-semibold text-gray-800 mb-2">{t('AI Processing Status')}</h2>
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%" aria-label={t('AI Processing Status Chart')}>
                        <PieChart>
                          <Pie
                              data={aiProcessingData}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={50}
                              paddingAngle={5}
                              dataKey="value"
                              nameKey="name"
                          >
                            <Cell key="processed" fill="#4caf50"/>
                            <Cell key="unprocessed" fill="#ff9800"/>
                          </Pie>
                          <Tooltip formatter={(value, name) => [`${value}`, name]}/>
                          <Legend content={renderAIProcessingLegend}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* File Types and Role Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* File Type Distribution */}
                  <div className="bg-white p-4 rounded-lg shadow card">
                    <h2 className="text-sm font-semibold text-gray-800 mb-2">{t('File Type Distribution')}</h2>
                    {memoizedFileTypeDistribution.length > 0 ? (
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%" aria-label={t('File Type Distribution Chart')}>
                            <BarChart data={memoizedFileTypeDistribution} barSize={20} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false}/>
                              <XAxis type="number"/>
                              <YAxis
                                  type="category"
                                  dataKey="fileType"
                                  tickFormatter={(value) => t(value.split('/')[1] || value)}
                                  width={60}
                              />
                              <Tooltip
                                  formatter={(value, name) => [
                                    name === 'sizeInMB' ? `${formatStorage(value)}` : value,
                                    name === 'sizeInMB' ? t('Size') : t('Count')
                                  ]}
                                  labelFormatter={(label) => t(label.split('/')[1] || label)}
                              />
                              <Legend verticalAlign="top" height={36}/>
                              <Bar dataKey="count" name={t('Count')} fill="#8884d8" radius={[0, 4, 4, 0]}/>
                              <Bar dataKey="sizeInMB" name={t('Size (MB)')} fill="#82ca9d" radius={[0, 4, 4, 0]}/>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-500 text-sm card">
                          {t('No file data available')}
                        </div>
                    )}
                  </div>

                  {/* Role Distribution */}
                  <div className="bg-white p-4 rounded-lg shadow card">
                    <h2 className="text-sm font-semibold text-gray-800 mb-2">{t('Role Distribution')}</h2>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%" aria-label={t('Role Distribution Chart')}>
                        <PieChart>
                          <Pie
                              data={roleData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, value}) => (value > 0 ? `${name}: ${value}` : '')}
                          >
                            {roleData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={ROLE_COLORS[entry.name] || COLORS[index % COLORS.length]}
                                />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip/>}/>
                          <Legend layout="vertical" verticalAlign="middle" align="right"/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white p-4 rounded-lg shadow mb-4 card">
                  <h2 className="text-sm font-semibold text-gray-800 mb-3">{t('Recent Activity')}</h2>
                  {memoizedRecentActivity.length > 0 ? (
                      <div className="w-full">
                        <div className="grid grid-cols-12 bg-gray-50 py-2 mb-1 rounded-t">
                          <div className="col-span-2 text-center text-xs font-medium text-gray-500 uppercase">
                            {t('Action')}
                          </div>
                          <div className="col-span-2 text-center text-xs font-medium text-gray-500 uppercase">
                            {t('User')}
                          </div>
                          <div className="col-span-6 text-center text-xs font-medium text-gray-500 uppercase">
                            {t('Document')}
                          </div>
                          <div className="col-span-2 text-center text-xs font-medium text-gray-500 uppercase">
                            {t('Time')}
                          </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                          {memoizedRecentActivity.map((activity, index) => (
                            <div key={index} className="grid grid-cols-12 py-2 hover:bg-gray-50">
                              <div className="col-span-2 text-center">
                                <div className="flex items-center justify-center">
                                  {getActivityIcon(activity.actionType)}
                                  <span className="ml-2 text-xs font-medium text-gray-900">
                                    {t(activity.actionType)}
                                  </span>
                                </div>
                              </div>
                              <div className="col-span-2 text-center text-xs text-gray-500">
                                {activity.userName}
                              </div>
                              <div className="col-span-6 text-center text-xs text-gray-500">
                                <div className="truncate px-2">
                                  {activity.documentName}
                                </div>
                              </div>
                              <div className="col-span-2 text-center text-xs text-gray-500">
                                {formatDate(activity.timestamp)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                  ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        {t('No recent activity found')}
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
  );
};

export default React.memo(Dashboard);