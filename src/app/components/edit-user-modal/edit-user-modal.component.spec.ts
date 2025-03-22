import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EditUserModalComponent } from './edit-user-modal.component';

describe('EditUserModalComponent', () => {
  let component: EditUserModalComponent;
  let fixture: ComponentFixture<EditUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditUserModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.userForm.get('first_name')?.value).toBe('');
    expect(component.userForm.get('last_name')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
    expect(component.userForm.get('job')?.value).toBe('');
  });

  it('should update form when userData changes', () => {
    const mockUser = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      job: 'Developer',
      avatar: 'avatar.jpg'
    };

    // component.userData = mockUser;
    // component.ngOnChanges({
    //   userData: {
    //     currentValue: mockUser,
    //     previousValue: null,
    //     firstChange: true,
    //     isFirstChange: () => true
    //   }
    // });
    (component as any).userData = () => mockUser;

    fixture.detectChanges(); 

    expect(component.userForm.get('first_name')?.value).toBe(mockUser.first_name);
    expect(component.userForm.get('last_name')?.value).toBe(mockUser.last_name);
    expect(component.userForm.get('email')?.value).toBe(mockUser.email);
    expect(component.userForm.get('job')?.value).toBe(mockUser.job);
  });

  it('should emit close event', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit save event with form data when valid', () => {
    spyOn(component.save, 'emit');
    
    const formData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      job: 'Developer'
    };

    component.userForm.patchValue(formData);
    component.onSubmit();

    expect(component.save.emit).toHaveBeenCalledWith(formData);
  });

  it('should save event when form is valid', () => {
    spyOn(component.save, 'emit');
    
    component.userForm.patchValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      job: 'Developer'
    });

    component.onSubmit();

    expect(component.save.emit).not.toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    const form = component.userForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      job: 'Developer'
    });

    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.userForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });
});