# vector.py - 벡터 저장소 처리 전용 모듈
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

# 임베딩 및 벡터 저장소 생성
embeddings = OpenAIEmbeddings()

#공통 코드를 Vector DB에 저장해야 한다.
vectorstore = FAISS.from_texts([
    "공통 부분(코드): 이부분은 공통 코드 영역입니다.",
    "공통 부분(메타): 이 부분은 공통 메타 영역입니다."
    ], embeddings)

def search_vector(query: str) -> str:
    """
    벡터 저장소에서 입력 쿼리와 가장 유사한 문서를 검색하는 함수
    """
    relevant_docs = vectorstore.similarity_search(query)
    context = "\n".join([doc.page_content for doc in relevant_docs])
    return context
