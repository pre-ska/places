import React, { useState, useContext } from "react";

import "./Auth.css";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }
    setIsLoginMode(prev => !prev);
  };

  const authSubmitHandler = async e => {
    e.preventDefault();

    //refactoring 10-11...10-13
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          {
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          },
          // JSON.stringify({
          //   email: formState.inputs.email.value,
          //   password: formState.inputs.password.value,
          // }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(
          responseData.userId,
          responseData.token,
          responseData.avatar
        );
      } catch (error) {}
    } else {
      // const name = Date.now() + formState.inputs.image.value.name;
      // const imageRef = ref.child(name);

      // const snapshot = await imageRef.put(formState.inputs.image.value);

      // const imageUrl = await snapshot.ref.getDownloadURL();

      // imageRef
      //   .put(formState.inputs.image.value)
      //   .then(snapshot => snapshot.ref.getDownloadURL())
      //   .then(imageUrl => {
      //      (
      //       process.env.REACT_APP_BACKEND_URL + "/users/signup",
      //       "POST",
      //       JSON.stringify({
      //         name: formState.inputs.name.value,
      //         email: formState.inputs.email.value,
      //         password: formState.inputs.password.value,
      //         image: imageUrl,
      //       }),
      //       {
      //         "Content-Type": "application/json",
      //       }
      //     );
      //   })
      //   .then(response => {
      //     console.log(response);
      //     response.json();
      //   })
      //   .then(ress => {
      //     console.log(ress);
      //     auth.login(ress.userId, ress.token);
      //   })
      //   .catch(err => {});
      try {
        //FormData je standarni browser api - dodaje (appenda) na req.body
        // trebam ga jer nemogu poslati sliku kao application/json
        // ako korsitim FormData...automatski se postave headeri...a osim toga nemoram JSON.stingify jer sam napravio req.body na drugaciji nacin - sa append()
        // const formData = new FormData();
        // formData.append("email", formState.inputs.email.value);
        // formData.append("name", formState.inputs.name.value);
        // formData.append("password", formState.inputs.password.value);
        // formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          // formData,
          {
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            // prebacio sam uplodanje slika u http-hook - fireStorage argument
            image: formState.inputs.image.value,
            // image: imageUrl,
          },
          // JSON.stringify({
          //   name: formState.inputs.name.value,
          //   email: formState.inputs.email.value,
          //   password: formState.inputs.password.value,
          //   // image: imageUrl,
          // }),
          {
            "Content-Type": "application/json",
          }
        );

        // const responseData = await response.json();

        // //response.ok je property koji zivi na res objektu i biti ce ako je code 200-neki
        // // ovo radim jer ako je 400-neki ili 500-neki kod, response ce i dalje biti valjan i nece baciti error...a u biti JESTE error ako je npr 422 - user already exists
        // // tako da sa ovim se zelim osigurati da samo ako je sve ok prodje a ako ima nekakvih errora da mi odma ovdje izbaci error u catch blok I DA ME REDIRECTA
        // if (!response.ok) {
        //   throw new Error(responseData.message);
        // }

        // //ako je bilo errora 400-neki ili 500-neki ovo se nece izvesti
        // setIsLoading(false);

        auth.login(
          responseData.userId,
          responseData.token,
          responseData.avatar
        );
      } catch (error) {
        //   // console.log(error);
        //   // setIsLoading(false);
        //   // setError(
        //   //   error.message || "Something went wrong. Please  try again frontend.3"
        //   // );
      }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              type="text"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              errorText="Please enter your name"
              element="input"
            />
          )}

          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image"
            />
          )}

          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter valid email"
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter at least 6 characters"
            onInput={inputHandler}
          />

          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
