package shb.bxm.apc.bean;

import shb.app.ApplicationException;
import bxm.common.annotation.BxmCategory;
import bxm.container.annotation.BxmBean;
import shb.app.ShbApplicationException;
import shb.bxm.apc.bean.dto.MAPCEmplInfDto;
import shb.bxm.apc.dbio.DSmpEmpTst000;
import shb.bxm.apc.dbio.DSmpEmpTst000Dto;
import shb.bxm.apc.service.dto.RSAPC001A01InDto;
import shb.bxm.apc.service.dto.RSAPC001A01OutDto;
import shb.context.ShbApplicationContext;
import shb.utils.ShbDtoUtils;
import shb.utils.ShbMessageUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 고객정보관리모듈
 * - 변경이력
 *
 * 번호     성명       일자          근거자료       변경내용
 * ------------------------------------------------------
 * 0.1   SGOTMP001  2025-03-27   The NEXT 구축 신규 작성
 */
@BxmBean
@BxmCategory(logicalName="고객정보관리업무", author="SGOTMP001")
public class MAPCEmplnfmMng03 {
    private Logger logger = LoggerFactory.getLogger(getClass());

    private DSmpEmpTst000 dsmpEmpTst000;

    @BxmCategory(logicalName="고객정보생성", author="SGOTMP001")
    public int createEmpInf(MAPCEmplInfDto input) {

        if (input.getFeduEmpNm().length() > 10) {
            logger.debug("이름 길이 10 초과입니다.");
            throw new ShbApplicationException("BXM36005");
        }

        DSmpEmpTst000Dto dbInput = new DSmpEmpTst000Dto();
        ShbDtoUtils.copyProperties(input, dbInput);

        // 조회 변수 null 로 초기화 후 호출합니다.
        dsmpEmpTst000 = ShbApplicationContext.getBean(dsmpEmpTst000, DSmpEmpTst000.class);

        int affectedCount = dsmpEmpTst000.insert004(dbInput);

        return affectedCount;
    }
}
