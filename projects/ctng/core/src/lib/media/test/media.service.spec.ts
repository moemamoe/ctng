import { TestBed } from '@angular/core/testing';
import { MediaService } from '../media.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoggerService } from '../../logger';
import { Media_1, Media_2, Media_3 } from './media.data.stub';
import { of } from 'rxjs';
import { Media } from '../media';
import { loogerTestConfig } from '../../logger/loggers/test/logger-test.config';

describe('MediaService', () => {
  // services
  let mediaService: MediaService;
  let httpClient: HttpClient;

  // spies
  let getHttpImageSpy: jasmine.Spy;
  let blobToObjectUrlSpy: jasmine.Spy;
  let revokeObjectUrlSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaService, LoggerService, loogerTestConfig, HttpClient],
      imports: [HttpClientModule],
    });

    // services
    httpClient = TestBed.inject(HttpClient);
    getHttpImageSpy = spyOn(httpClient, 'get');

    // constructor
    mediaService = TestBed.inject(MediaService);

    // media service spies
    blobToObjectUrlSpy = spyOn<any>(mediaService, 'blobToObjectUrl');
    revokeObjectUrlSpy = spyOn(mediaService, 'revokeObjectUrl');
  });

  it('should be created', () => {
    // Assert
    expect(mediaService).toBeTruthy();
  });

  it('getImageUrl() should return the correct blob url, if the image is already in the library', () => {
    // Arrange
    const media = Media_1;
    mediaService['mediaLibrary'][media.id] = media.url;

    // Act
    const url = mediaService.getImageUrl(media.id);

    // Assert
    expect(url).toEqual(media.url, 'Unexpected media blob url');
  });

  it('getImageUrl() should return null, if the image is not in the library', () => {
    // Arrange
    const mediaId = 21;

    // Act
    const url = mediaService.getImageUrl(mediaId);

    // Assert
    expect(url).toEqual(MediaService['fallbackUrl'], 'Unexpected url returned. should be fallback url');
  });

  it('loadMedia() should load the media and store it in the media library, if it is not already loaded', () => {
    // Arrange
    const media = Media_1;
    const expectedBlobUrl = 'das-ist-eine-blob-url';

    getHttpImageSpy.and.returnValue(of({}));
    blobToObjectUrlSpy.and.returnValue(of(expectedBlobUrl));

    // Assert
    expect(mediaService['mediaLibrary'][media.id]).toBeUndefined('Media should not be loaded and not stored in the media library');

    // Act
    mediaService.loadMedia(media).subscribe();

    // // Assert
    expect(mediaService['mediaLibrary'][Media_1.id]).toBeDefined(`Media ${Media_1.id} should be loaded and stored in the media library`);
    expect(mediaService['mediaLibrary'][Media_1.id]).toEqual(expectedBlobUrl, 'Unexpected Blob Url for given ID');
    expect(getHttpImageSpy).toHaveBeenCalledTimes(1);
    expect(blobToObjectUrlSpy).toHaveBeenCalledTimes(1);
  });

  it('loadMedia() should return empty obeservable, when media should not be loaded', () => {
    // Arrange
    const media = Media_1;
    const expectedBlobUrl = 'das-ist-eine-blob-url';
    mediaService['mediaLibrary'][media.id] = expectedBlobUrl;

    getHttpImageSpy.and.returnValue(of({}));
    blobToObjectUrlSpy.and.returnValue(of(expectedBlobUrl));

    // Assert
    expect(mediaService['mediaLibrary'][media.id]).toBeDefined('Media should be loaded and stored in the media library');

    // Act & Assert
    mediaService.loadMedia(media).subscribe(emptyObeservable => expect(emptyObeservable).toEqual({}, 'unexpected return value'));

    // Arrange
    mediaService['mediaLibrary'] = {};
    mediaService['currentlyFetching'].push(media.id);

    // Act && Assert
    mediaService.loadMedia(media).subscribe(emptyObeservable => expect(emptyObeservable).toEqual({}, 'unexpected return value'));

    // Arrange
    mediaService['currentlyFetching'] = [];

    // Act && Assert
    mediaService.loadMedia(null).subscribe(emptyObeservable => expect(emptyObeservable).toEqual({}, 'unexpected return value'));

    // Assert
    expect(getHttpImageSpy).toHaveBeenCalledTimes(0);
    expect(blobToObjectUrlSpy).toHaveBeenCalledTimes(0);
  });

  it('loadMediaFiles() should return media blob urls and store it in media library', () => {
    // Arrange
    const expectedBlobUrl_1 = 'das-ist-eine-blob-url-1';
    const expectedBlobUrl_2 = 'das-ist-eine-blob-url-2';
    const expectedBlobUrl_3 = 'das-ist-eine-blob-url-3';

    getHttpImageSpy.and.returnValues(of({}), of({}), of({}));
    blobToObjectUrlSpy.and.returnValues(of(expectedBlobUrl_1), of(expectedBlobUrl_2), of(expectedBlobUrl_3));
    mediaService['currentlyFetching'].push(Media_3.id);

    // Assert
    expect(mediaService['mediaLibrary'][Media_1.id]).toBeUndefined('Media should not be loaded and not stored in the media library');
    expect(mediaService['mediaLibrary'][Media_2.id]).toBeUndefined('Media should not be loaded and not stored in the media library');
    expect(mediaService['mediaLibrary'][Media_3.id]).toBeUndefined('Media should not be loaded and not stored in the media library');

    // Act
    mediaService.loadMediaFiles([Media_1, Media_2, Media_3]).subscribe();

    // // Assert
    expect(mediaService['mediaLibrary'][Media_1.id]).toBeDefined(`Media ${Media_1.id} should be loaded and stored in the media library`);
    expect(mediaService['mediaLibrary'][Media_1.id]).toEqual(expectedBlobUrl_1, 'Unexpected Blob Url for given ID');
    expect(mediaService['mediaLibrary'][Media_2.id]).toBeDefined(`Media ${Media_2.id} should be loaded and stored in the media library`);
    expect(mediaService['mediaLibrary'][Media_2.id]).toEqual(expectedBlobUrl_2, 'Unexpected Blob Url for given ID');
    expect(mediaService['mediaLibrary'][Media_3.id]).toBeUndefined(
      `Media ${Media_3.id} should not be loaded and not stored in the media library, because it is currently fetching`,
    );

    expect(getHttpImageSpy).toHaveBeenCalledTimes(2);
    expect(blobToObjectUrlSpy).toHaveBeenCalledTimes(2);
  });

  it('clear() should revoke all object urls of the media library and clear it', () => {
    // Arrange
    revokeObjectUrlSpy.and.callThrough();

    mediaService['mediaLibrary'][Media_1.id] = Media_1.url;
    mediaService['mediaLibrary'][Media_2.id] = Media_2.url;
    mediaService['mediaLibrary'][Media_3.id] = Media_3.url;

    const expectedNumberOfCalls = Object.keys(mediaService['mediaLibrary']).length;

    // Act
    mediaService.clear();

    // Assert
    expect(revokeObjectUrlSpy).toHaveBeenCalledTimes(expectedNumberOfCalls);
    expect(mediaService['mediaLibrary']).toEqual({}, 'Unexpected media libaray object after clear');
    expect(mediaService['currentlyFetching']).toEqual([], 'Unexpected media libaray object after clear');
  });
});
