import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { tap, catchError, finalize, BehaviorSubject, map } from 'rxjs';
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

  public pickJobs$ = new BehaviorSubject<PickJob[]>([]);
  public pickJobsDataSource = new MatTableDataSource<PickJob>([]);

  public displayedColumns: string[] = [
    'created',
    'lastModified',
    'version',
    'facilityRef',
    'orderRef',
    'targetTime',
    'status',
  ];

  constructor(private pickJobsService: PickJobsService) {}

  public ngOnInit(): void {
    this.isLoading = true;
    this.pickJobsService
      .getPickJobs()
      .pipe(
        tap(data => {
          this.pickJobs$.next((data as PickJobs).pickjobs);
          this.isLoading = false;
        }),
        catchError(err => {
          this.isLoading = false;
          throw 'error in source. Details: ' + err;
        }),
      )
      .subscribe();

    this.pickJobs$.subscribe(data => (this.pickJobsDataSource.data = data));
  }

  public changeStatus(item: PickJob, event: MatButtonToggleChange): void {
    this.isLoading = true;

    const newStatus = event.value;
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
          this.isLoading = false;
        }),
        catchError(err => {
          this.isLoading = false;
          throw 'error in source. Details: ' + err;
        }),
      )
      .subscribe();
  }
}
