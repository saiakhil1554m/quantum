from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from backend.app.routers import execution, tutor, auth_lms

app = FastAPI(
    title="Quantum Execution Engine & AI Tutor API",
    description="Backend service for Smart India Hackathon Quantum Platform (SIH26140)",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(execution.router)
app.include_router(tutor.router)
app.include_router(auth_lms.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Quantum Execution Engine, RAG AI Tutor & LMS Auth API",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
