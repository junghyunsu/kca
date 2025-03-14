package bwg.absn.bc;

import java.math.BigDecimal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import bwg.absn.dao.DHRAbsnYrly01;
import bwg.absn.dao.dto.DHRAbsnYrly01IO;
import bxm.common.annotaion.BxmCategory;
import bxm.container.annotation.BxmBean;
import bxm.dft.context.DefaultApplicationContext;
import bxm.erp.app.ErpApplicationException;
import bxm.erp.util.BxErpCnstUtil;
import bxm.erp.util.BxErpCommUtil;

/**
 * <b>BXM Business class</b>
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
@BxmBean
@BxmCategory(logicalName = "연차관리", author = "BWG")
public class BHRAbsnYrly {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	private DHRAbsnYrly01 dHRAbsnYrly01;

	@BxmCategory(type = "Method", logicalName = "연차내역 조회", description = "연차내역 조회")
	public List<DHRAbsnYrly01IO> selectYrlyList(DHRAbsnYrly01IO in) throws ErpApplicationException {

		/**
		 * @BXMType GetBean
		 */
		dHRAbsnYrly01 = DefaultApplicationContext.getBean(DHRAbsnYrly01.class);

		/**
		 * @BXMType DbioCall
		 * @Desc 연차내역 조회(selectAbsnYrlyList) 호출
		 */
		return dHRAbsnYrly01.selectAbsnYrlyList(in);
	}
	
	@BxmCategory(type = "Method", logicalName = "연차 생성", description = "연차 생성")
	public int yrlyCrt(DHRAbsnYrly01IO in) throws ErpApplicationException {

		/**
		 * @BXMType GetBean
		 */
		dHRAbsnYrly01 = DefaultApplicationContext.getBean(DHRAbsnYrly01.class);
		
		/**
		 * @BXMType BeanCall
		 * @Desc 필수값 검증 모듈(validateFields) 호출
		 */
		BxErpCommUtil.validateFields(in, "crprCd", "emplNo", "clclYmd");
		
		DHRAbsnYrly01IO yrlyData = new DHRAbsnYrly01IO();
		
		int baseYy = 0;
		
		yrlyData.setCrprCd(in.getCrprCd());					    // 법인코드
		yrlyData.setAtrbYy(in.getAtrbYy());							// 귀속연도
		yrlyData.setEmplNo(in.getEmplNo());						// 사원번호
		yrlyData.setClclYmd(in.getClclYmd());						// 계산일자
				
		baseYy = Integer.parseInt(in.getAtrbYy()) -1;		
		yrlyData.setBaseYmd(Integer.toString(baseYy) + "1231");		// 기준일자

		/**
		 * @BXMType DbioCall
		 * @Desc 연차생성 기준 조회(selectYrlyClclBase) 호출
		 */	
		DHRAbsnYrly01IO yrlyBase = dHRAbsnYrly01.selectYrlyClclBase(yrlyData);
				
		/**
		* @BXMType IF
		* @Desc 대상자의 조회내역이 NULL 체크
		*/
		if (yrlyBase == null) {
			return 0;
		}

		// 급여이체 확인
		/**
		 * @BXMType DbioCall
		 * @Desc 급여반영 여부 조회(checkPymnCnt) 호출
		 */
		int pymnCnt = dHRAbsnYrly01.checkPymnCnt(yrlyData);

		if(pymnCnt > 0) {
			// 급여 반영된 자료는 수정할 수 없습니다.
			throw new ErpApplicationException("AHRE2219", new Object[]{});
		}
		
		yrlyData.setJoinYmd(yrlyBase.getJoinYmd());							// 입사일자
		yrlyData.setGrpJoinYmd(yrlyBase.getGrpJoinYmd());				// 그룹입사일자
		yrlyData.setYrlyBaseYmd(yrlyBase.getYrlyBaseYmd());			// 연차기산일자
		yrlyData.setRtrmYmd(yrlyBase.getRtrmYmd());		       			// 퇴직일자		

		yrlyData.setOrgnSiteCd(yrlyBase.getOrgnSiteCd());					// 원소속사업장코드
		yrlyData.setDprtCd(yrlyBase.getDprtCd());								// 부서코드
		yrlyData.setPstnCd(yrlyBase.getPstnCd());								// 직위코드
		yrlyData.setEmplGbCd(yrlyBase.getEmplGbCd());					// 사원구분코드
		yrlyData.setAdedDays(yrlyBase.getAdedDays());						// 가산연차일수
		yrlyData.setArmAdedDays(yrlyBase.getArmAdedDays());			// 군가산일수		
		
		yrlyData.setBaseYmdGbCd(yrlyBase.getBaseYmdGbCd());		// 근속년수기준구분코드											
		yrlyData.setMnthBaseGbCd(yrlyBase.getMnthBaseGbCd()); 	// 월차지급구분코드											
		yrlyData.setMnthUseGbCd(yrlyBase.getMnthUseGbCd());			// 월차사용구분코드(기간)											
		yrlyData.setMnth1yrGbCd(yrlyBase.getMnth1yrGbCd());			// 1년만근연차											
		yrlyData.setYrlyBaseGbCd(yrlyBase.getYrlyBaseGbCd());		// 연차지급구분코드											
		yrlyData.setYrlyUseGbCd(yrlyBase.getYrlyUseGbCd());			// 연차사용구분코드(기간)											
		yrlyData.setArmCrrInclYn(yrlyBase.getArmCrrInclYn());			// 군경력 경력포함 여부											
		yrlyData.setArmAdedYn(yrlyBase.getArmAdedYn());				// 군경력 가산연차 여부
		
		yrlyData.setCrrBaseYmd(yrlyBase.getCrrBaseYmd());				// 근속년수기준일자
		yrlyData.setMnthPrd(yrlyBase.getMnthPrd());							// 월차사용기간
		yrlyData.setMnth1yrBaseDiv(yrlyBase.getMnth1yrBaseDiv());	// 1년만근 기준
		yrlyData.setMnth1yrClclDiv(yrlyBase.getMnth1yrClclDiv());		// 1년만근 계산식
		yrlyData.setYrlyClclBaseDiv(yrlyBase.getYrlyClclBaseDiv()); 	// 연차수당지급기준		
		
		if(yrlyBase.getTtlLngvDays() < 0) {			
			yrlyData.setTtlLngvDays(0);		// 총근속일수
			yrlyData.setTtlLngvMnth(0);			// 총근속개월수
			yrlyData.setLngvYrs(0);				// 근속연수
			yrlyData.setLngvMnth(0);			// 근속월수
			yrlyData.setLngvDays(0);			// 근속일수
		} else {			
			yrlyData.setTtlLngvDays(yrlyBase.getTtlLngvDays());			// 총근속일수
			yrlyData.setTtlLngvMnth(yrlyBase.getTtlLngvMnth());				// 총근속개월수
			yrlyData.setLngvYrs(yrlyBase.getLngvYrs());						// 근속연수
			yrlyData.setLngvMnth(yrlyBase.getLngvMnth());					// 근속월수
			yrlyData.setLngvDays(yrlyBase.getLngvDays());					// 근속일수
		}
		
		int AtrbYy = Integer.parseInt(yrlyData.getAtrbYy());
		baseYy = Integer.parseInt(yrlyData.getCrrBaseYmd().substring(0,4));
		
		String baseMd = yrlyData.getCrrBaseYmd().substring(4, 8);
		
		DHRAbsnYrly01IO yrlyClcl = new DHRAbsnYrly01IO();
		
		// 회계연도(1월 1일) 기준으로 연차생성(입사일 기준으로 연차 생성 시 변경 필요)
		// 전년도 미사용 월차만 이월(전년도 초과사용연차, 미사용연차는 이월되지 않음)
		
		// 광주은행 => 가산휴가일수 : (지급연도 - 입행연도 + 군경력가산일수 - 1) / 2 (단, 소수점 이하는 절사) ==> 지급연도 : 귀속연도 단, 12월 입사자의 경우 근속년수 1년 더해줌
		// 그외는 기준일자 => 귀속연도의 전년도
		/**
		* @BXMType IF
		* @Desc 근속연수 1년 미만 (1년차)
		*/
		if(AtrbYy == baseYy) {			
			/**
			 * @BXMType DbioCall
			 * @Desc 연차 생성 조회 01(selectYrlyDays01) 호출
			 */	
			yrlyClcl = dHRAbsnYrly01.selectYrlyDays01(yrlyData);
		
		/**
		* @BXMType IF
		* @Desc 근속연수 1년 미만 (2년차)
		*/
		} else if(AtrbYy - baseYy == 1 && !"0101".equals(baseMd)) {

			/**
			 * @BXMType DbioCall
			 * @Desc 연차 생성 조회 02(selectYrlyDays02) 호출
			 */	
			yrlyClcl = dHRAbsnYrly01.selectYrlyDays02(yrlyData);
			
		/**
		* @BXMType IF
		* @Desc 근속연수 1년 이상
		*/
		} else {

			int lngvYrs =Integer.parseInt(yrlyData.getBaseYmd().substring(0,4)) - Integer.parseInt(yrlyData.getCrrBaseYmd().substring(0,4));
			
			yrlyData.setLngvYrs(lngvYrs);
						
			/**
			 * @BXMType DbioCall
			 * @Desc 연차 생성 조회 03(selectYrlyDays03) 호출
			 */	
			yrlyClcl = dHRAbsnYrly01.selectYrlyDays03(yrlyData);
		}

		yrlyData.setLngvYrs(yrlyBase.getLngvYrs());								// 근속년수
		yrlyData.setAtrbMm(yrlyClcl.getAtrbMm());									// 귀속월		
		yrlyData.setYrlyDays(yrlyClcl.getYrlyDays());								// 발생연차일수
		yrlyData.setPreFrwrDays(yrlyClcl.getPreFrwrDays());					// 이월연차일수(전년도미사용)
		yrlyData.setArmAdedDays(yrlyClcl.getArmAdedDays());				// 군가산일수		
		yrlyData.setSumDays(yrlyData.getYrlyDays().add(yrlyData.getAdedDays()).add(yrlyData.getPreFrwrDays()).add(yrlyData.getArmAdedDays()));		// 당해연도연차합계일수
		
		yrlyData.setMnthDays(yrlyClcl.getMnthDays());							// 발생월차일수
		yrlyData.setMnthPreFrwrDays(yrlyClcl.getMnthPreFrwrDays());	// 이월월차일수(전년도미사용)
		yrlyData.setMnthSumDays(yrlyData.getMnthDays());					// 월차합계일수
		yrlyData.setPymnYm(yrlyClcl.getPymnYm());								// 정산연월		
		yrlyData.setYrlyUseStrtYmd(yrlyClcl.getYrlyUseStrtYmd()); 			// 연차사용시작일자
		yrlyData.setYrlyUseEndYmd(yrlyClcl.getYrlyUseEndYmd()); 		// 연차사용종료일자
		
		yrlyData.setMnthUseStrtYmd(yrlyClcl.getMnthUseStrtYmd());			// 월차사용시작일자
		yrlyData.setMnthUseEndYmd(yrlyClcl.getMnthUseEndYmd());		// 월차사용종료일자		
		
		/**
		 * @BXMType BeanCall
		 * @Desc omm 기본값 세팅(setDefaultFields) 호출
		 */
		BxErpCommUtil.setDefaultFields(yrlyData);
		
		int result = 0;
		
		if(BxErpCnstUtil.STATUS_INSERT.equals(yrlyBase.getIudFlag())) {
			
			/**
			 * @BXMType DbioCall
			 * @Desc 연차관리 등록(insertAbsnYrly) 호출
			 */	
			result = dHRAbsnYrly01.insertAbsnYrly(yrlyData);
			
		} else if(BxErpCnstUtil.STATUS_UPDATE.equals(yrlyBase.getIudFlag())) {
			
			/**
			 * @BXMType DbioCall
			 * @Desc 연차관리 수정(updateAbsnYrly) 호출
			 */	
			result = dHRAbsnYrly01.updateAbsnYrly(yrlyData);
			
		}
		
		return result;
	}
	
	@BxmCategory(type = "Method", logicalName = "연차 사용일수 변경", description = "연차 사용일수 변경")
	public int updateUseDays(DHRAbsnYrly01IO in) throws ErpApplicationException {

		/**
		 * @BXMType GetBean
		 */
		dHRAbsnYrly01 = DefaultApplicationContext.getBean(DHRAbsnYrly01.class);

		/**
		 * @BXMType DbioCall
		 * @Desc 사용일수 기준 조회(selectUseDays) 호출
		 */	
		DHRAbsnYrly01IO useData = dHRAbsnYrly01.selectUseDays(in);
		
		
		in.setUseDays(useData.getUseDays());					// 연차사용일수
		in.setMnthUseDays(useData.getMnthUseDays());		// 월차사용일수
		
		/**
		 * @BXMType DbioCall
		 * @Desc 연차 소멸일수 조회(selectExtnDays) 호출
		 */		
		DHRAbsnYrly01IO extnData = dHRAbsnYrly01.selectExtnDays(in);
		
		in.setExtnDays(extnData.getExtnDays());					// 연차소멸일수
		in.setMnthExtnDays(extnData.getMnthExtnDays()); 	// 월차소멸일수
		
		/**
		 * @BXMType BeanCall
		 * @Desc omm 기본값 세팅(setDefaultFields) 호출
		 */
		BxErpCommUtil.setDefaultFields(in);
		
		/**
		 * @BXMType DbioCall
		 * @Desc 연차 사용일수 변경(updateUseDays) 호출
		 */	
		return dHRAbsnYrly01.updateUseDays(in);
	}

	
	@BxmCategory(type = "Method", logicalName = "연월차관리 수정", description = "연월차관리 수정")
	public int saveAbsnYrly(DHRAbsnYrly01IO in) throws ErpApplicationException {

		/**
		 * @BXMType GetBean
		 */
		dHRAbsnYrly01 = DefaultApplicationContext.getBean(DHRAbsnYrly01.class);
		
		int result = 0;
		
		/**
		 * @BXMType BeanCall
		 * @Desc 필수값 검증 모듈(validateFields) 호출
		 */
		BxErpCommUtil.validateFields(in, "crprCd", "atrbYy", "emplNo");
		
		/**
		 * @BXMType BeanCall
		 * @Desc omm 기본값 세팅(setDefaultFields) 호출
		 */
		BxErpCommUtil.setDefaultFields(in);
		
		// 등록여부 확인 후 없으면 insert 있으면 update
		/**
		 * @BXMType DbioCall
		 * @Desc 수정 - 환경설정(updateYrlyCnfg) 호출
		 */
		int cnt =  dHRAbsnYrly01.selectAbsnYrly(in);
		
		if (cnt  == 0) {
			/**
			 * @BXMType DbioCall
			 * @Desc 수정 - 환경설정(updateYrlyCnfg) 호출
			 */
			result = dHRAbsnYrly01.insertAbsnYrly(in);	
		}else {
			// 정산여부 확인
			int clclDays = dHRAbsnYrly01.checkAbsnYrlyClcl(in);
			
			if (clclDays > 0) {
				// 근태신청 내역이 존재하여 처리할 수 없습니다.
				throw new ErpApplicationException("AHRE1215", new Object[] {""});
			}
			
			if (BxErpCnstUtil.STATUS_UPDATE.equals(in.getIudFlag())/**수정*/) {
			/**
			 * @BXMType DbioCall
			 * @Desc 수정 - 환경설정(updateYrlyCnfg) 호출
			 */
			result = dHRAbsnYrly01.updateAbsnYrly(in);	
			}else if (BxErpCnstUtil.STATUS_DELETE.equals(in.getIudFlag())/**삭제*/) {
				/**
				 * @BXMType DbioCall
				 * @Desc 수정 - 환경설정(updateYrlyCnfg) 호출
				 */
				result = dHRAbsnYrly01.deleteAbsnYrly(in);	
					
			}
		}
		
		return result;
	}
}