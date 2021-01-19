import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WordpressMockConfig } from '../../config/test/wordpress.mock.config';
import { PostMock } from '../../model/test/wp-post.mock';
import { UrlService } from '../url.service';
import { WPDataService } from '../wp-data.service';
import { WP_CONFIG } from '../../config/wordpress.config';
import { loogerTestConfig } from '@ctng/core';

describe('WpDataService', () => {
  let service: WPDataService;
  let urlService: UrlService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WPDataService, UrlService, { provide: WP_CONFIG, useValue: WordpressMockConfig }, loogerTestConfig],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(WPDataService);
    urlService = TestBed.inject(UrlService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCustomPosts() should return mocked WP Post Array as Observable', () => {
    service.getCustomPosts('products').subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts[0]).toEqual(PostMock);
    });

    const req = httpMock.expectOne(urlService.getWordpressRestUrl('products'));
    expect(req.request.method).toBe('GET');
    req.flush([PostMock]);
  });

  it('getCustomPosts() should return mocked WP Post Array as Observable', () => {
    service.getPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts[0]).toEqual(PostMock);
    });

    const req = httpMock.expectOne(urlService.getWordpressRestUrl('posts'));
    expect(req.request.method).toBe('GET');
    req.flush([PostMock]);
  });

  it('getCustomPost() should return mocked WP Post as Observable', () => {
    service.getCustomPostById('products', 1).subscribe(post => {
      expect(post).toEqual(PostMock);
    });

    const req = httpMock.expectOne(urlService.getWordpressRestUrl('products/1'));
    expect(req.request.method).toBe('GET');
    req.flush(PostMock);
  });
});
