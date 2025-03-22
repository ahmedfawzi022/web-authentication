import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { of, throwError } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { User } from '../../models/user.interface';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockUsers = {
    data: [
      {
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'avatar.jpg'
      }
    ],
    page: 1,
    per_page: 6,
    total: 12,
    total_pages: 2
  };

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'createUser', 'updateUser', 'deleteUser']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['show']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FontAwesomeModule,
        UserListComponent
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  beforeEach(() => {
    userService.getUsers.and.returnValue(of(mockUsers));
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(userService.getUsers).toHaveBeenCalledWith(1);
    expect(component.users).toEqual(mockUsers.data);
    expect(component.totalPages).toBe(mockUsers.total_pages);
  });

  it('should handle page change', () => {
    component.changePage(2);
    expect(userService.getUsers).toHaveBeenCalledWith(2);
    expect(component.currentPage).toBe(2);
  });

  it('should open create user modal', () => {
    component.openCreateUser();
    expect(component.selectedUser()).toEqual({ 
      id: 0,
      email: '',
      first_name: '',
      last_name: '',
      avatar: ''
    } as User);
  });

  it('should open edit user modal', () => {
    const user = mockUsers.data[0];
    component.editUser(user);
    expect(component.selectedUser()).toEqual(user);
  });

  it('should handle user deletion', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    userService.deleteUser.and.returnValue(of(void 0));

    component.deleteUser(1);

    expect(userService.deleteUser).toHaveBeenCalledWith(1);
    expect(notificationService.show).toHaveBeenCalledWith('User deleted successfully', 'success');
  });

  it('should handle user creation', () => {
    const newUser = {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
      job: 'Developer'
    };

    const createdUser: User = {
      ...newUser,
      id: 2,
      avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=random'
    };

    userService.createUser.and.returnValue(of(createdUser));

    component.saveUser(newUser);

    expect(userService.createUser).toHaveBeenCalledWith(newUser);
    expect(notificationService.show).toHaveBeenCalledWith('User created successfully', 'success');
  });

  it('should handle user update', () => {
    const user = mockUsers.data[0];
    const updateData = {
      first_name: 'John Updated'
    };

    component.selectedUser.set(user);
    userService.updateUser.and.returnValue(of({ ...user, ...updateData }));

    component.saveUser(updateData);

    expect(userService.updateUser).toHaveBeenCalledWith(user.id, updateData);
    expect(notificationService.show).toHaveBeenCalledWith('User updated successfully', 'success');
  });

  it('should handle error when loading users', () => {
    userService.getUsers.and.returnValue(throwError(() => new Error('Failed to load users')));
    component.loadUsers();
    expect(notificationService.show).toHaveBeenCalledWith('Failed to load users', 'error');
  });
});