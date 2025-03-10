# session_manager.py - 세션 히스토리 관리 모듈
# 사용자의 최근 질의 응답을 여기에 저장
from langchain_core.messages import AIMessage, HumanMessage

class SimpleMessageHistory:
    def __init__(self):
        self.messages = []

    def add_messages(self, messages):
        self.messages.extend(messages)

    def add_user_message(self, message):
        self.messages.append(HumanMessage(content=message))

    def add_ai_message(self, message):
        self.messages.append(AIMessage(content=message))

    def clear(self):
        self.messages = []

    def get_messages(self):
        return self.messages

# 메시지 히스토리 저장소 (세션별 관리)
store = {}

def get_session_history(session_id: str):
    print(f"session_id: {session_id}")
    """ 세션 ID를 기반으로 메시지 히스토리를 관리하는 함수 """
    if session_id not in store:
        store[session_id] = SimpleMessageHistory()
    return store[session_id]
