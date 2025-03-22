import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  template: `
    <div class="notifications-container">
      <div
        *ngFor="let notification of notifications"
        class="notification"
        [class.success]="notification.type === 'success'"
        [class.error]="notification.type === 'error'"
      >
        {{ notification.message }}
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .notification {
      padding: 1rem 1.5rem;
      border-radius: 6px;
      color: white;
      font-weight: 500;
      min-width: 300px;
      animation: slideIn 0.3s ease-out;
    }

    .success {
      background-color: #10B981;
    }

    .error {
      background-color: #EF4444;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `],
  imports: [CommonModule],
  standalone: true
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(
      notifications => this.notifications = notifications
    );
  }
}