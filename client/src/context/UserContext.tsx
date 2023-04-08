import React from "react";

type Nullable<T> = T | null | undefined;

export interface User {
  id: Nullable<number>;
  username: Nullable<string>;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  email: Nullable<string>;
  isStaff: Nullable<boolean>;
  accessToken: Nullable<string>;
  refreshToken: Nullable<string>;
  isLoggedIn: boolean;
}

export enum USER_ACTIONS {
  REFRESH_ACCESS_TOKEN = "refreshAccessToken",
  LOGIN = "login",
  BLACKLIST = "blacklist ",
}

interface UserAction {
  type: USER_ACTIONS;
  payload: Partial<User> | User;
}

const INITIAL_USER_STATE: User = {
  id: null,
  username: null,
  firstName: null,
  lastName: null,
  email: null,
  isStaff: null,
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
};

function userReducer(userState: User, action: UserAction): User {
  switch (action.type) {
    case USER_ACTIONS.LOGIN: {
      return {
        id: action.payload.id,
        username: action.payload.username,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        isStaff: action.payload.isStaff,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isLoggedIn: true,
      };
    }
    case USER_ACTIONS.BLACKLIST: {
      return {
        ...INITIAL_USER_STATE,
      };
    }
    case USER_ACTIONS.REFRESH_ACCESS_TOKEN: {
      return {
        ...userState,
        accessToken: action.payload.accessToken,
      };
    }
    default:
      throw new Error(`Unknow action type, ${action.type}`);
  }
}

const UserContext = React.createContext(INITIAL_USER_STATE);
const UserDispatchContext = React.createContext(
  (() => {}) as React.Dispatch<UserAction>
);

type reactNode = { children: React.ReactNode };

export function UserProvider({ children }: reactNode) {
  const [userState, dispatch] = React.useReducer(
    userReducer,
    INITIAL_USER_STATE
  );

  return (
    <UserContext.Provider value={userState}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export function useUser() {
  return React.useContext(UserContext);
}

export function useUserDispactch() {
  return React.useContext(UserDispatchContext);
}
