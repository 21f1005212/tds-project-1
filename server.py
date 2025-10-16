# server.py
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
import os, json, uuid, requests, asyncio
from dotenv import load_dotenv

load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
VERIFY_SECRET = os.getenv("MY_SECRET")  # your secret for dev test

app = FastAPI()

class TaskRequest(BaseModel):
    email: str
    secret: str
    task: str
    round: int
    nonce: str
    brief: str
    checks: list | None = []
    evaluation_url: str
    attachments: list | None = []

@app.post("/task")
async def task_endpoint(payload: TaskRequest):
    # Verify secret
    if payload.secret != VERIFY_SECRET:
        raise HTTPException(status_code=401, detail="invalid secret")

    # Respond quickly with 200 and JSON ack
    resp = {"status": "accepted", "task": payload.task, "round": payload.round, "nonce": payload.nonce}
    # Kick off background build flow
    asyncio.create_task(handle_build(payload.dict()))
    return resp
