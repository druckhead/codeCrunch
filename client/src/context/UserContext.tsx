import React from "react";

type Nullable<T> = T | null | undefined;

export interface User {
  id: Nullable<number>;
  username: Nullable<string>;
  first_name: Nullable<string>;
  last_name: Nullable<string>;
  email: Nullable<string>;
  is_staff: Nullable<boolean>;
  accessToken: Nullable<string>;
  refreshToken: Nullable<string>;
  isLoggedIn: boolean;
}

export enum USER_ACTIONS {
  REFRESH_ACCESS_TOKEN = "refreshAccessToken",
  LOGIN = "login",
  REGISTER = "register",
  ME = "me",
  BLACKLIST = "blacklist ",
}

interface UserAction {
  type: USER_ACTIONS;
  payload: Partial<User> | User;
}

const INITIAL_USER_STATE: User = {
  id: null,
  username: null,
  first_name: null,
  last_name: null,
  email: null,
  is_staff: null,
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
};

function userReducer(userState: User, action: UserAction): User {
  switch (action.type) {
    case USER_ACTIONS.LOGIN: {
      return {
        ...userState,
        ...action.payload,
        isLoggedIn: true,
      };
    }
    case USER_ACTIONS.REGISTER: {
      return {
        ...userState,
        ...action.payload,
      };
    }
    case USER_ACTIONS.ME: {
      return {
        ...userState,
        ...action.payload,
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
