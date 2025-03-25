# openai.py - OpenAI 모델 및 대화 관리 모듈
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableWithMessageHistory
from dotenv import load_dotenv
from typing import Generator, Union

# session_manager.py에서 세션 관리 기능 불러오기
from session_manager import get_session_history
from vector import search_vector  

from models import BxmInput
from const import MODEL_NAME, TEMPERATURE, VERBOSE

# 환경 변수 로드
load_dotenv()

"""
사용자 Query에 필요한 Meta정보를 생성 리턴
현재는 벡터에서 검색 후 반환하는 함수
"""
def get_context(objectType: str) -> list[str]:
    # 검색어 리스트 (코드 샘플 + DTO 문법)
    service_search_terms = [
        "[BxmService Code Sample]",
        "SHRABSN10101In",
        "SHRABSN10101Out",
        "SHRABSN10101Sub"
    ]
    bean_search_terms = [
        "[BxmBean Code Sample]",
        "DHRAbsnYrly01IO"
    ]
    dbio_search_terms = [
        "[selectAbsnYrlyList 참조 테이블]"
    ]

    # objectType 값에 따라 적절한 searchTerms 선택
    if objectType.lower() == "service":
        searchTerms = service_search_terms
    elif objectType.lower() == "bean":
        searchTerms = bean_search_terms
    elif objectType.lower() == "dbio":
        searchTerms = dbio_search_terms
    else:
        searchTerms = []  # 잘못된 입력에 대한 기본값 처리

    # 여러 개의 검색어를 기반으로 벡터 검색 수행
    context = [search_vector(term) for term in searchTerms]
    
    return context


def run_openai_chat(bxmInput: BxmInput, sessionId: str = "conversation_session") -> Union[str, Generator[str, None, None]]:
    """
    LLM 호출 시 Streaming 여부를 결정하여 처리하는 함수
    - isStreaming=True: 부분 응답을 실시간으로 Streaming (Generator 사용)
    - isStreaming=False: 전체 응답을 한 번에 반환
    """
    # OpenAI 모델 설정
    # chat = ChatOpenAI(model_name="gpt-4.5-preview", verbose=True, temperature=0.7)
    chat = ChatOpenAI(model_name=MODEL_NAME, verbose=VERBOSE, temperature=TEMPERATURE)


    # 프롬프트 템플릿 설정
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an AI code generator.
Below is the necessary information for generating the requested code, including Code Samples, In/Out structures, or Table structures required for SQL generation.
Refer to this information to generate the appropriate code.:
    {context}"""),
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

    # context 가져오기
    context = get_context(bxmInput.object_type)
    # 호출 직전에 수동으로 프롬프트 확인
    formatted_prompt = prompt.format(
        context=context,
        history=get_session_history(sessionId).get_messages(),
        input=bxmInput.query
    )
    print(f"프롬프트:\n{formatted_prompt}")

    if bxmInput.isStreaming:
        # Streaming 모드: 부분 응답을 실시간으로 전송
        def generate_response():
            streaming_response = chain_with_history.stream(
                {
                    "context": context,
                    "input": bxmInput.query
                },
                config={
                    "configurable": {"session_id": sessionId},
                    "verbose": True
                }
            )
            for chunk in streaming_response:
                yield chunk.content  # 부분 응답을 실시간으로 반환
                print(chunk.content, end="", flush=True)  # 실시간 출력
        return generate_response()  # Generator 반환
    else:
        # 일반 모드: 전체 응답을 한 번에 반환
        response = chain_with_history.invoke(
            {
                "context": context,
                "input": bxmInput.query
            },
            config={
                "configurable": {"session_id": sessionId},
                "verbose": True
            }
        )

        print(f"""------------------------Response---------------------------------------------
{response.content}
----------------------------------------------------------------""", flush=True)

        return response.content  # 일반 응답 반환



def run_continue_dev_context(input_text: str, session_id: str = "conversation_session") -> list[str]:
    """
    continue-dev context provider 요청에 대해서 벡터 검색 prompt에 사용될 context를 반환하는 함수
    """
    # 벡터 검색 수행
    context = get_context("service")
    return context  # AI 응답 반환