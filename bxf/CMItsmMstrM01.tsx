import BwgForm from "@/components/BwgForm"
import BwgGrid, { BwgGridRef } from "@/components/BwgGrid"
import {
  BwgBtnCstm,
  BwgDatePicker,
  BwgFormItem,
  BwgInput,
  BwgSection,
  BwgSelect,
  BwgSrchPop,
  BwgTab,
  BwgTextArea,
} from "@/components/Core"
import {
  BwgDivider,
  BwgFileView,
  BwgHeader,
  BwgImageView,
  ContentBox,
  ContentLayout,
} from "@/components/Core_Ext"
import Page from "@/components/Page"
import SearchBox from "@/components/SearchBox"
import realFormat from "@/config/realFormat"
import useCode from "@/hooks/useCode"
import useService from "@/hooks/useService"
import useWorkFlow from "@/hooks/useWorkFlow"
import { grantEventList } from "@/types/index"
import { $formUtils } from "@/utils/common.form"
import { BwgGridColProps, BwgGridEventList } from "@/utils/common.grid"
import { RocketOutlined, SendOutlined } from "@ant-design/icons"
import { Flex, Space, TabsProps, Tag, Typography } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { GridFitStyle } from "realgrid"

const { Paragraph } = Typography

function CMItsmMstrM01() {
  /** useHooks */
  const $codeHooks = useCode()
  const $serviceHooks = useService()
  const $workFlowHooks = useWorkFlow()

  /** useState */
  const [rgstFileGrpKey, setRgstFileGrpKey] = useState(0)
  const [crntRgstNo, setCrntRgstNo] = useState()
  const [curRowData, setCurRowData] = useState<any>()
  /** useRef */
  const mainGridRef = useRef<BwgGridRef>(null)
  const searchBoxRef = useRef()
  const rgstFormRef = useRef()

  /** init Grid */
  const mainGridCols: BwgGridColProps[] = [
    {
      fieldName: "crprCd",
      tag: "req",
      visible: false,
    },
    {
      fieldName: "instId",
      header: { text: "WF" },
      width: 80,
      renderer: "workflow",
    },
    {
      fieldName: "issueNo",
      visible: false,
    },
    {
      fieldName: "issueMenuId",
      visible: false,
    },
    {
      fieldName: "issueMenuNm",
      header: { text: "메뉴" },
      styleName: "center",
    },
    {
      fieldName: "issueGb",
      header: { text: "요청구분" },
      list: $codeHooks.getCodeList("CMRQ0"),
      renderer: "listWithTag",
      width: 80,
      styleName: "center",
    },
    {
      fieldName: "rgstStts",
      header: { text: "요청상태" },
      list: $codeHooks.getCodeList("CMRQ1"),
      width: 40,
    },
    {
      fieldName: "issueTitle",
      header: { text: "제목" },
      width: 100,
      align: "left",
      visible: true,
      editable: false,
    },
    {
      fieldName: "issueContent",
      visible: false,
    },
    {
      fieldName: "rgstUser",
      visible: false,
    },
    {
      name: "rgstUserNm",
      fieldName: "rgstUserNm",
      width: 40,
      header: { text: "요청자" },
      styleName: "center",
    },
    {
      fieldName: "rgstFileGrpKey",
      visible: false,
    },
    {
      fieldName: "rgstDt",
      header: { text: "요청일" },
      width: 60,
      styleName: "center",
      editor: realFormat.editYmd,
      textFormat: realFormat.formatYmd,
    },
    {
      fieldName: "issueMngr",
      header: { text: "업무담당자" },
      width: 40,
    },
    {
      fieldName: "prcsStts",
      header: { text: "처리상태" },
      list: $codeHooks.getCodeList("CMRQ2"),
      width: 40,
    },
    {
      fieldName: "prcsFileGrpKey",
      visible: false,
    },
    {
      fieldName: "prcsDt",
      header: { text: "처리일" },
      width: 60,
      styleName: "center",
      editor: realFormat.editYmd,
      textFormat: realFormat.formatYmd,
    },
  ]

  /** 공통버튼 이벤트 */
  const grantEvent: grantEventList = {
    search() {
      //console.log("[INFO] Invoke Search Event ")
      serviceEvent.SCMITSM00101()
    },
    /*
      new() {},
      save() {},
      delete() {},
      file() {},
      draft() {},
      */
  }

  /** 서비스 이벤트 */
  const serviceEvent = {
    SCMITSM00101() {
      const svcParam = {
        ...$formUtils.getSearchBoxData(searchBoxRef),
      }
      $serviceHooks
        .callService("SCMITSM00101", svcParam)
        .then((response: any) => {
          /** 서비스 완료 후 콜백 처리 */
          console.log({
            SCMITSM00101: response,
          })
          mainGridRef.current?.addAllData(response.data)
        })
    },
  }

  /** 그리드 Event */
  const mainGridEvnt: BwgGridEventList = {
    /** 행 변경이 완료된 후 콜백 */
    onCurrentRowChanged(grid, oldRow, newRow) {
      if (newRow < 0) {
        $formUtils.resetData(rgstFormRef)
        return
      }
      console.log({
        curData: grid.getValues(newRow),
      })
      $formUtils.setValues(rgstFormRef, grid.getValues(newRow))
      setCrntRgstNo(grid.getValue(newRow, "issueNo"))
      setCurRowData(grid.getValues(newRow))
      setRgstFileGrpKey(grid.getValue(newRow, "rgstFileGrpKey"))
    },
  }

  const tabList: TabsProps["items"] = [
    {
      key: "rgst",
      label: "요청 정보",
      icon: <SendOutlined />,
      children: (
        <Flex vertical gap={"small"}>
          <Space>
            <Typography
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 0,
              }}
            >
              {"문서번호 : "}
            </Typography>
            <Paragraph
              copyable
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 0,
              }}
            >
              {crntRgstNo}
            </Paragraph>
          </Space>
          <BwgSection
            listKey={["key1", "key2"]}
            list={[
              {
                key: "key1",
                label: "요청",
                children: (
                  <ContentBox>
                    <BwgForm
                      ref={rgstFormRef}
                      labelCol={100}
                      style={{ padding: "0px 15px" }}
                      disabled={true}
                    >
                      <Flex gap="small" vertical>
                        <BwgFormItem label="등록자">
                          <Flex gap={"small"}>
                            <BwgInput name="rgstUser"></BwgInput>
                            <BwgInput name="rgstUserNm"></BwgInput>
                          </Flex>
                        </BwgFormItem>
                        <Flex gap={"small"}>
                          <div className="w50fl">
                            <BwgDatePicker
                              name="rgstDt"
                              label="등록일자"
                            ></BwgDatePicker>
                          </div>
                          <div className="w50pl">
                            <BwgSelect
                              name="issueGb"
                              label="등록구분"
                              list={$codeHooks.getCodeList("CMRQ0")}
                            ></BwgSelect>
                          </div>
                        </Flex>
                        <BwgInput name="issueTitle" label="제목"></BwgInput>
                        <BwgTextArea
                          label="내용"
                          name="issueContent"
                          autoSize
                        ></BwgTextArea>
                      </Flex>
                    </BwgForm>
                  </ContentBox>
                ),
              },
              {
                key: "key2",
                label: "첨부",
                children: (
                  <ContentBox>
                    <BwgDivider title="이미지첨부"></BwgDivider>
                    <BwgImageView
                      fileGrpKey={rgstFileGrpKey}
                      type="itsm"
                      height={140}
                    ></BwgImageView>
                    <BwgDivider title="일반첨부"></BwgDivider>
                    <BwgFileView fileGrpKey={rgstFileGrpKey}></BwgFileView>
                  </ContentBox>
                ),
              },
            ]}
          ></BwgSection>
        </Flex>
      ),
    },
    {
      key: "prcs",
      label: "처리 정보",
      icon: <RocketOutlined />,
    },
  ]

  useEffect(() => {
    grantEvent.search && grantEvent.search()
  }, [])

  return (
    <Page
      grantEvent={grantEvent}
      searchBox={
        <SearchBox
          ref={searchBoxRef}
          reqRows={{
            row1: [
              <BwgSelect
                name="issueGb"
                label="구분"
                list={$codeHooks.getCodeList("CMRQ0")}
              ></BwgSelect>,
              <BwgSelect
                name="rgstStts"
                label="요청상태"
                list={$codeHooks.getCodeList("CMRQ1")}
              ></BwgSelect>,
              <BwgSrchPop
                allowClear
                name={["rgstUser", "rgstUserNm"]}
                label="요청자"
                popuCode={"srchEmpl"}
              ></BwgSrchPop>,
              <></>,
            ],
          }}
        ></SearchBox>
      }
    >
      <ContentLayout>
        <ContentBox className="w50fl" border>
          <BwgHeader title="이슈 및 업무 목록">
            <BwgBtnCstm iconNm="memo" name="수정"></BwgBtnCstm>
            <BwgBtnCstm
              iconNm="insert"
              name="승인"
              onClick={() =>
                /** 분류코드를 통해 워크플로우 목록 조회 */
                $workFlowHooks.workFlowExecuter({
                  wkClsfCd: "CMWKFL01",
                  rowData: curRowData,
                  onRefresh() {
                    grantEvent.search && grantEvent.search()
                  },
                })
              }
            ></BwgBtnCstm>
            <BwgBtnCstm iconNm="reset" name="반려"></BwgBtnCstm>
            <BwgBtnCstm iconNm="delete" name="취소"></BwgBtnCstm>
          </BwgHeader>
          <BwgGrid
            ref={mainGridRef}
            columns={mainGridCols}
            editable={false}
            eventList={mainGridEvnt}
            options={{
              hide: ["statebar"],
              displayOptions: {
                fitStyle: GridFitStyle.EVEN,
              },
            }}
          ></BwgGrid>
        </ContentBox>
        <ContentBox className="w50pl">
          <BwgTab tabPosition="left" list={tabList}></BwgTab>
        </ContentBox>
      </ContentLayout>
    </Page>
  )
}

export default React.memo(CMItsmMstrM01)
