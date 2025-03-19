import { useEffect, useRef, useState } from "react"
import { GridFitStyle, RowState, ValueType } from "realgrid"
import Page from "@/components/Page"
import {
  BwgBtnCstm,
  BwgDatePicker,
  BwgDrawer,
  BwgInput,
  BwgSelect,
  BwgSrchPop,
  BwgTab,
} from "@/components/Core"
import {
  BwgCol,
  BwgHeader,
  BwgRow,
  ContentBox,
  ContentLayout,
} from "@/components/Core_Ext"
import SearchBox from "@/components/SearchBox"
import BwgGrid, { BwgGridRef } from "@/components/BwgGrid"
import { $formUtils } from "@/utils/common.form"
import { $stringUtils } from "@/utils/common.string"
import { $dateUtils } from "@/utils/common.date"
import { grantEventList } from "@/types/index"
import realFormat from "@/config/realFormat"
import useService from "@/hooks/useService"
import useCode from "@/hooks/useCode"
import useModal from "@/hooks/useModal"
import usePopup from "@/hooks/usePopup"
import {
  BwgGridColProps,
  BwgGridEventList,
  BwgGridOption,
} from "@/utils/common.grid"
import { $userUtils } from "@/utils/common.user"
import acUtils from "@/utils/common.ac"
import { BwgSrchAc } from "@/components/Core_Ac"
import BwgForm from "@/components/BwgForm"

/******************************************************************
 * 프로그램 명  : 연차기준관리
 * 프로그램 ID	: HRAbsnYrlyInfoM01.tsx
 * 작 성 자     : 김진
 * 작 성 일     : 2025.01.03
 * ----------------[수정이력]----------------------
 * 수정일자      /   수정자 /   수정내용
 *******************************************************************/
function HRAbsnYrlyInfoM01() {
  /******************************************************************
   * Function Name	: No
   * Description  	: 전역 변수 및 리얼그리드 선언
   *****************************************************************/
  /** useHook */
  const $serviceHooks = useService()
  const $codeHooks = useCode()
  const $modalHooks = useModal()
  const $popupHooks = usePopup()
  const $acUtils = acUtils()

  /** 기타 전역변수 */
  const crprCd = $userUtils.getCrprCd()
  const today = $dateUtils.getToday()

  /** 탭 페이지 state 선언 */
  const [activeKey, setActiveKey] = useState("tab01")

  /** Drawer state 선언 */
  const [disabledDrawer, setDisabledDrawer] = useState(true) // Drawer Disabled
  const [isDrawOpened, setIsDrawOpened] = useState(false)
  const [baseYmdList, setBaseYmdList] = useState<any>([])

  /** BwgPage Props 1. 토글영역 */
  const searchRef = useRef()
  const copyRef = useRef()

  /** 그리드 선언 - 메인 */
  const grdCnfgList = useRef<BwgGridRef>(null)
  const grdYrlyInfo = useRef<BwgGridRef>(null)

  /** 그리드 컬럼 정의 */
  const grdCnfgList_Cols: BwgGridColProps[] = [
    {
      name: "crprCd",
      fieldName: "crprCd",
      header: { text: "법인코드" },
      visible: false,
    },
    {
      name: "menuCd",
      fieldName: "menuCd",
      header: { text: "메뉴코드" },
      visible: false,
    },
    {
      name: "menuNm",
      fieldName: "menuNm",
      header: { text: "기준분류" },
      visible: false,
    },
    {
      name: "cnfgCd",
      fieldName: "cnfgCd",
      header: { text: "설정코드" },
      visible: false,
    },
    {
      name: "cnfgNm",
      fieldName: "cnfgNm",
      header: { text: "기준항목" },
      width: 100,
      styleName: realFormat.left,
      editable: false,
      footer: realFormat.count,
    },
    {
      name: "CharVl",
      fieldName: "CharVl",
      header: { text: "항목코드" },
      visible: false,
    },
    {
      name: "mngmCd",
      fieldName: "mngmCd",
      header: { text: "항목코드" },
      visible: false,
    },
    {
      name: "mngmNm",
      fieldName: "mngmNm",
      header: { text: "항목명칭" },
      width: 100,
      styleName: realFormat.left,
      button: "action",
    },
    {
      name: "numVl",
      fieldName: "numVl",
      header: { text: "설정값(숫자)" },
      visible: false,
    },
    {
      name: "addSetDscr",
      fieldName: "addSetDscr",
      header: { text: "추가항목" },
      width: 80,
    },
    {
      name: "inptDscr",
      fieldName: "inptDscr",
      header: { text: "설명" },
      width: 400,
      styleName: realFormat.left,
      editable: false,
    },
  ]

  const grdYrlyInfo_Cols: BwgGridColProps[] = [
    {
      name: "crprCd",
      fieldName: "crprCd",
      header: { text: "법인코드" },
      visible: false,
    },
    {
      name: "baseYmd",
      fieldName: "baseYmd",
      header: { text: "기준일자" },
      visible: false,
    },
    {
      name: "siteCd",
      fieldName: "siteCd",
      header: { text: "사업장코드" },
      visible: false,
    },
    {
      name: "siteNm",
      fieldName: "siteNm",
      header: { text: "사업장명칭" },
      width: 120,
      styleName: realFormat.left,
      editable: false,
      footer: realFormat.count,
    },
    {
      name: "baseYmdGbCd",
      fieldName: "baseYmdGbCd",
      header: { text: "근속연수기준" },
      width: 100,
      styleName: realFormat.left,
      list: $codeHooks.getCodeList("HR324", undefined, true),
      lookupDisplay: true,
      editor: realFormat.lookup,
    },
    {
      name: "mnthBaseGbCd",
      fieldName: "mnthBaseGbCd",
      header: { text: "월차지급기준" },
      width: 100,
      styleName: realFormat.left,
      list: $codeHooks.getCodeList("HR323", undefined, true),
      lookupDisplay: true,
      editor: realFormat.lookup,
    },
    {
      name: "mnthUseGbCd",
      fieldName: "mnthUseGbCd",
      header: { text: "월차사용기간" },
      width: 100,
      styleName: realFormat.left,
      list: $codeHooks.getCodeList("HR319", undefined, true),
      lookupDisplay: true,
      editor: realFormat.lookup,
    },
    {
      name: "mnth1yrGbCd",
      fieldName: "mnth1yrGbCd",
      header: { text: "1년만근연차" },
      width: 100,
      styleName: realFormat.left,
      list: $codeHooks.getCodeList("HR318", undefined, true),
      lookupDisplay: true,
      editor: realFormat.lookup,
    },
    {
      name: "yrlyBaseGbCd",
      fieldName: "yrlyBaseGbCd",
      header: { text: "연차지급시기" },
      width: 100,
      styleName: realFormat.left,
      list: $codeHooks.getCodeList("HR320", undefined, true),
      lookupDisplay: true,
      editor: realFormat.lookup,
    },
    {
      name: "yrlyUseGbCd",
      fieldName: "yrlyUseGbCd",
      header: { text: "연차사용기간" },
      width: 100,
      styleName: realFormat.left,
      list: $codeHooks.getCodeList("HR320", undefined, true),
      lookupDisplay: true,
      editor: realFormat.lookup,
    },
    {
      fieldName: "armInfo",
      direction: "horizontal",
      header: { text: "군경력정보" },
      editable: false,
      children: [
        {
          name: "armCrrInclYn",
          fieldName: "armCrrInclYn",
          header: { text: "경력포함여부" },
          width: 60,
          editable: false,
          renderer: realFormat.checkY,
        },
        {
          name: "armAdedYn",
          fieldName: "armAdedYn",
          header: { text: "가산연차여부" },
          width: 60,
          editable: false,
          renderer: realFormat.checkY,
        },
      ],
    },
    {
      fieldName: "cnsrInfo",
      direction: "horizontal",
      header: { text: "보상연차정보" },
      editable: false,
      children: [
        {
          name: "cnsrPymnYn",
          fieldName: "cnsrPymnYn",
          header: { text: "지급여부" },
          width: 60,
          editable: false,
          renderer: realFormat.checkY,
        },
        {
          name: "cnsrBaseDays",
          fieldName: "cnsrBaseDays",
          header: { text: "기준일수" },
          width: 60,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
        },
        {
          name: "cnsrPymnDays",
          fieldName: "cnsrPymnDays",
          header: { text: "지급일수" },
          width: 60,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
        },
      ],
    },
    {
      fieldName: "pymnInfo",
      direction: "horizontal",
      header: { text: "연차수당정보" },
      editable: false,
      children: [
        {
          name: "yrlyPymnYn",
          fieldName: "yrlyPymnYn",
          header: { text: "지급여부" },
          width: 60,
          visible: true,
          editable: false,
          renderer: realFormat.checkY,
        },
        {
          name: "yrlyPymnGbCd",
          fieldName: "yrlyPymnGbCd",
          header: { text: "지급시기" },
          width: 100,
          styleName: realFormat.left,
          list: $codeHooks.getCodeList("HR322", undefined, true),
          lookupDisplay: true,
          editor: realFormat.lookup,
        },
      ],
    },
    {
      name: "rmrk",
      fieldName: "rmrk",
      header: { text: "비고" },
      width: 150,
      styleName: realFormat.left,
    },
  ]

  /******************************************************************
   * Function Name	: gridOption
   * Description		: 그리드옵션
   *****************************************************************/
  const gridOption: BwgGridOption = {
    hide: ["panel"],
    // displayOptions: {
    //   fitStyle: GridFitStyle.EVEN_FILL,
    // },
  }

  /******************************************************************
   * Function Name	: useEffect
   * Description		: 초기화(initRealGrid) 및 기본설정
   *****************************************************************/
  useEffect(() => {
    // 초기 검색조건 컴포넌트 설정
    viewEvent.setSrchPrpr()

    // @ts-ignore
    grantEvent.search()
  }, [])

  /******************************************************************
   * Function Name	: grantEvent
   * Description		: 권한 버튼 클릭 시 발생하는 이벤트
   *****************************************************************/
  const grantEvent: grantEventList = {
    /******************************************************************
     * Function Name    : search
     * Description      : 조회 버튼 클릭 시 발생하는 이벤트
     *****************************************************************/
    search() {
      grdCnfgList.current?.setAllCommit()
      grdYrlyInfo.current?.setAllCommit()

      if (viewEvent.modifyCheck()) {
        $modalHooks.searchConfirm((isOk: any) => {
          if (isOk) {
            serviceEvent.SHRABSN12001()
            serviceEvent.SHRABSN12002()
          }
        })
      } else {
        serviceEvent.SHRABSN12001()
        serviceEvent.SHRABSN12002()
      }
    },

    /******************************************************************
     * Function Name    : save
     * Description      : 저장 버튼 클릭 시 발생하는 이벤트
     *****************************************************************/
    save() {
      if (!viewEvent.modifyCheck()) {
        $modalHooks.saveAlert()
      } else {
        serviceEvent.SHRABSN12004()
      }
    },

    /******************************************************************
     * Function Name    : new
     * Description      : 신규 버튼 클릭시 발생하는 이벤트
     *****************************************************************/
    new() {},

    /******************************************************************
     * Function Name    : delete
     * Description      : 삭제 버튼 클릭 시 발생하는 이벤트
     *****************************************************************/
    delete() {},
  }

  /******************************************************************
   * Function Name    : customEvent
   * Description      : 커스텀 버튼 클릭 시 발생하는 이벤트
   *****************************************************************/
  const customEvent = [
    /******************************************************************
     * Function Name    : copyInfo
     * Description      : 복사 버튼
     *****************************************************************/
    {
      label: "기준복사",
      onClick() {
        setIsDrawOpened(true)

        $formUtils.setValue(copyRef, "baseYmd", "")

        serviceEvent.SHRABSN12003()
      },
    },
  ]

  /******************************************************************
   * Function Name	: btnEvent
   * Description		: 버튼 영역 Event
   *******************************************************************/
  const btnEvent = {}

  /******************************************************************
   * Function Name : popupEvent
   * Description   : 팝업 호출 및 콜백 선언
   *****************************************************************/
  const popupEvent = {}

  /******************************************************************
   * Function Name	: gridEvent
   * Description		: 그리드에서 발생하는 이벤트
   *******************************************************************/
  const gridEvent: BwgGridEventList = {}

  /******************************************************************
   * Function Name	: serviceEvent
   * Description		: service Call 이벤트
   *****************************************************************/
  const serviceEvent = {
    /******************************************************************
     * Function Name	: SHRABSN12001
     * Description		: 환경설정 조회
     *****************************************************************/
    SHRABSN12001() {
      const svcParam = $formUtils.getSearchBoxData(searchRef)

      grdCnfgList.current?.dp?.clearRows()

      $serviceHooks
        .callService("SHRABSN12001", svcParam)
        .then((response: any) => {
          grdCnfgList.current?.addAllData(response.sub01)
        })
    },

    /******************************************************************
     * Function Name	: SHRABSN12002
     * Description		: 연차기준관리 조회
     *****************************************************************/
    SHRABSN12002() {
      const svcParam = $formUtils.getSearchBoxData(searchRef)

      grdYrlyInfo.current?.dp?.clearRows()

      $serviceHooks
        .callService("SHRABSN12002", svcParam)
        .then((response: any) => {
          grdYrlyInfo.current?.addAllData(response.sub01)

          const infoList = grdYrlyInfo.current?.dp?.getRowCount() ?? 0
          for (let i = 0; i < infoList; i++) {
            if (
              $stringUtils.isEmpty(
                grdYrlyInfo.current?.dp?.getValue(i, "baseYmd"),
              )
            ) {
              grdYrlyInfo.current?.dp?.setRowState(i, RowState.CREATED)
            }
          }
        })
    },

    /******************************************************************
     * Function Name	: SHRABSN12003
     * Description		: 기준일자 조회
     *****************************************************************/
    SHRABSN12003() {
      const svcParam = $formUtils.getSearchBoxData(searchRef)

      $serviceHooks
        .callService("SHRABSN12003", svcParam)
        .then((response: any) => {
          const setCodeList: any = []

          response?.sub01.map((item: any) => {
            const items = {
              label: $dateUtils.dateFormat(item.baseYmd, "D"),
              value: item.baseYmd,
            }
            setCodeList.push(items)
          })

          setBaseYmdList(setCodeList)
        })
    },

    /******************************************************************
     * Function Name	: SHRABSN12004
     * Description		: 연차기준관리 저장
     *****************************************************************/
    SHRABSN12004() {
      grdYrlyInfo.current?.setAllCommit()

      if (grdYrlyInfo.current?.dp?.getRowCount() == 0) return

      const validCheck = grdYrlyInfo.current?.gridValidCheck()

      if (validCheck?.isValidPass == false) {
        $modalHooks.alert({
          content: validCheck.content + "을(를) 입력하십시오.",
        })
        return
      }

      const sub01 = grdCnfgList.current?.getGridSaveData()
      const sub02 = grdYrlyInfo.current?.getGridSaveData()

      const input = {
        baseYmd: $formUtils.getValue(searchRef, "baseYmd"),
        sub01: sub01,
        sub01Cnt: sub01?.length,
        sub02: sub02,
        sub02Cnt: sub02?.length,
      }

      $serviceHooks.callService("SHRABSN12004", input).then((response: any) => {
        grdCnfgList.current?.dp?.clearRowStates(true)
        grdYrlyInfo.current?.dp?.clearRowStates(true)
        grantEvent.search?.()
      })
    },

    /******************************************************************
     * Function Name	: SHRABSN12005
     * Description		: 연차기준관리 저장
     *****************************************************************/
    SHRABSN12005() {
      const params = $formUtils.getSearchBoxData(copyRef)

      if (
        $stringUtils.isEmpty(params.copyYmd) ||
        !$dateUtils.isValidDate(params.copyYmd)
      ) {
        $modalHooks.alert({ content: "대상일자를 바르게 입력하십시오." })
      }

      if (
        $stringUtils.isEmpty(params.baseYmd) ||
        !$dateUtils.isValidDate(params.baseYmd)
      ) {
        $modalHooks.alert({ content: "복사일자를 바르게 입력하십시오." })
      }

      const message = {
        title: "기준복사",
        content:
          "(대상일자) " +
          $dateUtils.dateFormat(params.copyYmd, "H") +
          " 자료를 (기준일자) " +
          $dateUtils.dateFormat(params.baseYmd, "H") +
          " 로 복사하시겠습니까?",
        onOk: function () {
          $serviceHooks
            .callService("SHRABSN12005", params)
            .then((response: any) => {
              $formUtils.setValue(searchRef, "baseYmd", params.baseYmd)
              setIsDrawOpened(false)
              grantEvent.search?.()
            })
        },
      }

      $modalHooks.confirm(message)
    },
  }

  /******************************************************************
   * Function Name	: viewEvent
   * Description		: 이외 화면에서 발생하는 Event
   *******************************************************************/
  const viewEvent = {
    /******************************************************************
     * Function Name    : setSrchPrpr
     * Description      : 초기 검색조건 컴포넌트 설정
     *****************************************************************/
    setSrchPrpr() {
      $formUtils.setValue(searchRef, "baseYmd", today)
    },

    /******************************************************************
     * Function Name 	: tabChng
     * Description 		: 탭 변경 이벤트
     *****************************************************************/
    tabChng(key: any) {
      if (key != activeKey) {
        setActiveKey(key)
      }
    },

    /******************************************************************
     * Function Name	: modifyCheck
     * Description		: 화면 변경 값 체크
     *****************************************************************/
    modifyCheck() {
      if (grdCnfgList.current?.isUpdate() || grdYrlyInfo.current?.isUpdate()) {
        return true
      } else {
        return false
      }
    },
  }

  /******************************************************************
   * Function Name	: closeDrawer
   * Description		: Drawer 닫기 버튼 이벤트
   *****************************************************************/
  const closeDrawer = () => {
    setIsDrawOpened(false)
  }

  //탭화면 리스트
  const tabList = [
    {
      label: "환경설정",
      forceRender: true,
      children: (
        <>
          <BwgGrid
            ref={grdCnfgList}
            columns={grdCnfgList_Cols}
            options={gridOption}
            initCallback={() => {}}
          ></BwgGrid>
        </>
      ),
      key: "tab01",
    },
    {
      label: "생성기준",
      forceRender: true,
      children: (
        <>
          <BwgGrid
            ref={grdYrlyInfo}
            columns={grdYrlyInfo_Cols}
            eventList={gridEvent}
            options={gridOption}
            initCallback={() => {}}
          ></BwgGrid>
        </>
      ),
      key: "tab02",
    },
  ]

  return (
    <Page
      grantEvent={grantEvent}
      customEvent={customEvent}
      searchBox={
        <SearchBox ref={searchRef} labelCol={90}>
          <BwgRow>
            <BwgCol span={4}>
              <BwgDatePicker
                name="baseYmd"
                label="기준일자"
                req={true}
                onChange={() => {
                  grantEvent.search?.()
                }}
              ></BwgDatePicker>
            </BwgCol>
            <BwgCol span={6}>
              <BwgSrchAc
                label="사업장"
                name={["siteCd", "siteNm"]}
                popuCode={"srchSiteMstr"}
              ></BwgSrchAc>
            </BwgCol>
          </BwgRow>
        </SearchBox>
      }
    >
      <ContentLayout>
        <ContentBox width="100%" height="100%">
          <BwgTab
            activeKey={activeKey}
            list={tabList}
            type="line"
            tabPosition="top"
            onTabClick={(key) => viewEvent.tabChng(key)}
          ></BwgTab>
        </ContentBox>
      </ContentLayout>

      <BwgForm ref={copyRef} labelCol={90}>
        <BwgDrawer
          key="copyDrawer"
          title="기준복사"
          placement={"right"}
          forceRender={true}
          open={isDrawOpened}
          onClose={() => closeDrawer()}
          getContainer={false} // 사이즈조정
          mask={false} // 외부클릭해도 안닫힘
          width={300}
        >
          <BwgRow>
            <BwgCol span={24}>
              <BwgSelect
                name="copyYmd"
                label="대상일자"
                list={baseYmdList}
                rules={[{ required: true }]}
              ></BwgSelect>
            </BwgCol>
          </BwgRow>
          <BwgRow>
            <BwgCol span={24}>
              <BwgDatePicker
                name="baseYmd"
                label="복사일자"
                rules={[{ required: true }]}
              ></BwgDatePicker>
            </BwgCol>
          </BwgRow>
          <BwgBtnCstm
            iconNm="save"
            name="복사"
            style={{ float: "right" }}
            onClick={(e) => serviceEvent.SHRABSN12005?.()}
          ></BwgBtnCstm>
        </BwgDrawer>
      </BwgForm>
    </Page>
  )
}
export default HRAbsnYrlyInfoM01
