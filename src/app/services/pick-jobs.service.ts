import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PickJob, StatusEnum } from './pick-jobs';

@Injectable({
  providedIn: 'root',
})
export class PickJobsService {
  constructor(private httpClient: HttpClient) {}

  public getPickJobs() {
    const headers = {
      authorization: `Bearer ${localStorage.getItem('userToken')}`,
    };

    return this.httpClient.get(
      'https://api-gateway-arnambywuq-ew.a.run.app/api/pickjobs',
      { headers: headers },
    );
  }

  public updateStatusPickJob(item: PickJob, newStatus: StatusEnum) {
    const headers = {
      authorization: `Bearer ${localStorage.getItem('userToken')}`,
    };

    const body = {
      version: item.version,
      actions: [
        {
          status: newStatus,
          action: 'ModifyPickJob',
        },
      ],
    };

    return this.httpClient.patch(
      `https://api-gateway-arnambywuq-ew.a.run.app/api/pickjobs/${item.id}`,
      body,
      { headers: headers },
    );
  }
}
