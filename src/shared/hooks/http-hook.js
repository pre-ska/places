//10-10

import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(
    // dodao sam fireStorage zbog uploada....dobijem firebase storage ref i image value
    async (url, method = "GET", body_ = null, headers = {}, fireStorage) => {
      setIsLoading(true);

      let body = body_;

      // moj refactoring - ovo mi treab samo ako forma ima slike... signup i create new place... za login i update netrebam
      if (fireStorage) {
        const name = Date.now() + fireStorage.image.name;
        const imageRef = fireStorage.ref.child(name);

        const snapshot = await imageRef.put(fireStorage.image);

        const imageUrl = await snapshot.ref.getDownloadURL();

        body = JSON.parse(body);
        body.image = imageUrl;
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
