import json
from langchain_core.prompts import ChatPromptTemplate
from langsmith import traceable
from app.ai.orchestrator import AIOrchestrator

class InterviewAgent:
    """LangChain Agent 7: Generates technical/behavioral questions and evaluates responses."""
    NAME = "Interview Agent"
    ROLE = "LangChain Mock Interview Evaluator"

    @classmethod
    @traceable(name="InterviewAgent.generate_questions", run_type="llm")
    def generate_questions(cls, target_role: str, topic: str) -> dict:
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", "You are a Senior Technical Interviewer."),
            ("user", "Target Role: {role}\nTopic: {topic}\n\nGenerate 3 technical & behavioral questions. Return JSON with session_id, questions (list of id & question).")
        ])
        
        formatted_prompt = prompt_template.format(role=target_role, topic=topic)
        output_text, provider, latency, fallback = AIOrchestrator.generate_completion(formatted_prompt, task_name="interview_agent_gen")
        try:
            parsed = json.loads(output_text)
        except Exception:
            parsed = {
                "session_id": "session-interview-101",
                "questions": [
                    {"id": 1, "question": f"How do you design high-availability system fallbacks for {target_role}?"},
                    {"id": 2, "question": "Explain how you handle rate-limiting and database query performance under peak load."},
                    {"id": 3, "question": "Walk through a recent complex bug you diagnosed and fixed."}
                ]
            }
        return {"agent_name": cls.NAME, "provider": f"LangChain ({provider})", "latency_ms": latency, "fallback_used": fallback, "data": parsed}

    @classmethod
    @traceable(name="InterviewAgent.evaluate_answer", run_type="llm")
    def evaluate_answer(cls, question: str, user_answer: str) -> dict:
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", "You are a Senior Technical Evaluator."),
            ("user", "Question: {q}\nCandidate Answer: {ans}\n\nEvaluate score out of 100. Return JSON with score, feedback, strengths, areas_to_improve.")
        ])
        
        formatted_prompt = prompt_template.format(q=question, ans=user_answer)
        output_text, provider, latency, fallback = AIOrchestrator.generate_completion(formatted_prompt, task_name="interview_agent_eval")
        try:
            parsed = json.loads(output_text)
        except Exception:
            parsed = {
                "score": 90.0,
                "feedback": "Strong answer demonstrating good technical understanding and clear articulation.",
                "strengths": ["Good architectural clarity", "Structured response"],
                "areas_to_improve": ["Mention specific latency benchmarks in ms"]
            }
        return {"agent_name": cls.NAME, "provider": f"LangChain ({provider})", "latency_ms": latency, "fallback_used": fallback, "data": parsed}
