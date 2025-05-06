import { useEffect, useReducer, useState, ActionDispatch } from "react";
import { useKeycloak } from "./Hooks/useKeycloak";
import { KeycloakInstance } from "keycloak-js";
import {
  keycloakReducer,
  ACTIONS,
  updateKeycloak,
} from "../Store/Reducers/auth.reducer";
import { UserInterface } from "../Models/user.model";
