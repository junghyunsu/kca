# session_manager.py - 세션 히스토리 관리 모듈
# 사용자의 최근 질의 응답을 여기에 저장
from langchain_core.messages import AIMessage, HumanMessage
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains.summarize import load_summarize_chain

from const import MODEL_NAME
llm = ChatOpenAI(model_name=MODEL_NAME, temperature=0)

class SmartSummaryMessageHistory:
    def __init__(self, max_length=5):
        self.messages = []
        self.summary = ""
        self.max_length = max_length  # 일정 길이 넘으면 요약 수행

    def add_messages(self, messages):
        self.messages.extend(messages)
        self._maybe_summarize()
        
    def add_user_message(self, message):
        self.messages.append(HumanMessage(content=message))
        self._maybe_summarize()

    def add_ai_message(self, message):
        self.messages.append(AIMessage(content=message))
        self._maybe_summarize()

    def get_messages(self):
        if self.summary:
            return [HumanMessage(content="이전 요약: " + self.summary)] + self.messages
        return self.messages

    def clear(self):
        self.messages = []
        self.summary = ""

    def _maybe_summarize(self):
        if len(self.messages) > self.max_length:
            print("⚠️ 요약 실행")
            self._summarize_messages()

    def _summarize_messages(self):
        # 메시지를 문자열로 변환
        text_blocks = [f"{m.type.upper()}: {m.content}" for m in self.messages]
        full_text = "\n".join(text_blocks)

        # 요약 체인 실행
        prompt_template = PromptTemplate.from_template("다음 대화를 간결하게 요약해줘:\n{text}")
        chain = prompt_template | llm

        summary_result = chain.invoke({"text": full_text})
        self.summary += "\n" + summary_result.content.strip()

        # 메시지 초기화 (요약만 남기고)
        self.messages = []

# 메시지 히스토리 저장소 (세션별 관리)
store = {}

# 세션 ID를 기반으로 메시지 히스토리를 관리하는 함수
def get_session_history(session_id: str):
    print(f"session_id: {session_id}")    
    if session_id not in store:
        store[session_id] = SmartSummaryMessageHistory(max_length=5)  # 적절히 조절
    return store[session_id]