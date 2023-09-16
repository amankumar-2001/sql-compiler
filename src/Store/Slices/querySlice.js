import { createSlice } from "@reduxjs/toolkit";

const querySlice = createSlice({
  name: "query",
  initialState: [],
  reducers: {
    addQuery(state, action) {
      const { date, windowPage, newQuery, dispatch } = action.payload;
      const dateObject = state.find((d) => d.date === date);

      if (dateObject) {
        const windowPageObject = dateObject.windowPages.find(
          (wp) => wp.page === windowPage
        );

        if (windowPageObject) {
          windowPageObject.queries.unshift(newQuery);
        }
      } else {
        dispatch(
          querySlice.actions.addNewWindow({ date, windowName: windowPage })
        );
      }
    },

    addDummyData(state, action) {
      action.payload.dummyData.forEach((obj) => {
        state.push(obj);
      });
    },

    addNewWindow(state, action) {
      const { date, windowName } = action.payload;
      const dateObject = state.find((d) => d.date === date);

      if (dateObject) {
        const windowPageObject = {
          page: windowName,
          queries: [],
        };
        dateObject.windowPages.unshift(windowPageObject);
      } else {
        const windowPageObject = {
          date: date,
          windowPages: [
            {
              page: windowName,
              queries: [],
            },
          ],
        };

        state.unshift(windowPageObject);
      }
    },
  },
});

export default querySlice;
