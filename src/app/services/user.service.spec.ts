import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return users list', () => {
      const mockResponse = {
        page: 1,
        per_page: 6,
        total: 12,
        total_pages: 2,
        data: [
          { id: 1, email: 'test@example.com', first_name: 'John', last_name: 'Doe', avatar: 'avatar.jpg' }
        ]
      };

      service.getUsers().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('https://reqres.in/api/users?page=1');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getUser', () => {
    it('should return single user', () => {
      const mockResponse = {
        data: { id: 1, email: 'test@example.com', first_name: 'John', last_name: 'Doe', avatar: 'avatar.jpg' }
      };

      service.getUser(1).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('https://reqres.in/api/users/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createUser', () => {
    it('should create new user', () => {
      const newUser: CreateUserDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        job: 'Developer'
      };

      const mockResponse = {
        ...newUser,
        // id: 1,
        createdAt: new Date().toISOString()
      };

      service.createUser(newUser).subscribe(response => {
        expect(response.first_name).toBe(newUser.first_name);
        expect(response.last_name).toBe(newUser.last_name);
        expect(response.avatar).toContain(newUser.first_name);
      });

      const req = httpMock.expectOne('https://reqres.in/api/users');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(mockResponse);
    });
  });

  describe('updateUser', () => {
    it('should update existing user', () => {
      const userId = 1;
      const updateData: UpdateUserDto = {
        first_name: 'John Updated',
        last_name: 'Doe',
        email: 'john@example.com',
        job: 'Senior Developer',
      };

      const mockResponse = {
        id: userId,
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      service.updateUser(userId, updateData).subscribe(response => {
        expect(response).toHaveBeenCalledWith(jasmine.objectContaining({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          job: 'Developer'
        }));
      });

      const req = httpMock.expectOne(`https://reqres.in/api/users/${userId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', () => {
      const userId = 1;

      service.deleteUser(userId).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`https://reqres.in/api/users/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});