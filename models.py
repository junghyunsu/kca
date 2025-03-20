# models.py - 공통 데이터 모델 정의
from pydantic import BaseModel

# 요청 및 응답 데이터 모델
class BxmInput(BaseModel):
    object_type: str
    query: str
    isStreaming: bool = True

class ContnueDevInput(BaseModel):
    query: str
    fullInput: str

class ContinueDevOutput(BaseModel):
    name: str = "KRX Code Assistant" #Optional field
    description: str = "KRX Code Assistant Context" # Optional field
    content: str = "" #Required field