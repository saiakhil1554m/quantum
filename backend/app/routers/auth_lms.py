from typing import List
from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.lms import UserRegisterRequest, UserLoginRequest, UserResponse, CourseModule
from backend.app.services import lms_service

router = APIRouter(
    prefix="/api",
    tags=["Authentication & LMS"]
)

@router.post("/auth/register", response_model=UserResponse)
def register_endpoint(request: UserRegisterRequest):
    try:
        return lms_service.register_user(request)
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))

@router.post("/auth/login", response_model=UserResponse)
def login_endpoint(request: UserLoginRequest):
    try:
        return lms_service.login_user(request)
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(val_err))

@router.get("/lms/modules", response_model=List[CourseModule])
def get_modules_endpoint():
    return lms_service.get_course_modules()
