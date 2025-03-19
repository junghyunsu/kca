import { useEffect, useRef, useState } from "react"
import { GridFitStyle, ValueType } from "realgrid"
import Page from "@/components/Page"
import {
  BwgDatePicker,
  BwgInput,
  BwgSelect,
  BwgSrchPop,
} from "@/components/Core"
import {
  BwgCol,
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

/******************************************************************
 * 프로그램 명  : 연차관리
 * 프로그램 ID	: HRAbsnYrlyM01.tsx
 * 작 성 자     : 김진
 * 작 성 일     : 2024.06.12
 * ----------------[수정이력]----------------------
 * 수정일자      /   수정자 /   수정내용
 *******************************************************************/
function HRAbsnYrlyM01() {
  /******************************************************************
   * Function Name	: No
   * Description  	: 전역 변수 및 리얼그리드 선언
   *****************************************************************/
  /** useHook */
  const $serviceHooks = useService()
  const $codeHooks = useCode()
  const $modalHooks = useModal()
  const $acUtils = acUtils()

  // 역할관리(RHR001:인사관리자/RHR002:인사담당자/RHR003:급여담당자/RHR004:총무담당자/RHR005:연수담당자/RHR006:평가담당자)
  const admn = $userUtils.getRoleList().find(function (data: string) {
    return data == "RHR001" || "RHR002" || "RCM000" // 인사관리자, 인사담당자, 개발자
  })

  const admnYn = !$stringUtils.isEmpty(admn) ? "Y" : "N"

  /** 기타 전역변수 */
  const crprCd = $userUtils.getCrprCd()
  const today = $dateUtils.getToday()

  /** 사업장코드 State 선언 */
  const [siteCdList, setSiteCdList] = useState([])

  /** BwgPage Props 1. 토글영역 */
  const searchRef = useRef()

  /** 그리드 선언 - 메인 */
  const grdAbsnYrly = useRef<BwgGridRef>(null)

  /** 그리드 컬럼 정의 */
  const grdAbsnYrly_Cols: BwgGridColProps[] = [
    {
      name: "crprCd",
      fieldName: "crprCd",
      header: { text: "법인코드" },
      visible: false,
    },
    {
      name: "atrbYy",
      fieldName: "atrbYy",
      header: { text: "귀속연도" },
      visible: false,
    },
    {
      name: "atrbMm",
      fieldName: "atrbMm",
      header: { text: "귀속월" },
      visible: false,
    },
    {
      name: "dprtCd",
      fieldName: "dprtCd",
      header: { text: "부서코드" },
      visible: false,
    },
    {
      name: "dprtNm",
      fieldName: "dprtNm",
      header: { text: "부서명칭" },
      width: 120,
      styleName: realFormat.left,
      editable: false,
    },
    {
      name: "orgnSiteCd",
      fieldName: "orgnSiteCd",
      header: { text: "원소속사업장코드" },
      visible: false,
    },
    {
      name: "orgnSiteNm",
      fieldName: "orgnSiteNm",
      header: { text: "원소속" },
      width: 120,
      styleName: realFormat.left,
      editable: false,
      footer: realFormat.count,
    },
    {
      name: "emplGbCd",
      fieldName: "emplGbCd",
      header: { text: "사원구분" },
      width: 80,
      styleName: realFormat.left,
      list: $codeHooks.getCodeList("HR008", undefined, true, "ALL"),
      lookupDisplay: true,
      editable: false,
    },
    {
      name: "emplNo",
      fieldName: "emplNo",
      header: { text: "사원번호" },
      width: 100,
    },
    {
      name: "emplNm",
      fieldName: "emplNm",
      header: { text: "성명" },
      width: 100,
    },
    {
      name: "pstnCd",
      fieldName: "pstnCd",
      header: { text: "직위" },
      width: 80,
      styleName: realFormat.left,
      list: $codeHooks.getCodeList("HR003", undefined, true, "ALL"),
      lookupDisplay: true,
      editable: false,
    },
    {
      name: "grpJoinYmd",
      fieldName: "grpJoinYmd",
      header: { text: "그룹입사일자" },
      width: 100,
      textFormat: realFormat.formatYmd,
      editable: false,
    },
    {
      name: "joinYmd",
      fieldName: "joinYmd",
      header: { text: "입사일자" },
      width: 100,
      textFormat: realFormat.formatYmd,
      editable: false,
    },
    {
      name: "yrlyBaseYmd",
      fieldName: "yrlyBaseYmd",
      header: { text: "연차기산일자" },
      width: 100,
      textFormat: realFormat.formatYmd,
      editable: false,
    },
    {
      name: "rtrmYmd",
      fieldName: "rtrmYmd",
      header: { text: "퇴직일자" },
      width: 100,
      textFormat: realFormat.formatYmd,
      editable: false,
    },
    {
      name: "baseYmd",
      fieldName: "baseYmd",
      header: { text: "기준일자" },
      width: 100,
      textFormat: realFormat.formatYmd,
      editable: false,
    },
    {
      name: "ttlLngvDays",
      fieldName: "ttlLngvDays",
      header: { text: "총근속일수" },
      visible: false,
    },
    {
      name: "ttlLngvMnth",
      fieldName: "ttlLngvMnth",
      header: { text: "총근속개월수" },
      visible: false,
    },
    {
      fieldName: "lngvInfo",
      direction: "horizontal",
      header: { text: "근속기간" },
      children: [
        {
          name: "lngvYrs",
          fieldName: "lngvYrs",
          header: { text: "년" },
          width: 30,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          editable: false,
        },
        {
          name: "lngvMnth",
          fieldName: "lngvMnth",
          header: { text: "월" },
          width: 30,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          editable: false,
        },
        {
          name: "lngvDays",
          fieldName: "lngvDays",
          header: { text: "일" },
          width: 30,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          editable: false,
        },
      ],
    },
    {
      fieldName: "yrlyInfo",
      direction: "horizontal",
      header: { text: "당해연도 연차내역" },
      children: [
        {
          name: "yrlyDays",
          fieldName: "yrlyDays",
          header: { text: "발생연차" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
        },
        {
          name: "adedDays",
          fieldName: "adedDays",
          header: { text: "가산연차" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "armAdedDays",
          fieldName: "armAdedDays",
          header: { text: "군가산연차" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "preFrwrDays",
          fieldName: "preFrwrDays",
          header: { text: "이월연차" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "sumDays",
          fieldName: "sumDays",
          header: { text: "연차합계" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "useDays",
          fieldName: "useDays",
          header: { text: "사용일수" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "extnDays",
          fieldName: "extnDays",
          header: { text: "소멸일수" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "unsdDays",
          fieldName: "unsdDays",
          header: { text: "잔여일수" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "frwrDays",
          fieldName: "frwrDays",
          header: { text: "이월연차일수" },
          visible: false,
        },
        {
          name: "yrlyUseStrtYmd",
          fieldName: "yrlyUseStrtYmd",
          header: { text: "사용시작일자" },
          width: 100,
          textFormat: realFormat.formatYmd,
        },
        {
          name: "yrlyUseEndYmd",
          fieldName: "yrlyUseEndYmd",
          header: { text: "사용종료일자" },
          width: 100,
          textFormat: realFormat.formatYmd,
        },
      ],
    },
    {
      name: "pymnYm",
      fieldName: "pymnYm",
      header: { text: "수당지급시기" },
      width: 100,
      textFormat: realFormat.formatYm,
    },
    {
      name: "baseDays",
      fieldName: "baseDays",
      header: { text: "기본연차발생일수" },
      visible: false,
    },
    {
      name: "cnsrDays",
      fieldName: "cnsrDays",
      header: { text: "연차보전일수" },
      visible: false,
    },
    {
      name: "pymnDays",
      fieldName: "pymnDays",
      header: { text: "연차정산일수" },
      visible: false,
    },
    {
      name: "nrmlAmt",
      fieldName: "nrmlAmt",
      header: { text: "통상임금" },
      width: 100,
      dataType: ValueType.NUMBER,
      editable: false,
      visible: false,
    },
    {
      name: "dlyAmt",
      fieldName: "dlyAmt",
      header: { text: "기본급" },
      width: 100,
      dataType: ValueType.NUMBER,
      editable: false,
      visible: false,
    },
    {
      name: "yrlyAmt",
      fieldName: "yrlyAmt",
      header: { text: "연차수당" },
      width: 100,
      dataType: ValueType.NUMBER,
      editable: false,
    },
    {
      name: "mnthYrlyAmt",
      fieldName: "mnthYrlyAmt",
      header: { text: "월차수당" },
      visible: false,
    },
    {
      name: "slryAtrbYm",
      fieldName: "slryAtrbYm",
      header: { text: "지급연월" },
      visible: false,
    },
    {
      name: "slryGbCd",
      fieldName: "slryGbCd",
      header: { text: "급여구분" },
      visible: false,
    },
    {
      name: "slrySeq",
      fieldName: "slrySeq",
      header: { text: "지급차수" },
      visible: false,
    },
    {
      name: "pymnYmd",
      fieldName: "pymnYmd",
      header: { text: "지급일자" },
      visible: false,
    },
    {
      name: "slryRflcYn",
      fieldName: "slryRflcYn",
      header: { text: "급여반영" },
      visible: false,
    },
    {
      name: "enlsYmd",
      fieldName: "enlsYmd",
      header: { text: "입대일자" },
      width: 100,
      textFormat: realFormat.formatYmd,
      editable: false,
    },
    {
      name: "dschYmd",
      fieldName: "dschYmd",
      header: { text: "제대일자" },
      width: 100,
      textFormat: realFormat.formatYmd,
      editable: false,
    },
    {
      fieldName: "mnthYrlyInfo",
      direction: "horizontal",
      header: { text: "1년미만" },
      children: [
        {
          name: "mnthDays",
          fieldName: "mnthDays",
          header: { text: "발생월차" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
        },
        {
          name: "mnthPreFrwrDays",
          fieldName: "mnthPreFrwrDays",
          header: { text: "이월월차" },
          visible: false,
        },
        {
          name: "mnthSumDays",
          fieldName: "mnthSumDays",
          header: { text: "월차합계" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "mnthUseDays",
          fieldName: "mnthUseDays",
          header: { text: "사용일수" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "mnthExtnDays",
          fieldName: "mnthExtnDays",
          header: { text: "소멸일수" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "mnthUnsdDays",
          fieldName: "mnthUnsdDays",
          header: { text: "잔여일수" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "mnthUseStrtYmd",
          fieldName: "mnthUseStrtYmd",
          header: { text: "사용시작일자" },
          width: 100,
          textFormat: realFormat.formatYmd,
        },
        {
          name: "mnthUseEndYmd",
          fieldName: "mnthUseEndYmd",
          header: { text: "사용종료일자" },
          width: 100,
          textFormat: realFormat.formatYmd,
        },
      ],
    },
    {
      fieldName: "prvsInfo",
      direction: "horizontal",
      header: { text: "전년도 연차내역" },
      children: [
        {
          name: "prvsSumDays",
          fieldName: "prvsSumDays",
          header: { text: "합계일수" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "prvsUseDays",
          fieldName: "prvsUseDays",
          header: { text: "사용일수" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "prvsExtnDays",
          fieldName: "prvsExtnDays",
          header: { text: "소멸일수" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
        {
          name: "prvsUnsdDays",
          fieldName: "prvsUnsdDays",
          header: { text: "미사용일수" },
          width: 80,
          styleName: realFormat.right,
          dataType: ValueType.NUMBER,
          numberFormat: realFormat.number2,
          editable: false,
        },
      ],
    },
    {
      name: "clclYmd",
      fieldName: "clclYmd",
      header: { text: "최종계산일자" },
      width: 100,
      textFormat: realFormat.formatYmd,
      editable: false,
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
      serviceEvent.SHRABSN10101()
    },

    /******************************************************************
     * Function Name    : save
     * Description      : 저장 버튼 클릭 시 발생하는 이벤트
     *****************************************************************/
    save() {
      serviceEvent.SHRABSN10103()
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
     * Function Name    : createyrly
     * Description      : 연차기준 Popup 버튼
     *****************************************************************/
    // {
    //   label: "연차기준",
    //   onClick() {
    //     const popParams = {
    //       atrbYy: $formUtils.getValue(searchRef, "atrbYy"),
    //     }

    //     $popupHooks.openBwgPop("crtAbsnBase", popParams)
    //   },
    // },

    /******************************************************************
     * Function Name    : AbsnBase
     * Description      : 연차생성 버튼
     *****************************************************************/
    {
      label: "연차생성",
      onClick() {
        serviceEvent.SHRABSN10102()
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
  const gridEvent: BwgGridEventList = {
    /******************************************************************
     * Function Name	: onDataLoadComplated
     * Description		: 그리드 refresh 완료 시 발생하는 이벤트
     *****************************************************************/
    onDataLoadComplated() {
      const count: any = grdAbsnYrly?.current?.dp.getFieldIndex("emplNm") //orgnSiteCd

      grdAbsnYrly?.current?.vw.setFixedOptions({ colCount: count + 1 })
    },

    /******************************************************************
     * Function Name     : onCurrentRowChanged
     * Description       : 그리드 행 위치 변경 후 이벤트
     *******************************************************************/
    onCurrentRowChanged(grid, oldRow, newRow) {
      if (newRow < 0) return

      if (oldRow == -1) {
        const count: any = grdAbsnYrly?.current?.dp.getFieldIndex("orgnSiteCd")

        grdAbsnYrly?.current?.vw.setFixedOptions({ colCount: count + 1 })
      }
    },

    /******************************************************************
     * Function Name     : onEditRowChanged
     * Description       : 그리드 값 변경 후 이벤트
     *****************************************************************/
    onEditRowChanged(grid, itemIndex, row, field, oldValue, newValue) {
      grdAbsnYrly.current?.setAllCommit()

      const fieldName = grid.getCurrent().fieldName

      if (row < 0) return

      if (fieldName == "yrlyDays") {
        const yrlyDays = Number(newValue) // 발생연차
        const adedDays = Number(grid.getDataSource().getValue(row, "adedDays")) // 가산연차
        const armAdedDays = Number(
          grid.getDataSource().getValue(row, "armAdedDays"),
        ) // 군가산연차
        const preFrwrDays = Number(
          grid.getDataSource().getValue(row, "preFrwrDays"),
        ) // 이월연차

        const sumDays = yrlyDays + adedDays + armAdedDays // 연차합계

        const useDays = Number(grid.getDataSource().getValue(row, "useDays")) // 사용일수
        const extnDays = Number(grid.getDataSource().getValue(row, "extnDays")) // 소멸일수

        const unsdDays = sumDays - useDays - extnDays // 잔여일수

        grid.getDataSource().setValue(row, "sumDays", sumDays) // 연차합계
        grid.getDataSource().setValue(row, "unsdDays", unsdDays) // 잔여일수
      }
    },
  }

  /******************************************************************
   * Function Name	: serviceEvent
   * Description		: service Call 이벤트
   *****************************************************************/
  const serviceEvent = {
    /******************************************************************
     * Function Name	: SHRABSN10101
     * Description		: 연차내역 조회
     *****************************************************************/
    SHRABSN10101() {
      const svcParam = $formUtils.getSearchBoxData(searchRef)

      grdAbsnYrly.current?.dp?.clearRows()

      $serviceHooks
        .callService("SHRABSN10101", svcParam)
        .then((response: any) => {
          grdAbsnYrly.current?.addAllData(response.sub01)
        })
    },

    /******************************************************************
     * Function Name    : SHRABSN10102
     * Description      : 연차 생성
     *****************************************************************/
    SHRABSN10102() {
      grdAbsnYrly.current?.vw.commit()

      const atrbYy = $formUtils.getValue(searchRef, "atrbYy")
      const clclYmd = $formUtils.getValue(searchRef, "clclYmd")

      const checkList = grdAbsnYrly.current?.vw.getCheckedItems() ?? []

      if (checkList.length < 1) {
        $modalHooks.alert({ content: "선택된 자료가 존재하지 않습니다." })
        return
      }

      if ($stringUtils.isEmpty(clclYmd)) {
        $modalHooks.alert({ content: "[계산일자]를 반드시 입력하십시오." })
        return
      }

      if (atrbYy != clclYmd.substring(0, 4)) {
        $modalHooks.alert({
          content: "기준연도에 해당하는 계산기준일자만 연차 생성이 가능합니다.",
        })
        return
      }

      const message = {
        title: "",
        content:
          "[" +
          $dateUtils.dateFormat(clclYmd, "H") +
          "] 기준으로 연차를 생성하시겠습니까?",
        onOk: function () {
          let sub01 = []

          for (let i = 0; i < checkList.length; i++) {
            sub01.push({
              crprCd: grdAbsnYrly.current?.vw.getValue(checkList[i], "crprCd"),
              emplNo: grdAbsnYrly.current?.vw.getValue(checkList[i], "emplNo"),
              clclYmd: clclYmd,
            })
          }

          const input = {
            sub01: sub01,
            sub01Cnt: sub01.length,
          }

          $serviceHooks
            .callService("SHRABSN10102", input)
            .then((response: any) => {
              grdAbsnYrly.current?.dp.clearRowStates(true)
              grantEvent.search?.()
            })
        },
      }

      $modalHooks.confirm(message)
    },

    /******************************************************************
     * Function Name    : SHRABSN10103
     * Description      : 연월차관리 저장
     *****************************************************************/
    SHRABSN10103() {
      grdAbsnYrly.current?.vw.commit()

      const validCheck = grdAbsnYrly.current?.gridValidCheck()

      if (validCheck?.isValidPass == false) {
        $modalHooks.alert({
          content: validCheck.content + "을(를) 입력하십시오.",
        })
        return
      }

      const sub01 = grdAbsnYrly.current?.getGridSaveData()

      const input = {
        sub01: sub01,
      }

      $serviceHooks.callService("SHRABSN10103", input).then((response: any) => {
        grdAbsnYrly.current?.dp.clearRowStates(true)
        grantEvent.search?.()
      })
    },

    /**************************************************************************************
     * Function Name : SCMCOMM00101
     * Description   : 사업장코드 조회
     **************************************************************************************/
    SCMCOMM00101() {
      const params = {
        crprCd: crprCd,
        acntGbCd: $acUtils.ACNT_GB_CD,
        unsdInclYn: "Y",
      }

      $serviceHooks
        .callService("SACINFO00101", params)
        .then((response: any) => {
          const setCodeList: any = []

          response?.siteMstrList.map((item: any) => {
            const items = {
              label: item.siteNm,
              value: item.siteCd,
            }
            setCodeList.push(items)
          })

          setSiteCdList(setCodeList)
        })
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
      $formUtils.setValue(searchRef, "atrbYy", $dateUtils.getToday("YYYY"))
      $formUtils.setValue(searchRef, "clclYmd", today)
    },

    /******************************************************************
     * Function Name	: changeAtrbYy
     * Description		: 기준연도 변경 이벤트
     *****************************************************************/
    changeAtrbYy() {
      const atrbYy = $formUtils.getValue(searchRef, "atrbYy")

      const today = $dateUtils.getToday()
      if (atrbYy == today.substring(0, 4)) {
        $formUtils.setValue(searchRef, "clclYmd", today)
      } else {
        $formUtils.setValue(searchRef, "clclYmd", atrbYy + "0101")
      }

      grantEvent.search?.()
    },
  }

  return (
    <Page 
      grantEvent={grantEvent}
      customEvent={customEvent}
      searchBox={
        <SearchBox ref={searchRef} labelCol={90}>
          <BwgRow>
            <BwgCol span={4}>
              <BwgDatePicker
                name="atrbYy"
                label="귀속연도"
                req={true}
                type="year"
                onChange={() => {
                  viewEvent.changeAtrbYy()
                }}
              ></BwgDatePicker>
            </BwgCol>
            <BwgCol span={4}>
              <BwgSelect
                name="orgnSiteCd"
                label="원소속"
                list={siteCdList}
                addField="ALL"
                initValue=""
                onChange={() => grantEvent.search?.()}
              ></BwgSelect>
            </BwgCol>
            <BwgCol span={8}>
              <BwgSrchPop
                name={["dprtCd", "dprtNm"]}
                placeholder={["부서코드", "부서명칭"]}
                label="부서"
                popuCode="srchDprtMstr"
                popParams={{
                  admnYn: admnYn,
                }}
              ></BwgSrchPop>
            </BwgCol>
            <BwgCol span={4}>
              <BwgSelect
                name="workStCd"
                label="근무상태"
                list={$codeHooks.getCodeList("HR009")}
                addField="ALL"
                initValue="HR0091"
                onChange={() => grantEvent.search?.()}
              ></BwgSelect>
            </BwgCol>
            <BwgCol span={4}>
              <BwgSelect
                name="emplGbCd"
                label="사원구분"
                list={$codeHooks.getCodeList("HR008")}
                addField="ALL"
                onChange={() => grantEvent.search?.()}
              ></BwgSelect>
            </BwgCol>
          </BwgRow>
          <BwgRow>
            <BwgCol span={8}>
              <BwgInput
                name="srchVl"
                label="검색어"
                placeholder="사원번호/성명"
                onPressEnter={() => grantEvent.search?.()}
              ></BwgInput>
            </BwgCol>
            <BwgCol span={4}>
              <BwgDatePicker
                name="clclYmd"
                label="계산기준일자"
                type="date"
              ></BwgDatePicker>
            </BwgCol>
          </BwgRow>
        </SearchBox>
      }
    >
      <ContentLayout>
        <ContentBox>
          <BwgGrid
            ref={grdAbsnYrly}
            columns={grdAbsnYrly_Cols}
            eventList={gridEvent}
            options={gridOption}
            // editable={false}
            initCallback={() => {
              serviceEvent.SCMCOMM00101()
            }}
          ></BwgGrid>
        </ContentBox>
      </ContentLayout>
    </Page>
  )
}
export default HRAbsnYrlyM01
