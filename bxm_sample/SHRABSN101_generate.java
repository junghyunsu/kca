@BxmCategory(logicalName = "연차내역 조회", description = "연차내역 조회")
public List<DHRAbsnYrly01IO> SHRABSN10101(DHRAbsnYrly01IO input) throws DefaultApplicationException {

    logger.debug("============== START ==============");
    logger.debug("input = {}", input);

    dHRAbsnYrly01 = DefaultApplicationContext.getBean(dHRAbsnYrly01, DHRAbsnYrly01.class);

    List<DHRAbsnYrly01IO> output = dHRAbsnYrly01.selectYrlyList(input);

    logger.debug("output = {}", output);
    logger.debug("============== END ==============");

    return output;
}