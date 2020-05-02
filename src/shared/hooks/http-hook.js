//10-10

import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(
    // dodao sam image u body na one pozive koji postaju img
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      // moj refactoring - ovo mi treab samo ako forma ima slike... signup i create new place... za login i update netrebam
      if (body) {
        if (body.image) {
          const ref = window.firebase.storage().ref();
          const name = Date.now() + body.image.name;

          const imageRef = ref.child(name);

          const snapshot = await imageRef.put(body.image);

          const imageUrl = await snapshot.ref.getDownloadURL();

          body.image = imageUrl;
        }
        // prebacio stringify ovdje.... ali nema svaki req body...izbaci grešku na GET
        body = JSON.stringify(body);
      }

      const httpAbortCtrl = new AbortController();
      activeHttpRequest.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequest.current = activeHttpRequest.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const clearError = () => setError(null);

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
