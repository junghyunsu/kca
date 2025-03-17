@BxmServiceOperation("SHRABSN10101")
@BxmCategory(logicalName = "연차관리 조회")
public SHRABSN10101Out SHRABSN10101(SHRABSN10101In input) throws DefaultApplicationException {
    logger.debug("============== SERVICE START ==============");
    logger.debug("input = {}", input);

    BHRAbsnYrly bean = DefaultApplicationContext.getBean(BHRAbsnYrly.class);

    DHRAbsnYrly01IO dto = new DHRAbsnYrly01IO();
    dto.setCrprCd(input.getCrprCd());
    dto.setAtrbYy(input.getAtrbYy());
    dto.setOrgnSiteCd(input.getOrgnSiteCd());
    dto.setDprtCd(input.getDprtCd());
    dto.setWorkStCd(input.getWorkStCd());
    dto.setEmplGbCd(input.getEmplGbCd());
    dto.setSrchVl(input.getSrchVl());

    List<DHRAbsnYrly01IO> beanOutput = bean.selectYrlyList(dto);

    SHRABSN10101Out output = new SHRABSN10101Out();
    if (beanOutput != null && !beanOutput.isEmpty()) {
        List<SHRABSN10101Sub> subList = new ArrayList<>();
        for (DHRAbsnYrly01IO item : beanOutput) {
            SHRABSN10101Sub sub = new SHRABSN10101Sub();
            sub.setCrprCd(item.getCrprCd());
            sub.setAtrbYy(item.getAtrbYy());
            sub.setEmplNo(item.getEmplNo());
            sub.setAtrbMm(item.getAtrbMm());
            sub.setBaseYmd(item.getBaseYmd());
            sub.setClclYmd(item.getClclYmd());
            sub.setJoinYmd(item.getJoinYmd());
            sub.setGrpJoinYmd(item.getGrpJoinYmd());
            sub.setYrlyBaseYmd(item.getYrlyBaseYmd());
            sub.setRtrmYmd(item.getRtrmYmd());
            sub.setDprtCd(item.getDprtCd());
            sub.setPstnCd(item.getPstnCd());
            sub.setTtlLngvDays(item.getTtlLngvDays());
            sub.setTtlLngvMnth(item.getTtlLngvMnth());
            sub.setLngvYrs(item.getLngvYrs());
            sub.setLngvMnth(item.getLngvMnth());
            sub.setLngvDays(item.getLngvDays());
            sub.setAdedDays(item.getAdedDays());
            sub.setArmAdedDays(item.getArmAdedDays());
            sub.setYrlyDays(item.getYrlyDays());
            sub.setPreFrwrDays(item.getPreFrwrDays());
            sub.setSumDays(item.getSumDays());
            sub.setUseDays(item.getUseDays());
            sub.setExtnDays(item.getExtnDays());
            sub.setUnsdDays(item.getUnsdDays());
            sub.setFrwrDays(item.getFrwrDays());
            sub.setPymnDays(item.getPymnDays());
            sub.setPymnYm(item.getPymnYm());
            sub.setMnthDays(item.getMnthDays());
            sub.setMnthPreFrwrDays(item.getMnthPreFrwrDays());
            sub.setMnthSumDays(item.getMnthSumDays());
            sub.setMnthUseDays(item.getMnthUseDays());
            sub.setMnthExtnDays(item.getMnthExtnDays());
            sub.setMnthUnsdDays(item.getMnthUnsdDays());
            sub.setMnthFrwrDays(item.getMnthFrwrDays());
            sub.setMnthPymnDays(item.getMnthPymnDays());
            sub.setMnthPymnYm(item.getMnthPymnYm());
            sub.setYrlyUseStrtYmd(item.getYrlyUseStrtYmd());
            sub.setYrlyUseEndYmd(item.getYrlyUseEndYmd());
            sub.setMnthUseStrtYmd(item.getMnthUseStrtYmd());
            sub.setMnthUseEndYmd(item.getMnthUseEndYmd());
            sub.setBaseDays(item.getBaseDays());
            sub.setCnsrDays(item.getCnsrDays());
            sub.setNrmlAmt(item.getNrmlAmt());
            sub.setDlyAmt(item.getDlyAmt());
            sub.setYrlyAmt(item.getYrlyAmt());
            sub.setMnthYrlyAmt(item.getMnthYrlyAmt());
            sub.setSlryAtrbYm(item.getSlryAtrbYm());
            sub.setSlryGbCd(item.getSlryGbCd());
            sub.setSlrySeq(item.getSlrySeq());
            sub.setPymnYmd(item.getPymnYmd());
            sub.setHlthDays(item.getHlthDays());
            sub.setHlthUseDays(item.getHlthUseDays());
            sub.setRmrk(item.getRmrk());
            sub.setEmplNm(item.getEmplNm());
            sub.setDprtNm(item.getDprtNm());
            sub.setEmplGbCd(item.getEmplGbCd());
            sub.setWorkStCd(item.getWorkStCd());
            sub.setPrvsSumDays(item.getPrvsSumDays());
            sub.setPrvsUseDays(item.getPrvsUseDays());
            sub.setPrvsExtnDays(item.getPrvsExtnDays());
            sub.setPrvsUnsdDays(item.getPrvsUnsdDays());
            sub.setOrgnSiteCd(item.getOrgnSiteCd());
            sub.setOrgnSiteNm(item.getOrgnSiteNm());
            sub.setEnlsYmd(item.getEnlsYmd());
            sub.setDschYmd(item.getDschYmd());
            subList.add(sub);
        }
        output.setSub01Cnt(subList.size());
        output.setSub01(subList);
    } else {
        output.setSub01Cnt(0);
        output.setSub01(new ArrayList<>());
    }

    DefaultApplicationContext.addMessage("BXMI60000", null, new Object[] {});

    logger.debug("output = {}", output);
    logger.debug("============== SERVICE END ==============");

    return output;
}