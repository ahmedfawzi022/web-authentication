import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User, UserResponse, UsersResponse, CreateUserDto, UpdateUserDto } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://reqres.in/api';

  constructor(private http: HttpClient) { }

  getUsers(page: number = 1): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/users?page=${page}`);
  }

  getUser(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users/${id}`);
  }

  createUser(userData: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData).pipe(
      map(response => ({
        ...response,
        avatar: `https://ui-avatars.com/api/?name=${userData.first_name}+${userData.last_name}&background=random`
      }))
    );
  }

  updateUser(id: number, userData: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}