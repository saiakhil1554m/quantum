from enum import Enum
from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class GateType(str, Enum):
    H = 'H'
    X = 'X'
    Y = 'Y'
    Z = 'Z'
    S = 'S'
    T = 'T'
    RX = 'RX'
    RY = 'RY'
    RZ = 'RZ'
    CNOT = 'CNOT'
    CZ = 'CZ'
    SWAP = 'SWAP'
    MEASURE = 'MEASURE'

class NoiseModelType(str, Enum):
    IDEAL = 'ideal'
    FAKE_MANILA = 'fake_manila'    # IBM Manila: realistic T1/T2 thermal relaxation & depolarizing
    FAKE_CAIRO = 'fake_cairo'      # IBM Cairo: realistic readout error and cross-talk

class GateParams(BaseModel):
    theta: Optional[float] = None
    phi: Optional[float] = None
    lam: Optional[float] = None

class GateModel(BaseModel):
    id: str = Field(description="Unique node/gate ID in the circuit layout")
    type: GateType
    targets: List[int] = Field(description="List of target qubit indices")
    controls: List[int] = Field(default_factory=list, description="List of control qubit indices")
    position: int = Field(default=0, description="Horizontal grid position/step")
    params: Optional[GateParams] = None

class QubitModel(BaseModel):
    id: int = Field(ge=0, description="Zero-based qubit index")
    label: str = Field(description="Human readable label like q[0]")
    initialState: Optional[str] = Field(default="0", description="Initial state |0> or |1>")

class CircuitState(BaseModel):
    numQubits: int = Field(gt=0, le=16, default=3, description="Total number of qubits (1 to 16)")
    numClassicalBits: int = Field(ge=0, le=16, default=3, description="Total number of classical bits")
    qubits: List[QubitModel]
    gates: List[GateModel]
    shots: Optional[int] = Field(default=1024, gt=0, le=8192)

class StateVectorElement(BaseModel):
    real: float
    imag: float
    magnitude: float
    phase: float

class TimeTravelStepState(BaseModel):
    step: int
    gateId: Optional[str] = None
    gateType: Optional[str] = None
    targets: List[int] = Field(default_factory=list)
    controls: List[int] = Field(default_factory=list)
    statevector: List[StateVectorElement]
    probabilities: Dict[str, float] = Field(default_factory=dict)
    description: str

class CircuitExecutionRequest(BaseModel):
    circuit: CircuitState
    shots: Optional[int] = Field(default=1024, gt=0, le=8192)
    includeStatevector: Optional[bool] = Field(default=True)
    noiseModel: Optional[NoiseModelType] = Field(default=NoiseModelType.IDEAL)
    recordTimeSteps: Optional[bool] = Field(default=True, description="Record step-by-step statevectors for time-travel debugger")

class CircuitExecutionResponse(BaseModel):
    success: bool
    counts: Dict[str, int] = Field(default_factory=dict)
    probabilities: Dict[str, float] = Field(default_factory=dict)
    statevector: Optional[List[StateVectorElement]] = None
    stepStatevectors: Optional[List[TimeTravelStepState]] = None
    noiseModelApplied: str = Field(default="ideal")
    qasm: Optional[str] = None
    error: Optional[str] = None
    executionTimeMs: float = Field(default=0.0)

# Optimization / Transpiler Schemas
class CircuitOptimizationRequest(BaseModel):
    circuit: CircuitState

class OptimizationRuleApplied(BaseModel):
    rule: str
    description: str
    affectedGateIds: List[str]

class CircuitOptimizationResponse(BaseModel):
    success: bool
    originalGateCount: int
    optimizedGateCount: int
    originalDepth: int
    optimizedDepth: int
    gateCountReduction: int
    depthReductionPct: float
    optimizationsApplied: List[OptimizationRuleApplied]
    optimizedCircuit: CircuitState
    qasm: str

# Natural Language Prompt-to-Circuit Synthesis
class CircuitSynthesisRequest(BaseModel):
    prompt: str

class CircuitSynthesisResponse(BaseModel):
    success: bool
    prompt: str
    circuit: CircuitState
    qasm: str
    explanation: str
    detectedAlgorithm: str

# Algorithm Fidelity Auto-Grader
class FidelityGradeRequest(BaseModel):
    circuit: CircuitState
    challengeId: str

class FidelityGradeResponse(BaseModel):
    success: bool
    challengeId: str
    challengeTitle: str
    fidelity: float # 0.0 to 1.0 ( |<target|student>|^2 )
    passed: bool
    xpAwarded: int
    feedback: str
    targetStateDescription: str
