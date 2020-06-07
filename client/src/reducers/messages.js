const messagesReducer = (state, action) => {
  switch (action.type) {
    case "SET_MESSAGES":
      return [
        ...state,
        action.data
      ];
    default:
      return state;
  }
};

export { messagesReducer as default };
