from typing import Dict, Any, List
from app.ai.agents.resume_parser_agent import ResumeParserAgent
from app.ai.agents.ats_scorer_agent import ATSScorerAgent
from app.ai.agents.skill_gap_agent import SkillGapAgent
from app.ai.agents.learning_path_agent import LearningPathAgent
from app.ai.agents.practice_tutor_agent import PracticeTutorAgent
from app.ai.agents.career_coach_agent import CareerCoachAgent
from app.ai.agents.interview_agent import InterviewAgent
from app.ai.agents.candidate_ranking_agent import CandidateRankingAgent

class MultiAgentOrchestrator:
    """
    Multi-Agent Collaboration Ecosystem Router.
    Coordinates sequential & stateful agent interactions and logs real-time agent execution telemetry.
    """
    
    @classmethod
    def execute_candidate_pipeline(cls, raw_resume_text: str, target_role: str = "AI Solutions Architect") -> Dict[str, Any]:
        telemetry_logs: List[Dict[str, Any]] = []

        # 1. Resume Parser Agent
        parse_res = ResumeParserAgent.parse_resume(raw_resume_text)
        telemetry_logs.append({
            "step": 1,
            "agent": parse_res["agent_name"],
            "provider": parse_res["provider"],
            "latency_ms": parse_res["latency_ms"],
            "output_summary": f"Extracted {len(parse_res['data'].get('skills', []))} skills"
        })
        parsed_data = parse_res["data"]

        # 2. ATS Scorer Agent
        ats_res = ATSScorerAgent.evaluate_ats(parsed_data, target_role)
        telemetry_logs.append({
            "step": 2,
            "agent": ats_res["agent_name"],
            "provider": ats_res["provider"],
            "latency_ms": ats_res["latency_ms"],
            "output_summary": f"ATS Score: {ats_res['data'].get('ats_score')}%"
        })

        # 3. Skill Gap Agent
        gap_res = SkillGapAgent.analyze_gaps(parsed_data.get("skills", []), target_role)
        telemetry_logs.append({
            "step": 3,
            "agent": gap_res["agent_name"],
            "provider": gap_res["provider"],
            "latency_ms": gap_res["latency_ms"],
            "output_summary": f"Identified {len(gap_res['data'].get('gap_skills', []))} skill gaps"
        })

        # 4. Learning Path Agent
        plan_res = LearningPathAgent.generate_custom_plan(gap_res['data'].get('gap_skills', []), target_role)
        telemetry_logs.append({
            "step": 4,
            "agent": plan_res["agent_name"],
            "provider": plan_res["provider"],
            "latency_ms": plan_res["latency_ms"],
            "output_summary": "Generated personalized N-day TakeUForward-style study & practice planner"
        })

        return {
            "pipeline_status": "Success",
            "telemetry_logs": telemetry_logs,
            "resume_analysis": parsed_data,
            "ats_evaluation": ats_res["data"],
            "skill_gaps": gap_res["data"],
            "learning_path": plan_res["data"]
        }
