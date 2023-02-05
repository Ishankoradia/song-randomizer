import React, { useReducer } from "react";
import ToastMessage from "./../common/ToastMessage";

export const ToastContext = React.createContext(null);

export const ToastProvider = ({ children, initialState, reducer }) => {
  const [toastState, toastDispatch] = useReducer(reducer, initialState);

  return (
    <ToastContext.Provider value={[toastState, toastDispatch]}>
      {children}
      <ToastMessage
        open={toastState.open}
        seconds={toastState.seconds}
        message={toastState.message}
        messages={toastState.messages}
        severity={toastState.severity}
        handleClose={() => toastDispatch({ type: "close", value: "" })}
      />
    </ToastContext.Provider>
  );
};
