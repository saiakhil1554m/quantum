from typing import List
from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.tutor import TutorChatRequest, TutorChatResponse, DocIngestRequest
from backend.app.services.rag_service import search_quantum_docs, generate_socratic_response, add_custom_doc, get_indexed_docs

router = APIRouter(
    prefix="/api/tutor",
    tags=["AI Tutor & RAG"]
)

@router.post(
    "/chat",
    response_model=TutorChatResponse,
    summary="Ask AI Tutor a question with live circuit context and RAG document injection",
    description="Searches vector documentation and generates a Socratic response tailored to the student's active circuit payload."
)
def tutor_chat_endpoint(request: TutorChatRequest):
    try:
        circuit = request.circuit
        gate_summary_list = []
        for g in circuit.gates:
            controls_str = f" (ctrl q{g.controls})" if g.controls else ""
            gate_summary_list.append(f"{g.type} on q{g.targets}{controls_str} at step {g.position}")
        
        circuit_summary = (
            f"Qubits: {circuit.numQubits}. "
            f"Placed Gates: {', '.join(gate_summary_list) if gate_summary_list else 'Empty circuit (all qubits in |0⟩ state)'}."
        )

        exec_info = ""
        if request.executionResult and request.executionResult.success:
            exec_info = (
                f"Probabilities: {request.executionResult.probabilities}. "
                f"Shot Counts: {request.executionResult.counts}."
            )

        retrieved_docs = search_quantum_docs(request.query)

        ai_response = generate_socratic_response(
            query=request.query,
            circuit_summary=circuit_summary,
            retrieved_docs=retrieved_docs,
            execution_info=exec_info
        )

        return TutorChatResponse(
            response=ai_response,
            retrievedDocs=retrieved_docs,
            circuitSummary=circuit_summary
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Tutor Service Error: {str(exc)}"
        )

@router.post(
    "/ingest",
    summary="Ingest and train custom documents/notes into the RAG Vector Knowledge Base",
    description="Allows students or teachers to upload custom lecture notes, Qiskit tutorials, or LaTeX papers to train the AI Tutor."
)
def ingest_doc_endpoint(request: DocIngestRequest):
    try:
        return add_custom_doc(request.title, request.content)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Document Ingestion Failure: {str(exc)}"
        )

@router.get(
    "/docs",
    summary="Get all indexed RAG knowledge base documents",
    description="Returns list of all active quantum reference docs and custom ingested user notes."
)
def get_docs_endpoint():
    return get_indexed_docs()
