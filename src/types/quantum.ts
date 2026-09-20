export enum GateType {
  H = 'H',
  X = 'X',
  Y = 'Y',
  Z = 'Z',
  S = 'S',
  T = 'T',
  RX = 'RX',
  RY = 'RY',
  RZ = 'RZ',
  CNOT = 'CNOT',
  CZ = 'CZ',
  SWAP = 'SWAP',
  MEASURE = 'MEASURE',
}

export type NoiseModelType = 'ideal' | 'fake_manila' | 'fake_cairo';

export interface GateParams {
  theta?: number | string;
  phi?: number | string;
  lam?: number | string;
}

export interface GateModel {
  id: string;
  type: GateType;
  targets: number[];
  controls?: number[];
  position: number; // grid column step
  params?: GateParams;
}

export interface QubitModel {
  id: number; // qubit index e.g. 0, 1, 2
  label: string; // e.g. "q[0]"
  initialState?: string; // "|0⟩" or "|1⟩"
}

export interface CircuitState {
  numQubits: number;
  numClassicalBits: number;
  qubits: QubitModel[];
  gates: GateModel[];
  shots?: number;
}

export interface StateVectorElement {
  real: number;
  imag: number;
  magnitude: number;
  phase: number;
}

export interface TimeTravelStepState {
  step: number;
  gateId?: string;
  gateType?: string;
  targets: number[];
  controls: number[];
  statevector: StateVectorElement[];
  probabilities: Record<string, number>;
  description: string;
}

export interface CircuitExecutionRequest {
  circuit: CircuitState;
  shots?: number;
  includeStatevector?: boolean;
  noiseModel?: NoiseModelType;
  recordTimeSteps?: boolean;
}

export interface CircuitExecutionResponse {
  success: boolean;
  counts: Record<string, number>;
  probabilities: Record<string, number>;
  statevector?: StateVectorElement[];
  stepStatevectors?: TimeTravelStepState[];
  noiseModelApplied?: string;
  qasm?: string;
  error?: string;
  executionTimeMs: number;
}

export interface OptimizationRuleApplied {
  rule: string;
  description: string;
  affectedGateIds: string[];
}

export interface CircuitOptimizationResponse {
  success: boolean;
  originalGateCount: number;
  optimizedGateCount: number;
  originalDepth: number;
  optimizedDepth: number;
  gateCountReduction: number;
  depthReductionPct: number;
  optimizationsApplied: OptimizationRuleApplied[];
  optimizedCircuit: CircuitState;
  qasm: string;
}

export interface CircuitSynthesisResponse {
  success: boolean;
  prompt: string;
  circuit: CircuitState;
  qasm: string;
  explanation: string;
  detectedAlgorithm: string;
}

export interface FidelityGradeResponse {
  success: boolean;
  challengeId: string;
  challengeTitle: string;
  fidelity: number;
  passed: boolean;
  xpAwarded: number;
  feedback: string;
  targetStateDescription: string;
}
