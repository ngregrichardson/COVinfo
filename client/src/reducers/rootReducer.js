let initState = { user: null, authed: false };

let rootReducer = (state = initState, action) => {
  switch (action.type) {
    case "UPDATE_USER":
      return { ...state, user: action.user, authed: true };
    case "CLEAR_USER":
      return { ...state, user: null, authed: false };
    default:
      return state;
  }
};

export default rootReducer;
