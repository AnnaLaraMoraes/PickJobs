import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { tap, catchError, finalize, BehaviorSubject, map } from 'rxjs';
import { PickJob, PickJobs, StatusEnum } from 'src/app/services/pick-jobs';
import { PickJobsService } from 'src/app/services/pick-jobs.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
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

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

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

  ngAfterViewInit() {
    this.pickJobsDataSource.sort = this.sort;
  }

  public changeStatus(item: PickJob): void {
    this.isLoading = true;

    let newStatus: StatusEnum;

    switch (item.status) {
      case StatusEnum.OPEN:
        newStatus = StatusEnum.IN_PROGRESS;
        break;

      case StatusEnum.IN_PROGRESS:
        newStatus = StatusEnum.CLOSED;
        break;

      case StatusEnum.IN_PROGRESS || StatusEnum.ABORTED:
        newStatus = StatusEnum.OPEN;
        break;

      default:
        newStatus = StatusEnum.OPEN;
    }

    this.pickJobsService
      .updateStatusPickJob(item, newStatus)
      .pipe(
        map(
          data =>
            this.pickJobs$.value?.map(item => {
              if (item.id === (data as PickJob).id) {
                const pickJob = data as PickJob;
                if (!pickJob.targetTime) {
                  pickJob.targetTime = item.targetTime;
                }
                return data as PickJob;
              } else {
                return item;
              }
            }) || [],
        ),
        tap(updatedPickJobs => {
          this.pickJobs$.next(updatedPickJobs);
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
