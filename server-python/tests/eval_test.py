#!/usr/bin/env python3
"""
Evaluation testing script for AutBot LLM responses
"""

import sys
import os
# Add parent directory to path so we can import from server modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm_engine import query_engine, documents
from config import logger

def test_document_loading():
    """Test if documents are loaded correctly"""
    print("=" * 50)
    print("DOCUMENT LOADING TEST")
    print("=" * 50)
    
    for i, doc in enumerate(documents):
        filename = doc.metadata.get('file_name', 'Unknown')
        weight = doc.metadata.get('weight', 'No weight')
        doc_type = doc.metadata.get('doc_type', 'Unknown type')
        content_preview = doc.text[:200] + "..." if len(doc.text) > 200 else doc.text
        
        print(f"\nDocument {i+1}:")
        print(f"  File: {filename}")
        print(f"  Type: {doc_type}")
        print(f"  Weight: {weight}")
        print(f"  Content length: {len(doc.text)} characters")
        print(f"  Content preview: {content_preview}")
        print("-" * 30)

def test_queries():
    """Test specific queries that should work"""
    test_cases = [
        {
            "query": "Where did Autumn work last?",
            "expected_keywords": ["Automattic", "WordPress", "recent", "last"]
        },
        {
            "query": "What was Autumn's job title at her last role?",
            "expected_keywords": ["Product Engineering Lead", "Engineering Lead", "Automattic"]
        },
        {
            "query": "What companies has Autumn worked for?",
            "expected_keywords": ["Automattic", "ustwo", "company", "work"]
        }
    ]
    
    print("\n" + "=" * 50)
    print("QUERY TESTING")
    print("=" * 50)
    
    for i, test in enumerate(test_cases):
        print(f"\nTest {i+1}: {test['query']}")
        print("-" * 30)
        
        try:
            response = query_engine.query(test['query'])
            response_text = str(response)
            
            print(f"Response: {response_text}")
            
            # Check if expected keywords are in response
            found_keywords = []
            for keyword in test['expected_keywords']:
                if keyword.lower() in response_text.lower():
                    found_keywords.append(keyword)
            
            print(f"Expected keywords: {test['expected_keywords']}")
            print(f"Found keywords: {found_keywords}")
            print(f"Score: {len(found_keywords)}/{len(test['expected_keywords'])}")
            
        except Exception as e:
            print(f"ERROR: {e}")
        
        print("-" * 50)

def inspect_resume_content():
    """Specifically inspect the resume PDF content"""
    print("\n" + "=" * 50)
    print("RESUME CONTENT INSPECTION")
    print("=" * 50)
    
    resume_docs = [doc for doc in documents if 'resume' in doc.metadata.get('file_name', '').lower() or doc.metadata.get('doc_type') == 'resume']
    
    if not resume_docs:
        print("❌ No resume documents found!")
        return
    
    for doc in resume_docs:
        print(f"Resume file: {doc.metadata.get('file_name')}")
        print(f"Content length: {len(doc.text)} characters")
        print(f"Weight: {doc.metadata.get('weight')}")
        print("\nFull content:")
        print("-" * 30)
        print(doc.text)
        print("-" * 30)

def main():
    print("🔍 Starting AutBot Evaluation Tests")
    
    # Test document loading
    test_document_loading()
    
    # Inspect resume content specifically
    inspect_resume_content()
    
    # Test queries
    test_queries()
    
    print("\n✅ Evaluation complete!")

if __name__ == "__main__":
    main() 