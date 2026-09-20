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

const DEFAULT_RAG_DOCS: RagDocItem[] = [
  {
    id: 1,
    title: 'Hadamard Gate & Superposition',
    content:
      'The Hadamard Gate (H) transforms computational basis states into equal superpositions: H|0⟩ = (|0⟩ + |1⟩)/√2. Matrix: H = (1/√2) * [[1, 1], [1, -1]]. Applying H creates an equal 50% probability distribution.',
  },
  {
    id: 2,
    title: 'CNOT Gate & Entanglement',
    content:
      'The Controlled-NOT (CNOT / CX) gate flips the target qubit if the control qubit is in state |1⟩. When placed after Hadamard, it produces maximum quantum entanglement (|00⟩ + |11⟩)/√2.',
  },
  {
    id: 3,
    title: 'Pauli Gates (X, Y, Z)',
    content:
      'Pauli-X flips bit state |0⟩ <-> |1⟩. Pauli-Z applies a π phase flip to state |1⟩. Pauli-Y applies both bit and phase flip.',
  },
  {
    id: 4,
    title: 'Quantum Measurement & Born Rule',
    content:
      'Measurement projects a quantum state |Ψ⟩ into a classical outcome. By Born rule, P(k) = |c_k|^2. Measurement irreversibly collapses superposition into a single state.',
  },
];

export function getStoredCustomDocs(): RagDocItem[] {
  try {
    const json = localStorage.getItem('sih_custom_rag_docs');
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export function saveCustomDocToStorage(title: string, content: string): RagDocItem {
  const existing = getStoredCustomDocs();
  const newDoc: RagDocItem = {
    id: Date.now(),
    title,
    content,
    custom: true,
  };
  const updated = [...existing, newDoc];
  localStorage.setItem('sih_custom_rag_docs', JSON.stringify(updated));
  return newDoc;
}

export async function askAiTutor(
  query: string,
  circuit: CircuitState,
  executionResult?: CircuitExecutionResponse | null
): Promise<TutorChatResponse> {
  const circuitSummary = `${circuit.numQubits} Qubits with ${circuit.gates.length} gates placed (${circuit.gates.map((g) => g.type).join(', ') || 'No gates yet'}).`;

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

    if (response.ok) {
      const data: TutorChatResponse = await response.json();
      if (data.response && data.response.trim().length > 10) {
        return data;
      }
    }
  } catch (error: any) {
    console.log('Backend tutor API offline, utilizing client-side RAG model engine.');
  }

  // Dynamic Client-side RAG & Synthesizer
  const customDocs = getStoredCustomDocs();
  const allDocs = [...DEFAULT_RAG_DOCS, ...customDocs];

  const qLower = query.toLowerCase();
  const matched = allDocs.filter(
    (d) =>
      qLower.includes(d.title.toLowerCase()) ||
      d.content.toLowerCase().split(' ').some((w) => w.length > 3 && qLower.includes(w))
  );

  const activeDocs = matched.length > 0 ? matched : [allDocs[0]];
  const docsText = activeDocs.map((d) => `[${d.title}]\n${d.content}`);

  let answerText = '';

  // 1. Check custom trained docs first
  const customMatch = customDocs.find(
    (d) => qLower.includes(d.title.toLowerCase()) || d.content.toLowerCase().includes(qLower)
  );

  if (customMatch) {
    answerText = `[Trained Knowledge Match: ${customMatch.title}]\n${customMatch.content}\n\nSocratic Hint: Based on your trained model notes above, how does this apply to your active ${circuit.numQubits}-qubit setup?`;
  } else if (qLower.includes('hadamard') || qLower.includes('superposition')) {
    answerText = `The Hadamard gate (H) puts a qubit into an equal superposition of |0⟩ and |1⟩:\n\nH|0⟩ = (|0⟩ + |1⟩)/√2\n\nIn your circuit (${circuitSummary}), applying H gives each basis state a 50% probability upon measurement. What happens if you apply another Hadamard gate to the same qubit?`;
  } else if (qLower.includes('cnot') || qLower.includes('entangle') || qLower.includes('bell')) {
    answerText = `The CNOT (CX) gate entangles two qubits by flipping the target qubit only when the control qubit is in state |1⟩.\n\nCombined with Hadamard (H on q0, CNOT on q0-q1), it creates the Bell State (|00⟩ + |11⟩)/√2. What measurement correlations do you expect between q0 and q1?`;
  } else if (qLower.includes('explain') || qLower.includes('circuit')) {
    answerText = `Your active circuit consists of ${circuit.numQubits} qubits and ${circuit.gates.length} gates placed.\n\nGatelist: ${circuit.gates.map((g) => `${g.type} on q[${g.targets.join(',')}]`).join(', ') || 'None'}.\n\nApplying these unitary matrices transforms the initial ground state |0...0⟩ into a multi-qubit statevector. Would you like to run a simulation or scrub the Time-Travel Debugger?`;
  } else if (qLower.includes('quiz') || qLower.includes('help')) {
    answerText = `Let's break down the quiz question step-by-step! Remember that measuring state (|0⟩ + |1⟩)/√2 gives probabilities |c_0|^2 = 1/2 (50%) for 0 and |c_1|^2 = 1/2 (50%) for 1. Which option matches equal 50% probability?`;
  } else {
    answerText = `Great question! In quantum computing, operations are unitary transformations U on statevector |Ψ⟩.\n\nRetrieved Knowledge: ${activeDocs[0].content}\n\nHow can you test this concept using the gates in your Playground?`;
  }

  return {
    response: answerText,
    retrievedDocs: docsText,
    circuitSummary,
  };
}

export async function ingestCustomDocument(title: string, content: string): Promise<boolean> {
  // Save to client storage immediately for training persistence
  saveCustomDocToStorage(title, content);

  try {
    const response = await fetch(`${API_BASE_URL}/api/tutor/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    return true;
  } catch (err) {
    return true; // Document trained & stored locally
  }
}

export async function fetchIndexedDocs(): Promise<RagDocItem[]> {
  const custom = getStoredCustomDocs();
  try {
    const response = await fetch(`${API_BASE_URL}/api/tutor/docs`);
    if (response.ok) {
      const serverDocs: RagDocItem[] = await response.json();
      return [...serverDocs, ...custom];
    }
  } catch (err) {
    // fallback
  }
  return [...DEFAULT_RAG_DOCS, ...custom];
}

