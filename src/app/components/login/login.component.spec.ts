import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        LoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalsy();
    
    form.controls['email'].setValue('test@example.com');
    expect(form.controls['email'].valid).toBeTruthy();
    
    form.controls['password'].setValue('password123');
    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.controls['email'];
    
    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBeFalsy();
    
    emailControl.setValue('test@example.com');
    expect(emailControl.valid).toBeTruthy();
  });

  it('should call auth service on form submit', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    authService.login.and.returnValue(of({ token: 'fake-token' }));
    spyOn(router, 'navigate');

    component.loginForm.setValue(credentials);
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(
      credentials.email,
      credentials.password
    );
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should handle login error', () => {
    authService.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'wrong-password'
    });
    component.onSubmit();

    expect(component.error).toBe('Invalid credentials');
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.setValue({
      email: 'invalid-email',
      password: ''
    });
    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });
});