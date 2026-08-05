import json
from app.ai.orchestrator import AIOrchestrator

class CareerCoachAgent:
    """Agent 6: Conversational AI Career Coach & Strategy Assistant."""
    NAME = "Career Coach Agent"
    ROLE = "AI Career Mentor & Advisor"

    @classmethod
    def chat(cls, user_message: str, chat_history: list = None) -> dict:
        history_str = "\n".join([f"{m.get('sender')}: {m.get('text')}" for m in (chat_history or [])[-5:]])
        prompt = f"""
        Role: Principal Executive Career Coach & Technical Industry Mentor.
        Chat History:
        {history_str}
        
        User Message: {user_message}

        Provide helpful, actionable, and encouraging career advice, interview strategies, or skill transition guidance.
        Return JSON with:
        - "reply": string conversational message
        - "recommended_next_action": string suggested next step
        - "key_takeaways": list of bullet takeaways
        """
        output_text, provider, latency, fallback = AIOrchestrator.generate_completion(prompt, task_name="career_coach_agent")
        
        try:
            parsed = json.loads(output_text)
        except Exception:
            parsed = {
                "reply": "Focusing on core CS fundamentals alongside Data Structures will set you apart in senior engineering technical interviews. Try completing 1 practice problem daily in our TakeUForward DSA Sheet!",
                "recommended_next_action": "Complete Day 1 Array & Pointer Optimization practice problem.",
                "key_takeaways": [
                    "Consistency over intensity: 45 mins daily practice yields long-term mastery.",
                    "Practice explaining your thought process out loud before coding."
                ]
            }
        return {
            "agent_name": cls.NAME,
            "provider": provider,
            "latency_ms": latency,
            "fallback_used": fallback,
            "data": parsed
        }
