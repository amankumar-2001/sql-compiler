import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { dummyData } from "../Constants/DummyData";
import { connect } from "react-redux";
import querySlice from "../Store/Slices/querySlice";
import { BsFiletypeSql } from "react-icons/bs";
import { MdOutlineAddBox } from "react-icons/md";
import { dateFormatToDayMonthYear } from "../Constants/CommonFunctions";

const SidebarContainer = styled.div`
  height: 100%;
  background-color: #333;
  color: #fff;
  box-sizing: border-box;
  padding: 10px;
`;

const SidebarList = styled.ul`
  list-style-type: none;
  padding: 0;
  height: 90vh;
  overflow: scroll;
`;

const DateHeader = styled.div`
  margin: 20px 0px;
  margin-left: 10px;
  font-size: 14px;
  font-weight: 100;
  color: grey;
`;

const WindowTiles = styled.div`
  display: flex;
  border-radius: 5px;
  align-items: center;
  font-size: 18px;
  padding: 20px 5px;
  margin: 5px;
  cursor: pointer;
  height: 30px;
  background-color: ${({ active }) => (active ? "#555" : "none")};

  &:hover {
    background-color: #555;
  }
`;

const SidebarHeader = styled.div`
  margin: 5px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid;
  cursor: pointer;
  height: 30px;

  &:hover {
    background-color: #555;
  }
`;

const Title = styled.div``;

function Sidebar({
  query,
  addDummyData,
  createNewWindow,
  selectedWindow,
  setSelectedWindow,
  selectedDate,
  setSelectedDate,
}) {
  const [firstTimeDataFlag, setFirstTimeDataFlag] = useState(true);

  useEffect(() => {
    if (firstTimeDataFlag) {
      addDummyData({ dummyData });
      setFirstTimeDataFlag(false);
    }
  }, []);

  return (
    <SidebarContainer>
      <SidebarHeader onClick={createNewWindow}>
        <Title>New Window</Title>
        <MdOutlineAddBox height={120} />
      </SidebarHeader>
      <SidebarList>
        {query.length > 0
          ? query.map(({ date, windowPages }) => {
              return (
                <>
                  <DateHeader>{dateFormatToDayMonthYear(date)} :</DateHeader>
                  {windowPages.map(({ page }, index) => {
                    return (
                      <WindowTiles
                        active={
                          selectedWindow === page && selectedDate === date
                        }
                        onClick={() => {
                          setSelectedWindow(page);
                          setSelectedDate(date);
                        }}
                        key={index}
                      >
                        <BsFiletypeSql
                          style={{
                            margin: "2px",
                            "padding-right": "10px",
                            width: "30px",
                          }}
                        />
                        {page}
                      </WindowTiles>
                    );
                  })}
                </>
              );
            })
          : ""}
      </SidebarList>
    </SidebarContainer>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    addDummyData: ({ dummyData }) => {
      dispatch(querySlice.actions.addDummyData({ dummyData }));
    },
    addNewWindow: ({ date, windowName, size }) => {
      dispatch(querySlice.actions.addNewWindow({ date, windowName, size }));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    query: state.query,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
