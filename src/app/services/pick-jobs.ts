export interface PickJobs {
  pickjobs: [PickJob];
  total: number;
}

export interface PickJob {
  created: string;
  lastModified: string;
  version: number;
  facilityRef: string;
  id: string;
  orderRef: string;
  targetTime: string;
  status: StatusEnum;
}

export enum StatusEnum {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  ABORTED = 'ABORTED',
}
