import json
from app.ai.orchestrator import AIOrchestrator

class PracticeTutorAgent:
    """
    Agent 5: Socratic Practice Tutor Agent.
    Explains daily practice problems in simple terms and clarifies candidate doubts WITHOUT giving away the final solution code.
    """
    NAME = "Practice Tutor Agent"
    ROLE = "Socratic Problem Guide & Doubt Resolver"

    @classmethod
    def assist_practice(cls, problem_title: str, problem_description: str, candidate_query: str = "") -> dict:
        prompt = f"""
        Role: World-Class Socratic Technical Educator & Mentor.
        Problem Title: {problem_title}
        Problem Description/Challenge: {problem_description}
        Candidate Doubt/Query: {candidate_query or 'Can you explain this problem in simple terms and give me an approach hint?'}

        CRITICAL GUARDRAIL: DO NOT provide the complete final code or direct solution code!
        Instead:
        1. Explain the core intuition & real-world analogy in simple, beginner-friendly terms.
        2. Break down the key constraints and edge cases to watch out for.
        3. Provide 2-3 progressive Socratic thought hints to guide the candidate toward discovering the optimal approach themselves.
        4. Suggest time and space complexity targets (e.g., O(N) time, O(1) space).

        Return JSON with:
        - "simple_explanation": string intuitive breakdown with analogy
        - "key_constraints_and_edge_cases": list of strings
        - "socratic_hints": list of progressive hint strings (NO CODE SOLUTION)
        - "target_complexity": {{"time": string, "space": string}}
        - "encouraging_guidance": string
        """
        output_text, provider, latency, fallback = AIOrchestrator.generate_completion(prompt, task_name="practice_tutor_agent")
        
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
            "provider": provider,
            "latency_ms": latency,
            "fallback_used": fallback,
            "data": parsed
        }
