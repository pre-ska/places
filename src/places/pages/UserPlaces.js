import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (error) {}
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = placeId => {
    setLoadedPlaces(prev => prev.filter(place => place.id !== placeId));
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList onDeletePlace={placeDeletedHandler} items={loadedPlaces} />
      )}
    </>
  );
};

export default UserPlaces;
