import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';
import { UserDetailsPanelComponent } from '../user-details-panel/user-details-panel.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faPencilAlt, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto } from '../../models/user.interface';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [
    CommonModule,
    EditUserModalComponent,
    UserDetailsPanelComponent,
    FontAwesomeModule
  ],
  standalone: true
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  currentPage = 1;
  totalPages = 1;
  selectedUser = signal<User | null>(null);
  viewingUser = signal<User | null>(null);
  showDetailsPanel = signal<boolean>(false);
  private subscriptions: Subscription = new Subscription();

  // Font Awesome icons
  faTrash = faTrash;
  faPencilAlt = faPencilAlt;
  faChevronRight = faChevronRight;

  constructor(
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadUsers() {
    const subscription = this.userService.getUsers(this.currentPage).subscribe({
      next: (response) => {
        this.users = response.data;
        this.totalPages = response.total_pages;
        this.notificationService.show('Users loaded successfully', 'success');
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.notificationService.show('Failed to load users', 'error');
      }
    });
    this.subscriptions.add(subscription);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadUsers();
  }

  viewUser(user: User) {
    if (!user) return;
    this.viewingUser.set({ ...user });
    this.showDetailsPanel.set(true);
  }

  closeDetailsPanel() {
    this.viewingUser.set(null);
    this.showDetailsPanel.set(false);
  }

  editUser(user: User) {
    if (!user) return;
    this.selectedUser.set({ ...user });
    this.closeDetailsPanel();
  }

  openCreateUser() {
    this.selectedUser.set({} as User);
  }

  closeEditModal() {
    this.selectedUser.set(null);
  }

  saveUser(userData: CreateUserDto | UpdateUserDto) {
    if (!userData) return;
    
    const currentUser = this.selectedUser();
    const subscription = currentUser?.id 
      ? this.userService.updateUser(currentUser.id, userData as UpdateUserDto).subscribe({
          next: (response) => {
            this.users = this.users.map(user => 
              user.id === currentUser.id ? { ...user, ...response } : user
            );
            this.closeEditModal();
            this.notificationService.show('User updated successfully', 'success');
          },
          error: (error) => {
            console.error('Error updating user:', error);
            this.notificationService.show('Failed to update user', 'error');
          }
        })
      : this.userService.createUser(userData as CreateUserDto).subscribe({
          next: (response) => {
            this.users = [response, ...this.users];
            this.closeEditModal();
            this.notificationService.show('User created successfully', 'success');
          },
          error: (error) => {
            console.error('Error creating user:', error);
            this.notificationService.show('Failed to create user', 'error');
          }
        });
    
    this.subscriptions.add(subscription);
  }

  deleteUser(id: number) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this user?')) {
      const subscription = this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          this.closeDetailsPanel();
          this.notificationService.show('User deleted successfully', 'success');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.notificationService.show('Failed to delete user', 'error');
        }
      });
      this.subscriptions.add(subscription);
    }
  }
}