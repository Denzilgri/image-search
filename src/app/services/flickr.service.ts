import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map, Observable, Subject } from 'rxjs';
import { Photos } from '../util/Photos.model';
import { Photo, PhotoTile } from '../util/Photo.model';
import { PhotoInfo } from '../util/PhotoInfo.model';

@Injectable({
  providedIn: 'root',
})
export class FlickrService implements OnInit {
  photoObjects: PhotoTile[] = [];
  displayImages$ = new Subject<{
    photos: PhotoTile[];
    error: string;
    searchText: string;
  }>();
  displayImageInfo$ = new Subject<any>();
  loading$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  fetchImages(
    searchText: string,
    pageNum: number = 1
  ): Observable<PhotoTile[]> {
    this.loading$.next(true);

    let imgSrc = '';
    const url =
      environment.flickr.url +
      '?method=flickr.photos.search&api_key=' +
      environment.flickr.apiKey +
      '&text=' +
      searchText +
      '&format=json&nojsoncallback=1' +
      '&per_page=20&safe_search=1&page=' +
      pageNum;

    return this.http.get<{ [photos: string]: Photos }>(url).pipe(
      map((response) => {
        const photos = response['photos'].photo;
        this.photoObjects = [];
        photos.forEach((val: Photo, idx: number) => {
          imgSrc = `${environment.flickr.imageUrl}${val.server}/${val.id}_${val.secret}_z.jpg`;
          this.photoObjects.push({
            imgSrc,
            title: val.title,
          });
        });
        return this.photoObjects;
      })
    );
  }

  fetchMoreImages(searchText: string, pageNum: number) {
    this.loading$.next(true);
    let imgSrc = '';
    const url =
      environment.flickr.url +
      '?method=flickr.photos.search&api_key=' +
      environment.flickr.apiKey +
      '&text=' +
      searchText +
      '&format=json&nojsoncallback=1' +
      '&per_page=20&safe_search=1&page=' +
      pageNum;


    return this.http.get<{ [photos: string]: Photos }>(url).pipe(
      map((response) => {
        const photos = response['photos'].photo;
        this.photoObjects = [];
        photos.forEach((val: Photo, idx: number) => {
          imgSrc = `${environment.flickr.imageUrl}${val.server}/${val.id}_${val.secret}_z.jpg`;
          this.photoObjects.push({
            imgSrc,
            title: val.title,
          });
        });
        return this.photoObjects;
      })
    );
  }

  displayResults(results: {
    photos: PhotoTile[];
    error: string;
    searchText: string;
  }) {
    this.displayImages$.next(results);
  }

  displayImageInfo(info: any) {
    this.displayImageInfo$.next(info);
  }

  fetchImageInfo(id: string, secret: string) {
    this.loading$.next(true);

    let imgSrc = '';
    const url =
      environment.flickr.url +
      '?method=flickr.photos.getInfo&api_key=' +
      environment.flickr.apiKey +
      '&photo_id=' +
      id +
      '&secret=' +
      secret +
      '&format=json&nojsoncallback=1';

    return this.http.get<{ [photoInfo: string]: PhotoInfo }>(url).pipe(
      map((response) => response['photo'])
    );
  }
}
