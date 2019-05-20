export interface Event {
  _creator: string;
  title: string;
  description?: string;
  city: string;
  state: string;
  startTime: string;
  endTime: string;
  suggestLocations: Boolean;

  members?: Array<any>;
  displayStart?: string;
  displayEnd?: string;
  start?: Date;
  end?: Date;
  color?: object;

  _id?: string;
  __v?: any;
}
