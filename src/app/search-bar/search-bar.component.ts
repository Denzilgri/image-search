import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FlickrService } from '../services/flickr.service';
import { PhotoTile } from '../util/Photo.model';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
  searchForm: FormGroup;
  error = false;
  displayOutput: {photos: PhotoTile[], error: string, searchText: string };

  constructor(private flickrService: FlickrService) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchText: new FormControl(null, Validators.required),
      submitBtn: new FormControl(null),
    });
  }

  onSubmit() {
    // console.log(this.searchForm);
    const searchText = this.searchForm.value.searchText
    const resultsObservable = this.flickrService.fetchImages(searchText);
    resultsObservable.subscribe({
      next: (photos) => {
        console.log(photos);
        this.displayOutput = {
          photos,
          error: '',
          searchText
        };
      },
      error: (err) => {
        console.error('Error fetching images: ', err);
        this.error = true;
        this.displayOutput = {
          photos: [],
          error: 'Sorry, No results were foundfor this match.',
          searchText
        };
      },
      complete: () => this.flickrService.displayResults(this.displayOutput)
    });
    
  }

  validateInput() {
    return (
      !this.searchForm.get('searchText')?.valid &&
      this.searchForm.get('searchText')?.touched
    );
  }

  validateSubmit() {
    return (
      this.searchForm.get('searchText')?.valid &&
      this.searchForm.get('searchText')?.touched
    );
  }
}
