import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { APP_CONFIG } from '../../../core/config/app.config';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  const baseUrl = `${APP_CONFIG.api.baseUrl}/api/categories`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list categories and extract content from paginated response', () => {
    const mockResponse = {
      content: [
        { id: 1, name: 'Electronics', status: 'ACTIVE' },
        { id: 2, name: 'Books', status: 'ACTIVE' }
      ],
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 20
    };

    service.list().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories[0].name).toBe('Electronics');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get category by id', () => {
    const mockCategory = { id: 1, name: 'Electronics', status: 'ACTIVE' };

    service.getById(1).subscribe(category => {
      expect(category.id).toBe(1);
      expect(category.name).toBe('Electronics');
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory);
  });

  it('should create category', () => {
    const newCategory = { name: 'Toys', description: 'Toys for kids', status: 'ACTIVE' as const };
    const mockResponse = { id: 3, ...newCategory };

    service.create(newCategory).subscribe(category => {
      expect(category.id).toBe(3);
      expect(category.name).toBe('Toys');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCategory);
    req.flush(mockResponse);
  });

  it('should update category', () => {
    const updatedCategory = { name: 'Electronics Updated', status: 'ACTIVE' as const };
    const mockResponse = { id: 1, ...updatedCategory };

    service.update(1, updatedCategory).subscribe(category => {
      expect(category.name).toBe('Electronics Updated');
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedCategory);
    req.flush(mockResponse);
  });

  it('should delete category', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
