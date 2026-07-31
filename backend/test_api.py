import sys
import os

# Add backend directory to module search path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token
from app.ai.orchestrator import AIOrchestrator
import json

def run_tests():
    print("==================================================")
    print("TalentFlow AI — Automated Core System Verification")
    print("==================================================")

    # 1. Config Check
    print(f"[OK] Project Name: {settings.PROJECT_NAME}")
    print(f"[OK] API Version: {settings.VERSION}")

    # 2. Security / JWT Check
    raw_pw = "TalentFlowSecured2026!"
    hashed_pw = get_password_hash(raw_pw)
    assert verify_password(raw_pw, hashed_pw), "Password verification failed"
    token = create_access_token("user-123", "candidate")
    payload = decode_token(token)
    assert payload["sub"] == "user-123", "JWT subject mismatch"
    assert payload["role"] == "candidate", "JWT role mismatch"
    print("[OK] Auth & JWT Security Utilities verified.")

    # 3. AI Orchestrator Verification (Testing Native Heuristic & Multi-Provider Fallback)
    output, provider, latency, fallback = AIOrchestrator.generate_completion(
        "Analyze candidate skills for Python and FastAPI", task_name="ats_analysis"
    )
    parsed = json.loads(output)
    assert "ats_score" in parsed, "ATS score missing in AI response"
    assert "skills" in parsed, "Skills missing in AI response"
    print(f"[OK] AI Orchestrator executed successfully via provider: '{provider}' ({latency}ms).")
    print(f"    Sample ATS Score: {parsed['ats_score']}% | Skills Extracted: {parsed['skills']}")

    # 4. Career Roadmap Generator Test
    roadmap_out, r_prov, r_lat, _ = AIOrchestrator.generate_completion(
        "Target Role: Full Stack AI Engineer", task_name="career_roadmap"
    )
    roadmap_json = json.loads(roadmap_out)
    assert "steps" in roadmap_json, "Steps missing in roadmap"
    print(f"[OK] AI Roadmap Engine verified ({len(roadmap_json['steps'])} steps generated).")

    print("\n[SUCCESS] ALL ZERO-COST BACKEND MODULES VERIFIED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
