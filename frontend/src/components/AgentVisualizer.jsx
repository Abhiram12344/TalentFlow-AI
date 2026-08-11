import React from 'react';
import { Activity, ArrowRight, Layers, GitBranch, Wrench } from 'lucide-react';

export default function AgentVisualizer({ telemetryLogs, langsmithRunId }) {
  const LANGGRAPH_NODES = [
    { id: "START", type: "entry", name: "StateGraph Start", provider: "LangGraph StateGraph" },
    { id: "parse_resume", type: "node", name: "Resume Analysis Node", agent: "Resume Analysis Agent", tool: "extract_resume_entities_tool", icon: "📄", desc: "Extracts structured JSON facts from PDF/DOCX." },
    { id: "evaluate_ats", type: "node", name: "ATS Auditor Node", agent: "ATS Optimization Agent", tool: "calculate_ats_audit_tool", icon: "📊", desc: "Audits formatting compliance & ATS match score." },
    { id: "analyze_gaps", type: "node", name: "Skill Gap Analyst Node", agent: "Skill Gap Agent", tool: "fetch_skill_gap_matrix_tool", icon: "🎯", desc: "Maps gaps against target role benchmarks." },
    { id: "generate_curriculum", type: "node", name: "Curriculum Architect Node", agent: "Learning Path Agent", tool: "generate_hierarchical_curriculum_tool", icon: "🗺️", desc: "Architects full course syllabi & code exercises." },
    { id: "END", type: "exit", name: "StateGraph End", provider: "LangGraph StateGraph" }
  ];

  const STANDALONE_AGENTS = [
    { name: "Practice Tutor Agent", tool: "socratic_doubt_help_tool", icon: "💡", desc: "Provides intuitive problem hints & clarifies doubts without revealing solution code." },
    { name: "Code Sandbox Execution Agent", tool: "execute_python_code_sandbox_tool", icon: "💻", desc: "Compiles candidate Python code and returns live stdout, stderr, and test pass/fail results." },
    { name: "Career Coach Agent", tool: "chat_career_mentor_tool", icon: "💬", desc: "Handles multi-turn conversational career strategy & advice." },
    { name: "Candidate Ranking Agent", tool: "rank_applicant_tool", icon: "🏆", desc: "Ranks applicants per job posting using vector similarity & rationale." }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }} className="gradient-text">
            LangGraph Tool-Calling Multi-Agent Architecture
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-world autonomous agents executing LangChain <code style={{ color: '#4ade80' }}>@tool</code> functions inside a LangGraph StateGraph.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge badge-purple" style={{ padding: '0.5rem 1rem' }}>
            <GitBranch size={14} /> LangGraph Tool Graph Active
          </span>
          <span className="badge badge-green" style={{ padding: '0.5rem 1rem' }}>
            <Wrench size={14} /> LangChain @tool Invocations Active
          </span>
        </div>
      </div>

      {/* LangGraph State Workflow Visualizer */}
      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <GitBranch size={18} color="#6366f1" /> Tool-Calling Node Pipeline
      </h4>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
        {LANGGRAPH_NODES.map((node, idx) => (
          <React.Fragment key={idx}>
            <div className="glass-panel" style={{ 
              padding: node.type === 'node' ? '1rem 1.25rem' : '0.65rem 1rem', 
              borderLeft: node.type === 'node' ? '4px solid #6366f1' : '1px solid var(--border-glass)',
              minWidth: node.type === 'node' ? '210px' : 'auto',
              background: node.type === 'node' ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.02)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{node.id}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                {node.icon ? `${node.icon} ` : ''}{node.name}
              </div>
              {node.tool && (
                <div style={{ fontSize: '0.73rem', color: '#4ade80', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                  🔧 {node.tool}
                </div>
              )}
            </div>

            {idx < LANGGRAPH_NODES.length - 1 && (
              <ArrowRight size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Standalone LangChain Tools */}
      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Wrench size={18} color="#c084fc" /> Specialized LangChain Tool Functions
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {STANDALONE_AGENTS.map((agent, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #c084fc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{agent.icon}</span>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>LangChain @tool</span>
            </div>
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{agent.name}</h5>
            <p style={{ fontSize: '0.78rem', color: '#4ade80', fontFamily: 'monospace', marginBottom: '0.35rem' }}>🔧 {agent.tool}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{agent.desc}</p>
          </div>
        ))}
      </div>

      {/* Live Tool Execution Telemetry Logs */}
      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity size={18} color="#4ade80" /> Real-Time Tool Execution Telemetry Logs
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(telemetryLogs && telemetryLogs.length > 0 ? telemetryLogs : [
          { step: 1, agent: "Resume Analysis Agent", tool_called: "extract_resume_entities_tool", tool_output: "Extracted 14 technical skills & 4.0 experience yrs", provider: "LangChain Tool Node", latency_ms: 120 },
          { step: 2, agent: "ATS Optimization Agent", tool_called: "calculate_ats_audit_tool", tool_output: "ATS Compliance Score: 92.0%", provider: "LangChain Tool Node", latency_ms: 180 },
          { step: 3, agent: "Skill Gap Agent", tool_called: "fetch_skill_gap_matrix_tool", tool_output: "Identified 3 gap skills in System Design & Vector Stores", provider: "LangChain Tool Node", latency_ms: 90 },
          { step: 4, agent: "Learning Path Agent", tool_called: "generate_hierarchical_curriculum_tool", tool_output: "Architected full course syllabi & code exercises", provider: "LangChain Tool Node", latency_ms: 150 }
        ]).map((log, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-purple">Step {log.step || idx+1}</span>
              <div>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{log.agent}</h5>
                <p style={{ fontSize: '0.8rem', color: '#4ade80', fontFamily: 'monospace' }}>🔧 Executed Tool: {log.tool_called || "tool"}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{log.output_summary || log.tool_output}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-green">{log.provider || "LangChain Tool Node"}</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Latency: {log.latency_ms}ms</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
