import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import RecentWindow from "../Components/RecentWindow";
import Compiler from "../Components/Compiler";
import { styled } from "styled-components";
import { connect } from "react-redux";
import { CurrentDateFormat } from "../Constants/CommonFunctions";
import querySlice from "../Store/Slices/querySlice";
import Join from "../Components/Join";
import Pivot from "../Components/Pivot";

const Container = styled.div`
  display: grid;
  grid-template-columns: ${({ selectedOperation }) =>
    selectedOperation ? "1.5fr 8fr" : "1.5fr 3fr 5fr"};
  gap: 10px;
  background: grey;
`;

function Dashboard({ query, addNewWindow }) {
  const [selectedWindow, setSelectedWindow] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [selectedQuery, setSelectedQuery] = useState("");
  const [queryOutput, setQueryOutput] = useState("");
  const [selectedOperation, setSelectedOperation] = useState("");
  const [leftSelectedTable, setLeftSelectedTable] = useState({});
  const [rightSelectedTable, setRightSelectedTable] = useState({});
  const [selectedTable, setSelectedTable] = useState({});

  const createNewWindow = () => {
    const currentDate = CurrentDateFormat();
    let size = 0;
    query.forEach(({ date, windowPages }) => {
      if (date === currentDate) {
        size = windowPages.length;
      }
    });
    addNewWindow({
      date: currentDate,
      windowName: `Window ${size + 1}`,
      size,
    });

    setSelectedWindow(`Window ${size + 1}`);
    setSelectedDate(currentDate);
  };

  return (
    <Container selectedOperation={selectedOperation}>
      <Sidebar
        createNewWindow={createNewWindow}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedWindow={selectedWindow}
        setSelectedWindow={setSelectedWindow}
      />
      {selectedOperation === "" ? (
        <>
          <RecentWindow
            selectedDate={selectedDate}
            selectedWindow={selectedWindow}
            selectedQuery={selectedQuery}
            queryOutput={queryOutput}
            setSelectedQuery={setSelectedQuery}
            setQueryOutput={setQueryOutput}
            selectedOperation={selectedOperation}
            setSelectedOperation={setSelectedOperation}
          />
          <Compiler
            selectedDate={selectedDate}
            selectedQuery={selectedQuery}
            queryOutput={queryOutput}
            selectedWindow={selectedWindow}
            setSelectedQuery={setSelectedQuery}
            setQueryOutput={setQueryOutput}
            createNewWindow={createNewWindow}
            setSelectedDate={setSelectedDate}
            setSelectedWindow={setSelectedWindow}
          />
        </>
      ) : selectedOperation.includes("Join") ? (
        <Join
          selectedDate={selectedDate}
          selectedWindow={selectedWindow}
          selectedQuery={selectedQuery}
          selectedOperation={selectedOperation}
          setSelectedOperation={setSelectedOperation}
          leftSelectedTable={leftSelectedTable}
          setLeftSelectedTable={setLeftSelectedTable}
          rightSelectedTable={rightSelectedTable}
          setRightSelectedTable={setRightSelectedTable}
        />
      ) : (
        <Pivot
          selectedDate={selectedDate}
          selectedWindow={selectedWindow}
          selectedQuery={selectedQuery}
          selectedOperation={selectedOperation}
          setSelectedOperation={setSelectedOperation}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
        />
      )}
    </Container>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
