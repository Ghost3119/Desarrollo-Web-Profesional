import type { LocationState, Navigate } from "../router";

export type PageProps = {
  location: LocationState;
  navigate: Navigate;
};

export type SubmitState = {
  ok?: boolean;
  message: string;
};
