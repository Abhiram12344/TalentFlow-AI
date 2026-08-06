import json
from langchain_core.prompts import ChatPromptTemplate
from langsmith import traceable
from app.ai.orchestrator import AIOrchestrator

class LearningPathAgent:
    """LangChain Agent 4: TakeUForward-Inspired Professional Learning Path & Daily Planner Agent."""
    NAME = "Learning Path Agent"
    ROLE = "LangChain Curriculum & Daily Study Architect"

    CURATED_DOMAINS = {
        "dsa": {
            "title": "DSA Sheet & Problem Solving",
            "description": "Inspired by TakeUForward Striver's A2Z DSA Sheet — Arrays to Advanced Dynamic Programming & Graphs.",
            "topics": [
                { "day": 1, "title": "Arrays & Pointers Optimization", "daily_learn": "Kadane's Algorithm, Two Pointers Technique, and Sliding Window Optimization.", "daily_practice": "Find Maximum Subarray Sum & 3Sum Problem (LeetCode Medium)", "difficulty": "Medium", "time_minutes": 45 },
                { "day": 2, "title": "Hashing & Frequency Maps", "daily_learn": "Hash Table Collision Resolution, Subarray with Given Sum, and Frequency Counting.", "daily_practice": "Longest Consecutive Sequence in O(N) Time", "difficulty": "Medium", "time_minutes": 45 },
                { "day": 3, "title": "Binary Search & Search Space", "daily_learn": "Lower Bound, Upper Bound, Search on Rotated Sorted Array, Search Space Reduction.", "daily_practice": "Book Allocation Problem & Capacity To Ship Packages Within N Days", "difficulty": "Hard", "time_minutes": 60 },
                { "day": 4, "title": "Linked Lists & Fast/Slow Pointers", "daily_learn": "Cycle Detection (Floyd's Tortoise & Hare), Reversing Linked List, Merge K Sorted Lists.", "daily_practice": "Detect and Remove Loop in Linked List", "difficulty": "Medium", "time_minutes": 50 },
                { "day": 5, "title": "Trees & Graph Traversals", "daily_learn": "DFS, BFS, Binary Search Tree Properties, LCA, Dijkstra's Shortest Path.", "daily_practice": "Lowest Common Ancestor in Binary Tree & Topological Sort", "difficulty": "Hard", "time_minutes": 60 }
            ]
        },
        "core_cs": {
            "title": "Core CS Fundamentals (OS, DBMS, Computer Networks)",
            "description": "Essential Core CS concepts required for top technical rounds and university excellence.",
            "topics": [
                { "day": 1, "title": "Operating Systems: Concurrency & Threads", "daily_learn": "Process vs Thread, Semaphores, Mutex Locks, Deadlock Conditions & Bankers Algorithm.", "daily_practice": "Analyze Producer-Consumer Problem using Semaphores & Deadlock Prevention Rules", "difficulty": "Medium", "time_minutes": 50 },
                { "day": 2, "title": "DBMS: SQL Indexing & Normalization", "daily_learn": "B-Tree vs Hash Indexes, 1NF to BCNF Normalization, ACID Properties, Isolation Levels.", "daily_practice": "Write Nth Highest Salary SQL Query & Design Normalized E-Commerce Schema", "difficulty": "Medium", "time_minutes": 45 },
                { "day": 3, "title": "Computer Networks: TCP/IP & HTTP/3", "daily_learn": "TCP 3-Way Handshake, SSL/TLS Encryption Handshake, DNS Resolution, HTTP vs HTTPS.", "daily_practice": "Trace Packet Flow from Browser URL Bar to Web Server Response", "difficulty": "Medium", "time_minutes": 40 }
            ]
        },
        "system_design": {
            "title": "System Design (HLD & LLD)",
            "description": "High Level & Low Level System Design for scalable distributed platforms.",
            "topics": [
                { "day": 1, "title": "High Level Design: Load Balancing & Caching", "daily_learn": "Consistent Hashing, CDN Caching Strategies (Write-Through vs Cache-Aside), Redis Cluster.", "daily_practice": "Design a Distributed Rate Limiter (Token Bucket Algorithm)", "difficulty": "Hard", "time_minutes": 60 },
                { "day": 2, "title": "Low Level Design: Object-Oriented Patterns", "daily_learn": "SOLID Principles, Factory, Strategy, Observer, and Singleton Patterns.", "daily_practice": "Design a Parking Lot System using SOLID Design Principles", "difficulty": "Medium", "time_minutes": 55 }
            ]
        },
        "aptitude": {
            "title": "Aptitude & Logical Reasoning",
            "description": "Quantitative Aptitude, Logical Reasoning, and Data Interpretation for screening rounds.",
            "topics": [
                { "day": 1, "title": "Quantitative: Speed, Distance & Work", "daily_learn": "Relative Speed Formulas, Work Rate Formulas, Train & Stream Problems.", "daily_practice": "Solve 10 Quantitative Problems on Pipes & Cisterns and Time-Work", "difficulty": "Easy-Medium", "time_minutes": 35 },
                { "day": 2, "title": "Logical Reasoning: Syllogisms & Seating", "daily_learn": "Venn Diagram Method for Syllogisms, Circular & Linear Seating Arrangements.", "daily_practice": "Solve 8 Complex Seating Arrangement Puzzles", "difficulty": "Medium", "time_minutes": 40 }
            ]
        }
    }

    @classmethod
    def get_curated_path(cls, domain: str = "dsa") -> dict:
        return cls.CURATED_DOMAINS.get(domain, cls.CURATED_DOMAINS["dsa"])

    @classmethod
    @traceable(name="LearningPathAgent.generate_custom_plan", run_type="llm")
    def generate_custom_plan(cls, gap_skills: list, target_role: str) -> dict:
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", "You are a TakeUForward Curriculum Architect. Generate an N-day structured daily study & practice schedule."),
            ("user", "Gap Skills: {gaps}\nTarget Role: {target_role}\n\nReturn JSON with domain_title, description, topics (list of objects with day, title, daily_learn, daily_practice, difficulty, time_minutes).")
        ])
        
        formatted_prompt = prompt_template.format(gaps=", ".join(gap_skills), target_role=target_role)
        output_text, provider, latency, fallback = AIOrchestrator.generate_completion(formatted_prompt, task_name="learning_path_agent")
        
        try:
            parsed = json.loads(output_text)
        except Exception:
            parsed = cls.CURATED_DOMAINS["dsa"]
            
        return {
            "agent_name": cls.NAME,
            "provider": f"LangChain ({provider})",
            "latency_ms": latency,
            "fallback_used": fallback,
            "data": parsed
        }
