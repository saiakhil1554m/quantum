from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.circuit import (
    CircuitExecutionRequest,
    CircuitExecutionResponse,
    CircuitOptimizationRequest,
    CircuitOptimizationResponse,
    CircuitSynthesisRequest,
    CircuitSynthesisResponse,
    FidelityGradeRequest,
    FidelityGradeResponse,
)
from backend.app.services.quantum_engine import (
    execute_circuit,
    optimize_circuit,
    grade_algorithm_fidelity,
    synthesize_circuit_from_prompt,
)

router = APIRouter(
    prefix="/api",
    tags=["Execution Engine & Quantum Transpiler"]
)

@router.post(
    "/execute",
    response_model=CircuitExecutionResponse,
    summary="Execute a quantum circuit and return probabilities, statevectors, and counts",
    description="Simulates circuit via Qiskit Aer with optional noise models (FakeManila/FakeCairo) and step-by-step statevectors for the Time-Travel Debugger."
)
def execute_quantum_circuit_endpoint(request: CircuitExecutionRequest):
    try:
        return execute_circuit(request)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Quantum Circuit Validation Error: {str(val_err)}"
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Quantum Engine Simulation Failure: {str(exc)}"
        )

@router.post(
    "/optimize",
    response_model=CircuitOptimizationResponse,
    summary="Optimize and transpile circuit to eliminate redundancies",
    description="Applies peephole optimization rules (H·H=I, CX·CX=I, rotation cancellation) and returns depth and gate reduction statistics."
)
def optimize_circuit_endpoint(request: CircuitOptimizationRequest):
    try:
        return optimize_circuit(request)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Circuit Optimization Error: {str(exc)}"
        )

@router.post(
    "/grade-fidelity",
    response_model=FidelityGradeResponse,
    summary="Auto-grade algorithm fidelity against reference statevectors",
    description="Computes exact state fidelity F = |<ψ_target|ψ_student>|^2 and awards gamified XP."
)
def grade_fidelity_endpoint(request: FidelityGradeRequest):
    try:
        return grade_algorithm_fidelity(request)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Fidelity Auto-Grader Error: {str(exc)}"
        )

@router.post(
    "/synthesize-circuit",
    response_model=CircuitSynthesisResponse,
    summary="Prompt-to-Circuit Natural Language Synthesis",
    description="Translates natural language prompts (e.g. 'Create 3-qubit GHZ state') into executable OpenQASM and visual gate layouts."
)
def synthesize_circuit_endpoint(request: CircuitSynthesisRequest):
    try:
        return synthesize_circuit_from_prompt(request)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Circuit Synthesis Error: {str(exc)}"
        )
