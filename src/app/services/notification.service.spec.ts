import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add notification', () => {
    service.show('Test message', 'success');
    service.getNotifications().subscribe(notifications => {
      expect(notifications.length).toBe(1);
      expect(notifications[0].message).toBe('Test message');
      expect(notifications[0].type).toBe('success');
    });
  });

  it('should remove notification after timeout', fakeAsync(() => {
    service.show('Test message', 'success');
    
    service.getNotifications().subscribe(notifications => {
      expect(notifications.length).toBe(1);
    });

    tick(5000);

    service.getNotifications().subscribe(notifications => {
      expect(notifications.length).toBe(0);
    });
  }));

  it('should handle multiple notifications', () => {
    service.show('First message', 'success');
    service.show('Second message', 'error');

    service.getNotifications().subscribe(notifications => {
      expect(notifications.length).toBe(2);
      expect(notifications[0].message).toBe('First message');
      expect(notifications[1].message).toBe('Second message');
    });
  });
});