import json
from app.ai.orchestrator import AIOrchestrator

class InterviewAgent:
    """Agent 7: Generates dynamic technical/behavioral interview questions and evaluates responses."""
    NAME = "Interview Agent"
    ROLE = "Mock Interview Evaluator"

    @classmethod
    def generate_questions(cls, target_role: str, topic: str) -> dict:
        prompt = f"""
        Role: Senior Technical Interviewer.
        Target Role: {target_role}
        Topic: {topic}

        Generate 3 technical & behavioral interview questions. Return JSON with:
        - "session_id": string
        - "questions": list of objects with "id" and "question"
        """
        output_text, provider, latency, fallback = AIOrchestrator.generate_completion(prompt, task_name="interview_agent_gen")
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
        return {"agent_name": cls.NAME, "provider": provider, "latency_ms": latency, "fallback_used": fallback, "data": parsed}

    @classmethod
    def evaluate_answer(cls, question: str, user_answer: str) -> dict:
        prompt = f"""
        Question: {question}
        User Answer: {user_answer}

        Evaluate response out of 100. Return JSON with score, feedback, strengths, and areas_to_improve.
        """
        output_text, provider, latency, fallback = AIOrchestrator.generate_completion(prompt, task_name="interview_agent_eval")
        try:
            parsed = json.loads(output_text)
        except Exception:
            parsed = {
                "score": 90.0,
                "feedback": "Strong answer demonstrating good technical understanding and clear articulation.",
                "strengths": ["Good architectural clarity", "Structured response"],
                "areas_to_improve": ["Mention specific latency benchmarks in ms"]
            }
        return {"agent_name": cls.NAME, "provider": provider, "latency_ms": latency, "fallback_used": fallback, "data": parsed}
