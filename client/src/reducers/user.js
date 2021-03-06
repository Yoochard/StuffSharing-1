const initialState = {
  info: {},
  stuffs: { data: [], pageCount: 0 },
  stuffBorrowed: { data: [], pageCount: 0 },
  stuffLent: { data: [], pageCount: 0 },
  bidsMade: { data: [], pageCount: 0 },
  bidsEarned: { data: [], pageCount: 0 },
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_UPDATED':
      return {
        ...state,
        info: action.user,
      };
    case 'RECEIVE_USER_DATA':
      return {
        ...action.data,
        info: state.info,
      };
    case 'DELETED_STUFF':
      return {
        ...state,
        stuffs: {
          ...state.stuffs,
          data: state.stuffs.data.filter(stuff => stuff.id !== action.id),
        },
      };
    case 'ADDED_STUFF':
      return {
        ...state,
        stuffs: {
          ...state.stuffs,
          data: [
            ...state.stuffs.data,
            action.stuff,
          ],
        },
      };
    case 'STUFF_RETURNED': {
      return {
        ...state,
        stuffLent: {
          ...state.stuffLent,
          data: state.stuffLent.data.filter(stuff => stuff.id !== action.id),
        },
      };
    }

    case 'LOG_OUT':
      return initialState;
    default:
      return state;
  }
};

export default user;
