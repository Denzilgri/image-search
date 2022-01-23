import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClickService } from '../services/click.service';
import { FlickrService } from '../services/flickr.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'image-info',
  templateUrl: './image-info.component.html',
  styleUrls: ['./image-info.component.css'],
})
export class ImageInfoComponent implements OnInit, OnDestroy {
  isModalOpen: boolean = false;
  private modalSubscription: Subscription;
  private imgInfoSubscription: Subscription;
  title: string = '';
  imgSrc: string = '';
  owner: string = '';
  url: string = '';
  captureDate: string = '';

  constructor(
    private clickService: ClickService,
    private flickrService: FlickrService
  ) {}

  ngOnInit(): void {
    this.modalSubscription = this.clickService.openModal$.subscribe({
      next: (flag: boolean) => {
        this.isModalOpen = flag;
        document.body.className = 'scroll-hide';
      },
    });
    this.imgInfoSubscription = this.flickrService.displayImageInfo$.subscribe({
      next: (imgInfo: any) => {
        this.title = imgInfo.title._content;
        this.imgSrc = `${environment.flickr.imageUrl}${imgInfo.server}/${imgInfo.id}_${imgInfo.secret}_b.jpg`;
        this.owner = imgInfo.owner.username;
        this.url = imgInfo.urls.url[0]._content;
        this.captureDate = imgInfo.dates.taken;
      },
    });
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.className = '';
    this.title = '';
    this.imgSrc = '';
    this.owner = '';
    this.url = '';
    this.captureDate = '';
  }

  ngOnDestroy(): void {
    this.modalSubscription.unsubscribe();
    this.imgInfoSubscription.unsubscribe();
  }
}
