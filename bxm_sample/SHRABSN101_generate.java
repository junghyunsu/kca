@BxmServiceOperation("SHRABSN10101")
@BxmCategory(logicalName = "연차관리 조회")
public SHRABSN10101Out SHRABSN10101(SHRABSN10101In input) throws DefaultApplicationException {

    BHRAbsnYrly bean = DefaultApplicationContext.getBean(BHRAbsnYrly.class);

    DHRAbsnYrly01IO beanInput = new DHRAbsnYrly01IO();
    beanInput.setCrprCd(input.getCrprCd());
    beanInput.setAtrbYy(input.getAtrbYy());
    beanInput.setOrgnSiteCd(input.getOrgnSiteCd());
    beanInput.setDprtCd(input.getDprtCd());
    beanInput.setWorkStCd(input.getWorkStCd());
    beanInput.setEmplGbCd(input.getEmplGbCd());
    beanInput.setSrchVl(input.getSrchVl());

    List<DHRAbsnYrly01IO> beanOutputList = bean.selectYrlyList(beanInput);

    SHRABSN10101Out output = new SHRABSN10101Out();
    output.setSub01Cnt(beanOutputList.size());

    if(beanOutputList.size() > 0) {
        SHRABSN10101Sub[] subArray = new SHRABSN10101Sub[beanOutputList.size()];
        for(int i=0; i < beanOutputList.size(); i++){
            DHRAbsnYrly01IO beanOutput = beanOutputList.get(i);
            SHRABSN10101Sub sub = new SHRABSN10101Sub();

            sub.setCrprCd(beanOutput.getCrprCd());
            sub.setAtrbYy(beanOutput.getAtrbYy());
            sub.setEmplNo(beanOutput.getEmplNo());
            sub.setAtrbMm(beanOutput.getAtrbMm());
            sub.setBaseYmd(beanOutput.getBaseYmd());
            sub.setClclYmd(beanOutput.getClclYmd());
            sub.setJoinYmd(beanOutput.getJoinYmd());
            sub.setGrpJoinYmd(beanOutput.getGrpJoinYmd());
            sub.setYrlyBaseYmd(beanOutput.getYrlyBaseYmd());
            sub.setRtrmYmd(beanOutput.getRtrmYmd());
            sub.setDprtCd(beanOutput.getDprtCd());
            sub.setPstnCd(beanOutput.getPstnCd());
            sub.setTtlLngvDays(beanOutput.getTtlLngvDays());
            sub.setTtlLngvMnth(beanOutput.getTtlLngvMnth());
            sub.setLngvYrs(beanOutput.getLngvYrs());
            sub.setLngvMnth(beanOutput.getLngvMnth());
            sub.setLngvDays(beanOutput.getLngvDays());
            sub.setAdedDays(beanOutput.getAdedDays());
            sub.setArmAdedDays(beanOutput.getArmAdedDays());
            sub.setYrlyDays(beanOutput.getYrlyDays());
            sub.setPreFrwrDays(beanOutput.getPreFrwrDays());
            sub.setSumDays(beanOutput.getSumDays());
            sub.setUseDays(beanOutput.getUseDays());
            sub.setExtnDays(beanOutput.getExtnDays());
            sub.setUnsdDays(beanOutput.getUnsdDays());
            sub.setFrwrDays(beanOutput.getFrwrDays());
            sub.setPymnDays(beanOutput.getPymnDays());
            sub.setPymnYm(beanOutput.getPymnYm());
            sub.setMnthDays(beanOutput.getMnthDays());
            sub.setMnthPreFrwrDays(beanOutput.getMnthPreFrwrDays());
            sub.setMnthSumDays(beanOutput.getMnthSumDays());
            sub.setMnthUseDays(beanOutput.getMnthUseDays());
            sub.setMnthExtnDays(beanOutput.getMnthExtnDays());
            sub.setMnthUnsdDays(beanOutput.getMnthUnsdDays());
            sub.setMnthFrwrDays(beanOutput.getMnthFrwrDays());
            sub.setMnthPymnDays(beanOutput.getMnthPymnDays());
            sub.setMnthPymnYm(beanOutput.getMnthPymnYm());
            sub.setYrlyUseStrtYmd(beanOutput.getYrlyUseStrtYmd());
            sub.setYrlyUseEndYmd(beanOutput.getYrlyUseEndYmd());
            sub.setMnthUseStrtYmd(beanOutput.getMnthUseStrtYmd());
            sub.setMnthUseEndYmd(beanOutput.getMnthUseEndYmd());
            sub.setBaseDays(beanOutput.getBaseDays());
            sub.setCnsrDays(beanOutput.getCnsrDays());
            sub.setNrmlAmt(beanOutput.getNrmlAmt());
            sub.setDlyAmt(beanOutput.getDlyAmt());
            sub.setYrlyAmt(beanOutput.getYrlyAmt());
            sub.setMnthYrlyAmt(beanOutput.getMnthYrlyAmt());
            sub.setSlryAtrbYm(beanOutput.getSlryAtrbYm());
            sub.setSlryGbCd(beanOutput.getSlryGbCd());
            sub.setSlrySeq(beanOutput.getSlrySeq());
            sub.setPymnYmd(beanOutput.getPymnYmd());
            sub.setHlthDays(beanOutput.getHlthDays());
            sub.setHlthUseDays(beanOutput.getHlthUseDays());
            sub.setRmrk(beanOutput.getRmrk());
            sub.setEmplNm(beanOutput.getEmplNm());
            sub.setDprtNm(beanOutput.getDprtNm());
            sub.setEmplGbCd(beanOutput.getEmplGbCd());
            sub.setWorkStCd(beanOutput.getWorkStCd());
            sub.setPrvsSumDays(beanOutput.getPrvsSumDays());
            sub.setPrvsUseDays(beanOutput.getPrvsUseDays());
            sub.setPrvsExtnDays(beanOutput.getPrvsExtnDays());
            sub.setPrvsUnsdDays(beanOutput.getPrvsUnsdDays());
            sub.setOrgnSiteCd(beanOutput.getOrgnSiteCd());
            sub.setOrgnSiteNm(beanOutput.getOrgnSiteNm());
            sub.setEnlsYmd(beanOutput.getEnlsYmd());
            sub.setDschYmd(beanOutput.getDschYmd());

            subArray[i] = sub;
        }
        output.setSub01(subArray);
    }

    DefaultApplicationContext.addMessage("BXMI60000", null, new Object[] {});
    return output;
}