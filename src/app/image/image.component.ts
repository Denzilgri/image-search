import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ClickService } from '../services/click.service';
import { FlickrService } from '../services/flickr.service';
import { PhotoTile } from '../util/Photo.model';

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
})
export class ImageComponent implements OnInit, OnDestroy {
  error: boolean = false;
  pageNum: number = 1;
  public results: { photos: PhotoTile[], error: string, searchText: string };
  searchText = '';
  loading: boolean = false;
  private loadingSubscription: Subscription;
  private displaySubscription: Subscription;

  constructor(private flickrService: FlickrService, private clickService: ClickService) {}

  ngOnInit(): void {
    this.loadingSubscription = this.flickrService.loading$.subscribe({next: (loading) => this.loading = loading});
    this.displaySubscription = this.flickrService.displayImages$.subscribe({
      next: (results: {photos: PhotoTile[], error: string, searchText: string }) => {
        this.results = results;
        this.searchText = results.searchText
        this.error = false;
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }

  onScrollDown() {
    if (this.results !== undefined) {
      const resultsObservable = this.flickrService.fetchMoreImages(
        this.searchText,
        this.pageNum++
      );
      resultsObservable.subscribe({
        next: (photos) => {
          this.results.photos = this.results.photos.concat(photos);
          this.error = false;
        },
        error: (err) => {
          console.error('Error fetching images: ', err);
          this.error = true;
        },
        complete: () => this.loading = false
      });
    }
  }

  onCardClick(event: Event) {
    this.clickService.openModal(true);
    const idx = parseInt((<HTMLInputElement>event.target).id);
    const imgSrc = this.results.photos[idx].imgSrc;
    const imgAttr = imgSrc.split('/').reverse()[0].split('_');
    const id = imgAttr[0];
    const secret = imgAttr[1];
    this.flickrService.fetchImageInfo(id, secret).subscribe({
      next: (photoInfo) => {
        this.flickrService.displayImageInfo(photoInfo);
      },
      error: (err) => {
        console.error('Error fetching image info: ', err);
        this.flickrService.displayImageInfo('Error fetching image details.');
      }
    });
    
  }

  ngOnDestroy(): void {
      this.loadingSubscription.unsubscribe();
      this.displaySubscription.unsubscribe();
  }
}
