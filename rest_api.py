import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from krx_openai import run_openai_chat 

# FastAPI 앱 생성
kca = FastAPI()

# 요청 및 응답 데이터 모델
class Chat(BaseModel):
    chat: str

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

# POST 요청 처리 (vector.py 함수 호출)
@kca.post("/chat/")
def chat(chat: Chat):
    response_text = run_openai_chat(chat.chat)  #  사용자의 입력을 vector.py로 전달
    return {"response": response_text}  #  AI 응답 반환

# API 서버 실행
if __name__ == "__main__":
    uvicorn.run(kca, host="0.0.0.0", port=8080)
