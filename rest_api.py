import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from krx_openai import run_openai_chat, run_continue_dev_context
from models import BxmInput, ContnueDevInput, ContinueDevOutput

# FastAPI 앱 생성
kca = FastAPI()

# 기본 GET 요청
@kca.get("/")
def read_root():
    return {
        "message": "Hello, KRX Code Assistant",
        "usage": {
            "url": "http://localhost:8080/chat/",
            "method": "POST",
            "body": {
                "chat": "string"
            }
        }
    }

# POST 요청 처리 run_openai_chat 함수 호출
@kca.post("/chat/")
def chat(bxmInput: BxmInput):
    responseText = run_openai_chat(bxmInput)  #  사용자의 입력을 vector.py로 전달
    return {"response": responseText}  #  AI 응답 반환

# POST continue-dev context-provider 처리 run_continue_dev_context 함수 호출
@kca.post("/continue-dev/")
def continew_dev(continueDevInput: ContnueDevInput):
    print(f"query: {continueDevInput.query}")
    # Vector DB만 검색한 결과를 context로 전달
    context = run_continue_dev_context(continueDevInput.query)
    context = ["\n".join(item) if isinstance(item, list) else item for item in context]

    retStr = "\n\n".join(context)
    print(f"context: {retStr}")
    return ContinueDevOutput(content=retStr)  # continue-dev OUt으로 생성

# API 서버 실행
if __name__ == "__main__":
    uvicorn.run(kca, host="0.0.0.0", port=8080)