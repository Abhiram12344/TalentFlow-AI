import time
import os
import json
from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, START, END
from langsmith import traceable
from app.ai.tools import (
    extract_resume_entities_tool,
    calculate_ats_audit_tool,
    fetch_skill_gap_matrix_tool
)

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

@traceable(name="Resume Parser Agent Node", run_type="tool")
def resume_parser_node(state: TalentFlowAgentState) -> TalentFlowAgentState:
    from app.ai.agents.resume_parser_agent import ResumeParserAgent
    start = time.time()
    
    # Execute Tool Call
    tool_output_str = extract_resume_entities_tool.invoke({"raw_text": state["raw_resume_text"]})
    try:
        parsed = json.loads(tool_output_str)
    except Exception:
        result = ResumeParserAgent.parse_resume(state["raw_resume_text"])
        parsed = result["data"]

    elapsed = int((time.time() - start) * 1000)
    
    logs = list(state.get("telemetry_logs", []))
    logs.append({
        "step": 1,
        "agent": "Resume Analysis Agent",
        "tool_called": "extract_resume_entities_tool",
        "tool_input": f"raw_text ({len(state['raw_resume_text'])} chars)",
        "tool_output": f"Extracted {len(parsed.get('skills', []))} skills",
        "provider": "LangChain Tool Node",
        "latency_ms": elapsed,
        "output_summary": f"Extracted {len(parsed.get('skills', []))} skills & {parsed.get('experience_years', 0)} yrs experience"
    })
    
    state["parsed_resume"] = parsed
    state["telemetry_logs"] = logs
    return state

@traceable(name="ATS Auditor Agent Node", run_type="tool")
def ats_scorer_node(state: TalentFlowAgentState) -> TalentFlowAgentState:
    from app.ai.agents.ats_scorer_agent import ATSScorerAgent
    start = time.time()
    
    # Execute Tool Call
    parsed_json_str = json.dumps(state.get("parsed_resume", {}))
    target_jd = state.get("target_role", "AI Solutions Architect")
    
    tool_output_str = calculate_ats_audit_tool.invoke({"resume_json_str": parsed_json_str, "target_jd": target_jd})
    try:
        ats_data = json.loads(tool_output_str)
    except Exception:
        result = ATSScorerAgent.evaluate_ats(state.get("parsed_resume", {}), target_jd)
        ats_data = result["data"]

    elapsed = int((time.time() - start) * 1000)
    
    logs = list(state.get("telemetry_logs", []))
    logs.append({
        "step": 2,
        "agent": "ATS Optimization Agent",
        "tool_called": "calculate_ats_audit_tool",
        "tool_input": f"target_jd: '{target_jd}'",
        "tool_output": f"ATS Score: {ats_data.get('ats_score')}%",
        "provider": "LangChain Tool Node",
        "latency_ms": elapsed,
        "output_summary": f"Calculated ATS Compliance Score: {ats_data.get('ats_score')}%"
    })
    
    state["ats_evaluation"] = ats_data
    state["telemetry_logs"] = logs
    return state

@traceable(name="Skill Gap Analyst Node", run_type="tool")
def skill_gap_node(state: TalentFlowAgentState) -> TalentFlowAgentState:
    from app.ai.agents.skill_gap_agent import SkillGapAgent
    start = time.time()
    
    skills_list = state.get("parsed_resume", {}).get("skills", ["Python", "FastAPI"])
    skills_csv = ", ".join(skills_list)
    target_role = state.get("target_role", "AI Solutions Architect")
    
    # Execute Tool Call
    tool_output_str = fetch_skill_gap_matrix_tool.invoke({"skills_csv": skills_csv, "target_role": target_role})
    try:
        gap_data = json.loads(tool_output_str)
    except Exception:
        result = SkillGapAgent.analyze_gaps(skills_list, target_role)
        gap_data = result["data"]

    elapsed = int((time.time() - start) * 1000)
    
    logs = list(state.get("telemetry_logs", []))
    logs.append({
        "step": 3,
        "agent": "Skill Gap Agent",
        "tool_called": "fetch_skill_gap_matrix_tool",
        "tool_input": f"skills_csv: '{skills_csv}'",
        "tool_output": f"Identified {len(gap_data.get('gap_skills', []))} gap skills",
        "provider": "LangChain Tool Node",
        "latency_ms": elapsed,
        "output_summary": f"Identified {len(gap_data.get('gap_skills', []))} priority gap skills"
    })
    
    state["skill_gaps"] = gap_data
    state["telemetry_logs"] = logs
    return state

@traceable(name="Curriculum Architect Node", run_type="tool")
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
        "agent": "Learning Path Agent",
        "tool_called": "generate_hierarchical_curriculum_tool",
        "tool_input": f"target_role: '{target}'",
        "tool_output": "Architected full hierarchical course syllabus",
        "provider": "LangChain Tool Node",
        "latency_ms": elapsed,
        "output_summary": "Architected full hierarchical course syllabus (Modules ➔ Topics ➔ Sub-Topics)"
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
