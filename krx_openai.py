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

"""
사용자 Query에 필요한 Meta정보를 생성 리턴
현재는 벡터에서 검색 후 반환하는 함수
"""
def get_context() -> list[str]:
    # 검색어 리스트 (BxmService 코드 샘플 + SHRABSN 관련 키워드)
    search_terms = [
        "[BxmService Code Sample]",
        "SHRABSN10101In",
        "SHRABSN10101Out",
        "SHRABSN10101Sub"
    ]

    # 여러 개의 검색어를 기반으로 벡터 검색 수행
    context = [search_vector(term) for term in search_terms]
    # print(f"Context: {context}")
    return context

def run_openai_chat(input_text: str, session_id: str = "conversation_session") -> str:
    # OpenAI 모델 설정
    chat = ChatOpenAI(model_name="gpt-4.5-preview", verbose=True,  temperature=0.7)

    # 프롬프트 템플릿 설정 (context를 system 메시지 내부에 포함)
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an AI code generator. Below is a sample format for code generation. 
    Use this format as a reference to generate the appropriate code.
    Refer to the sample code format as well as the input (In) and output (Out) structures used for user queries:
    {context}"""),
        MessagesPlaceholder(variable_name="history"),  # 히스토리만 Placeholder로 유지
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
        # output_messages_key="response"
    )

    # context 가져오기
    context = get_context()

    # 호출 직전에 수동으로 프롬프트 확인
    formatted_prompt = prompt.format(
        context=context,
        history=get_session_history(session_id).messages,
        input=input_text
    )
    print(f"프롬프트:\n{formatted_prompt}")

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
    print(f"""------------------------Response---------------------------------------------
{response.content}
----------------------------------------------------------------""")
          
    return response.content  # AI 응답 반환


def run_continue_dev_context(input_text: str, session_id: str = "conversation_session") -> list[str]:
    """
    continue-dev context provider 요청에 대해서 벡터 검색 prompt에 사용될 context를 반환하는 함수
    """
    # 벡터 검색 수행
    context = get_context()
    return context  # AI 응답 반환