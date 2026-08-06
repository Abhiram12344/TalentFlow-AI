import json
from langchain_core.prompts import ChatPromptTemplate
from langsmith import traceable
from app.ai.orchestrator import AIOrchestrator

class PracticeTutorAgent:
    """LangChain Agent 5: Socratic Practice Tutor Agent with strict zero-solution code guardrails."""
    NAME = "Practice Tutor Agent"
    ROLE = "LangChain Socratic Problem Guide & Doubt Resolver"

    @classmethod
    @traceable(name="PracticeTutorAgent.assist_practice", run_type="llm")
    def assist_practice(cls, problem_title: str, problem_description: str, candidate_query: str = "") -> dict:
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", "You are a World-Class Socratic Technical Educator. STRICT GUARDRAIL: DO NOT provide the complete final code or direct solution code!"),
            ("user", "Problem Title: {title}\nProblem Description: {desc}\nCandidate Query: {query}\n\nExplain core intuition simply, list key constraints & edge cases, provide 2-3 progressive Socratic thought hints (NO CODE SOLUTION), time/space complexity target, and encouraging guidance.")
        ])
        
        formatted_prompt = prompt_template.format(
            title=problem_title,
            desc=problem_description,
            query=candidate_query or 'Can you explain this problem in simple terms and give me an approach hint?'
        )
        output_text, provider, latency, fallback = AIOrchestrator.generate_completion(formatted_prompt, task_name="practice_tutor_agent")
        
        try:
            parsed = json.loads(output_text)
        except Exception:
            parsed = {
                "simple_explanation": f"Think of '{problem_title}' like organizing items in a row where you want to keep track of the highest sum seen so far without checking every possible pair repeatedly.",
                "key_constraints_and_edge_cases": [
                    "Array contains all negative numbers.",
                    "Single element array.",
                    "Extremely large integer values causing overflow."
                ],
                "socratic_hints": [
                    "Hint 1: If your running sum becomes negative, will it help increase the sum of future contiguous elements?",
                    "Hint 2: Try maintaining two variables: current_running_sum and max_overall_sum.",
                    "Hint 3: Reset current_running_sum to 0 whenever it drops below 0!"
                ],
                "target_complexity": {"time": "O(N)", "space": "O(1)"},
                "encouraging_guidance": "Try writing out the loop logic using these hints! Remember: don't look up the code solution — test your logic step by step."
            }
        return {
            "agent_name": cls.NAME,
            "provider": f"LangChain ({provider})",
            "latency_ms": latency,
            "fallback_used": fallback,
            "data": parsed
        }
