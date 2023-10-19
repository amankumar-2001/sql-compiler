import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { RiArrowDownSLine } from "react-icons/ri";

const QueryListContainer = styled.div`
  height: 100%;
  padding: 10px;
  overflow: scroll;
`;

const QueryListItem = styled.div`
  border: 1px solid;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 5px;
  background-color: ${({ active }) => (active ? "#555" : "none")};

  &:hover {
    background-color: #555;
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;
const QueryList = styled.div`
  margin-top: 13px;
  gap: 12px;
  display: flex;
  flex-direction: column;
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
  flex-direction: row-reverse;
  gap: 10px;
  align-items: center;
`;

function RecentWindow({
  selectedDate,
  selectedWindow,
  query,
  selectedQuery,
  setSelectedQuery,
  setQueryOutput,
  selectedOperation,
  setSelectedOperation,
}) {
  const [recentQuery, setRecentQuery] = useState();
  const [queryKey, setQueryKey] = useState();

  const toggleDropdown = () => {
    const menu = document.getElementById("operationDropdownMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  };

  useEffect(() => {
    if ((selectedDate, selectedWindow)) {
      const temp = query.find(({ date }) => date === selectedDate);
      setRecentQuery(
        temp.windowPages.find(({ page }) => page === selectedWindow)
      );
    }
  }, [query, selectedDate, selectedWindow]);

  return (
    <QueryListContainer>
      <Header>
        <h2>Queries</h2>
        <Actions>
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
      <QueryList>
        {recentQuery?.queries.length
          ? recentQuery.queries.map(({ query, result }, index) => (
              <QueryListItem
                key={index}
                onClick={() => {
                  setSelectedQuery(query);
                  setQueryOutput(result);
                  setQueryKey(index);
                }}
                active={selectedQuery === query && queryKey === index}
              >
                {index + 1} : {query}{" "}
              </QueryListItem>
            ))
          : "No Queries"}
      </QueryList>
    </QueryListContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(RecentWindow);
