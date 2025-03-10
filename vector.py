# vector.py - 모듈 구조 변경 적용 버전
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableWithMessageHistory

# 메시지 히스토리를 위한 클래스 직접 구현
from langchain_core.messages import AIMessage, HumanMessage

class SimpleMessageHistory:
    def __init__(self):
        self.messages = []
    
    def add_user_message(self, message):
        self.messages.append(HumanMessage(content=message))
    
    def add_ai_message(self, message):
        self.messages.append(AIMessage(content=message))
    
    def clear(self):
        self.messages = []
    
    def get_messages(self):
        return self.messages

import os

# API 키 설정
openapi_key = "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"
os.environ["OPENAI_API_KEY"] = openapi_key

# OpenAI 모델 설정
chat = ChatOpenAI(model_name="gpt-4.5-preview")

# 임베딩 및 벡터 저장소 생성
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_texts(["LangChain은 기억하는 AI를 만들 수 있습니다."], embeddings)

# 직접 문서 검색
relevant_docs = vectorstore.similarity_search("기억하는 AI를 만들 수 있나요?")
context = "\n".join([doc.page_content for doc in relevant_docs])

# 프롬프트 템플릿 설정
prompt = ChatPromptTemplate.from_messages([
    ("system", "당신은 도움이 되는 AI 비서입니다. 다음 정보를 참고하세요: {context}"),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

# 메시지 히스토리 설정
store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = SimpleMessageHistory()
    return store[session_id]

# 체인 설정
chain = prompt | chat

# 메시지 히스토리와 함께 실행 가능한 체인 생성
chain_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history"
)

# 실행
session_id = "conversation_session"
response = chain_with_history.invoke(
    {
        "context": context,
        "input": "기억하는 AI를 만들 수 있나요?"
    },
    config={"configurable": {"session_id": session_id}}
)

print(response.content)