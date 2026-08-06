import time
import os
import json
from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, START, END
from langsmith import traceable

# Environment setup for LangSmith tracing
if os.getenv("LANGCHAIN_API_KEY"):
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    os.environ["LANGCHAIN_PROJECT"] = os.getenv("LANGCHAIN_PROJECT", "TalentFlow-AI")
else:
    os.environ["LANGCHAIN_TRACING_V2"] = "false"

class TalentFlowAgentState(TypedDict):
    raw_resume_text: str
    target_role: str
    parsed_resume: Dict[str, Any]
    ats_evaluation: Dict[str, Any]
    skill_gaps: Dict[str, Any]
    learning_path: Dict[str, Any]
    telemetry_logs: List[Dict[str, Any]]
    langsmith_run_id: str

@traceable(name="Resume Parser Node", run_type="chain")
def resume_parser_node(state: TalentFlowAgentState) -> TalentFlowAgentState:
    from app.ai.agents.resume_parser_agent import ResumeParserAgent
    start = time.time()
    result = ResumeParserAgent.parse_resume(state["raw_resume_text"])
    elapsed = int((time.time() - start) * 1000)
    
    logs = list(state.get("telemetry_logs", []))
    logs.append({
        "step": 1,
        "agent": "Resume Analysis Agent (LangGraph Node)",
        "provider": result.get("provider", "LangChain LLM Chain"),
        "latency_ms": elapsed,
        "output_summary": f"Extracted {len(result['data'].get('skills', []))} skills & {result['data'].get('experience_years', 0)} yrs experience"
    })
    
    state["parsed_resume"] = result["data"]
    state["telemetry_logs"] = logs
    return state

@traceable(name="ATS Auditor Node", run_type="chain")
def ats_scorer_node(state: TalentFlowAgentState) -> TalentFlowAgentState:
    from app.ai.agents.ats_scorer_agent import ATSScorerAgent
    start = time.time()
    result = ATSScorerAgent.evaluate_ats(state.get("parsed_resume", {}), state.get("target_role", ""))
    elapsed = int((time.time() - start) * 1000)
    
    logs = list(state.get("telemetry_logs", []))
    logs.append({
        "step": 2,
        "agent": "ATS Optimization Agent (LangGraph Node)",
        "provider": result.get("provider", "LangChain Prompt Chain"),
        "latency_ms": elapsed,
        "output_summary": f"Calculated ATS Compliance Score: {result['data'].get('ats_score')}%"
    })
    
    state["ats_evaluation"] = result["data"]
    state["telemetry_logs"] = logs
    return state

@traceable(name="Skill Gap Analyst Node", run_type="chain")
def skill_gap_node(state: TalentFlowAgentState) -> TalentFlowAgentState:
    from app.ai.agents.skill_gap_agent import SkillGapAgent
    start = time.time()
    skills = state.get("parsed_resume", {}).get("skills", [])
    target = state.get("target_role", "AI Solutions Architect")
    result = SkillGapAgent.analyze_gaps(skills, target)
    elapsed = int((time.time() - start) * 1000)
    
    logs = list(state.get("telemetry_logs", []))
    logs.append({
        "step": 3,
        "agent": "Skill Gap Agent (LangGraph Node)",
        "provider": result.get("provider", "LangChain Vector Competency Chain"),
        "latency_ms": elapsed,
        "output_summary": f"Identified {len(result['data'].get('gap_skills', []))} priority gap skills"
    })
    
    state["skill_gaps"] = result["data"]
    state["telemetry_logs"] = logs
    return state

@traceable(name="Curriculum Architect Node", run_type="chain")
def learning_path_node(state: TalentFlowAgentState) -> TalentFlowAgentState:
    from app.ai.agents.learning_path_agent import LearningPathAgent
    start = time.time()
    gaps = state.get("skill_gaps", {}).get("gap_skills", [])
    target = state.get("target_role", "AI Solutions Architect")
    result = LearningPathAgent.generate_custom_plan(gaps, target)
    elapsed = int((time.time() - start) * 1000)
    
    logs = list(state.get("telemetry_logs", []))
    logs.append({
        "step": 4,
        "agent": "Learning Path Agent (LangGraph Node)",
        "provider": result.get("provider", "TakeUForward Daily Planner Graph"),
        "latency_ms": elapsed,
        "output_summary": "Architected customized N-Day daily study & practice planner"
    })
    
    state["learning_path"] = result["data"]
    state["telemetry_logs"] = logs
    return state

# Compile LangGraph StateGraph Workflow
def build_talentflow_graph():
    workflow = StateGraph(TalentFlowAgentState)
    
    workflow.add_node("parse_resume", resume_parser_node)
    workflow.add_node("evaluate_ats", ats_scorer_node)
    workflow.add_node("analyze_gaps", skill_gap_node)
    workflow.add_node("generate_curriculum", learning_path_node)
    
    workflow.add_edge(START, "parse_resume")
    workflow.add_edge("parse_resume", "evaluate_ats")
    workflow.add_edge("evaluate_ats", "analyze_gaps")
    workflow.add_edge("analyze_gaps", "generate_curriculum")
    workflow.add_edge("generate_curriculum", END)
    
    return workflow.compile()

talentflow_compiled_graph = build_talentflow_graph()
