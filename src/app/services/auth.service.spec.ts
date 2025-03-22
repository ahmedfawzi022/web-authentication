import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should store user token on successful login', () => {
      const mockResponse = { token: 'fake-token' };
      const email = 'test@example.com';
      const password = 'password123';

      service.login(email, password).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('currentUser')).toBeTruthy();
        expect(JSON.parse(localStorage.getItem('currentUser')!)).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('https://reqres.in/api/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password });
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should remove user from localStorage', () => {
      localStorage.setItem('currentUser', JSON.stringify({ token: 'fake-token' }));
      service.logout();
      expect(localStorage.getItem('currentUser')).toBeNull();
    });

    it('should update currentUserSubject with null', () => {
      localStorage.setItem('currentUser', JSON.stringify({ token: 'fake-token' }));
      service.logout();
      service.currentUser.subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });

  describe('currentUserValue', () => {
    it('should return current user from BehaviorSubject', () => {
      const mockUser = { token: 'fake-token' };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      service = TestBed.inject(AuthService); // Reinitialize to trigger localStorage check
      expect(service.currentUserValue).toEqual(mockUser);
    });
  });
});