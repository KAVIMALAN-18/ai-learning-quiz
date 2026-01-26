import React, { useState } from 'react';
import api from '../../services/api.client';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Container from '../../components/ui/Container';
import { Target, CheckCircle, Circle, Map } from 'lucide-react';

const CareerDashboard = () => {
    const [targetRole, setTargetRole] = useState('Frontend Developer');
    const [careerPath, setCareerPath] = useState(null);
    const [loading, setLoading] = useState(false);

    const generatePath = async () => {
        setLoading(true);
        try {
            const res = await api.post('/mentor/career-path', { targetRole });
            setCareerPath(res.data.careerPath);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                    <Map size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Career Pathfinder</h1>
                    <p className="text-slate-500">Generate a personalized roadmap to your dream job.</p>
                </div>
            </div>

            {!careerPath ? (
                <Card className="max-w-xl mx-auto p-10 text-center">
                    <h2 className="text-2xl font-bold mb-4">Choose your Target Role</h2>
                    <div className="flex gap-4 justify-center mb-8">
                        {['Frontend Developer', 'Backend Developer', 'Data Scientist'].map(role => (
                            <button
                                key={role}
                                onClick={() => setTargetRole(role)}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${targetRole === role ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                    <Button size="lg" onClick={generatePath} disabled={loading}>
                        {loading ? 'Analyzing Profile...' : 'Generate Roadmap'}
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xl font-bold">Your Roadmap to {targetRole}</h3>
                        {careerPath.roadmap.map((step, i) => (
                            <Card key={i} className="p-6 flex gap-4">
                                <div className="mt-1">
                                    {step.status === 'completed' ? <CheckCircle className="text-emerald-500" /> : <Circle className="text-slate-300" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{step.title}</h4>
                                    <p className="text-slate-500 mb-2">{step.description}</p>
                                    <div className="flex gap-2">
                                        {step.resources?.map((res, j) => (
                                            <a key={j} href={res.url} target="_blank" className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">
                                                🔗 {res.title}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-primary-600 text-white">
                            <div className="text-center">
                                <div className="text-5xl font-black mb-2">{careerPath.readiness.score}%</div>
                                <div className="text-sm opacity-80 uppercase tracking-widest">Readiness Score</div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h4 className="font-bold mb-4">Missing Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {careerPath.readiness.missingSkills.map(skill => (
                                    <span key={skill} className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default CareerDashboard;
