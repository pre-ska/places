import React from "react";

import Modal from "./Modal";
import Button from "../FormElements/Button";

const ErrorModal = props => {
  console.log(props.error);
  console.log(typeof props.error);
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
