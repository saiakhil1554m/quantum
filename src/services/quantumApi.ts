/// <reference types="vite/client" />
import {
  CircuitExecutionRequest,
  CircuitExecutionResponse,
  CircuitState,
  CircuitOptimizationResponse,
  CircuitSynthesisResponse,
  FidelityGradeResponse,
} from '../types/quantum';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

export async function executeCircuit(
  request: CircuitExecutionRequest
): Promise<CircuitExecutionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Simulation execution failed' }));
      throw new Error(errorData.detail || `Server returned status ${response.status}`);
    }

    const data: CircuitExecutionResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('Quantum Execution Error:', error);
    return {
      success: false,
      counts: {},
      probabilities: {},
      error: error.message || 'Network or simulation error occurred',
      executionTimeMs: 0,
    };
  }
}

export async function optimizeCircuit(
  circuit: CircuitState
): Promise<CircuitOptimizationResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ circuit }),
    });
    if (!response.ok) throw new Error('Optimization request failed');
    return await response.json();
  } catch (err) {
    console.error('Optimization error:', err);
    return null;
  }
}

export async function synthesizeCircuitFromPrompt(
  prompt: string
): Promise<CircuitSynthesisResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/synthesize-circuit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) throw new Error('Circuit synthesis failed');
    return await response.json();
  } catch (err) {
    console.error('Circuit synthesis error:', err);
    return null;
  }
}

export async function gradeAlgorithmFidelity(
  circuit: CircuitState,
  challengeId: string
): Promise<FidelityGradeResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/grade-fidelity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ circuit, challengeId }),
    });
    if (!response.ok) throw new Error('Fidelity grading failed');
    return await response.json();
  } catch (err) {
    console.error('Fidelity grading error:', err);
    return null;
  }
}
