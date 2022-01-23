import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClickService {

  openModal$ = new Subject<boolean>();

  constructor() { }

  openModal(flag: boolean) {
    this.openModal$.next(flag);
  }

}
