# openai.py - OpenAI 모델 및 대화 관리 모듈
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableWithMessageHistory
from dotenv import load_dotenv
import os

# session_manager.py에서 세션 관리 기능 불러오기
from session_manager import get_session_history
from vector import search_vector  

# 환경 변수 로드
load_dotenv()

# OpenAI 모델 설정
chat = ChatOpenAI(model_name="gpt-4.5-preview", verbose=True,  temperature=0.7)

# 프롬프트 템플릿 설정
prompt = ChatPromptTemplate.from_messages([
    ("system", "당신은 도움이 되는 AI 비서입니다. 다음 정보를 참고하세요: \n{context}"),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

# 체인 설정
chain = prompt | chat

# 메시지 히스토리와 함께 실행 가능한 체인 생성
chain_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,  
    input_messages_key="input",
    history_messages_key="history"
)

def run_openai_chat(input_text: str, session_id: str = "conversation_session") -> str:
    """
    사용자의 입력을 받아 벡터 검색 후 AI 응답을 반환하는 함수
    """
    # 벡터 검색 수행
    context = search_vector("공통 부분")
    # print(f"Context: {context}")

    # 호출 직전에 수동으로 프롬프트 확인
    formatted_prompt = prompt.format(
        context=context,
        history=get_session_history(session_id).messages,
        input=input_text
    )
    print("프롬프트:", formatted_prompt)

    # OpenAI 체인 실행
    response = chain_with_history.invoke(
        {
            "context": context,
            "input": input_text
        },
        config={
            "configurable": {"session_id": session_id},
            "verbose": True
            }
    )

    # for debug
    # history = get_session_history("conversation_session")
    # for msg in history.get_messages():
    #     print(f"{msg.type}: {msg.content}")
    print("---------------------------------------------------------------------")
    return response.content  # AI 응답 반환


def run_continue_dev_context(input_text: str, session_id: str = "conversation_session") -> str:
    """
    continue-dev context provider 요청에 대해서 벡터 검색 prompt에 사용될 context를 반환하는 함수
    """
    # 벡터 검색 수행
    context = search_vector("나의 정보")
    # print(f"Context: {context}")
    print("---------------------------------------------------------------------")
    return context  # AI 응답 반환