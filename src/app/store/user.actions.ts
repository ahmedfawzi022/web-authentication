import { createAction, props } from '@ngrx/store';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.interface';

export const loadUsers = createAction('User Load Users');
export const loadUsersSuccess = createAction(
  'User Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  'User Load Users Failure',
  props<{ error: any }>()
);

export const createUser = createAction(
  'User Create User',
  props<{ user: CreateUserDto }>()
);
export const createUserSuccess = createAction(
  'User Create User Success',
  props<{ user: User }>()
);
export const createUserFailure = createAction(
  'User Create User Failure',
  props<{ error: any }>()
);

export const updateUser = createAction(
  'User Update User',
  props<{ id: number; user: UpdateUserDto }>()
);
export const updateUserSuccess = createAction(
  'User Update User Success',
  props<{ user: User }>()
);
export const updateUserFailure = createAction(
  'User Update User Failure',
  props<{ error: any }>()
);

export const deleteUser = createAction(
  'User Delete User',
  props<{ id: number }>()
);
export const deleteUserSuccess = createAction(
  'User Delete User Success',
  props<{ id: number }>()
);
export const deleteUserFailure = createAction(
  'User Delete User Failure',
  props<{ error: any }>()
);