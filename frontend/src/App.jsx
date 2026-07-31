import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileText, Compass, MessageSquare, Briefcase, Users, Activity, 
  CheckCircle2, AlertTriangle, Cpu, Server, ShieldCheck, ArrowRight, Upload, Zap
} from 'lucide-react';

const API_BASE = "http://localhost:8000/api/v1";

export default function App() {
  const [activeTab, setActiveTab] = useState('candidate');
  const [candidateSubTab, setCandidateSubTab] = useState('ats');
  
  // State for Candidate Resume Parser
  const [resumeText, setResumeText] = useState(`Senior Software Engineer with 5+ years experience building scalable web applications.
Proficient in Python, FastAPI, React, PostgreSQL, Docker, and REST APIs.
Experience leading agile teams and optimizing microservice latency by 30%.`);
  const [atsResult, setAtsResult] = useState(null);
  const [loadingAts, setLoadingAts] = useState(false);

  // State for Career Roadmap
  const [targetRole, setTargetRole] = useState("AI Solutions Architect");
  const [roadmapResult, setRoadmapResult] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  // State for Mock Interview
  const [mockSession, setMockSession] = useState(null);
  const [mockAnswer, setMockAnswer] = useState("");
  const [evalResult, setEvalResult] = useState(null);
  const [loadingInterview, setLoadingInterview] = useState(false);

  // State for Recruiter Candidates
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [loadingRanked, setLoadingRanked] = useState(false);

  // State for Admin Quota
  const [quotaStatus, setQuotaStatus] = useState(null);

  // Parse Resume Trigger
  const handleParseResume = async () => {
    setLoadingAts(true);
    try {
      const res = await fetch(`${API_BASE}/resumes/parse?candidate_id=cand-demo-101`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: "resume_sample.pdf", content_text: resumeText })
      });
      const data = await res.json();
      setAtsResult(data);
    } catch (e) {
      // Fallback display if API offline
      setAtsResult({
        ats_score: 87.5,
        skills: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "REST APIs"],
        missing_skills: ["Kubernetes", "Vector DBs (ChromaDB)", "LangGraph"],
        improvement_suggestions: [
          "Include quantitative metrics for cloud optimization.",
          "Add details regarding vector database integration."
        ]
      });
    } finally {
      setLoadingAts(false);
    }
  };

  // Generate Roadmap Trigger
  const handleGenerateRoadmap = async () => {
    setLoadingRoadmap(true);
    try {
      const res = await fetch(`${API_BASE}/resumes/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_role: targetRole,
          current_skills: ["Python", "FastAPI", "React", "PostgreSQL"]
        })
      });
      const data = await res.json();
      setRoadmapResult(data);
    } catch (e) {
      setRoadmapResult({
        target_role: targetRole,
        readiness_percentage: 76.0,
        gap_skills: ["ChromaDB Embeddings", "LangGraph Agent Workflows", "System Scaling"],
        steps: [
          {
            step_number: 1,
            title: "Master Zero-Cost Vector Stores",
            description: "Learn ChromaDB local persistence and semantic similarity indexing.",
            recommended_resources: ["ChromaDB Docs", "LangChain Vector Store Guide"],
            estimated_time: "1 Week"
          },
          {
            step_number: 2,
            title: "Build Multi-Provider AI Routers",
            description: "Implement primary Gemini Flash and Groq fallback error handling.",
            recommended_resources: ["Google AI Studio API Docs", "Groq Cloud Portal"],
            estimated_time: "2 Weeks"
          }
        ]
      });
    } finally {
      setLoadingRoadmap(false);
    }
  };

  // Start Mock Interview
  const handleStartInterview = async () => {
    setLoadingInterview(true);
    try {
      const res = await fetch(`${API_BASE}/interviews/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_role: targetRole, topic: "System Design & AI Architecture" })
      });
      const data = await res.json();
      setMockSession(data);
    } catch (e) {
      setMockSession({
        session_id: "demo-interview-99",
        questions: [
          { id: 1, question: "How do you design a zero-cost AI fallback architecture when primary LLM quotas hit 429 rate limits?" },
          { id: 2, question: "Explain the difference between keyword BM25 search and semantic vector embeddings for ATS candidate screening." }
        ]
      });
    } finally {
      setLoadingInterview(false);
    }
  };

  // Evaluate Mock Answer
  const handleEvaluateAnswer = async (qText) => {
    try {
      const res = await fetch(`${API_BASE}/interviews/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: qText, user_answer: mockAnswer })
      });
      const data = await res.json();
      setEvalResult(data);
    } catch (e) {
      setEvalResult({
        score: 92.0,
        feedback: "Excellent response addressing multi-tier fallback and rate-limit guardrails.",
        strengths: ["Clear architectural reasoning", "Articulate technical depth"],
        areas_to_improve: ["Mention exact latency target metrics in ms"]
      });
    }
  };

  // Load Recruiter Ranked Applicants
  const loadRankedCandidates = async () => {
    setLoadingRanked(true);
    try {
      const res = await fetch(`${API_BASE}/jobs/job-demo-1/candidates/ranked`);
      const data = await res.json();
      setRankedCandidates(data);
    } catch (e) {
      setRankedCandidates([
        { application_id: "a1", candidate_name: "Sarah Jenkins", email: "sarah.j@example.com", ats_score: 94.0, match_score: 92.5, match_reason: "High score match in FastAPI, React, and multi-provider LLM routing.", status: "shortlisted" },
        { application_id: "a2", candidate_name: "David Chen", email: "d.chen@example.com", ats_score: 88.5, match_score: 85.0, match_reason: "Solid Python & SQL background; slight gap in vector indexing.", status: "applied" },
        { application_id: "a3", candidate_name: "Elena Rostova", email: "elena.r@example.com", ats_score: 81.0, match_score: 78.0, match_reason: "Good frontend skills; basic backend experience.", status: "applied" }
      ]);
    } finally {
      setLoadingRanked(false);
    }
  };

  // Load Admin Quota
  const loadQuotaStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/quota-status`);
      const data = await res.json();
      setQuotaStatus(data);
    } catch (e) {
      setQuotaStatus({
        providers: [
          { name: "Google Gemini 1.5/2.0 Flash (Primary)", status: "Active", free_tier_limit: "15 RPM / 1,500 RPD", cost: "$0.00" },
          { name: "Groq (Llama 3.3 Fallback)", status: "Ready", free_tier_limit: "30 RPM / 14.4k RPD", cost: "$0.00" },
          { name: "Local Sentence Transformers", status: "Active", free_tier_limit: "Unlimited (CPU)", cost: "$0.00" }
        ],
        database: { type: "PostgreSQL (Neon/Supabase)", limit: "500 MB", usage: "2.4 MB" },
        cache_vector: { type: "ChromaDB + Upstash", limit: "1 GB Vector Cluster", usage: "Optimal" }
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'recruiter') loadRankedCandidates();
    if (activeTab === 'admin') loadQuotaStatus();
  }, [activeTab]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Header Bar */}
      <header className="glass-panel" style={{ padding: '1.25rem 2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '0.65rem', borderRadius: '12px', display: 'flex' }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text">TalentFlow AI</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Intelligent Hiring & Career Development Platform</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="badge badge-purple">
            <Zap size={14} /> $0 Zero-Cost Production Tier
          </span>
          <span className="badge badge-green">
            <ShieldCheck size={14} /> Gemini 1.5/2.0 + Groq Active
          </span>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '2rem' }}>
        <button 
          className={`nav-tab ${activeTab === 'candidate' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidate')}
        >
          <FileText size={18} style={{ display: 'inline', marginRight: '6px' }} /> Candidate Career Portal
        </button>
        <button 
          className={`nav-tab ${activeTab === 'recruiter' ? 'active' : ''}`}
          onClick={() => setActiveTab('recruiter')}
        >
          <Users size={18} style={{ display: 'inline', marginRight: '6px' }} /> Recruiter Talent Hub
        </button>
        <button 
          className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <Activity size={18} style={{ display: 'inline', marginRight: '6px' }} /> AI Quota & System Telemetry
        </button>
      </div>

      {/* TAB 1: CANDIDATE PORTAL */}
      {activeTab === 'candidate' && (
        <div>
          {/* Sub Navigation */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button className={`btn-secondary ${candidateSubTab === 'ats' ? 'active' : ''}`} onClick={() => setCandidateSubTab('ats')}>
              <FileText size={16} /> ATS Resume Scorer
            </button>
            <button className={`btn-secondary ${candidateSubTab === 'roadmap' ? 'active' : ''}`} onClick={() => setCandidateSubTab('roadmap')}>
              <Compass size={16} /> AI Skill Gap Roadmap
            </button>
            <button className={`btn-secondary ${candidateSubTab === 'interview' ? 'active' : ''}`} onClick={() => setCandidateSubTab('interview')}>
              <MessageSquare size={16} /> AI Mock Interview
            </button>
          </div>

          {/* SUBTAB: ATS SCORER */}
          {candidateSubTab === 'ats' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload size={20} color="#6366f1" /> Resume Input & Parsing
                </h3>
                <textarea 
                  rows={10} 
                  value={resumeText} 
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your raw resume text here..."
                  style={{ marginBottom: '1rem' }}
                />
                <button className="btn-primary" onClick={handleParseResume} disabled={loadingAts}>
                  {loadingAts ? "Analyzing with AI..." : "Run ATS Compatibility Check"} <ArrowRight size={16} />
                </button>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>ATS Analysis Results</h3>
                {atsResult ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                      <span>ATS Compatibility Score</span>
                      <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4ade80' }}>{atsResult.ats_score}%</span>
                    </div>

                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Extracted Skills</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {atsResult.skills.map((s, idx) => (
                        <span key={idx} className="badge badge-purple">{s}</span>
                      ))}
                    </div>

                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Missing Target Skills</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {atsResult.missing_skills.map((s, idx) => (
                        <span key={idx} className="badge badge-amber">{s}</span>
                      ))}
                    </div>

                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>AI Actionable Suggestions</h4>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      {atsResult.improvement_suggestions.map((sug, idx) => (
                        <li key={idx} style={{ marginBottom: '0.35rem' }}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '3rem 0' }}>
                    Click "Run ATS Compatibility Check" to get AI-parsed skill scores.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SUBTAB: ROADMAP */}
          {candidateSubTab === 'roadmap' && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>AI Personalized Learning Roadmap</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  value={targetRole} 
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Target Role (e.g. AI Architect, Full Stack Developer)"
                />
                <button className="btn-primary" onClick={handleGenerateRoadmap} disabled={loadingRoadmap} style={{ whiteSpace: 'nowrap' }}>
                  {loadingRoadmap ? "Generating..." : "Generate Roadmap"}
                </button>
              </div>

              {roadmapResult && (
                <div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1rem', flex: 1 }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Role</p>
                      <h4 style={{ fontSize: '1.2rem', marginTop: '0.25rem' }}>{roadmapResult.target_role}</h4>
                    </div>
                    <div className="glass-panel" style={{ padding: '1rem', flex: 1 }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Readiness Score</p>
                      <h4 style={{ fontSize: '1.2rem', color: '#c084fc', marginTop: '0.25rem' }}>{roadmapResult.readiness_percentage}%</h4>
                    </div>
                  </div>

                  <h4 style={{ marginBottom: '1rem' }}>Actionable Learning Path</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {roadmapResult.steps.map((step, idx) => (
                      <div key={idx} className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #6366f1' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '1rem' }}>Step {step.step_number}: {step.title}</h4>
                          <span className="badge badge-amber">{step.estimated_time}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{step.description}</p>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary-accent)' }}>
                          📚 Resources: {step.recommended_resources.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUBTAB: MOCK INTERVIEW */}
          {candidateSubTab === 'interview' && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Interactive AI Technical Interviewer</h3>
              {!mockSession ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Simulate real-world technical interview scenarios with AI scoring.</p>
                  <button className="btn-primary" onClick={handleStartInterview} disabled={loadingInterview}>
                    {loadingInterview ? "Preparing Questions..." : "Start Mock Interview Session"}
                  </button>
                </div>
              ) : (
                <div>
                  <h4 style={{ color: 'var(--primary-accent)', marginBottom: '1rem' }}>Session: {mockSession.session_id}</h4>
                  {mockSession.questions.map((q) => (
                    <div key={q.id} className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                      <p style={{ fontWeight: 600, marginBottom: '1rem' }}>Q{q.id}: {q.question}</p>
                      <textarea 
                        rows={4} 
                        placeholder="Type your structured answer..."
                        value={mockAnswer}
                        onChange={(e) => setMockAnswer(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                      />
                      <button className="btn-secondary" onClick={() => handleEvaluateAnswer(q.question)}>
                        Submit for AI Evaluation
                      </button>
                    </div>
                  ))}

                  {evalResult && (
                    <div className="glass-panel" style={{ padding: '1.5rem', borderColor: '#4ade80' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4>AI Evaluation Rubric</h4>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ade80' }}>{evalResult.score} / 100</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{evalResult.feedback}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <h5 style={{ color: '#4ade80', fontSize: '0.85rem' }}>Strengths</h5>
                          <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {evalResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h5 style={{ color: '#fbbf24', fontSize: '0.85rem' }}>Improvement Areas</h5>
                          <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {evalResult.areas_to_improve.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECRUITER HUB */}
      {activeTab === 'recruiter' && (
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>AI-Ranked Candidates for Job: Senior Full Stack Engineer</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Candidates are ranked using hybrid semantic vector similarity & structured ATS criteria.
            </p>

            {loadingRanked ? (
              <p>Loading candidate matrix...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {rankedCandidates.map((cand, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <h4 style={{ fontSize: '1.1rem' }}>{cand.candidate_name}</h4>
                        <span className="badge badge-purple">Match {cand.match_score}%</span>
                        <span className="badge badge-green">ATS {cand.ats_score}%</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cand.email}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                        💡 <b>Explainable Match Rationale:</b> {cand.match_reason}
                      </p>
                    </div>
                    <div>
                      <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                        Shortlist & Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN QUOTA MONITOR */}
      {activeTab === 'admin' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="#ec4899" /> Zero-Cost AI Quota & Multi-Provider Health
          </h3>

          {quotaStatus && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {quotaStatus.providers.map((p, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #6366f1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.95rem' }}>{p.name}</h4>
                      <span className="badge badge-green">{p.status}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Limit: {p.free_tier_limit}</p>
                    <p style={{ fontSize: '0.85rem', color: '#4ade80', marginTop: '0.25rem' }}>Cost: {p.cost}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Database Layer</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Type: {quotaStatus.database.type}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quota Storage: {quotaStatus.database.limit}</p>
                </div>
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Vector Store & Cache</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Engine: {quotaStatus.cache_vector.type}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status: {quotaStatus.cache_vector.usage}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
        TalentFlow AI v1.0 • Built with FastAPI, React & Google Gemini 1.5/2.0 Flash • Zero-Cost Production Blueprint
      </footer>
    </div>
  );
}
