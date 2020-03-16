import { IAddNewSprintFailureAction } from 'v1/actions/boardActions';

export interface ILoginParams {
  username?: string;
  email?: string;
  password: string;
}

export interface IBoard {
  id?: number;
  name?: string;
  owner?: string;
  sprints?: ISprint[];
  unassigned?: ITicket[];
}

export interface IEpic {
  id?: number;
  name?: string;
  priority?: number;
}

export interface ISprint {
  id?: number;
  name?: string;
  capacity?: number;
  goal?: IAddNewSprintFailureAction;
  tickets?: IStory[];
}

export interface IStory {
  id?: number;
  dependencies?: number[];
  description?: string;
  home?: boolean;
  weight?: number;
  epic?: number;
  pin?: number;
}

export interface IError {
  error?: {
    message?: string;
    error?: string;
    status?: number;
  };
  formattedErrorMessage?: string;
}

export interface IMyPayload {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  orgSlug: string;
  researcher: boolean;
  roles: string[];
  username: string;
}
