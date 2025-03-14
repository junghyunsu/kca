# vector.py - 벡터 저장소 처리 전용 모듈
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

# 임베딩 및 벡터 저장소 생성
embeddings = OpenAIEmbeddings()
# 공통 정보를 벡터 저장소에 저장
vector_texts = [
    "나의 정보(직장): 프리랜서",
    "나의 정보(직업): 엔지니어",
    "나의 정보(이름): 정현수",
    "나의 정보(나이): 51"
]

# 추가: 여러 파일의 내용을 `vector_texts` 리스트에 추가
file_paths = [
    "bxm_sample/SSMP1001A.java",
    "bxm_sample/MSmpEmpInfMng.java",
    "bxm_sample/SHRABSN10101In.omm",
    "bxm_sample/SHRABSN10101Out.omm",
    "bxm_sample/SHRABSN10101Sub.omm",
    "bxm_sample/DHRAbsnYrly01IO.omm",
    "bxm_sample/selectAbsnYrlyList.sql",
]

for file_path in file_paths:
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            file_content = file.read()
            vector_texts.append(f"{file_path} 코드:\n{file_content}")
    except FileNotFoundError:
        print(f"⚠️ '{file_path}' 파일을 찾을 수 없습니다.")
    except Exception as e:
        print(f"⚠️ 파일 읽기 오류 ({file_path}): {e}")

# FAISS 벡터 저장소 생성
vectorstore = FAISS.from_texts(vector_texts, embeddings)


def search_vector(query: str) -> str:
    """
    벡터 저장소에서 입력 쿼리와 가장 유사한 문서를 검색하는 함수
    """
    relevant_docs = vectorstore.similarity_search(query)
    context = [doc.page_content for doc in relevant_docs]
    return context