[BxmBean Code Sample]
@BxmBean
@BxmCategory(logicalName = "Employee Info Management")
public class MSmpEmpInfMng {
    final Logger logger = LoggerFactory.getLogger(this.getClass());

    private DSmpEmpTst000 dSmpEmpTst000;

    /**
     * Select a single employee info.
     *
     * @param   input   DSmpEmpTst000Dto
     * @return DSmpEmpTst000Dto
     * @throws DefaultApplicationException
     */
    @BxmCategory(logicalName = "Single Select", description = "Select a single employee info.")
    public DSmpEmpTst000Dto getEmpInf(DSmpEmpTst000Dto input) throws DefaultApplicationException {

        logger.debug("============== START ==============");
        logger.debug("input = {}", input);

        dSmpEmpTst000 = DefaultApplicationContext.getBean(dSmpEmpTst000, DSmpEmpTst000.class);

        /**
         * @BXMType VariableDeclaration
         */
        DSmpEmpTst000Dto output = null;

        /**
         * @BXMType DbioCall
         * Employee ID number selectOne
         */
        output = dSmpEmpTst000.selectOne00(input);

        logger.debug("output = {}", output);
        logger.debug("============== END ==============");

        return output;
    }
}