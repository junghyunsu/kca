import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

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
                "usage" : {
                    "url" : "http://localhost:8080/chat/",
                    "method" : "POST",
                    "body" : {
                        "prompt" : "string"
                        }
                }
            }

# 파라미터를 받는 GET 요청
# @kca.get("/items/{item_id}")
# def read_item(item_id: int, query: str = None):
#     return {"item_id": item_id, "query": query}

# POST 요청 (데이터 받기)
@kca.post("/chat/")
def create_item(item: Chat):
    return {"received_item": item}

# API 서버 실행 방법:
# uvicorn app:app --reload

if __name__ == "__main__":
    uvicorn.run(kca, host="0.0.0.0", port=8080)