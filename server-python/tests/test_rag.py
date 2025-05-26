import os
from venv import logger
import requests
import pytest

API_BASE = os.getenv("AUTBOT_API_BASE", "http://localhost:3001")

@pytest.mark.parametrize("query, must_contain", [
    ("What's on her resume about analytics?", "behavioral analytics"),
    ("Tell me about her blog", "blog"),
    ("Where did Autumn work last?", "Automattic"),
    ("What was Autumn's job title?", "Engineering Lead"),
    ("What companies has Autumn worked for?", "ustwo"),
])
def test_rag_responses(query, must_contain):
    """Send a query and assert the LLM's answer mentions the expected keyword."""
    resp = requests.post(
        f"{API_BASE}/api/query",
        json={"query": query},
        timeout=10
    )
    assert resp.status_code == 200, f"Got HTTP {resp.status_code}"
    data = resp.json()
    answer = data.get("response", "").lower()
    assert must_contain.lower() in answer, (
        f"Answer for '{query}' = {answer!r} ...missing {must_contain!r}"
    )

def test_context_includes_resume():
    """Ensure at least one context chunk comes from the resume PDF."""
    resp = requests.post(f"{API_BASE}/api/query",
                         json={"query": "What's on her resume?"})
    assert resp.status_code == 200
    ctx = resp.json().get("context", [])
    # Check that we get context from the actual resume PDF file
    # Look for content that would be in AutumnFjeld_PM_Resume_20250514-0824.pdf
    resume_indicators = [
        "product engineering lead",  # Job title from resume
        "automattic",               # Recent company
        "wordpress",                # Company product
        "experience",               # Common resume section
        "skills",                   # Common resume section
        "Ph.D."
    ]
    
    found_resume_content = False
    for chunk in ctx:
        logger.info(f"Chunk: {chunk}")
        chunk_lower = chunk.lower()
        if any(indicator in chunk_lower for indicator in resume_indicators):
            found_resume_content = True
            break
    
    assert found_resume_content, f"No resume PDF content found in context. Got: {ctx[:2]}..."

def test_api_health():
    """Basic health check that the API is responding."""
    resp = requests.get(f"{API_BASE}/api/version")
    assert resp.status_code == 200
    data = resp.json()
    assert "version" in data

def test_empty_query_handling():
    """Test that empty queries are handled gracefully."""
    resp = requests.post(f"{API_BASE}/api/query", json={"query": ""})
    # Should either return 400 or a helpful response, not crash
    assert resp.status_code in [200, 400] 