import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import querySlice from "../Store/Slices/querySlice";
import { CurrentDateFormat } from "../Constants/CommonFunctions";
import axios from "axios";
import { apiUrls } from "../Constants/Apidist";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

const csvtojson = require("csvtojson");

const CompilerContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  margin-right: 13px;
  height: 100%;
  padding: 10px;
`;

const TextArea = styled.textarea`
  width: auto;
  min-width: 500px;
  resize: none;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
`;

const ClearButton = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 36px;
`;

const ResultContainer = styled.div`
  text-align: left;
  display: grid;
  grid-template-rows: 0.6fr 6fr;

  position: ${({ view }) => (view ? "absolute" : "")};
  top: ${({ view }) => (view ? "0px" : "")};
  right: ${({ view }) => (view ? "0px" : "")};
  width: ${({ view }) => (view ? "85%" : "")};
  height: ${({ view }) => (view ? "100%" : "")};
  background: ${({ view }) => (view ? "grey" : "none")};
`;

const InputWindow = styled.div`
  display: grid;
  grid-template-rows: 1fr 6fr;
`;
const Actions = styled.div`
  display: flex;
  flex-direction: row-reverse;
  gap: 10px;
  align-items: center;
`;

const Output = styled.div`
  background: black;
  height: ${({ view }) => (view ? "877px" : "380px")};
  overflow: scroll;
  color: white;
  padding: 10px;
  margin: 13px 0px 13px 0px;
`;

const TableWrapper = styled.div`
  max-width: 100%;
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  color: white;
`;

const TableRow = styled.tr`
  background: ${({ background }) => (background ? background : "none")};
  &:nth-child(even) {
    background-color: none;
  }
`;

const TableCell = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 38px;
`;

const Header = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-between;
`;

const Total = styled.div`
  margin-bottom: 10px;
`;

function Compiler({
  selectedQuery,
  queryOutput,
  selectedDate,
  selectedWindow,
  addQuery,
  createNewWindow,
  setSelectedDate,
  storedQuery,
  setSelectedWindow,
}) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [view, setView] = useState(false);
  const [alertView, setAlertView] = useState([]);
  const [status, setStatus] = useState({});

  const runQuery = async ({ queryWindow, queryDate }) => {
    if (queryDate === CurrentDateFormat()) {
      try {
        const apiKeys = Object.keys(apiUrls);
        const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

        const response = await axios.get(apiUrls[randomKey]);
        const csvData = response.data;
        const jsonArray = await csvtojson().fromString(csvData);

        setResult(jsonArray);
        const saveToStore = {
          query,
          result: jsonArray,
        };
        addQuery({
          newQuery: saveToStore,
          date: queryDate,
          windowPage: queryWindow,
        });
        setStatus({
          value: "success",
          label: "Successfully Compiled",
        });
      } catch (err) {
        setStatus({
          value: "danger",
          label: err,
        });
      }
    } else {
      setStatus({
        value: "danger",
        label:
          "The query cannot be executed in the previous day window. Select window from today's session or create a new window in today's session to execute new query.",
      });
    }
  };

  const compileQuery = () => {
    if (query) {
      if (selectedDate) {
        runQuery({ queryDate: selectedDate, queryWindow: selectedWindow });
      } else {
        const dateObject = storedQuery.find(
          (d) => d.date === CurrentDateFormat()
        );

        if (dateObject) {
          setSelectedDate(CurrentDateFormat());
          if (!dateObject.windowPages.length) {
            createNewWindow();
          }
          setSelectedWindow(dateObject.windowPages[0].page);
          runQuery({
            queryDate: CurrentDateFormat(),
            queryWindow: dateObject.windowPages[0].page,
          });
        } else {
          createNewWindow();
          runQuery({
            queryDate: CurrentDateFormat(),
            queryWindow: `Window 1`,
          });
        }
      }
    } else {
      setStatus({
        value: "danger",
        label: "Oops!! No query found, Please Enter Query",
      });
    }
  };

  const clearQuery = () => {
    setQuery("");
    setResult([]);
    setStatus({});
  };

  useEffect(() => {
    setStatus({});
  }, [query]);

  useEffect(() => {
    setQuery(selectedQuery);
    setResult(queryOutput);
  }, [selectedQuery, queryOutput]);

  useEffect(() => {
    if (result && searchQuery) {
      const newSearchResults = result.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setSearchResult(newSearchResults);
    }

    if (searchQuery === "") {
      setSearchResult([]);
    }
  }, [result, searchQuery]);

  return (
    <CompilerContainer>
      <InputWindow>
        <Header>
          <h2>SQL Compiler</h2>
          <Actions>
            <Button variant="dark" onClick={compileQuery}>
              Compile
            </Button>
            <Button variant="dark" onClick={clearQuery}>
              Clear
            </Button>
          </Actions>
        </Header>
        <TextArea
          placeholder="Enter your SQL query here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {status.value && (
          <Alert key={status.value} variant={status.value}>
            {status.label}
          </Alert>
        )}
      </InputWindow>
      <ResultContainer view={view}>
        <Header>
          <h3>Result:</h3>
          <SearchContainer>
            <Button
              variant="dark"
              onClick={() => (view ? setView(false) : setView(true))}
            >
              View in {view ? "small" : "large"} Window
            </Button>
            <SearchInput
              type="text"
              placeholder="Search in result..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
        </Header>
        <Output view={view}>
          <TableWrapper>
            {result.length ? (
              <>
                <Total>Total number of records: {result.length}</Total>
                <Table>
                  <TableHead>
                    <TableRow background={"grey"}>
                      <TableCell>Serial No.</TableCell>
                      {Object.keys(result[0]).map((item, index) => (
                        <TableCell key={index}>{item}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <tbody>
                    {result.map((row, i) => (
                      <>
                        <TableRow
                          key={i}
                          background={
                            searchResult.includes(row) ? "darkblue" : "node"
                          }
                        >
                          <TableCell>{i + 1}</TableCell>
                          {Object.keys(result[0]).map((item, j) => (
                            <TableCell key={j}>{row[item]}</TableCell>
                          ))}
                        </TableRow>
                      </>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              "..."
            )}
          </TableWrapper>
        </Output>
      </ResultContainer>

      <Modal
        show={alertView.length > 0}
        onHide={() => setAlertView([])}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        {alertView.map((str) => {
          return <Modal.Body>{str} </Modal.Body>;
        })}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAlertView([])}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </CompilerContainer>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    addQuery: ({ newQuery, date, windowPage }) => {
      dispatch(
        querySlice.actions.addQuery({ newQuery, date, windowPage, dispatch })
      );
    },
  };
};

const mapStateToProps = (state) => {
  return {
    storedQuery: state.query,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Compiler);
