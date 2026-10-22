'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowRight, 
  GraduationCap, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Coins,
  Award,
  Zap,
  Lock,
  Mail,
  User,
  School,
  Globe
} from 'lucide-react';
import { useUniStore } from '@/lib/data/useUniStore';
import AppLogo from '@/components/ui/AppLogo';
import RankBadge from '@/components/common/RankBadge';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams?.get('role') === 'company' ? 'company' : 'student';

  const [role, setRole] = useState<'student' | 'company'>(defaultRole);
  
  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [college, setCollege] = useState('');
  const [track, setTrack] = useState('fullstack');
  
  // Company Form State
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [industry, setIndustry] = useState('software');
  const [website, setWebsite] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const { registerUser } = useUniStore();

  const isEduEmail = studentEmail.endsWith('.ac.in') || studentEmail.endsWith('.edu') || studentEmail.includes('college') || studentEmail.includes('uni');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    registerUser({
      name: studentName || 'New Student',
      email: studentEmail,
      role: 'STUDENT',
      college: college || 'Engineering College',
    });
    setTimeout(() => {
      router.push('/student/dashboard?onboarding=complete');
    }, 600);
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    registerUser({
      name: companyName || 'New Enterprise Partner',
      email: companyEmail,
      role: 'COMPANY',
      college: website || 'Enterprise',
    });
    setTimeout(() => {
      router.push('/company/dashboard?onboarding=complete');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-between selection:bg-purple-600/30">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 border-b border-white/5 bg-[#07090E]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <AppLogo size={34} />
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-wider text-white group-hover:text-purple-400 transition-colors uppercase">
                Uni<span className="text-purple-500">Parahits</span>
              </span>
              <span className="text-[10px] text-slate-400 -mt-1 tracking-widest font-mono">
                ONBOARDING REGISTRY
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>Already registered?</span>
            <Link 
              href="/login" 
              className="text-purple-400 hover:text-purple-300 transition-colors font-sans font-medium"
            >
              Sign In &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
        {submitted ? (
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-slate-900/80 border border-purple-500/40 backdrop-blur-xl shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white">Institutional Identity Initialized!</h2>
            <p className="mt-2 text-sm text-slate-400">
              Allocating your starting Rank E credentials, MANA XP wallet, and cryptographic student identity...
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-purple-400">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>Redirecting to your command center...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Zap className="w-3.5 h-3.5" />
                Verified Student Workforce
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Join the UniParahits Ecosystem
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Choose your participation tier to access verified bounties, peer classrooms, and institutional escrow.
              </p>

              {/* Role Selection Toggle */}
              <div className="mt-6 inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    role === 'student'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Developer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('company')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    role === 'company'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Corporate Sponsor</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Card */}
              <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
                {role === 'student' ? (
                  <form onSubmit={handleStudentSubmit} className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        STUDENT IDENTITY REGISTRATION
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Tier E Entry
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Full Legal Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="e.g. Rohan Verma"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono text-slate-400">
                          College / Institutional Email
                        </label>
                        {studentEmail && (
                          <span className={`text-[10px] font-mono flex items-center gap-1 ${
                            isEduEmail ? 'text-emerald-400' : 'text-amber-400'
                          }`}>
                            <CheckCircle2 className="w-3 h-3" />
                            {isEduEmail ? 'Institutional Domain Verified' : 'Standard Domain'}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          placeholder="rohan.verma@iitd.ac.in"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 font-mono">
                        Supports .edu, .ac.in, or verified university domain
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        University / Institute Name
                      </label>
                      <div className="relative">
                        <School className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. Indian Institute of Technology Delhi"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Primary Development Specialization
                      </label>
                      <select
                        value={track}
                        onChange={(e) => setTrack(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="fullstack" className="bg-[#111333] text-white">Full Stack Web (Next.js, TypeScript, React)</option>
                        <option value="backend" className="bg-[#111333] text-white">Backend & Distributed Systems (Java, Go, Spring)</option>
                        <option value="aiml" className="bg-[#111333] text-white">AI / ML & LLM Engineering (Python, PyTorch)</option>
                        <option value="devops" className="bg-[#111333] text-white">DevOps, Cloud & Kubernetes</option>
                        <option value="mobile" className="bg-[#111333] text-white">Mobile App Development (React Native / Flutter)</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                      >
                        <span>Initialize Student Identity (Rank E)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleCompanySubmit} className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        ENTERPRISE SPONSOR ONBOARDING
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
                        Verified Corporate
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Company / Startup Name
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. NovaTech Labs Inc."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Corporate Work Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={companyEmail}
                          onChange={(e) => setCompanyEmail(e.target.value)}
                          placeholder="partnerships@company.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Company Website URL
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          required
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://company.io"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Tech Domain / Industry
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="software" className="bg-[#111333] text-white">Enterprise SaaS & Cloud Systems</option>
                        <option value="fintech" className="bg-[#111333] text-white">Fintech, Payments & Crypto</option>
                        <option value="ai" className="bg-[#111333] text-white">Artificial Intelligence & Robotics</option>
                        <option value="healthtech" className="bg-[#111333] text-white">HealthTech & Bio-Informatics</option>
                        <option value="ecommerce" className="bg-[#111333] text-white">Next-Gen E-Commerce & Retail</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2"
                      >
                        <span>Activate Enterprise Escrow Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Right Side: What you get */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                  <h3 className="font-bold text-base text-white flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    {role === 'student' ? 'Student Progression Path' : 'Corporate Benefits'}
                  </h3>
                  
                  {role === 'student' ? (
                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <RankBadge rank="E" size="sm" />
                        <div>
                          <div className="font-bold text-slate-200">Start at Rank E (Initiate)</div>
                          <div className="text-slate-400">Complete verified beginner tasks to earn MANA XP and level up.</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <RankBadge rank="D" size="sm" />
                        <div>
                          <div className="font-bold text-slate-200">Unlock Peer Teaching at Rank D</div>
                          <div className="text-slate-400">Create courses, earn 85% of ZENI fees, expand classroom capacity.</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <RankBadge rank="C" size="sm" />
                        <div>
                          <div className="font-bold text-slate-200">Unlock Guilds & Mentorship at Rank C</div>
                          <div className="text-slate-400">Form agency teams, bid on real corporate bounties with smart escrow.</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="font-bold text-white mb-1">Guaranteed Escrow Protection</div>
                        <div className="text-slate-400">Funds locked securely until you approve the submitted GitHub pull request and deliverables.</div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="font-bold text-white mb-1">Rank-Gated Elite Student Guilds</div>
                        <div className="text-slate-400">Bounties are restricted to verified Rank C, B, and A student teams with 90%+ trust scores.</div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="font-bold text-white mb-1">Zero Freelance Marketplace Noise</div>
                        <div className="text-slate-400">Pre-vetted university talent with verifiable skill portfolios and zero spam proposals.</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs text-purple-300 flex items-center gap-3">
                  <Coins className="w-5 h-5 text-purple-400 shrink-0" />
                  <span>
                    <strong>Dual-Economy Guarantee:</strong> MANA measures non-transferable merit XP. ZENI is pegged 1:1 to ₹ INR for transparent financial settlements.
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        Smart India Hackathon 2026 • Verified Student Workforce & Multi-Role Architecture
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090E] flex items-center justify-center text-slate-400 font-mono">Loading onboarding registry...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
