import os
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage

# OpenAI API 키 설정
os.environ["OPENAI_API_KEY"] = "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"

# ChatOpenAI 모델 초기화
chat = ChatOpenAI(model_name="gpt-4.5-preview", temperature=0.7)

# 사용자 입력 메시지
messages = [HumanMessage(content='너는 이전에 질문했던 내용을 기억하고 있니?')]

# 모델 응답 생성
response = chat(messages)

# 결과 출력
print(response.content)

#curl https://api.openai.com/v1/models -H "Authorization: Bearer "