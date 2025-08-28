import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Package, 
  DollarSign,
  MapPin,
  Users,
  BarChart3,
  Calendar,
  Target,
  Award,
  AlertTriangle
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalDeliveries: number;
  averageDeliveryTime: number;
  completionRate: number;
  customerSatisfaction: number;
  costPerDelivery: number;
  revenueGrowth: number;
  topPerformingProviders: Array<{
    name: string;
    deliveries: number;
    rating: number;
    efficiency: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    deliveries: number;
    revenue: number;
    satisfaction: number;
  }>;
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  dailyPerformance: Array<{
    day: string;
    completed: number;
    pending: number;
    cancelled: number;
  }>;
}

interface DeliveryAnalyticsDashboardProps {
  userId?: string;
  userRole?: string;
}

const DeliveryAnalyticsDashboard: React.FC<DeliveryAnalyticsDashboardProps> = ({ 
  userId, 
  userRole 
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, userId]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate analytics data - in real implementation would fetch from Supabase
      const mockData: AnalyticsData = {
        totalDeliveries: 1247,
        averageDeliveryTime: 4.2,
        completionRate: 94.5,
        customerSatisfaction: 4.6,
        costPerDelivery: 1850,
        revenueGrowth: 23.5,
        topPerformingProviders: [
          { name: "Express Logistics", deliveries: 156, rating: 4.8, efficiency: 96 },
          { name: "Swift Transport", deliveries: 134, rating: 4.7, efficiency: 94 },
          { name: "Metro Delivery", deliveries: 112, rating: 4.5, efficiency: 91 },
          { name: "City Movers", deliveries: 98, rating: 4.4, efficiency: 88 }
        ],
        monthlyTrends: [
          { month: 'Jan', deliveries: 95, revenue: 175000, satisfaction: 4.3 },
          { month: 'Feb', deliveries: 108, revenue: 198000, satisfaction: 4.4 },
          { month: 'Mar', deliveries: 124, revenue: 225000, satisfaction: 4.5 },
          { month: 'Apr', deliveries: 142, revenue: 260000, satisfaction: 4.6 },
          { month: 'May', deliveries: 156, revenue: 285000, satisfaction: 4.6 },
          { month: 'Jun', deliveries: 171, revenue: 312000, satisfaction: 4.7 }
        ],
        statusDistribution: [
          { name: 'Completed', value: 68, color: '#22c55e' },
          { name: 'In Transit', value: 18, color: '#3b82f6' },
          { name: 'Pending', value: 10, color: '#f59e0b' },
          { name: 'Cancelled', value: 4, color: '#ef4444' }
        ],
        dailyPerformance: [
          { day: 'Mon', completed: 45, pending: 8, cancelled: 2 },
          { day: 'Tue', completed: 52, pending: 6, cancelled: 1 },
          { day: 'Wed', completed: 48, pending: 9, cancelled: 3 },
          { day: 'Thu', completed: 58, pending: 7, cancelled: 2 },
          { day: 'Fri', completed: 62, pending: 11, cancelled: 4 },
          { day: 'Sat', completed: 38, pending: 5, cancelled: 1 },
          { day: 'Sun', completed: 29, pending: 4, cancelled: 2 }
        ]
      };

      setAnalytics(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (value: number, type: 'percentage' | 'rating') => {
    if (type === 'percentage') {
      if (value >= 95) return 'text-green-600';
      if (value >= 85) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value >= 4.5) return 'text-green-600';
      if (value >= 4.0) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const KPICard = ({ title, value, trend, icon: Icon, format = 'number' }: {
    title: string;
    value: number;
    trend: number;
    icon: any;
    format?: 'number' | 'percentage' | 'currency' | 'hours' | 'rating';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'percentage': return `${val}%`;
        case 'currency': return `KSh ${val.toLocaleString()}`;
        case 'hours': return `${val}h`;
        case 'rating': return `${val}/5`;
        default: return val.toLocaleString();
      }
    };

    const isPositiveTrend = trend > 0;
    const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{formatValue(value)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendIcon className={`h-4 w-4 ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trend)}%
            </span>
            <span className="text-sm text-muted-foreground">vs last period</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive delivery performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <Badge
              key={range}
              variant={timeRange === range ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </Badge>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Deliveries"
          value={analytics.totalDeliveries}
          trend={12.5}
          icon={Package}
        />
        <KPICard
          title="Avg Delivery Time"
          value={analytics.averageDeliveryTime}
          trend={-8.2}
          icon={Clock}
          format="hours"
        />
        <KPICard
          title="Completion Rate"
          value={analytics.completionRate}
          trend={2.1}
          icon={Target}
          format="percentage"
        />
        <KPICard
          title="Customer Rating"
          value={analytics.customerSatisfaction}
          trend={4.3}
          icon={Award}
          format="rating"
        />
        <KPICard
          title="Cost per Delivery"
          value={analytics.costPerDelivery}
          trend={-5.7}
          icon={DollarSign}
          format="currency"
        />
        <KPICard
          title="Revenue Growth"
          value={analytics.revenueGrowth}
          trend={23.5}
          icon={TrendingUp}
          format="percentage"
        />
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends & Performance</TabsTrigger>
          <TabsTrigger value="providers">Provider Analytics</TabsTrigger>
          <TabsTrigger value="distribution">Status Distribution</TabsTrigger>
          <TabsTrigger value="optimization">Optimization Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Delivery Trends</CardTitle>
                <CardDescription>Delivery volume and revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="deliveries" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Performance</CardTitle>
                <CardDescription>Weekly delivery completion patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.dailyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" stackId="a" fill="#22c55e" />
                    <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="cancelled" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Providers</CardTitle>
              <CardDescription>Provider rankings by efficiency and rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topPerformingProviders.map((provider, index) => (
                  <div key={provider.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{provider.name}</h4>
                        <p className="text-sm text-muted-foreground">{provider.deliveries} deliveries</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">Rating</p>
                        <p className={`text-lg font-bold ${getPerformanceColor(provider.rating, 'rating')}`}>
                          {provider.rating}/5
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Efficiency</p>
                        <p className={`text-lg font-bold ${getPerformanceColor(provider.efficiency, 'percentage')}`}>
                          {provider.efficiency}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Status Distribution</CardTitle>
                <CardDescription>Current status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">On-Time Delivery</span>
                    <span className="text-sm text-muted-foreground">94.5%</span>
                  </div>
                  <Progress value={94.5} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Customer Satisfaction</span>
                    <span className="text-sm text-muted-foreground">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Cost Efficiency</span>
                    <span className="text-sm text-muted-foreground">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Provider Utilization</span>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Optimization Recommendations
                </CardTitle>
                <CardDescription>AI-powered insights for efficiency improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                    <h4 className="font-medium text-orange-800 dark:text-orange-200">Route Optimization</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      Consolidating deliveries in Westlands area could reduce costs by 15%
                    </p>
                  </div>
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">Provider Allocation</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Reassigning 8 pending deliveries to Express Logistics for faster completion
                    </p>
                  </div>
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <h4 className="font-medium text-green-800 dark:text-green-200">Time Slot Optimization</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Moving 3 deliveries to off-peak hours could improve efficiency by 12%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>AI-powered delivery forecasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span className="font-medium">Expected deliveries today</span>
                    <span className="text-lg font-bold text-primary">47</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span className="font-medium">Predicted completion time</span>
                    <span className="text-lg font-bold text-green-600">6:30 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span className="font-medium">Risk of delays</span>
                    <span className="text-lg font-bold text-yellow-600">Low (18%)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span className="font-medium">Resource utilization</span>
                    <span className="text-lg font-bold text-blue-600">89%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryAnalyticsDashboard;