import React, { useState, useEffect } from 'react';
import api from '../../services/api.client';
import Card from '../../components/ui/Card';
import Container from '../../components/ui/Container';
import { Briefcase, Building } from 'lucide-react';

const ApplicationTracker = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await api.get('/jobs/my-applications');
                setApplications(res.data.applications);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'SHORTLISTED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            case 'INTERVIEW': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <Container className="py-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Application Tracker</h1>

            {loading ? (
                <div>Loading...</div>
            ) : applications.length === 0 ? (
                <Card className="p-8 text-center bg-slate-50 border-dashed">
                    <p className="text-slate-500">You haven't applied to any jobs yet.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {applications.map(app => (
                        <Card key={app._id} className="p-6 transition-transform hover:scale-[1.01]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-lg flex items-center justify-center p-2 shadow-sm">
                                        {app.jobId.companyId?.logo ? (
                                            <img src={app.jobId.companyId.logo} className="w-full h-full object-contain" />
                                        ) : (
                                            <Building className="text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{app.jobId.title}</h3>
                                        <div className="text-slate-500 text-sm">{app.jobId.companyId?.name}</div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(app.status)} mb-2 inline-block`}>
                                        {app.status}
                                    </div>
                                    <div className="text-xs text-slate-400 font-medium">
                                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {app.matchScore > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary-500 h-full rounded-full" style={{ width: `${app.matchScore}%` }} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{app.matchScore}% Match Fit</span>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default ApplicationTracker;
