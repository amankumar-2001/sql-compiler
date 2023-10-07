import React, { useEffect, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import { styled } from "styled-components";
import { connect } from "react-redux";

const OperationContainer = styled.div`
  height: 97vh;
  overflow: scroll;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h2`
  display: flex;
  align-items: center;
`;
const BtnGroup = styled.div`
  display: inline-block;
  position: relative;
`;

const DropdownButton = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DropdownMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 5px;
  display: none;
`;

const DropdownItem = styled.li`
  &:not(:last-child) {
    border-bottom: 1px solid #ced4da;
  }
`;

const DropdownLink = styled.div`
  display: block;
  padding: 10px 20px;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const OperationWindow = styled.div`
  display: grid;
  grid-template-rows: 2fr 5fr;
  height: 92%;
`;
const InputWindow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;
const LeftTable = styled.div`
  padding: 0px 5%;
  width: 90%;
  height: 100%;
  border: 2px solid black;
`;
const RightTable = styled.div`
  padding: 0px 5%;
  width: 90%;
  height: 100%;
  border: 2px solid black;
`;
const OutputWindow = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid black;
  text-align: left;
  display: grid;
  grid-template-rows: 0.6fr 6fr;
`;

const QueryListItem = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#555" : "none")};

  &:hover {
    background-color: ${({ hover }) => (hover ? "#555" : "none")};
  }
`;

const QueryList = styled.div`
  margin-top: 13px;
`;
const QueryName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;
const CompileButton = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 35px;
`;

const ClearButton = styled(CompileButton)``;
const ColumnList = styled.div`
  display: flex;
  flex-direction: column;
  height: 160px;
  overflow: scroll;
`;

const Output = styled.div`
  background: black;
  height: 490px;
  overflow: scroll;
  color: white;
  padding: 10px;
  margin: 0px 0px 13px 0px;
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
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Total = styled.div`
  margin-bottom: 10px;
`;

const RadioLabel = styled.label`
  height: 30px;
  display: flex;
  align-items: center;
  width: 90%;
  border-radius: 6px;
  padding: 0px 10px;
  margin: 2px 0px;
  color: ${({ checked }) => (checked ? "white" : "black")};
  background: ${({ checked }) => (checked ? "#333" : "none")};

  &:hover {
    background: #333;
    color: white;
  }
`;

function Join({
  query,
  selectedWindow,
  selectedDate,
  selectedOperation,
  setSelectedOperation,
  leftSelectedTable,
  setLeftSelectedTable,
  rightSelectedTable,
  setRightSelectedTable,
}) {
  const [recentQuery, setRecentQuery] = useState();
  const [queryKey, setQueryKey] = useState();
  const [finalOutput, setFinalOutput] = useState([]);
  const [basedOn, setBasedOn] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const toggleDropdown = () => {
    const menu = document.getElementById("operationDropdownMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  };

  const naturalJoin = () => {
    const commonKeys = Object.keys(leftSelectedTable.result[0]).filter((key) =>
      Object.keys(rightSelectedTable.result[0]).includes(key)
    );
    const joinResult = leftSelectedTable.result.map((leftItem) => {
      const matchingRightItem = rightSelectedTable.result.find((rightItem) =>
        commonKeys.every((key) => leftItem[key] === rightItem[key])
      );

      return {
        ...leftItem,
        ...(matchingRightItem || {}),
      };
    });
    setFinalOutput(joinResult);
  };

  const leftJoin = ({ on }) => {
    const joinResult = leftSelectedTable.result.map((leftItem) => {
      const matchingRightItem = rightSelectedTable.result.find(
        (rightItem) => rightItem[on] === leftItem[on]
      );
      return {
        ...leftItem,
        ...(matchingRightItem || {}),
      };
    });
    setFinalOutput(joinResult);
  };

  const rightJoin = ({ on }) => {
    const joinResult = rightSelectedTable.result.map((leftItem) => {
      const matchingRightItem = leftSelectedTable.result.find(
        (rightItem) => rightItem[on] === leftItem[on]
      );
      return {
        ...leftItem,
        ...(matchingRightItem || {}),
      };
    });
    setFinalOutput(joinResult);
  };

  useEffect(() => {
    if ((selectedDate, selectedWindow)) {
      const temp = query.find(({ date }) => date === selectedDate);
      setRecentQuery(
        temp.windowPages.find(({ page }) => page === selectedWindow)
      );
    }
  }, [query, selectedDate, selectedWindow]);

  useEffect(() => {
    if (finalOutput && searchQuery) {
      const newSearchResults = finalOutput.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setSearchResult(newSearchResults);
    }
    if (searchQuery === "") {
      setSearchResult([]);
    }
  }, [finalOutput, searchQuery]);

  return (
    <OperationContainer>
      <Header>
        <Heading>
          <IoMdArrowRoundBack
            onClick={() => {
              setSelectedOperation("");
            }}
            style={{ cursor: "pointer" }}
          />
          {selectedOperation}
        </Heading>
        <Actions>
          <ClearButton
            onClick={() => {
              setFinalOutput([]);
              setLeftSelectedTable({});
              setRightSelectedTable({});
            }}
          >
            Clear
          </ClearButton>
          <CompileButton
            onClick={() => {
              if (selectedOperation === "Natural Join") {
                naturalJoin(basedOn);
              } else if (selectedOperation === "Left Join") {
                leftJoin(basedOn);
              } else if (selectedOperation === "Right Join") {
                rightJoin(basedOn);
              }
            }}
          >
            Compile
          </CompileButton>
          <BtnGroup>
            <DropdownButton onClick={toggleDropdown}>
              Advance Operation
              <RiArrowDownSLine />
            </DropdownButton>
            <DropdownMenu id="operationDropdownMenu">
              <DropdownItem>
                <DropdownLink
                  onClick={() => {
                    setSelectedOperation("Left Join");
                    toggleDropdown();
                  }}
                >
                  Left Join
                </DropdownLink>
              </DropdownItem>

              <DropdownItem>
                <DropdownLink
                  onClick={() => {
                    setSelectedOperation("Right Join");
                    toggleDropdown();
                  }}
                >
                  Right Join
                </DropdownLink>
              </DropdownItem>

              <DropdownItem>
                <DropdownLink
                  onClick={() => {
                    setSelectedOperation("Natural Join");
                    toggleDropdown();
                  }}
                >
                  Natural Join
                </DropdownLink>
              </DropdownItem>
              <DropdownItem>
                <DropdownLink
                  onClick={() => {
                    setSelectedOperation("Pivot");
                    toggleDropdown();
                  }}
                >
                  Pivot
                </DropdownLink>
              </DropdownItem>
            </DropdownMenu>
          </BtnGroup>
        </Actions>
      </Header>
      <OperationWindow>
        <InputWindow>
          <LeftTable>
            <QueryList>
              {recentQuery?.queries.length ? (
                Object.keys(leftSelectedTable).length === 0 ? (
                  recentQuery.queries.map(({ query, result }, index) => (
                    <QueryListItem
                      key={index}
                      onClick={() => {
                        setLeftSelectedTable({ query, result });
                        setQueryKey(index);
                      }}
                      hover={true}
                      active={
                        leftSelectedTable.query === query && queryKey === index
                      }
                    >
                      <QueryName>
                        {index + 1} : {query}{" "}
                      </QueryName>
                    </QueryListItem>
                  ))
                ) : (
                  <QueryListItem hover={false}>
                    <QueryName>
                      <b>Left Table:</b>
                      <br />
                      <b>Query:</b> {leftSelectedTable.query}
                    </QueryName>
                    {selectedOperation === "Left Join" && (
                      <>
                        {" "}
                        <b>Select Column:</b>
                        <ColumnList>
                          {Object.keys(leftSelectedTable.result[0]).map(
                            (column) => {
                              return (
                                <RadioLabel
                                  checked={basedOn === column}
                                  onClick={() => setBasedOn(column)}
                                >
                                  {column}
                                </RadioLabel>
                              );
                            }
                          )}
                        </ColumnList>
                      </>
                    )}
                  </QueryListItem>
                )
              ) : (
                "No Selected Table"
              )}
            </QueryList>
          </LeftTable>
          <RightTable>
            <QueryList>
              {recentQuery?.queries.length ? (
                Object.keys(rightSelectedTable).length === 0 ? (
                  recentQuery.queries.map(({ query, result }, index) => (
                    <QueryListItem
                      key={index}
                      onClick={() => {
                        setRightSelectedTable({ query, result });
                        setQueryKey(index);
                      }}
                      hover={true}
                      active={
                        rightSelectedTable.query === query && queryKey === index
                      }
                    >
                      <QueryName>
                        {index + 1} : {query}{" "}
                      </QueryName>
                    </QueryListItem>
                  ))
                ) : (
                  <QueryListItem hover={false}>
                    <QueryName>
                      <b>Right Table:</b>
                      <br />
                      <b>Query:</b> {rightSelectedTable.query}
                    </QueryName>
                    {selectedOperation === "Right Join" && (
                      <>
                        {" "}
                        <b>Select Column:</b>
                        <ColumnList>
                          {Object.keys(rightSelectedTable.result[0]).map(
                            (column) => {
                              return (
                                <RadioLabel
                                  checked={basedOn === column}
                                  onClick={() => setBasedOn(column)}
                                >
                                  {column}
                                </RadioLabel>
                              );
                            }
                          )}
                        </ColumnList>
                      </>
                    )}
                  </QueryListItem>
                )
              ) : (
                "No Selected Table"
              )}
            </QueryList>
          </RightTable>
        </InputWindow>
        <OutputWindow>
          <Header>
            <h3>Result:</h3>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Search in result..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
          </Header>
          <Output>
            <TableWrapper>
              {finalOutput.length ? (
                <>
                  <Total>Total number of records: {finalOutput.length}</Total>
                  <Table>
                    <TableHead>
                      <TableRow background={"grey"}>
                        <TableCell>Serial No.</TableCell>
                        {Object.keys(finalOutput[0]).map((item, index) => (
                          <TableCell key={index}>{item}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <tbody>
                      {finalOutput.map((row, i) => (
                        <>
                          <TableRow
                            key={i}
                            background={
                              searchResult.includes(row) ? "darkblue" : "node"
                            }
                          >
                            <TableCell>{i + 1}</TableCell>
                            {Object.keys(finalOutput[0]).map((item, j) => (
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
        </OutputWindow>
      </OperationWindow>
    </OperationContainer>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

const mapStateToProps = (state) => {
  return {
    query: state.query,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Join);
