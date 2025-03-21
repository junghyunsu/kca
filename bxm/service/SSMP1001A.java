@BxmService("SSMP1001A")
@BxmCategory(logicalName = "Single select")
public class SSMP1001A {
    final Logger logger = LoggerFactory.getLogger(this.getClass());

    private MSmpEmpInfMng mSmpEmpInfMng;

    @BxmServiceOperation("ssmp1001a001")
    @BxmCategory(logicalName = "Single select")
    public SSMP1001A001OutDto ssmp1001a001(SSMP1001A001InDto input) throws DefaultApplicationException {

        logger.debug("============== SERVICE START ==============");
        logger.debug("input = {}", input);

        mSmpEmpInfMng = DefaultApplicationContext.getBean(mSmpEmpInfMng, MSmpEmpInfMng.class);

        /**
         * @BXMType VariableDeclaration
         */
        DSmpEmpTst000Dto beanInput = new DSmpEmpTst000Dto();

        /**
         * @BXMType VariableDeclaration
         */
        SSMP1001A001OutDto output = new SSMP1001A001OutDto();

        /**
         * @BXMType IF
         */
        if (input.getFeduEmpNo().equals(BigDecimal.valueOf(9877))) {
            logger.error("Pre-Deploy Test Exception for FeduEmpNo [9877].");
            throw new DefaultApplicationException("BXME30000", new Object[] {},
                    new Object[] { "Pre-Deploy Test Exception." });
        }

        /**
         * @BXMType LogicalArea
         * @Desc DTO mapping
         */
        {
            beanInput.setFeduEmpNo(input.getFeduEmpNo());
        }

        /**
         * @BXMType BeanCall
         * @Desc Call bean single select method
         */
        DSmpEmpTst000Dto beanOutput = mSmpEmpInfMng.getEmpInf(beanInput);

        /**
         * @BXMType IF
         * @Desc DTO mapping if bean out is not null
         */
        if (beanOutput != null) {
            output.setFeduEmpNo(beanOutput.getFeduEmpNo());
            output.setFeduEmpNm(beanOutput.getFeduEmpNm());
            output.setFeduOccpNm(beanOutput.getFeduOccpNm());
            output.setFeduMngrEmpNo(beanOutput.getFeduMngrEmpNo());
            output.setFeduIpsaDt(beanOutput.getFeduIpsaDt());
            output.setFeduPayAmt(beanOutput.getFeduPayAmt());
            output.setFeduDeptNo(beanOutput.getFeduDeptNo());
        }

        /**
         * @BXMType LogicalArea
         * @Desc add message
         */
        {
            DefaultApplicationContext.addMessage("BXMI60000", null, new Object[] {});
        }

        logger.debug("output = {}", output);
        logger.debug("============== SERVICE END ==============");

        return output;
    }
}