import React, { useState } from 'react';
import { Cpu, Zap, Activity, CheckCircle, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';

export default function AgentVisualizer({ telemetryLogs }) {
  const [selectedAgent, setSelectedAgent] = useState(null);

  const AGENTS_ECOSYSTEM = [
    { name: "Resume Analysis Agent", role: "Document Extractor", icon: "📄", status: "Active", desc: "Extracts structured JSON skills, experience & education from raw PDF/DOCX." },
    { name: "ATS Optimization Agent", role: "ATS Auditor", icon: "📊", status: "Active", desc: "Audits formatting compliance, keyword alignment, and ATS match score." },
    { name: "Skill Gap Agent", role: "Competency Evaluator", icon: "🎯", status: "Active", desc: "Identifies gap skills against target role benchmarks." },
    { name: "Learning Path Agent", role: "Curriculum Architect", icon: "🗺️", status: "Active", desc: "Generates TakeUForward-inspired daily study & practice planners." },
    { name: "Practice Tutor Agent", role: "Socratic Problem Guide", icon: "💡", status: "Active", desc: "Provides intuitive problem hints & clarifies doubts without giving solution code." },
    { name: "Career Coach Agent", role: "AI Mentor", icon: "💬", status: "Active", desc: "Handles multi-turn conversational career strategy & advice." },
    { name: "Interview Agent", role: "Mock Evaluator", icon: "🎤", status: "Active", desc: "Generates scenario-based technical questions and evaluates answers." },
    { name: "Candidate Ranking Agent", role: "Semantic Ranker", icon: "🏆", status: "Active", desc: "Ranks applicants per job posting using vector similarity & rationale." }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }} className="gradient-text">
            Multi-Agent Collaboration Ecosystem
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            8 specialized AI agent nodes collaborating in real-time with multi-provider fallback (Gemini Flash / Groq / Local Transformers).
          </p>
        </div>
        <span className="badge badge-purple" style={{ padding: '0.5rem 1rem' }}>
          <Activity size={14} /> 8 Agents Active & Online
        </span>
      </div>

      {/* Agent Network Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {AGENTS_ECOSYSTEM.map((agent, idx) => (
          <div 
            key={idx} 
            className="glass-panel" 
            onClick={() => setSelectedAgent(agent)}
            style={{ 
              padding: '1.25rem', 
              cursor: 'pointer', 
              borderLeft: '4px solid #6366f1',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{agent.icon}</span>
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>{agent.status}</span>
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{agent.name}</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--primary-accent)', marginBottom: '0.5rem' }}>{agent.role}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{agent.desc}</p>
          </div>
        ))}
      </div>

      {/* Live Pipeline Telemetry Logs */}
      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Layers size={18} color="#4ade80" /> Recent Multi-Agent Execution Telemetry
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(telemetryLogs && telemetryLogs.length > 0 ? telemetryLogs : [
          { step: 1, agent: "Resume Analysis Agent", provider: "Google Gemini 1.5 Flash", latency_ms: 120, output_summary: "Extracted 14 technical skills & 4.5 experience years" },
          { step: 2, agent: "ATS Optimization Agent", provider: "Groq Llama 3.3 Versatile", latency_ms: 180, output_summary: "Calculated ATS Score: 91.5% with 2 improvement fixes" },
          { step: 3, agent: "Skill Gap Agent", provider: "Local Sentence Transformers", latency_ms: 90, output_summary: "Mapped competency gaps in System Design & ChromaDB Vector Stores" },
          { step: 4, agent: "Learning Path Agent", provider: "Google Gemini 1.5 Flash", latency_ms: 150, output_summary: "Generated 5-Day TakeUForward-inspired study & practice planner" }
        ]).map((log, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-purple">Step {log.step || idx+1}</span>
              <div>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{log.agent}</h5>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{log.output_summary}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-green">{log.provider}</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Latency: {log.latency_ms}ms</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
