import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api.client';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import { Award, CheckCircle, XCircle, Calendar, User, BookOpen, TrendingUp } from 'lucide-react';

const VerifyCertificate = () => {
    const { certificateId } = useParams();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (certificateId) {
            verifyCertificate();
        }
    }, [certificateId]);

    const verifyCertificate = async () => {
        try {
            const res = await api.get(`/career/verify/${certificateId}`);
            setValid(res.data.valid);
            if (res.data.valid) {
                setCertificate(res.data.certificate);
            } else {
                setError(res.data.message || 'Certificate is invalid');
            }
        } catch (err) {
            setValid(false);
            setError(err.response?.data?.message || 'Certificate not found');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Verifying certificate...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-20">
            <Container className="max-w-4xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Certificate Verification</h1>
                    <p className="text-slate-500">Verify the authenticity of this certificate</p>
                </div>

                {!valid ? (
                    <Card className="p-12 text-center bg-white">
                        <XCircle size={64} className="mx-auto text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Invalid Certificate</h2>
                        <p className="text-slate-600 mb-6">{error}</p>
                        <p className="text-sm text-slate-400">
                            Certificate ID: <span className="font-mono font-bold">{certificateId}</span>
                        </p>
                    </Card>
                ) : (
                    <Card className="overflow-hidden bg-white shadow-2xl">
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white text-center">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                <Award size={40} className="text-white" />
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <CheckCircle size={20} className="text-emerald-300" />
                                <span className="text-emerald-100 font-bold text-sm uppercase tracking-wider">Verified Certificate</span>
                            </div>
                            <h2 className="text-3xl font-black mb-2">Certificate of Completion</h2>
                            <p className="text-primary-100">This certificate has been verified as authentic</p>
                        </div>

                        {/* Certificate Details */}
                        <div className="p-10">
                            <div className="text-center mb-10">
                                <p className="text-slate-500 text-sm mb-2">This is to certify that</p>
                                <h3 className="text-4xl font-black text-slate-900 mb-2">{certificate.name}</h3>
                                <p className="text-slate-500 text-sm">has successfully completed</p>
                                <h4 className="text-2xl font-bold text-primary-600 mt-4">{certificate.course}</h4>
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <div className="text-center p-6 bg-slate-50 rounded-lg">
                                    <Calendar className="mx-auto text-primary-600 mb-2" size={24} />
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Completion Date</p>
                                    <p className="font-bold text-slate-900">{new Date(certificate.completionDate).toLocaleDateString()}</p>
                                </div>

                                <div className="text-center p-6 bg-slate-50 rounded-lg">
                                    <BookOpen className="mx-auto text-primary-600 mb-2" size={24} />
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Certificate ID</p>
                                    <p className="font-mono font-bold text-slate-900 text-sm">{certificate.id}</p>
                                </div>

                                {certificate.score && (
                                    <div className="text-center p-6 bg-slate-50 rounded-lg">
                                        <TrendingUp className="mx-auto text-primary-600 mb-2" size={24} />
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Final Score</p>
                                        <p className="font-bold text-slate-900 text-2xl">{certificate.score}%</p>
                                    </div>
                                )}
                            </div>

                            {/* Verification Status */}
                            <div className="border-t border-slate-200 pt-6 text-center">
                                <p className="text-sm text-slate-500 mb-2">Status</p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <CheckCircle size={16} className="text-emerald-600" />
                                    <span className="text-emerald-700 font-bold text-sm uppercase tracking-wider">
                                        {certificate.status === 'valid' ? 'Valid & Authenticated' : certificate.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                                <p className="text-xs text-slate-400">
                                    This certificate is issued by the AI Learning Platform and has been cryptographically verified.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </Container>
        </div>
    );
};

export default VerifyCertificate;
