# models.py - 공통 데이터 모델 정의
from pydantic import BaseModel, Field

# 요청 및 응답 데이터 모델
class BxmInput(BaseModel):
    object_type: str = Field("", description="service, bean, dbio 중 하나의 값을 입력하세요, 기본값 없음")
    query: str = Field(..., description="사용자 질의")
    isStreaming: bool = Field(True, description="Streaming 여부, 기본값 True")

class ContnueDevInput(BaseModel):
    query: str = Field(..., description="사용자 질의")
    fullInput: str

class ContinueDevOutput(BaseModel):
    name: str = Field("KRX Code Assistant", description="Context provider name")
    description: str = Field("KRX Code Assistant Context")
    content: str = Field(..., description="Context provider response")