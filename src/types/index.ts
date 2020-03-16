export interface IFuelSavings {
  newMpg?: number | string;
  tradeMpg?: number | string;
  newPpg?: number | string;
  tradePpg?: number | string;
  milesDriven?: number | string;
  milesDrivenTimeframe?: string;
  displayResults?: boolean;
  dateModified?: string;
  necessaryDataIsProvidedToCalculateSavings?: boolean;
  savings?: ISavings;
}

export interface ILoginParams {
  username?: string;
  email?: string;
  password: string;
}

export interface ISavings {
  monthly?: number | string;
  annual?: number | string;
  threeYear?: number | string;
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
  tickets?: ITicket[];
}

export interface ITicket {
  id?: number;
  dependencies?: number[];
  description?: string;
  home?: boolean;
  weight?: number;
  epic?: number;
  pin?: number;
}
