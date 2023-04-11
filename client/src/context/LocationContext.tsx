import React from "react";
import { Location } from "/Users/danielraz/repos/codeCrunch/client/node_modules/@remix-run/router/dist/history";

// type Nullable<T> = T | null | undefined;

export interface LocationState {
  pathname: string;
  search: string;
  hash: string;
  state: any;
  key: string;
}

export enum LOCATION_ACTIONS {
  SET_PREVIOUS_LOCATION = "setPrevLocation",
}

interface LocationAction {
  type: LOCATION_ACTIONS;
  payload: Location;
}

const INITIAL_LOCATION_STATE = {
  pathname: "/",
  search: "",
  hash: "",
  state: null,
  key: "",
};

function locationReducer(
  locationState: Location,
  action: LocationAction
): Location {
  switch (action.type) {
    case LOCATION_ACTIONS.SET_PREVIOUS_LOCATION: {
      return {
        ...locationState,
        ...action.payload,
      };
    }
    default:
      throw new Error(`Unknow action type, ${action.type}`);
  }
}

const LocationContext = React.createContext(INITIAL_LOCATION_STATE);
const LocationDispatchContext = React.createContext(
  (() => {}) as React.Dispatch<LocationAction>
);

type reactNode = { children: React.ReactNode };

export function LocationProvider({ children }: reactNode) {
  const [prevLocationState, dispatch] = React.useReducer(
    locationReducer,
    INITIAL_LOCATION_STATE
  );

  return (
    <LocationContext.Provider value={prevLocationState}>
      <LocationDispatchContext.Provider value={dispatch}>
        {children}
      </LocationDispatchContext.Provider>
    </LocationContext.Provider>
  );
}

export function usePrevLocation() {
  return React.useContext(LocationContext);
}

export function usePrevLocationDispactch() {
  return React.useContext(LocationDispatchContext);
}
