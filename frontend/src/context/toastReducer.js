export const initialState = {
  open: false,
  message: "",
  seconds: 0,
  messages: [],
};

export const reducer = (state, action) => {
  switch (action?.type) {
    case "close":
      return { ...state, open: false };
    case "new-toast":
      return {
        open: action.value.open,
        message: action.value.message,
        seconds: action.value.seconds,
        messages: action.value.messages,
        severity: action.value.severity,
      };
  }
};
