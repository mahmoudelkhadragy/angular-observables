import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  activated = false;
  private destroy$ = new Subject<void>();
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.activatedEmitter
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.activated = val;
      });
  }
  ngOnDestroy() {
    // this.firstObsSubscription.unsubscribe();
    // Emit a value to signal that the component is being destroyed
    this.destroy$.next();
    // Complete the subject to ensure that all observables using it complete
    this.destroy$.complete();
  }
}
