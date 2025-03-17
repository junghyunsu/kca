package bxcodesmp.com.sample.service;

import bxm.common.annotaion.BxmCategory;
import bxm.container.annotation.BxmService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * 
 * 변경이력
 * <pre>
 * ------- ------- ----------- --------------- --------------------------------
 * 버전    성명    일자        근거자료        변경내용                        
 * ------- ------- ----------- --------------- --------------------------------
 * 0.1     sysadmin 2025-03-11  The NEXT 구축 신규 작성
 * </pre>
 */
@BxmService("TestService")
@BxmCategory(logicalName="TestService", author="sysadmin")
public class TestService {
   private Logger logger= LoggerFactory.getLogger(getClass());
   
}