package bwg.absn.sc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import bwg.absn.bc.BHRAbsnYrly;
import bwg.absn.bc.BHRAbsnYrly;
import bwg.absn.dao.dto.DHRAbsnYrly01IO;
import bwg.absn.dao.dto.DHRAbsnYrly01IO;
import bwg.absn.sc.dto.SHRABSN10101In;
import bwg.absn.sc.dto.SHRABSN10101Out;
import bwg.absn.sc.dto.SHRABSN10101Sub;
import bwg.absn.sc.dto.SHRABSN10102In;
import bwg.absn.sc.dto.SHRABSN10102Out;
import bwg.absn.sc.dto.SHRABSN10102Sub;
import bwg.absn.sc.dto.SHRABSN10103In;
import bwg.absn.sc.dto.SHRABSN10103Out;
import bwg.absn.sc.dto.SHRABSN10103Sub;
import bxm.common.annotaion.BxmCategory;
import bxm.container.annotation.BxmService;
import bxm.container.annotation.BxmServiceOperation;
import bxm.dft.context.DefaultApplicationContext;

/**
 * <b>BXM Service class</b>
 * <p>
 * <b>Revision history</b><br>
 * <pre>
 * 2022.09.23 : New creation
 * </pre>
 *
 * @since 2022.09.23
 * @version 1.0.0
 * @author BWG
 */
@BxmService("SHRABSN101")
@BxmCategory(logicalName = "연차관리", author = "BWG")
public class SHRABSN101 {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	private BHRAbsnYrly bHRAbsnYrly;
	
	@BxmServiceOperation("SHRABSN10101")
	@BxmCategory(logicalName = "연월차관리 조회", description = "연월차관리 조회")
	public SHRABSN10101Out SHRABSN10101(SHRABSN10101In in) throws Exception {
		
		/** 
		 * @BXMType GetBean
		 */
		bHRAbsnYrly = DefaultApplicationContext.getBean(BHRAbsnYrly.class);
		
		/**
         * @BXMType VariableDeclaration
         * @Desc Out 객체생성
		 */
		SHRABSN10101Out out = new SHRABSN10101Out();
		
		/**
		 * @BXMType VariableDeclaration
		 * @Desc BC Input 객체생성
		 */
		DHRAbsnYrly01IO bcIn = new DHRAbsnYrly01IO();
		
		/**
		 * @BXMType IOMapping
		 * @Desc BC 입력객체 맵핑
		 */
		{
			bcIn.setCrprCd(in.getCrprCd()); // 법인코드
			bcIn.setAtrbYy(in.getAtrbYy()); // 귀속연도
			bcIn.setOrgnSiteCd(in.getOrgnSiteCd()); // 원소속사업장코드
			bcIn.setDprtCd(in.getDprtCd()); // 부서코드
			bcIn.setEmplGbCd(in.getEmplGbCd()); // 사원구분코드
			bcIn.setWorkStCd(in.getWorkStCd()); // 근무상태코드
			bcIn.setSrchVl(in.getSrchVl()); // 검색어
		}
		
		/**
		 * @BXMType BeanCall
		 * @Desc 연차관리 마스터 조회(selectYrly) 호출
		 */
		List<DHRAbsnYrly01IO> bcOutList = bHRAbsnYrly.selectYrlyList(bcIn);
		
		/**
         * @BXMType LOOP
         * @Desc Bean의 Output을 Service의 Output으로 설정
		 */
		for(DHRAbsnYrly01IO bcOut : bcOutList) {
			/**
			 * @BXMType VariableDeclaration
			 * @Desc SC Output 객체생성
			 */
			SHRABSN10101Sub sub = new SHRABSN10101Sub();

			sub.setCrprCd(bcOut.getCrprCd()); // 법인코드
			sub.setAtrbYy(bcOut.getAtrbYy()); // 귀속연도
			sub.setEmplNo(bcOut.getEmplNo()); // 사원번호
			sub.setAtrbMm(bcOut.getAtrbMm()); // 귀속월
			sub.setBaseYmd(bcOut.getBaseYmd()); // 기준일자
			sub.setClclYmd(bcOut.getClclYmd()); // 계산일자
			sub.setJoinYmd(bcOut.getJoinYmd()); // 입사일자
			sub.setGrpJoinYmd(bcOut.getGrpJoinYmd()); // 그룹입사일자
			sub.setYrlyBaseYmd(bcOut.getYrlyBaseYmd()); // 연차기산일자
			sub.setRtrmYmd(bcOut.getRtrmYmd()); // 퇴직일자
			sub.setDprtCd(bcOut.getDprtCd()); // 부서코드
			sub.setPstnCd(bcOut.getPstnCd()); // 직위코드
			sub.setTtlLngvDays(bcOut.getTtlLngvDays()); // 총근속일수
			sub.setTtlLngvMnth(bcOut.getTtlLngvMnth()); // 총근속개월수
			sub.setLngvYrs(bcOut.getLngvYrs()); // 근속연수
			sub.setLngvMnth(bcOut.getLngvMnth()); // 근속월수
			sub.setLngvDays(bcOut.getLngvDays()); // 근속일수
			sub.setAdedDays(bcOut.getAdedDays()); // 가산연차일수
			sub.setArmAdedDays(bcOut.getArmAdedDays()); // 군가산일수
			sub.setYrlyDays(bcOut.getYrlyDays()); // 발생연차일수
			sub.setPreFrwrDays(bcOut.getPreFrwrDays()); // 이월연차일수(전년도미사용)
			sub.setSumDays(bcOut.getSumDays()); // 당해연도연차합계일수
			sub.setUseDays(bcOut.getUseDays()); // 사용일수
			sub.setExtnDays(bcOut.getExtnDays()); // 소멸일수
			sub.setUnsdDays(bcOut.getUnsdDays()); // 미사용일수
			sub.setFrwrDays(bcOut.getFrwrDays()); // 이월연차일수
			sub.setPymnDays(bcOut.getPymnDays()); // 연차정산일수
			sub.setPymnYm(bcOut.getPymnYm()); // 정산연월
			sub.setMnthDays(bcOut.getMnthDays()); // 발생월차일수(월만근연차)
			sub.setMnthPreFrwrDays(bcOut.getMnthPreFrwrDays()); // 이월월차일수(전년도미사용)
			sub.setMnthSumDays(bcOut.getMnthSumDays()); // 당해연도월차합계일수
			sub.setMnthUseDays(bcOut.getMnthUseDays()); // 월차 사용일수
			sub.setMnthExtnDays(bcOut.getMnthExtnDays()); // 월차 소멸일수
			sub.setMnthUnsdDays(bcOut.getMnthUnsdDays()); // 월사 미사용일수
			sub.setMnthFrwrDays(bcOut.getMnthFrwrDays()); // 월차 이월일수
			sub.setMnthPymnDays(bcOut.getMnthPymnDays()); // 월차 정산일수
			sub.setMnthPymnYm(bcOut.getMnthPymnYm()); // 월차 정산연월
			sub.setYrlyUseStrtYmd(bcOut.getYrlyUseStrtYmd()); // 연차사용시작일자
			sub.setYrlyUseEndYmd(bcOut.getYrlyUseEndYmd()); // 연차사용종료일자
			sub.setMnthUseStrtYmd(bcOut.getMnthUseStrtYmd()); // 월차사용시작일자
			sub.setMnthUseEndYmd(bcOut.getMnthUseEndYmd()); // 월차사용종료일자
			sub.setBaseDays(bcOut.getBaseDays()); // 기본연차발생일수
			sub.setCnsrDays(bcOut.getCnsrDays()); // 연차보전일수
			sub.setNrmlAmt(bcOut.getNrmlAmt()); // 통상임금
			sub.setDlyAmt(bcOut.getDlyAmt()); // 일급
			sub.setYrlyAmt(bcOut.getYrlyAmt()); // 연차수당
			sub.setMnthYrlyAmt(bcOut.getMnthYrlyAmt()); // 월차수당
			sub.setSlryAtrbYm(bcOut.getSlryAtrbYm()); // 지급기준연월
			sub.setSlryGbCd(bcOut.getSlryGbCd()); // 지급구분코드
			sub.setSlrySeq(bcOut.getSlrySeq()); // 지급차수
			sub.setPymnYmd(bcOut.getPymnYmd()); // 지급일자
			sub.setHlthDays(bcOut.getHlthDays()); // 보건발생일수
			sub.setHlthUseDays(bcOut.getHlthUseDays()); // 보건사용일수
			sub.setEmplNm(bcOut.getEmplNm()); // 성명
			sub.setDprtNm(bcOut.getDprtNm()); // 부서명칭
			sub.setEmplGbCd(bcOut.getEmplGbCd()); // 사원구분코드
			sub.setWorkStCd(bcOut.getWorkStCd()); // 근무상태코드
			sub.setPrvsSumDays(bcOut.getPrvsSumDays()); // 전년도연차합계일수
			sub.setPrvsUseDays(bcOut.getPrvsUseDays()); // 전년도사용일수
			sub.setPrvsExtnDays(bcOut.getPrvsExtnDays()); // 전년도소멸일수
			sub.setPrvsUnsdDays(bcOut.getPrvsUnsdDays()); // 전년도미사용일수
			sub.setOrgnSiteCd(bcOut.getOrgnSiteCd()); // 원소속사업장코드
			sub.setOrgnSiteNm(bcOut.getOrgnSiteNm()); // 원소속사업장명칭
			sub.setEnlsYmd(bcOut.getEnlsYmd()); // 입대일자
			sub.setDschYmd(bcOut.getDschYmd()); // 제대일자
			
			out.getSub01().add(sub);
		}
		
		return out;
	}
	
	@BxmServiceOperation("SHRABSN10102")
	@BxmCategory(logicalName = "연월차관리 생성", description = "연월차관리 생성")
	public SHRABSN10102Out SHRABSN10102(SHRABSN10102In in) throws Exception {
		
		/** 
		 * @BXMType GetBean
		 */
		bHRAbsnYrly = DefaultApplicationContext.getBean(BHRAbsnYrly.class);
		
		/**
         * @BXMType VariableDeclaration
         * @Desc Out 객체생성
		 */
		SHRABSN10102Out out = new SHRABSN10102Out();
		
		int result = 0;
		
		/**
         * @BXMType LOOP
         * @Desc 입력값을 Bean의 Input으로 설정
		 */
		for(SHRABSN10102Sub sub : in.getSub01()) {
			/**
			 * @BXMType VariableDeclaration
			 * @Desc BC Input 객체생성
			 */
			DHRAbsnYrly01IO bcIn = new DHRAbsnYrly01IO();
			
			/**
			 * @BXMType IOMapping
			 * @Desc BC 입력객체 맵핑
			 */
			{
				bcIn.setCrprCd(sub.getCrprCd());								// set [법인코드]
				bcIn.setAtrbYy(sub.getClclYmd().substring(0,4));			// set [기준연도]
				bcIn.setEmplNo(sub.getEmplNo());								// set [사원번호]
				bcIn.setClclYmd(sub.getClclYmd());							// set [계산일자]
			}
			
			/**
			 * @BXMType BeanCall
			 * @Desc 연차 생성(yrlyCrt) 호출
			 */
			result += bHRAbsnYrly.yrlyCrt(bcIn);
			
			/**
			 * @BXMType BeanCall
			 * @Desc 연차 사용일수 변경(updateUseDays) 호출
			 */
			result += bHRAbsnYrly.updateUseDays(bcIn);
		}

		/**
		 * @BXMType IOMapping
		 * @Desc BC Out -> SC Out
		 */
		out.setResult(result);		
		
		return out;
	}
	

	@BxmServiceOperation("SHRABSN10103")
	@BxmCategory(logicalName = "연월차관리 저장", description = "연월차관리 저장")
	public SHRABSN10103Out SHRABSN10103(SHRABSN10103In in) throws Exception {

		/** 
		 * @BXMType GetBean
		 * @Desc BC class GetBean
		 */
		bHRAbsnYrly = DefaultApplicationContext.getBean(BHRAbsnYrly.class);


		int result = 0;
		
		/**
		 * @BXMType VariableDeclaration
		 * @Desc Out 객체생성
		 */
		SHRABSN10103Out out = new SHRABSN10103Out();	
		
		/**
		 * @BXMType LOOP
		 * @Desc Service의 Input을 Bean의 Input으로 설정
		 */
		for (SHRABSN10103Sub sub : in.getSub01()) {
			
			/**
			 * @BXMType VariableDeclaration
			 * @Desc BC Input 객체생성
			 */
			DHRAbsnYrly01IO bcIn = new DHRAbsnYrly01IO();

			/**
			 * @BXMType IOMapping
			 * @Desc BC 입력객체 맵핑
			 */
			{
				bcIn.setCrprCd(sub.getCrprCd()); // 법인코드
				bcIn.setAtrbYy(sub.getAtrbYy()); // 귀속연도
				bcIn.setEmplNo(sub.getEmplNo()); // 사원번호
				bcIn.setAtrbMm(sub.getAtrbMm()); // 귀속월
				bcIn.setBaseYmd(sub.getBaseYmd()); // 기준일자
				bcIn.setClclYmd(sub.getClclYmd()); // 계산일자
				bcIn.setJoinYmd(sub.getJoinYmd()); // 입사일자
				bcIn.setGrpJoinYmd(sub.getGrpJoinYmd()); // 그룹입사일자
				bcIn.setYrlyBaseYmd(sub.getYrlyBaseYmd()); // 연차기산일자
				bcIn.setRtrmYmd(sub.getRtrmYmd()); // 퇴직일자
				bcIn.setDprtCd(sub.getDprtCd()); // 부서코드
				bcIn.setPstnCd(sub.getPstnCd()); // 직위코드
				bcIn.setTtlLngvDays(sub.getTtlLngvDays()); // 총근속일수
				bcIn.setTtlLngvMnth(sub.getTtlLngvMnth()); // 총근속개월수
				bcIn.setLngvYrs(sub.getLngvYrs()); // 근속연수
				bcIn.setLngvMnth(sub.getLngvMnth()); // 근속월수
				bcIn.setLngvDays(sub.getLngvDays()); // 근속일수
				bcIn.setAdedDays(sub.getAdedDays()); // 가산연차일수
				bcIn.setArmAdedDays(sub.getArmAdedDays()); // 군가산일수
				bcIn.setYrlyDays(sub.getYrlyDays()); // 발생연차일수
				bcIn.setPreFrwrDays(sub.getPreFrwrDays()); // 이월연차일수(전년도미사용)
				bcIn.setSumDays(sub.getSumDays()); // 당해연도연차합계일수
				bcIn.setUseDays(sub.getUseDays()); // 사용일수
				bcIn.setExtnDays(sub.getExtnDays()); // 소멸일수
				bcIn.setUnsdDays(sub.getUnsdDays()); // 미사용일수
				bcIn.setFrwrDays(sub.getFrwrDays()); // 이월연차일수
				bcIn.setPymnDays(sub.getPymnDays()); // 연차정산일수
				bcIn.setPymnYm(sub.getPymnYm()); // 정산연월
				bcIn.setMnthDays(sub.getMnthDays()); // 발생월차일수(월만근연차)
				bcIn.setMnthPreFrwrDays(sub.getMnthPreFrwrDays()); // 이월월차일수(전년도미사용)
				bcIn.setMnthSumDays(sub.getMnthSumDays()); // 당해연도월차합계일수
				bcIn.setMnthUseDays(sub.getMnthUseDays()); // 월차 사용일수
				bcIn.setMnthExtnDays(sub.getMnthExtnDays()); // 월차 소멸일수
				bcIn.setMnthUnsdDays(sub.getMnthUnsdDays()); // 월사 미사용일수
				bcIn.setMnthFrwrDays(sub.getMnthFrwrDays()); // 월차 이월일수
				bcIn.setMnthPymnDays(sub.getMnthPymnDays()); // 월차 정산일수
				bcIn.setMnthPymnYm(sub.getMnthPymnYm()); // 월차 정산연월
				bcIn.setYrlyUseStrtYmd(sub.getYrlyUseStrtYmd()); // 연차사용시작일자
				bcIn.setYrlyUseEndYmd(sub.getYrlyUseEndYmd()); // 연차사용종료일자
				bcIn.setMnthUseStrtYmd(sub.getMnthUseStrtYmd()); // 월차사용시작일자
				bcIn.setMnthUseEndYmd(sub.getMnthUseEndYmd()); // 월차사용종료일자
				bcIn.setBaseDays(sub.getBaseDays()); // 기본연차발생일수
				bcIn.setCnsrDays(sub.getCnsrDays()); // 연차보전일수
				bcIn.setNrmlAmt(sub.getNrmlAmt()); // 통상임금
				bcIn.setDlyAmt(sub.getDlyAmt()); // 일급
				bcIn.setYrlyAmt(sub.getYrlyAmt()); // 연차수당
				bcIn.setMnthYrlyAmt(sub.getMnthYrlyAmt()); // 월차수당
				bcIn.setSlryAtrbYm(sub.getSlryAtrbYm()); // 지급기준연월
				bcIn.setSlryGbCd(sub.getSlryGbCd()); // 지급구분코드
				bcIn.setSlrySeq(sub.getSlrySeq()); // 지급차수
				bcIn.setPymnYmd(sub.getPymnYmd()); // 지급일자
				bcIn.setHlthDays(sub.getHlthDays()); // 보건발생일수
				bcIn.setHlthUseDays(sub.getHlthUseDays()); // 보건사용일수
				bcIn.setIudFlag(sub.getIudFlag()); // iud플래그
			}

			/**
			 * @BXMType BeanCall
			 * @Desc 유연근무 기준관리 저장(saveFlxbBase) 호출
			 */
			result += bHRAbsnYrly.saveAbsnYrly(bcIn);
		}

		out.setResult(result);
		return out;
	}
}
