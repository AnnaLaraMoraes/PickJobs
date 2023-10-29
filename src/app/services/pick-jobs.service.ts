import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { PickJob, StatusEnum } from './pick-jobs';

@Injectable({
  providedIn: 'root',
})
export class PickJobsService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {}

  public getPickJobs() {
    return this.authService.getUserTokenObservable().pipe(
      switchMap(userToken => {
        const headers = {
          authorization: `Bearer ${userToken}`,
        };

        return this.httpClient.get(
          'https://api-gateway-arnambywuq-ew.a.run.app/api/pickjobs',
          { headers: headers },
        );
      }),
    );
  }

  public updateStatusPickJob(item: PickJob, newStatus: StatusEnum) {
    return this.authService.getUserTokenObservable().pipe(
      switchMap(userToken => {
        const headers = {
          authorization: `Bearer ${userToken}`,
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
      }),
    );
  }
}
