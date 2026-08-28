import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import { ArrowRight, Inbox, BarChart3, Clock, Lock, Bell, Users, Building, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';

const LandingPage = () => {
    const [formStatus, setFormStatus] = useState('');

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setFormStatus('sending');
        setTimeout(() => setFormStatus('sent'), 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-purple-200">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        The ultimate pipeline for <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">modern sales teams.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
                        Stop losing leads in messy spreadsheets. Convert prospects, automate workflows, and drive revenue with a CRM built for speed and simplicity.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                            Start Free Trial <ArrowRight size={20} />
                        </Link>
                        <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-2xl font-bold text-lg transition-all">
                            View Features
                        </a>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="py-24 bg-white px-6 border-t border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-purple-600 font-extrabold tracking-wider uppercase text-sm mb-2 block">Powerful Capabilities</span>
                        <h2 className="text-4xl font-black text-slate-900">Everything you need to close deals.</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard icon={Inbox} title="Lead Management" desc="Capture, track, and qualify leads seamlessly with automatic staging rules." />
                        <FeatureCard icon={BarChart3} title="Analytics Dashboard" desc="Visualize your conversion rates and funnel drop-offs natively in real-time." />
                        <FeatureCard icon={Clock} title="Task Automation" desc="Never miss a follow-up. Kanban boards keep your entire project on track." />
                        <FeatureCard icon={Lock} title="Role-Based Access" desc="Strict hierarchical security mapping Admin, Manager, and Sales boundaries." />
                        <FeatureCard icon={Bell} title="Real-time Notifications" desc="WebSockets trigger instant alerts whenever tasks or clients are assigned." />
                        <FeatureCard icon={Zap} title="Pipeline Tracking" desc="Instantly track your pipeline across all project workflows natively." />
                    </div>
                </div>
            </section>

            {/* SOLUTIONS SECTION */}
            <section id="solutions" className="py-24 bg-slate-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900">Scaled for every stage of growth.</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <SolutionCard
                            title="For Sales Teams"
                            desc="Stop fighting software. Start crushing quotas."
                            benefits={['Automated follow-ups', 'Drag-and-drop pipelines', 'Instant client profiles']}
                        />
                        <SolutionCard
                            title="For Managers"
                            desc="Get full visibility without micromanaging."
                            benefits={['Real-time health tracking', 'Stage conversion metrics', 'Team assignment logs']}
                        />
                        <SolutionCard
                            title="For Enterprises"
                            desc="Secure, auditable, and instantly robust."
                            benefits={['Strict RBAC boundaries', 'Bank-level isolation', 'High-concurrency APIs']}
                        />
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="py-24 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900">Simple, transparent pricing.</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <PricingCard title="Starter" price="Free" features={['Up to 50 Leads', 'Basic Kanban Board', 'Community Support']} />
                        <PricingCard title="Pro" price="$10" suffix="/mo" highlighted features={['Unlimited Leads', 'Real-time Notifications', 'Advanced Role Management', 'Priority Support']} />
                        <PricingCard title="Enterprise" price="Custom" features={['Custom Integration API', 'Dedicated Account Manager', 'SLA Guarantee', 'On-premise deployments']} />
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section id="about" className="py-24 bg-slate-900 text-white px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-black mb-6">Built for speed. Designed for humans.</h2>
                    <p className="text-xl text-slate-400 mb-8 leading-relaxed font-medium">
                        Our mission is to dramatically eliminate the friction between sales logic and modern implementation pipelines. We chose the MERN stack because your data needs to move as fast as you do, with zero compromise on analytical integrity.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-12 text-slate-300">
                        <div className="text-center"><p className="text-5xl font-extrabold text-white mb-2">99.9%</p><p className="text-sm font-bold uppercase tracking-wider">Uptime</p></div>
                        <div className="text-center"><p className="text-5xl font-extrabold text-white mb-2">1M+</p><p className="text-sm font-bold uppercase tracking-wider">Leads Processed</p></div>
                        <div className="text-center"><p className="text-5xl font-extrabold text-white mb-2">24/7</p><p className="text-sm font-bold uppercase tracking-wider">Support</p></div>
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="py-24 bg-slate-50 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">Get in touch</h2>
                        <p className="text-slate-500 font-medium text-lg">Have a custom requirement? Let's talk.</p>
                    </div>
                    <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
                        {formStatus === 'sent' ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><ShieldCheck size={40} /></div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Received!</h3>
                                <p className="text-slate-500 text-lg">We will get back to you within 24 hours.</p>
                                <button onClick={() => setFormStatus('')} className="mt-8 text-purple-600 font-bold hover:underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                        <input type="text" required className="w-full px-5 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/50 outline-none transition" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input type="email" required className="w-full px-5 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/50 outline-none transition" placeholder="john@company.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                    <textarea required rows="4" className="w-full px-5 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/50 outline-none transition" placeholder="How can we help?"></textarea>
                                </div>
                                <button type="submit" disabled={formStatus === 'sending'} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-70 text-lg">
                                    {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <footer className="py-12 text-center text-slate-500 text-sm border-t border-slate-200 bg-white">
                <div className="flex justify-center items-center gap-2 font-bold mb-4">
                    <Zap size={16} className="text-purple-600" /> CRM Pro
                </div>
                <p>&copy; 2026 CRM Pro SaaS. All rights reserved.</p>
            </footer>
        </div>
    );
};

/* --- MICRO COMPONENTS --- */

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300">
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-purple-600 mb-6 font-bold">
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
);

const SolutionCard = ({ title, desc, benefits }) => (
    <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/30 border border-slate-100 transition hover:shadow-xl hover:-translate-y-1">
        <h3 className="text-2xl font-black text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 font-medium mb-8 text-lg">{desc}</p>
        <ul className="space-y-4">
            {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                    <ShieldCheck size={20} className="text-purple-600 shrink-0" />
                    <span className="font-bold text-slate-700">{benefit}</span>
                </li>
            ))}
        </ul>
    </div>
);

const PricingCard = ({ title, price, features, suffix = "", highlighted = false }) => (
    <div className={`p-8 rounded-3xl border ${highlighted ? 'bg-slate-900 border-slate-800 text-white shadow-2xl transform md:-translate-y-4 relative' : 'bg-white border-slate-200 text-slate-900'}`}>
        {highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Most Popular</div>}
        <h3 className={`text-xl font-bold mb-4 ${highlighted ? 'text-purple-400' : 'text-slate-500'}`}>{title}</h3>
        <div className="mb-8 flex items-baseline">
            <span className="text-5xl font-black">{price}</span>
            {suffix && <span className={`text-lg font-medium ml-1 ${highlighted ? 'text-slate-400' : 'text-slate-500'}`}>{suffix}</span>}
        </div>
        <ul className="space-y-5 mb-8">
            {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                    <ShieldCheck size={24} className={highlighted ? "text-purple-400 shrink-0" : "text-purple-600 shrink-0"} />
                    <span className={`font-bold ${highlighted ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                </li>
            ))}
        </ul>
        <Link to="/register" className={`block w-full py-4 text-center rounded-2xl font-bold transition-all text-lg ${highlighted ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
            Get Started
        </Link>
    </div>
);

export default LandingPage;
