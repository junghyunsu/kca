[selectAbsnYrlyList 참조 테이블]
-- 인사 마스터 테이블
CREATE TABLE HR_PRSN_MSTR (
    CRPR_CD VARCHAR(10) NOT NULL,  -- 법인코드
    EMPL_NO VARCHAR(20) NOT NULL,  -- 사원번호
    EMPL_NM VARCHAR(50),           -- 성명
    JOIN_YMD DATE,                 -- 입사일자
    GRP_JOIN_YMD DATE,             -- 그룹입사일자
    YRLY_BASE_YMD DATE,            -- 연차기산일자
    RTRM_YMD DATE,                 -- 퇴직일자
    DPRT_CD VARCHAR(10),           -- 부서코드
    ORGN_SITE_CD VARCHAR(10),      -- 원소속사업장코드
    PRIMARY KEY (CRPR_CD, EMPL_NO)
);

-- 인사 이력 테이블
CREATE TABLE HR_PRSN_MSTR_HSTR (
    CRPR_CD VARCHAR(10) NOT NULL,
    EMPL_NO VARCHAR(20) NOT NULL,
    STRT_YMD DATE NOT NULL,        -- 시작일자
    DPRT_CD VARCHAR(10),           -- 부서코드
    PSTN_CD VARCHAR(10),           -- 직위코드
    EMPL_GB_CD VARCHAR(10),        -- 사원구분코드
    WORK_ST_CD VARCHAR(10),        -- 근무상태코드
    PRIMARY KEY (CRPR_CD, EMPL_NO, STRT_YMD)
);

-- 연차 정보 테이블
CREATE TABLE HR_ABSN_YRLY (
    CRPR_CD VARCHAR(10) NOT NULL,
    EMPL_NO VARCHAR(20) NOT NULL,
    ATRB_YY VARCHAR(4) NOT NULL,   -- 귀속연도
    ATRB_MM VARCHAR(2),            -- 귀속월
    BASE_YMD DATE,                 -- 기준일자
    CLCL_YMD DATE,                 -- 계산일자
    TTL_LNGV_DAYS INT,             -- 총근속일수
    LNGV_YRS INT,                  -- 근속연수
    YRLY_DAYS INT,                 -- 발생연차일수
    USE_DAYS INT,                   -- 사용일수
    EXTN_DAYS INT,                  -- 소멸일수
    UNSD_DAYS INT,                  -- 미사용일수
    DPRT_CD VARCHAR(10),            -- 부서코드
    PRIMARY KEY (CRPR_CD, EMPL_NO, ATRB_YY)
);

-- 인사 상세 정보 테이블
CREATE TABLE HR_PRSN_DTLS (
    CRPR_CD VARCHAR(10) NOT NULL,
    EMPL_NO VARCHAR(20) NOT NULL,
    ENLS_YMD DATE,                 -- 입대일자
    DSCH_YMD DATE,                 -- 제대일자
    PRIMARY KEY (CRPR_CD, EMPL_NO)
);

-- 부서 마스터 테이블
CREATE TABLE CM_DPRT_MSTR (
    CRPR_CD VARCHAR(10) NOT NULL,
    DPRT_CD VARCHAR(10) NOT NULL,
    DPRT_NM VARCHAR(50),           -- 부서명
    PRIMARY KEY (CRPR_CD, DPRT_CD)
);

-- 사업장 마스터 테이블
CREATE TABLE AC_SITE_MSTR (
    CRPR_CD VARCHAR(10) NOT NULL,
    SITE_CD VARCHAR(10) NOT NULL,
    SITE_NM VARCHAR(50),           -- 사업장명
    PRIMARY KEY (CRPR_CD, SITE_CD)
);