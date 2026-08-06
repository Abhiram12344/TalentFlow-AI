import json
from langchain_core.prompts import ChatPromptTemplate
from langsmith import traceable
from app.ai.orchestrator import AIOrchestrator

class CareerCoachAgent:
    """LangChain Agent 6: Conversational AI Career Coach & Strategy Assistant."""
    NAME = "Career Coach Agent"
    ROLE = "LangChain AI Career Mentor & Advisor"

    @classmethod
    @traceable(name="CareerCoachAgent.chat", run_type="llm")
    def chat(cls, user_message: str, chat_history: list = None) -> dict:
        history_str = "\n".join([f"{m.get('sender')}: {m.get('text')}" for m in (chat_history or [])[-5:]])
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", "You are a Principal Executive Career Coach & Technical Industry Mentor."),
            ("user", "Chat History:\n{history}\nUser Message: {user_message}\n\nReturn JSON with reply, recommended_next_action, key_takeaways.")
        ])
        
        formatted_prompt = prompt_template.format(history=history_str, user_message=user_message)
        output_text, provider, latency, fallback = AIOrchestrator.generate_completion(formatted_prompt, task_name="career_coach_agent")
        
        try:
            parsed = json.loads(output_text)
        except Exception:
            parsed = {
                "reply": "Focusing on core CS fundamentals alongside TakeUForward DSA practice will set you apart in senior engineering technical interviews. Try completing 1 practice problem daily in our TakeUForward DSA Sheet!",
                "recommended_next_action": "Complete Day 1 Array & Pointer Optimization practice problem.",
                "key_takeaways": [
                    "Consistency over intensity: 45 mins daily practice yields long-term mastery.",
                    "Practice explaining your thought process out loud before coding."
                ]
            }
        return {
            "agent_name": cls.NAME,
            "provider": f"LangChain ({provider})",
            "latency_ms": latency,
            "fallback_used": fallback,
            "data": parsed
        }
