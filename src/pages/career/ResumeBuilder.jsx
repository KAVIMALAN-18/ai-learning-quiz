import React, { useState } from 'react';
import {
    FileText,
    Download,
    Plus,
    Trash2,
    Save,
    User,
    GraduationCap,
    Briefcase,
    Award,
    ExternalLink,
    Loader2
} from 'lucide-react';
import Container from '../../components/ui/Container';
import { Title, BodyText, Label, SectionHeader } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function ResumeBuilder() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Draft state (could be fetched from backend)
    const [resumeData, setResumeData] = useState({
        personalInfo: {
            fullName: 'Kavimalan K',
            email: 'kavi@example.com',
            phone: '+91 9876543210',
            location: 'Tamil Nadu, India',
            summary: 'Passionate Fullstack Developer with a focus on AI-driven educational platforms. Skilled in React, Node.js, and MongoDB.'
        },
        education: [
            { institution: 'Technical University', degree: 'B.Tech Computer Science', year: '2024', score: '8.5 CGPA' }
        ],
        experience: [],
        skills: ['React', 'Node.js', 'MongoDB', 'C Language', 'Python', 'AI Integration'],
        projects: [
            { title: 'LearnSphere AI', description: 'AI-powered adaptive learning platform with real-time feedback.', link: '#' }
        ]
    });

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            alert("Resume saved successfully!");
        }, 1000);
    };

    const exportPDF = () => {
        alert("Generating PDF... (Integration with jspdf would go here)");
    };

    return (
        <Container className="py-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-100">
                <div>
                    <Label className="text-secondary-600 block mb-2 px-3 py-1 bg-secondary-50 w-fit rounded-lg font-bold">Tools</Label>
                    <Title className="text-5xl font-black text-slate-900 tracking-tight">Smart Resume Builder</Title>
                    <BodyText className="mt-4 text-slate-500 max-w-xl text-lg font-medium">
                        Auto-generate industry-standard resumes from your skills, project achievements, and overall platform performance.
                    </BodyText>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={handleSave} isLoading={saving} className="px-8 border-slate-200">
                        <Save size={18} className="mr-2" /> SAVE DRAFT
                    </Button>
                    <Button variant="primary" onClick={exportPDF} className="px-8 shadow-xl shadow-primary-600/20">
                        <Download size={18} className="mr-2" /> EXPORT PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
                {/* EDIT PANEL */}
                <div className="lg:col-span-7 space-y-10">
                    <section className="space-y-6">
                        <SectionHeader className="text-sm uppercase tracking-[0.2em] text-slate-400">Personal Details</SectionHeader>
                        <Card className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <input
                                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-primary-500"
                                        value={resumeData.personalInfo.fullName}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <input
                                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-primary-500"
                                        value={resumeData.personalInfo.email}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Professional Summary</Label>
                                <textarea
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px]"
                                    value={resumeData.personalInfo.summary}
                                />
                            </div>
                        </Card>
                    </section>

                    <section className="space-y-6">
                        <div className="flex justify-between items-center">
                            <SectionHeader className="text-sm uppercase tracking-[0.2em] text-slate-400 m-0">Projects & Experience</SectionHeader>
                            <Button size="sm" variant="ghost" className="text-primary-600 font-bold"><Plus size={16} /> ADD NEW</Button>
                        </div>
                        {resumeData.projects.map((p, i) => (
                            <Card key={i} className="p-8 relative group">
                                <button className="absolute top-6 right-6 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <h5 className="font-black text-slate-900 mb-1">{p.title}</h5>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{p.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </section>
                </div>

                {/* PREVIEW PANEL */}
                <div className="lg:col-span-5 relative">
                    <div className="sticky top-10">
                        <SectionHeader className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-6">Real-time Preview</SectionHeader>
                        <div className="bg-white shadow-2xl rounded-sm p-10 min-h-[700px] border border-slate-100 scale-95 origin-top">
                            <div className="text-center pb-8 border-b border-slate-100">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{resumeData.personalInfo.fullName}</h2>
                                <p className="text-[10px] text-slate-400 font-medium mt-2">{resumeData.personalInfo.email} • {resumeData.personalInfo.phone} • {resumeData.personalInfo.location}</p>
                            </div>

                            <div className="py-6 space-y-6">
                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-3">Summary</h5>
                                    <p className="text-[11px] text-slate-600 leading-relaxed">{resumeData.personalInfo.summary}</p>
                                </div>

                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-3">Core Skills</h5>
                                    <div className="flex flex-wrap gap-1.5">
                                        {resumeData.skills.map(s => <span key={s} className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-600 rounded-sm">{s}</span>)}
                                    </div>
                                </div>

                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-3">Projects</h5>
                                    {resumeData.projects.map((p, i) => (
                                        <div key={i} className="mb-4">
                                            <h6 className="text-[11px] font-black text-slate-900">{p.title}</h6>
                                            <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{p.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-10 border-t border-slate-50">
                                    <p className="text-[8px] text-slate-300 text-center font-medium italic">Validated by LearnSphere Studio Engine • 2026</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
