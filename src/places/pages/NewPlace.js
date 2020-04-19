import React, { useCallback } from "react";

import "./NewPlace.css";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

const NewPlace = () => {
  const titleInputHandler = useCallback((id, value, isValid) => {}, []);

  return (
    <form className="place-form">
      <Input
        element="input"
        type="text"
        label="Title"
        onInput={titleInputHandler}
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title "
      />
      <Input
        element="textarea"
        type="text"
        label="Title"
        onInput={titleInputHandler}
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title "
      />
    </form>
  );
};

export default NewPlace;
