import uuid
from typing import List, Dict, Optional
from backend.app.schemas.lms import CourseModule, UserResponse, UserRegisterRequest, UserLoginRequest
from backend.app.schemas.circuit import CircuitState, GateModel, GateType, QubitModel

# In-Memory DB Store (mirrors PostgreSQL tables)
USERS_DB: Dict[str, Dict] = {
    "demo": {
        "id": "usr-demo-123",
        "username": "quantum_explorer",
        "email": "demo@hackathon.sih",
        "password": "pass",
        "xp": 350,
        "completedModules": ["mod-1-superposition"],
    }
}

COURSE_MODULES: List[CourseModule] = [
    CourseModule(
        id="mod-1-superposition",
        title="Module 1: Creating Quantum Superposition",
        description="Learn how the Hadamard (H) gate transforms classical zero |0⟩ into equal superposition |+⟩ = (|0⟩ + |1⟩)/√2.",
        level="Beginner",
        xpReward=100,
        initialCircuit=CircuitState(
            numQubits=1,
            numClassicalBits=1,
            qubits=[QubitModel(id=0, label="q[0]")],
            gates=[]
        ),
        targetStateDescription="Apply an H gate on q[0] and observe 50% probability for |0⟩ and 50% for |1⟩."
    ),
    CourseModule(
        id="mod-2-entanglement",
        title="Module 2: Quantum Entanglement & Bell States",
        description="Construct the maximum entangled Bell State |Φ+⟩ using Hadamard and CNOT gates.",
        level="Intermediate",
        xpReward=150,
        initialCircuit=CircuitState(
            numQubits=2,
            numClassicalBits=2,
            qubits=[QubitModel(id=0, label="q[0]"), QubitModel(id=1, label="q[1]")],
            gates=[GateModel(id="init-h", type=GateType.H, targets=[0], position=0)]
        ),
        targetStateDescription="Add CNOT with control q[0] and target q[1] to generate 50% |00⟩ and 50% |11⟩."
    ),
    CourseModule(
        id="mod-3-teleportation",
        title="Module 3: Quantum Teleportation Protocol",
        description="Teleport an arbitrary unknown qubit state from Alice to Bob using a shared Bell pair.",
        level="Advanced",
        xpReward=250,
        initialCircuit=CircuitState(
            numQubits=3,
            numClassicalBits=3,
            qubits=[
                QubitModel(id=0, label="q[0] (psi)"),
                QubitModel(id=1, label="q[1] (Alice)"),
                QubitModel(id=2, label="q[2] (Bob)")
            ],
            gates=[
                GateModel(id="prep-x", type=GateType.X, targets=[0], position=0),
                GateModel(id="bell-h", type=GateType.H, targets=[1], position=1),
                GateModel(id="bell-cnot", type=GateType.CNOT, targets=[2], controls=[1], position=2)
            ]
        ),
        targetStateDescription="Complete Alice's Bell measurement and Bob's conditional X and Z correction gates."
    )
]

def register_user(req: UserRegisterRequest) -> UserResponse:
    if req.username in USERS_DB:
        raise ValueError(f"Username '{req.username}' is already taken.")
    
    user_id = f"usr-{uuid.uuid4().hex[:8]}"
    token = f"jwt-mock-{user_id}"
    
    USERS_DB[req.username] = {
        "id": user_id,
        "username": req.username,
        "email": req.email,
        "password": req.password,
        "xp": 100,
        "completedModules": [],
    }

    return UserResponse(
        id=user_id,
        username=req.username,
        email=req.email,
        token=token,
        xp=100,
        completedModules=[]
    )

def login_user(req: UserLoginRequest) -> UserResponse:
    user = USERS_DB.get(req.username)
    if not user or user["password"] != req.password:
        raise ValueError("Invalid username or password.")
    
    return UserResponse(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        token=f"jwt-mock-{user['id']}",
        xp=user["xp"],
        completedModules=user["completedModules"]
    )

def get_course_modules() -> List[CourseModule]:
    return COURSE_MODULES
