import React from "react";

import "./PlaceList.css";
import Card from "../../shared/components/UIElements/Card";
import { PlaceItem } from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";

const PlaceList = props => {
  // zbog razlike u vlasniku ako nema places i u nekom useru ako nema places
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          {props.owner === props.loggedInUser ? (
            <>
              <h2>No places found. Maybe create one?</h2>
              <Button to="/places/new">Share place</Button>
            </>
          ) : (
            <h2>This user didn't share any place yet</h2>
          )}
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map(place => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
