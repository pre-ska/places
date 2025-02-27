import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import "./PlaceForm.css";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async e => {
    e.preventDefault();
    // const name = Date.now() + formState.inputs.image.value.name;
    // const imageRef = ref.child(name);

    // const snapshot = await imageRef.put(formState.inputs.image.value);

    // const imageUrl = await snapshot.ref.getDownloadURL();

    // imageRef
    //   .put(formState.inputs.image.value)
    //   .then(snapshot => snapshot.ref.getDownloadURL())
    //   .then(imageUrl =>
    //     sendRequest(
    //       process.env.REACT_APP_BACKEND_URL + "/places",
    //       "POST",
    //       JSON.stringify({
    //         title: formState.inputs.title.value,
    //         description: formState.inputs.description.value,
    //         address: formState.inputs.address.value,
    //         image: imageUrl,
    //       }),
    //       {
    //         "Content-Type": "application/json",
    //         Authorization: "Bearer " + auth.token,
    //       }
    //     )
    //   )
    //   .then(response => history.push("/"))
    //   .catch(err => {});
    try {
      //11-9
      // vec opisano u Auth.js ... line 95
      // const formData = new FormData();
      // formData.append("title", formState.inputs.title.value);
      // formData.append("description", formState.inputs.description.value);
      // formData.append("address", formState.inputs.address.value);
      // formData.append("image", formState.inputs.image.value);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places",
        "POST",
        // formData,

        {
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          // prebacio sam uplodanje slika u http-hook
          image: formState.inputs.image.value,
          // image: imageUrl,
        },
        // JSON.stringify({
        //   title: formState.inputs.title.value,
        //   description: formState.inputs.description.value,
        //   address: formState.inputs.address.value,
        //   // image: imageUrl,
        // }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      history.push("/");
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}

        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title "
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)"
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address"
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image"
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
