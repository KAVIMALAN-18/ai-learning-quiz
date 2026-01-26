import React, { useState, useEffect } from 'react';
import api from '../../services/api.client';
import { Card } from '../../components/ui/Card';
import { Title, SectionHeader, Label, BodyText } from '../../components/ui/Typography';
import Container from '../../components/ui/Container';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import {
    Users,
    CheckCircle,
    Trophy,
    TrendingUp,
    Zap,
    Activity,
    ArrowUpRight
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title as ChartTitle,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ChartTitle,
    Tooltip,
    Legend
);

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, loading }) => (
    <Card className="p-6 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-500 ${colorClass}`} />
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100`}>
                <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
            </div>
            {subtext && (
                <Badge variant="success" size="sm" className="bg-emerald-50 text-emerald-600 border-none font-bold">
                    <TrendingUp size={12} className="mr-1" /> {subtext}
                </Badge>
            )}
        </div>
        {loading ? (
            <Skeleton className="h-8 w-24 mb-2" />
        ) : (
            <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
        )}
        <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{title}</Label>
    </Card>
);

export default function AdminOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch admin stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const growthData = stats?.newUserGrowth ? {
        labels: stats.newUserGrowth.map(d => d._id),
        datasets: [
            {
                label: 'New Users',
                data: stats.newUserGrowth.map(d => d.count),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    } : null;

    const performanceData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Success Rate',
                data: [65, 78, 82, 75, 88, 92, 85],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const popularityData = {
        labels: ['React', 'Node.js', 'Python', 'System Design', 'ML'],
        datasets: [
            {
                label: 'Enrollments',
                data: [350, 240, 190, 150, 110],
                backgroundColor: '#f59e0b',
                borderRadius: 8,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { weight: '600', size: 10 } }
            },
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(226, 232, 240, 0.5)' },
                ticks: { color: '#94a3b8', font: { weight: '600', size: 10 } }
            }
        }
    };

    return (
        <Container className="py-10 space-y-10 pb-24 animate-fade-in">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary" size="sm" className="bg-indigo-50 text-indigo-600 border-none font-black uppercase tracking-widest px-3 text-[10px]">System Report</Badge>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-slate-400 text-xs font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <Title className="text-4xl text-slate-900">Platform Performance</Title>
                <BodyText className="mt-2 text-slate-500 max-w-2xl font-medium">Monitor real-time user growth, quiz participation, and system efficiency across the entire LearnSphere platform.</BodyText>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Registered"
                    value={stats?.totalUsers || 0}
                    subtext="+12%"
                    icon={Users}
                    colorClass="bg-indigo-500"
                    loading={loading}
                />
                <StatCard
                    title="Active (Last 24h)"
                    value={stats?.activeUsers || 0}
                    icon={Activity}
                    colorClass="bg-emerald-500"
                    loading={loading}
                />
                <StatCard
                    title="Quizzes Attempted"
                    value={stats?.totalQuizzes || 0}
                    subtext="High"
                    icon={Zap}
                    colorClass="bg-amber-500"
                    loading={loading}
                />
                <StatCard
                    title="Average Proficiency"
                    value={`${stats?.avgScore || 0}%`}
                    icon={Trophy}
                    colorClass="bg-rose-500"
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 overflow-hidden">
                    <SectionHeader className="m-0 text-lg mb-2">New User Growth</SectionHeader>
                    <BodyText className="text-xs text-slate-400 font-bold uppercase mb-8">Registrations (Last 7 Days)</BodyText>
                    <div className="h-64 w-full">
                        {loading ? (
                            <Skeleton className="h-full w-full" />
                        ) : growthData ? (
                            <Line data={growthData} options={chartOptions} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">No data available for the current period.</div>
                        )}
                    </div>
                </Card>

                <Card className="p-8 overflow-hidden">
                    <SectionHeader className="m-0 text-lg mb-2">Quiz Accuracy</SectionHeader>
                    <BodyText className="text-xs text-slate-400 font-bold uppercase mb-8">Average Performance Trend</BodyText>
                    <div className="h-64 w-full">
                        <Line data={performanceData} options={chartOptions} />
                    </div>
                </Card>

                <Card className="p-8 overflow-hidden">
                    <SectionHeader className="m-0 text-lg mb-2">Course Popularity</SectionHeader>
                    <BodyText className="text-xs text-slate-400 font-bold uppercase mb-8">Top Topics by Engagement</BodyText>
                    <div className="h-64 w-full">
                        <Bar data={popularityData} options={chartOptions} />
                    </div>
                </Card>

                <Card className="p-8 flex flex-col">
                    <SectionHeader className="m-0 text-lg mb-8">Audit Overview</SectionHeader>
                    <div className="flex-1 space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">New quiz category added</p>
                                <p className="text-xs text-slate-500 mt-1">Admin updated the Python track.</p>
                                <p className="text-[10px] text-slate-400 mt-2 font-black uppercase">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">User milestone reached</p>
                                <p className="text-xs text-slate-500 mt-1">Total active users crossed 500.</p>
                                <p className="text-[10px] text-slate-400 mt-2 font-black uppercase">Yesterday</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">System maintenance complete</p>
                                <p className="text-xs text-slate-500 mt-1">Database optimized for higher load.</p>
                                <p className="text-[10px] text-slate-400 mt-2 font-black uppercase">3 days ago</p>
                            </div>
                        </div>
                    </div>
                    <button className="mt-8 w-full py-4 border-2 border-slate-100 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                        View Audit Logs <ArrowUpRight size={16} />
                    </button>
                </Card>
            </div>
        </Container>
    );
}
