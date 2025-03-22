import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsPanelComponent } from './user-details-panel.component';
import { User } from '../../models/user.interface';

describe('UserDetailsPanelComponent', () => {
  let component: UserDetailsPanelComponent;
  let fixture: ComponentFixture<UserDetailsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailsPanelComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit edit event', () => {
    spyOn(component.edit, 'emit');
    component.onEdit();
    expect(component.edit.emit).toHaveBeenCalled();
  });

  it('should emit delete event', () => {
    spyOn(component.delete, 'emit');
    component.onDelete();
    expect(component.delete.emit).toHaveBeenCalled();
  });

  it('should display user data when provided', () => {
    const mockUser: User = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      avatar: 'avatar.jpg',
      job: 'Developer',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-02'
    };

    component.userData = mockUser;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('John Doe');
    expect(compiled.querySelector('.email').textContent).toContain('john@example.com');
    expect(compiled.querySelector('img.profile-image').src).toContain('avatar.jpg');
  });

  it('should not display user data when userData is null', () => {
    component.userData = null;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.user-profile')).toBeFalsy();
  });
});