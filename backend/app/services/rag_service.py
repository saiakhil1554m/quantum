import os
import math
from typing import List, Dict, Tuple
from dotenv import load_dotenv

load_dotenv()

# Pre-populated Quantum Computing Knowledge Base RAG Chunks
QUANTUM_DOCS: List[Dict] = [
    {
        "id": 1,
        "title": "Hadamard Gate & Superposition",
        "content": (
            "The Hadamard Gate (H) transforms computational basis states into equal superpositions:\n"
            "H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩\n"
            "H|1⟩ = (|0⟩ - |1⟩)/√2 = |-⟩\n"
            "Matrix representation: H = (1/√2) * [[1, 1], [1, -1]]. "
            "Applying H to n qubits in |0...0⟩ creates an equal superposition over all 2^n computational basis states."
        )
    },
    {
        "id": 2,
        "title": "CNOT Gate & Quantum Entanglement",
        "content": (
            "The Controlled-NOT (CNOT / CX) gate operates on 2 qubits: a control qubit and a target qubit. "
            "It flips the target qubit if and only if the control qubit is in state |1⟩:\n"
            "CNOT|00⟩ = |00⟩, CNOT|01⟩ = |01⟩, CNOT|10⟩ = |11⟩, CNOT|11⟩ = |10⟩.\n"
            "When applied after a Hadamard gate (H on q[0], CNOT with control q[0] and target q[1]), "
            "it produces the Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2. This is maximum quantum entanglement."
        )
    },
    {
        "id": 3,
        "title": "Pauli Gates (X, Y, Z)",
        "content": (
            "Pauli-X (Bit Flip): X|0⟩ = |1⟩, X|1⟩ = |0⟩. Matrix: [[0, 1], [1, 0]]. Equivalent to quantum NOT.\n"
            "Pauli-Z (Phase Flip): Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩. Matrix: [[1, 0], [0, -1]]. Flips phase of |1⟩.\n"
            "Pauli-Y (Bit & Phase Flip): Y|0⟩ = i|1⟩, Y|1⟩ = -i|0⟩. Matrix: [[0, -i], [i, 0]]."
        )
    },
    {
        "id": 4,
        "title": "Quantum Measurement & State Collapse",
        "content": (
            "Measurement projects a continuous quantum superposition state |Ψ⟩ = Σ c_i |i⟩ into a single definite "
            "classical state |k⟩ with probability P(k) = |c_k|^2. "
            "Upon measurement, the state irreversibly collapses to |k⟩ and quantum superposition is lost."
        )
    },
    {
        "id": 5,
        "title": "Quantum Teleportation Protocol",
        "content": (
            "Quantum Teleportation transmits an unknown qubit state |ψ⟩ from Alice to Bob using an entangled Bell pair "
            "and 2 classical bits of communication. "
            "Steps: 1. Create Bell pair between Alice & Bob. 2. Alice applies CNOT(ψ, Alice_bell) and H(ψ). "
            "3. Alice measures her 2 qubits. 4. Bob applies X and/or Z gates based on Alice's classical measurement results."
        )
    },
    {
        "id": 6,
        "title": "Phase & Rotation Gates (S, T, Rx, Ry, Rz)",
        "content": (
            "Phase gate S = diag(1, i) applies a π/2 (90°) phase shift to |1⟩.\n"
            "T gate = diag(1, e^{iπ/4}) applies a π/4 (45°) phase shift.\n"
            "Rotation gates Rx(θ), Ry(θ), Rz(θ) rotate the qubit vector around the corresponding axis on the Bloch sphere."
        )
    }
]

def search_quantum_docs(query: str, top_k: int = 2) -> List[str]:
    """Retrieves top relevant documentation chunks based on vector/keyword similarity."""
    query_lower = query.lower()
    scored_docs: List[Tuple[float, str]] = []

    for doc in QUANTUM_DOCS:
        score = 0.0
        words = doc["title"].lower().split() + doc["content"].lower().split()
        for q_word in query_lower.split():
            if len(q_word) > 2 and q_word in words:
                score += 1.0
            if q_word in doc["title"].lower():
                score += 2.5
        
        if score > 0:
            scored_docs.append((score, f"[{doc['title']}]\n{doc['content']}"))

    scored_docs.sort(key=lambda x: x[0], reverse=True)
    if not scored_docs:
        return [f"[{d['title']}]\n{d['content']}" for d in QUANTUM_DOCS[:2]]
    
    return [doc_text for _, doc_text in scored_docs[:top_k]]

def add_custom_doc(title: str, content: str) -> Dict:
    """Ingests custom user-provided documentation or lecture notes into RAG knowledge base."""
    new_id = len(QUANTUM_DOCS) + 1
    doc_entry = {
        "id": new_id,
        "title": title,
        "content": content,
        "custom": True
    }
    QUANTUM_DOCS.append(doc_entry)
    return {
        "status": "success",
        "message": f"Successfully ingested and indexed document '{title}' into RAG Vector Knowledge Base!",
        "docId": new_id,
        "totalDocs": len(QUANTUM_DOCS)
    }

def get_indexed_docs() -> List[Dict]:
    """Returns list of all currently indexed RAG documents."""
    return QUANTUM_DOCS

def generate_socratic_response(query: str, circuit_summary: str, retrieved_docs: List[str], execution_info: str = "") -> str:
    """Generates a Socratic AI response injecting circuit context and retrieved documentation."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    docs_context = "\n\n".join(retrieved_docs)

    prompt = f"""You are an elite, encouraging Socratic AI Quantum Computing Tutor assisting a student building quantum circuits.

STUDENT'S QUESTION:
"{query}"

CURRENT ACTIVE QUANTUM CIRCUIT CONTEXT:
{circuit_summary}

SIMULATION EXECUTION RESULTS:
{execution_info if execution_info else "No simulation executed yet."}

RETRIEVED QUANTUM REFERENCE DOCUMENTATION (RAG):
{docs_context}

INSTRUCTIONS:
1. Be concise, highly clear, and Socratic. Explain the underlying physics or linear algebra (use LaTeX notation like |0⟩, |1⟩, H, CNOT where helpful).
2. Directly reference the student's CURRENT ACTIVE CIRCUIT (the gates they placed on which qubits).
3. Do NOT just give a dry raw answer — ask 1 guiding question at the end to prompt deeper critical thinking.
4. Keep the response under 150 words.
"""

    if api_key:
        models_to_try = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            for m in models_to_try:
                try:
                    response = client.models.generate_content(
                        model=m,
                        contents=prompt
                    )
                    if response and response.text:
                        return response.text.strip()
                except Exception:
                    continue
        except Exception as e:
            print("Gemini API call notice, falling back to local Socratic synthesis:", e)

    # Smart local Socratic fallback synthesizer if API key is not present or offline
    fallback_intro = "Great question! Let's analyze your active circuit step-by-step:\n\n"
    doc_highlight = f"Reference Concept:\n{retrieved_docs[0] if retrieved_docs else ''}\n\n"
    socratic_guidance = (
        f"In your circuit ({circuit_summary}), notice how applying gates modifies the quantum statevector. "
        "When gates interact with multiple qubits, they create linear combinations of states. "
        "What do you predict will happen to the probability distribution if you add a Measurement (M) gate at the end?"
    )
    return fallback_intro + doc_highlight + socratic_guidance
