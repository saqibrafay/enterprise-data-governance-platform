from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, users

app = FastAPI(
    title="Enterprise Data Governance Platform",
    version="0.1.0",
    description="Week 1: Auth + RBAC foundation",
)

# Allow the React dev server to call this API without CORS errors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)


@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok"}
