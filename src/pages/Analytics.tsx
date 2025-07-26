import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar,
  Download,
  Target,
  Clock
} from "lucide-react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    totalResumes: 0,
    totalUsers: 0,
    totalDownloads: 0,
    avgResponseTime: 0,
    topCompanies: [],
    recentActivity: [],
    monthlyStats: []
  });

  const navigate = useNavigate();
  // Mock user data - replace with actual auth implementation
  const user = { role: "admin" };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalyticsData({
        totalResumes: 1247,
        totalUsers: 89,
        totalDownloads: 1089,
        avgResponseTime: 2.3,
        topCompanies: [
          { name: "Google", count: 156, percentage: 12.5 },
          { name: "Microsoft", count: 134, percentage: 10.7 },
          { name: "Apple", count: 98, percentage: 7.9 },
          { name: "Amazon", count: 87, percentage: 7.0 },
          { name: "Meta", count: 76, percentage: 6.1 }
        ],
        recentActivity: [
          { user: "john_doe", action: "Generated resume for Google", time: "2 minutes ago" },
          { user: "jane_smith", action: "Downloaded resume for Microsoft", time: "5 minutes ago" },
          { user: "bob_wilson", action: "Generated resume for Apple", time: "8 minutes ago" },
          { user: "alice_brown", action: "Downloaded resume for Amazon", time: "12 minutes ago" },
          { user: "charlie_davis", action: "Generated resume for Meta", time: "15 minutes ago" }
        ],
        monthlyStats: [
          { month: "Jan", resumes: 89, downloads: 76 },
          { month: "Feb", resumes: 112, downloads: 98 },
          { month: "Mar", resumes: 156, downloads: 134 },
          { month: "Apr", resumes: 203, downloads: 178 },
          { month: "May", resumes: 187, downloads: 165 },
          { month: "Jun", resumes: 234, downloads: 201 }
        ]
      });
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType, color }) => (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 text-sm ${
                changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-3 h-3" />
                {change}
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navbar />
        <div className="max-w-2xl mx-auto p-6 mt-20">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 text-center">
            <CardContent className="p-8">
              <Target className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">
                You need admin privileges to view analytics.
              </p>
              <Button 
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-white/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => navigate("/admin")}
              className="bg-white/80 backdrop-blur-sm"
            >
              Back to Admin
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Resumes"
                value={analyticsData.totalResumes.toLocaleString()}
                icon={FileText}
                change="+12.5%"
                changeType="positive"
                color="bg-gradient-to-r from-blue-500 to-blue-600"
              />
              <StatCard
                title="Active Users"
                value={analyticsData.totalUsers.toLocaleString()}
                icon={Users}
                change="+8.2%"
                changeType="positive"
                color="bg-gradient-to-r from-green-500 to-green-600"
              />
              <StatCard
                title="Downloads"
                value={analyticsData.totalDownloads.toLocaleString()}
                icon={Download}
                change="+15.7%"
                changeType="positive"
                color="bg-gradient-to-r from-purple-500 to-purple-600"
              />
              <StatCard
                title="Avg Response Time"
                value={`${analyticsData.avgResponseTime}s`}
                icon={Clock}
                change="-0.3s"
                changeType="positive"
                color="bg-gradient-to-r from-orange-500 to-orange-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Companies */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Top Companies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topCompanies.map((company, index) => (
                      <div key={company.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{company.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{company.count} resumes</Badge>
                          <span className="text-sm text-muted-foreground">
                            {company.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            <span className="text-blue-600">@{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Statistics Chart */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Monthly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-4 h-64">
                  {analyticsData.monthlyStats.map((stat, index) => (
                    <div key={stat.month} className="flex flex-col items-center justify-end">
                      <div className="w-full space-y-1">
                        <div 
                          className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                          style={{ height: `${(stat.resumes / 250) * 100}px` }}
                        ></div>
                        <div 
                          className="bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                          style={{ height: `${(stat.downloads / 250) * 80}px` }}
                        ></div>
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-xs font-medium">{stat.month}</p>
                        <p className="text-xs text-blue-600">{stat.resumes}</p>
                        <p className="text-xs text-green-600">{stat.downloads}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm">Resumes Generated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm">Downloads</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}