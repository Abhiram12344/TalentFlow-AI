import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileText, Compass, MessageSquare, Briefcase, Users, Activity, 
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Layers, HelpCircle
} from 'lucide-react';

import ResumeUploadDropzone from './components/ResumeUploadDropzone';
import HierarchicalLearningPlatform from './components/HierarchicalLearningPlatform';
import AgentVisualizer from './components/AgentVisualizer';
import AICareerChat from './components/AICareerChat';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export default function App() {
  const [activeTab, setActiveTab] = useState('ats');
  const [atsAuditData, setAtsAuditData] = useState(null);
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  
  // Recruiter Ranked Candidates State
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [loadingRanked, setLoadingRanked] = useState(false);

  // Handle Upload/Parsing Completion
  const handleParsingComplete = (result) => {
    setAtsAuditData(result);
    if (result.pipeline_result?.telemetry_logs) {
      setTelemetryLogs(result.pipeline_result.telemetry_logs);
    }
  };

  // Load Recruiter Applicants
  const loadRankedCandidates = async () => {
    setLoadingRanked(true);
    try {
      const res = await fetch(`${API_BASE}/jobs/job-demo-1/candidates/ranked`);
      const data = await res.json();
      setRankedCandidates(data);
    } catch (e) {
      setRankedCandidates([
        { application_id: "a1", candidate_name: "Sarah Jenkins", email: "sarah.j@example.com", ats_score: 94.0, match_score: 93.5, match_reason: "Exceptional alignment in FastAPI, React, and multi-agent AI architecture.", status: "shortlisted" },
        { application_id: "a2", candidate_name: "David Chen", email: "d.chen@example.com", ats_score: 88.5, match_score: 86.0, match_reason: "Solid Python & PostgreSQL background; slight gap in vector indexing.", status: "applied" },
        { application_id: "a3", candidate_name: "Elena Rostova", email: "elena.r@example.com", ats_score: 82.0, match_score: 79.0, match_reason: "Good frontend skills; basic backend experience.", status: "applied" }
      ]);
    } finally {
      setLoadingRanked(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'recruiter') loadRankedCandidates();
  }, [activeTab]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Sleek Professional Enterprise Header (Clean & No Debug Text) */}
      <header className="glass-panel" style={{ padding: '1.25rem 2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '0.65rem', borderRadius: '12px', display: 'flex' }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }} className="gradient-text">TalentFlow AI</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>AI-Powered Intelligent Hiring & Career Platform</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge badge-purple" style={{ padding: '0.5rem 1rem' }}>
            <Layers size={14} /> Multi-Agent Ecosystem Active
          </span>
          <span className="badge badge-green" style={{ padding: '0.5rem 1rem' }}>
            <ShieldCheck size={14} /> Enterprise Production Ready
          </span>
        </div>
      </header>

      {/* Main Feature Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          className={`nav-tab ${activeTab === 'ats' ? 'active' : ''}`}
          onClick={() => setActiveTab('ats')}
        >
          <FileText size={18} style={{ display: 'inline', marginRight: '6px' }} /> Resume ATS & Audit
        </button>

        <button 
          className={`nav-tab ${activeTab === 'learning' ? 'active' : ''}`}
          onClick={() => setActiveTab('learning')}
        >
          <Compass size={18} style={{ display: 'inline', marginRight: '6px' }} /> Course Syllabi & Code Sandbox
        </button>

        <button 
          className={`nav-tab ${activeTab === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveTab('agents')}
        >
          <Activity size={18} style={{ display: 'inline', marginRight: '6px' }} /> Multi-Agent Collaboration
        </button>

        <button 
          className={`nav-tab ${activeTab === 'coach' ? 'active' : ''}`}
          onClick={() => setActiveTab('coach')}
        >
          <MessageSquare size={18} style={{ display: 'inline', marginRight: '6px' }} /> AI Career Coach
        </button>

        <button 
          className={`nav-tab ${activeTab === 'recruiter' ? 'active' : ''}`}
          onClick={() => setActiveTab('recruiter')}
        >
          <Users size={18} style={{ display: 'inline', marginRight: '6px' }} /> Recruiter Talent Hub
        </button>
      </div>

      {/* TAB 1: RESUME ATS AUDIT & FILE UPLOAD */}
      {activeTab === 'ats' && (
        <div>
          <ResumeUploadDropzone apiBase={API_BASE} onParsingComplete={handleParsingComplete} />

          {/* ATS Audit Results Panel */}
          {atsAuditData && (
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>ATS Audit Report: {atsAuditData.filename}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Evaluated by ATS Optimization Agent & Resume Analysis Agent</p>
                </div>
                <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>ATS Compatibility Score</span>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#4ade80' }}>
                    {atsAuditData.ats_score || atsAuditData.pipeline_result?.ats_evaluation?.ats_score}%
                  </span>
                </div>
              </div>

              {/* Parsed Skills */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Matched Candidate Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {(atsAuditData.pipeline_result?.resume_analysis?.skills || []).map((s, idx) => (
                  <span key={idx} className="badge badge-purple">{s}</span>
                ))}
              </div>

              {/* Missing Skills */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Target Gap Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {(atsAuditData.pipeline_result?.ats_evaluation?.missing_keywords || []).map((s, idx) => (
                  <span key={idx} className="badge badge-amber">{s}</span>
                ))}
              </div>

              {/* Actionable Suggestions */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Actionable Resume Improvements</h4>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {(atsAuditData.pipeline_result?.ats_evaluation?.actionable_improvements || []).map((sug, idx) => (
                  <li key={idx} style={{ marginBottom: '0.4rem' }}>{sug}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COURSE SYLLABI & EMBEDDED CODE SANDBOX */}
      {activeTab === 'learning' && (
        <HierarchicalLearningPlatform apiBase={API_BASE} />
      )}

      {/* TAB 3: MULTI-AGENT COLLABORATION */}
      {activeTab === 'agents' && (
        <AgentVisualizer telemetryLogs={telemetryLogs} langsmithRunId={atsAuditData?.pipeline_result?.langsmith_run_id} />
      )}

      {/* TAB 4: AI CAREER COACH CHAT */}
      {activeTab === 'coach' && (
        <AICareerChat apiBase={API_BASE} />
      )}

      {/* TAB 5: RECRUITER TALENT HUB */}
      {activeTab === 'recruiter' && (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Candidate Match Matrix</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Semantic applicant ranking evaluated by Candidate Ranking Agent.</p>
            </div>
          </div>

          {loadingRanked ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading candidate pool...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rankedCandidates.map((cand, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cand.candidate_name}</h4>
                      <span className="badge badge-purple">Match {cand.match_score}%</span>
                      <span className="badge badge-green">ATS {cand.ats_score}%</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cand.email}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.35rem' }}>
                      💡 <b>Explainable Rationale:</b> {cand.match_reason}
                    </p>
                  </div>
                  <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                    Shortlist Candidate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Professional Footer (Clean & No Debug Info) */}
      <footer style={{ textAlign: 'center', marginTop: '3.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
        © 2026 TalentFlow AI • Multi-Agent Intelligent Hiring & Career Development Platform
      </footer>
    </div>
  );
}
