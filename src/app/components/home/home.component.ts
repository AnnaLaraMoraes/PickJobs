import { Component, OnInit } from '@angular/core';
import { tap, catchError, finalize, BehaviorSubject } from 'rxjs';
import { PickJob, PickJobs, StatusEnum } from 'src/app/services/pick-jobs';
import { PickJobsService } from 'src/app/services/pick-jobs.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public isLoading = false;
  public statusTypeArray: StatusEnum[] = [
    StatusEnum.OPEN,
    StatusEnum.IN_PROGRESS,
    StatusEnum.CLOSED,
  ];

  public pickJobs$ = new BehaviorSubject<PickJob[] | []>([]);

  constructor(private pickJobsService: PickJobsService) {}

  public ngOnInit(): void {
    this.isLoading = true;
    this.pickJobsService
      .getPickJobs()
      .pipe(
        tap(data => {
          console.log('data: ', data);
          this.pickJobs$.next((data as PickJobs).pickjobs);
        }),
        catchError(err => {
          throw 'error in source. Details: ' + err;
        }),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe();
  }

  public statusToShow(currentStatus: StatusEnum): StatusEnum[] {
    const filteredStatusValues = this.statusTypeArray.filter(
      status => status !== currentStatus,
    );
    return filteredStatusValues as StatusEnum[];
  }

  public changeStatus(item: PickJob, newStatus: StatusEnum): void {
    this.isLoading = true;
    this.pickJobsService
      .updateStatusPickJob(item, newStatus)
      .pipe(
        tap(data => {
          const formatedPickjobs: PickJob[] =
            this.pickJobs$.value?.map(item => {
              if (item.id === (data as PickJob).id) {
                return data as PickJob;
              } else {
                return item;
              }
            }) || [];

          this.pickJobs$.next(formatedPickjobs);
        }),
        catchError(err => {
          throw 'error in source. Details: ' + err;
        }),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe();
  }
}
