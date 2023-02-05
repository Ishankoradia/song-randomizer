export const successToast = (toastDispatch, message) => {
  toastDispatch({
    type: "new-toast",
    value: {
      open: true,
      message: message,
      seconds: 4,
      severity: "success",
    },
  });
};

export const errorToast = (toastDispatch, message = "", messages = []) => {
  toastDispatch({
    type: "new-toast",
    value: {
      open: true,
      message: message,
      messages: messages,
      seconds: 4,
      severity: "error",
    },
  });
};
