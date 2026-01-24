import React from "react";
import { BrainCircuit, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-neutral-100 bg-white/50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand & Mission */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                                <BrainCircuit size={18} />
                            </div>
                            <span className="text-xl font-black tracking-tighter">LearnSphere</span>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
                            Empowering learners through AI-driven personalization. Master any topic with structured roadmaps, adaptive quizzes, and real-time guidance.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-neutral-900 mb-6 uppercase tracking-wider text-xs">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-neutral-500 hover:text-primary-600 text-sm transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-neutral-500 hover:text-primary-600 text-sm transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-neutral-500 hover:text-primary-600 text-sm transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-bold text-neutral-900 mb-6 uppercase tracking-wider text-xs">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-neutral-100 rounded-full text-neutral-500 hover:bg-primary-50 hover:text-primary-600 transition-all">
                                <Github size={18} />
                            </a>
                            <a href="#" className="p-2 bg-neutral-100 rounded-full text-neutral-500 hover:bg-primary-50 hover:text-primary-600 transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 bg-neutral-100 rounded-full text-neutral-500 hover:bg-primary-50 hover:text-primary-600 transition-all">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    <p>© {currentYear} LearnSphere Studio. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Cookies</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Status</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
