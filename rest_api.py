import uvicorn
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
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

# POST 요청 처리: run_openai_chat 함수 호출
@kca.post("/chat/")
def chat(bxmInput: BxmInput):
    """
    FastAPI 엔드포인트: LLM과 대화하는 API
    - bxmInput.isStreaming=True: StreamingResponse로 스트리밍 응답 반환
    - bxmInput.isStreaming=False: 일반 JSON 응답 반환
    """
    if bxmInput.isStreaming:
        # Streaming 처리 (제너레이터 사용)
        def generate_response():
            for chunk in run_openai_chat(bxmInput):
                yield chunk  # 부분 응답 전송 (Chunk-by-Chunk)

        return StreamingResponse(generate_response(), media_type="text/plain")

    else:
        # 일반 응답
        responseText = run_openai_chat(bxmInput)
        return {"response": responseText}

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



@kca.post("/test/")
def continew_dev(continueDevInput: ContnueDevInput):
    print(f"body: {continueDevInput}")

# API 서버 실행
if __name__ == "__main__":
    uvicorn.run(kca, host="0.0.0.0", port=8080)