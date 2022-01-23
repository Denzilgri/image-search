import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClickService } from '../services/click.service';
import { FlickrService } from '../services/flickr.service';
import { PhotoInfo } from '../util/PhotoInfo.model';

@Component({
  selector: 'image-info',
  templateUrl: './image-info.component.html',
  styleUrls: ['./image-info.component.css']
})
export class ImageInfoComponent implements OnInit, OnDestroy {

  isModalOpen: boolean = false;
  private modalSubscription: Subscription;
  private imgInfoSubscription: Subscription;
  imgInfo: PhotoInfo | string;

  constructor(private clickService: ClickService, private flickrService: FlickrService) { }

  ngOnInit(): void {
    this.modalSubscription = this.clickService.openModal$.subscribe({
      next: (flag: boolean) => {
        this.isModalOpen = flag;
        document.body.className = 'scroll-hide';
      }
    });
    this.imgInfoSubscription = this.flickrService.displayImageInfo$.subscribe({
      next: (imgInfo: PhotoInfo | string) => {
        this.imgInfo = imgInfo
        document.body.className = 'scroll-hide';
      }
    })
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.className = '';
  }

  ngOnDestroy(): void {
    this.modalSubscription.unsubscribe();
    this.imgInfoSubscription.unsubscribe();
  }

}
