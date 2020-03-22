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
  unassigned?: IStory[];
  notifications?: INotification[];
}

export interface INotification {
  type: string;
  id: number;
  storyRequestId: number;
  sender: string;
  sprint: string;
  epic: string;
  description: string;
  points: number;
  notes: string;
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
  goal?: string;
  tickets?: IStory[];
}

export interface IStory {
  id?: number;
  dependencies?: number[];
  crossBoardDependencies?: IStoryRequest[];
  crossBoardDependents?: boolean;
  description?: string;
  home?: boolean;
  weight?: number;
  epic?: number;
  pin?: number;
}

export interface IStoryRequest {
  id?: number;
  boardId?: number;
  storyId?: number;
  state?: STORY_REQUEST_STATE;
  storyDescription?: string;
  storyPoints?: number;
  storyEpicId?: number;
  storySprintId?: number;
  notes?: string;
}

export interface IStoryRequestWithViewData extends IStoryRequest {
  storyBoardName?: string;
  storySprintName?: string;
  storyEpicName?: string;
}

export interface ICrossBoardData {
  boardId?: number;
  sprints?: SprintPreview[];
  epics?: EpicPreview[];
}

export type SprintPreview = Pick<ISprint, 'id' | 'name'>;
export type EpicPreview = Pick<IEpic, 'id' | 'name'>;

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

export enum STORY_REQUEST_STATE {
  Pending = 'Pending',
  Withdrawn = 'Withdrawn',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

export enum STORY_REQUEST_ACTION {
  Withdraw = 'Withdraw',
  Submit = 'Submit',
  Resubmit = 'Resubmit',
  Accept = 'Accept',
  Reject = 'Reject',
}

export interface SelectOption {
  value: number | string;
  label: string;
}
