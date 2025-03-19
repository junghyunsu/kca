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

function Sample() {
  // Hooks
  const $serviceHooks = useService()
  const $codeHooks = useCode()
  const $modalHooks = useModal()
  const $acUtils = acUtils()
  const $popupHooks = usePopup()
 
  // Ref
  const searchRef = useRef()
  const gridRef = useRef<BwgGridRef>(null)

   // Grid props
  const gridCols: BwgGridColProps[] = [
    {
      name: "dprtNm",
      fieldName: "dprtNm",
      header: { text: "부서명칭" },
      width: 120,
      styleName: realFormat.left,
      editable: false,
    },
    {
      name: "emplNm",
      fieldName: "emplNm",
      header: { text: "성명" },
      width: 100,
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
      name: "clclYmd",
      fieldName: "clclYmd",
      header: { text: "최종계산일자" },
      width: 100,
      textFormat: realFormat.formatYmd,
      editable: false,
    },
  ]

  // Grid option
  const gridOption: BwgGridOption = {
    hide: ["panel", "statebar", "checkbar"],
    displayOptions: {
      fitStyle: GridFitStyle.EVEN_FILL,
    },
  }

  useEffect(() => {
    // 초기 검색조건 컴포넌트 설정
    viewEvent.setSrchPrpr()

    // @ts-ignore
    grantEvent.search()
  }, [])
 
  //초기화 및 useEffect 설정
  useEffect(() => {
    // 초기 검색조건 컴포넌트 설정
    viewEvent.setSrchPrpr()

    // @ts-ignore
    grantEvent.search()
  }, [])

  // grantEvent(Page 공통 버튼) 정의
  const grantEvent: grantEventList = {
    search() {
      serviceEvent.SERVICE10101()
    },
    save() {
      serviceEvent.SERVICE10102()
    },
    new() {},
    delete() {},
  }

  // customEvent(Custoem 버튼) 정의
  const customEvent = [
    {
      label: "연차기준",
      onClick() {
        const popParams = {
          atrbYy: $formUtils.getValue(searchRef, "atrbYy"),
        }

        $popupHooks.openBwgPop("crtAbsnBase", popParams)
      },
    },

    {
      label: "연차생성",
      onClick() {
        serviceEvent.SERVICE10102()
      },
    },
  ]

  //btn Event 정의
  const btnEvent = {}

  //popup Event 정의
  const popupEvent = {}

  //grid Event 정의
  const gridEvent: BwgGridEventList = {
    onDataLoadComplated() {
      const count: any = gridRef?.current?.dp.getFieldIndex("emplNm") 
      gridRef?.current?.vw.setFixedOptions({ colCount: count + 1 })
    },

    onCurrentRowChanged(grid, oldRow, newRow) {
      if (newRow < 0) return

      if (oldRow == -1) {
        const count: any = gridRef?.current?.dp.getFieldIndex("emplNm")
        gridRef?.current?.vw.setFixedOptions({ colCount: count + 1 })
      }
    },

    onEditRowChanged(grid, itemIndex, row, field, oldValue, newValue) {
      gridRef.current?.setAllCommit()
    },
  }

  // serviceEvent 정의
  const serviceEvent = {
    // 연차내역 조회
    SERVICE10101() {
      const svcParam = $formUtils.getSearchBoxData(searchRef)

      gridRef.current?.dp?.clearRows()
      $serviceHooks
        .callService("SERVICE10101", svcParam)
        .then((response: any) => {
          gridRef.current?.addAllData(response.sub01)
        })
    },
    // 연차 생성
    SERVICE10102() {
      gridRef.current?.vw.commit()

      const atrbYy = $formUtils.getValue(searchRef, "atrbYy")
      const clclYmd = $formUtils.getValue(searchRef, "clclYmd")
      const checkList = gridRef.current?.vw.getCheckedItems() ?? []

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
              crprCd: gridRef.current?.vw.getValue(checkList[i], "crprCd"),
              emplNo: gridRef.current?.vw.getValue(checkList[i], "emplNo"),
              clclYmd: clclYmd,
            })
          }

          const input = {
            sub01: sub01,
            sub01Cnt: sub01.length,
          }

          $serviceHooks
            .callService("SERVICE10102", input)
            .then((response: any) => {
              gridRef.current?.dp.clearRowStates(true)
              grantEvent.search?.()
            })
        },
      }

      $modalHooks.confirm(message)
    },
  }

  // 기타 필요 Event 정의
  const viewEvent = {
    //초기 검색조건 컴포넌트 설정
    setSrchPrpr() {
      $formUtils.setValue(searchRef, "atrbYy", $dateUtils.getToday("YYYY"))
      $formUtils.setValue(searchRef, "clclYmd", $dateUtils.getToday())
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
              ></BwgDatePicker>
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
            ref={gridRef}
            columns={gridCols}
            eventList={gridEvent}
            options={gridOption}
            // editable={false}
            initCallback={() => {
              serviceEvent.SERVICE10101()
            }}
          ></BwgGrid>
        </ContentBox>
      </ContentLayout>
    </Page>
  )
}
export default Sample
