from typing import List, Optional
from pydantic import BaseModel, Field
from backend.app.schemas.circuit import CircuitState

class UserRegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: str
    password: str = Field(min_length=4)

class UserLoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    token: str
    xp: int = Field(default=250)
    completedModules: List[str] = Field(default_factory=list)

class CourseModule(BaseModel):
    id: str
    title: str
    description: str
    level: str  # 'Beginner', 'Intermediate', 'Advanced'
    xpReward: int
    initialCircuit: CircuitState
    targetStateDescription: str

class ProgressSaveRequest(BaseModel):
    moduleId: str
    completed: bool
    savedCircuit: CircuitState
