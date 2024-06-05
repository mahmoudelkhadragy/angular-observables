import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  // private firstObsSubscription: Subscription;
  value$: Observable<number>;
  constructor(private userService: UserService) {}

  ngOnInit() {
    // this.firstObsSubscription = interval(1000).subscribe((x) => console.log(x));

    // handel observable subscrpe by async pipe in template
    this.value$ = interval(1000).pipe(map((val) => val + 1));

    // interval(1000)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((x) => console.log(x));

    // Observable.create is deprecated
    // making a custom observable
    const customObservable = new Observable((observer) => {
      let count = 0;
      setInterval(() => {
        observer.next(count);
        count === 2 && observer.complete(); //
        if (count > 3) {
          observer.error(new Error('Count is greater than 3')); // when it cancled due to error it cancel the observable it doesn't complete it and doesn't emit any data
        }
        count++;
      }, 1000);
    });

    customObservable
      .pipe(
        takeUntil(this.destroy$),
        filter((val: number) => val > 0), // filter out the value that is less than 0 and emit the value that is greater than 0 to next operator
        map((val: number) => 'Round: ' + (val + 1)), // transforms the value.
        tap((val: string) => console.log(val)) //This operator is used for side effects. It intercepts each value and logs it to the console without modifying the value that is passed down the stream.
      )
      .subscribe(
        (x) => console.log(x), //handel data
        (err) => alert(err), // handel error
        () => alert('Completed') // handel complete
      );
  }

  onActivate() {
    this.userService.activatedEmitter.next(true);
  }

  ngOnDestroy() {
    // this.firstObsSubscription.unsubscribe();
    // Emit a value to signal that the component is being destroyed
    this.destroy$.next();
    // Complete the subject to ensure that all observables using it complete
    this.destroy$.complete();
  }
}
