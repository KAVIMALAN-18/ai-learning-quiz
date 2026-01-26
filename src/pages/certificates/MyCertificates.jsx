import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.client';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Award, Download, Share2, CheckCircle, Calendar, Trophy } from 'lucide-react';

const MyCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const res = await api.get('/certificates/my-certificates');
            setCertificates(res.data.certificates);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = (certId) => {
        const url = `${window.location.origin}/verify/${certId}`;
        if (navigator.share) {
            navigator.share({
                title: 'My Certificate',
                text: 'Check out my certificate!',
                url: url
            });
        } else {
            navigator.clipboard.writeText(url);
            alert('Verification link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <Container className="py-10">
                <div className="text-center">Loading certificates...</div>
            </Container>
        );
    }

    return (
        <Container className="py-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                    <Award size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Certificates</h1>
                    <p className="text-slate-500">Your achievements and course completions</p>
                </div>
            </div>

            {certificates.length === 0 ? (
                <Card className="p-20 text-center">
                    <Trophy size={64} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-600 mb-2">No Certificates Yet</h3>
                    <p className="text-slate-400 mb-6">Complete a quiz with 60% or higher to earn your first certificate!</p>
                    <Button onClick={() => navigate('/dashboard/quizzes')}>
                        Take a Quiz
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <Card key={cert._id} className="p-6 hover:shadow-xl transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                                    <Award className="text-white" size={24} />
                                </div>
                                {cert.status === 'valid' && (
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                                        <CheckCircle size={12} className="inline mr-1" />
                                        Valid
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-lg text-slate-900 mb-2">{cert.courseName}</h3>
                            <p className="text-sm text-slate-500 mb-1">
                                <Calendar size={14} className="inline mr-1" />
                                {new Date(cert.completionDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-slate-500 mb-4">
                                Certificate ID: <span className="font-mono font-bold text-primary-600">{cert.certificateId}</span>
                            </p>

                            {cert.score && (
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">Score</span>
                                        <span className="font-bold text-slate-900">{cert.score}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${cert.score >= 80 ? 'bg-emerald-500' : 'bg-primary-500'}`}
                                            style={{ width: `${cert.score}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    fullWidth
                                    onClick={() => window.open(`/verify/${cert.certificateId}`, '_blank')}
                                >
                                    <Download size={16} className="mr-1" /> View
                                </Button>
                                <Button
                                    size="sm"
                                    fullWidth
                                    onClick={() => handleShare(cert.certificateId)}
                                >
                                    <Share2 size={16} className="mr-1" /> Share
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default MyCertificates;
