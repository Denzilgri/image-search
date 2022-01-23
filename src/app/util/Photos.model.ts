import { Photo } from "./Photo.model";

export interface Photos {
    page: number;
    pages: number;
    perpage: number;
    total: number;
    photo: Photo[]
}