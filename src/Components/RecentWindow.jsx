import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const QueryListContainer = styled.div`
  height: 97vh;
  overflow: scroll;
`;

const QueryListItem = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
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
`;
const QueryName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const QueryId = styled.div`
  color: #555;
`;

function RecentWindow({
  selectedDate,
  selectedWindow,
  query,
  selectedQuery,
  setSelectedQuery,
  setQueryOutput,
}) {
  const [recentQuery, setRecentQuery] = useState();
  const [queryKey, setQueryKey] = useState();

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
        <h2>Recent Queries</h2>
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
                <QueryName>Query: {query}</QueryName>
                <QueryId>Id: {index + 1}</QueryId>
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
