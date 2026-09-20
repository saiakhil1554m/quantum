/// <reference types="vite/client" />
import { CircuitState, CircuitExecutionResponse } from '../types/quantum';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

export interface TutorChatResponse {
  response: string;
  retrievedDocs: string[];
  circuitSummary: string;
}

export interface RagDocItem {
  id: number;
  title: string;
  content: string;
  custom?: boolean;
}

export async function askAiTutor(
  query: string,
  circuit: CircuitState,
  executionResult?: CircuitExecutionResponse | null
): Promise<TutorChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tutor/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        circuit,
        executionResult: executionResult || undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data: TutorChatResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('AI Tutor API Error:', error);
    return {
      response:
        "I'm here to help guide you! In quantum mechanics, applying gates creates superposition or entanglement. Try running your simulation and ask me about your probability distribution!",
      retrievedDocs: ['[Quantum Basics]\nSuperposition allows qubits to exist in a linear combination of |0⟩ and |1⟩.'],
      circuitSummary: `${circuit.numQubits} Qubits with ${circuit.gates.length} gates placed.`,
    };
  }
}

export async function ingestCustomDocument(title: string, content: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tutor/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    return response.ok;
  } catch (err) {
    console.error('Document ingestion error:', err);
    return false;
  }
}

export async function fetchIndexedDocs(): Promise<RagDocItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tutor/docs`);
    if (!response.ok) return [];
    return await response.json();
  } catch (err) {
    console.error('Fetch docs error:', err);
    return [];
  }
}
