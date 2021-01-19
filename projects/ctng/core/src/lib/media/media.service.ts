import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, mergeMap, catchError, finalize } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { Media } from './media';
import { LoggerService } from '../logger/logger.service';

interface MediaLibrary {
  [id: number]: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private static fallbackUrl = '/assets/img/fallback.jpg';

  // Storing media blob urls in this lybrary
  private mediaLibrary: MediaLibrary = {};

  // Array for currently loading media files
  private currentlyFetching: number[] = [];

  constructor(private http: HttpClient, private loggerService: LoggerService) {}

  /**
   * Gets the image url for the specified media ID.
   * Returns default image url if not found.
   */
  public getImageUrl(mediaId: number) {
    return this.getImageUrlFallback(mediaId);
  }

  /**
   * Loads the list of media into the library.
   */
  public loadMediaFiles(mediaList: Media[]) {
    const observables = [];

    for (const media of mediaList) {
      if (!this.shouldMediaBeLoaded(media)) {
        // We already loaded this media
        continue;
      }

      observables.push(this.getMediaObservable(media));
    }

    if (observables.length < 1) {
      observables.push(of(true));
    }

    const allRequests = forkJoin(observables);

    return allRequests;
  }

  /**
   * Loads a single media into the library.
   */
  public loadMedia(media: Media): Observable<any> {
    if (!this.shouldMediaBeLoaded(media)) {
      return of({});
    }

    return this.getMediaObservable(media).pipe(tap(res => this.logDebug('Loaded media', res)));
  }

  public revokeObjectUrl(url: string): void {
    const urlCreator = window.URL || (window as any).webkitURL;
    urlCreator.revokeObjectURL(url);
  }

  public clear() {
    this.logDebug('Clearing media service');

    Object.keys(this.mediaLibrary).forEach(mediaId => {
      this.revokeObjectUrl(this.mediaLibrary[mediaId]);
    });

    this.currentlyFetching = [];
    this.mediaLibrary = {};
  }

  /**
   *************************************************************************************
   *
   * Private helper
   *
   *************************************************************************************
   */

  /**
   * Checks if specified media was already loaded or is currently loaded.
   */
  private shouldMediaBeLoaded(media: Media) {
    return media && !this.mediaLibrary[media.id] && this.currentlyFetching.indexOf(media.id) < 0;
  }

  private getImageUrlFallback(mediaId: number) {
    let url = MediaService.fallbackUrl;
    const blobUrl = this.mediaLibrary[mediaId];

    if (blobUrl) {
      url = blobUrl;
    }

    return url;
  }

  /**
   * Gets the media observable.
   */
  private getMediaObservable(media: Media): Observable<any> {
    this.currentlyFetching.push(media.id);

    return this.http.get(media.url, { responseType: 'blob' }).pipe(
      mergeMap(mediaBlob => this.blobToObjectUrl(mediaBlob)),
      tap(mediaObjectUrl => {
        this.mediaLibrary[media.id] = mediaObjectUrl;
        this.removeCurrentlyFetchingImage(media.id);
      }),
      catchError(err => {
        this.loggerService.error('[MediaService]', 'Error while fetching image', media.id, err);
        this.removeCurrentlyFetchingImage(media.id);
        // We just return the error in case there happened something so that other images can load
        return of(err);
      }),
      finalize(() => {
        this.removeCurrentlyFetchingImage(media.id);
      }),
    );
  }

  /**
   * Removes the images from currently fetching queue.
   */
  private removeCurrentlyFetchingImage(mediaId: number) {
    const index = this.currentlyFetching.indexOf(mediaId);

    if (index >= 0) {
      this.currentlyFetching.splice(index, 1);
    }
  }

  /**
   * Get the Object URL of the specified blob.
   */
  private blobToObjectUrl(blob: Blob): Observable<string> {
    const urlCreator = window.URL || (window as any).webkitURL;
    return of(urlCreator.createObjectURL(blob));
  }

  /**
   *
   * @param input: Any input for debug log
   */
  private logDebug(message: string, ...input: any[]): void {
    this.loggerService.debug('[MediaService]', message, ...input);
  }

  private blobToDataURL(blob): Observable<string | ArrayBuffer> {
    const reader = new FileReader();

    const fileReaderObs = new Observable<string | ArrayBuffer>((observer: any) => {
      reader.onerror = error => observer.error(error);

      reader.onload = () => {
        observer.next(reader.result);
        observer.complete();
      };

      reader.readAsDataURL(blob);
    });

    return fileReaderObs;
  }
}
