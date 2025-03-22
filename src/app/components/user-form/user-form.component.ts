import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  template: `
    <div class="user-form">
      <h2>{{isEditing ? 'Edit' : 'Create'}} User</h2>
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="first_name">First Name</label>
          <input id="first_name" formControlName="first_name">
        </div>
        <div class="form-group">
          <label for="last_name">Last Name</label>
          <input id="last_name" formControlName="last_name">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email">
        </div>
        <button type="submit" [disabled]="userForm.invalid">
          {{isEditing ? 'Update' : 'Create'}} User
        </button>
        <button type="button" (click)="cancel()">Cancel</button>
      </form>
    </div>
  `,
  styles: [`
    .user-form {
      max-width: 500px;
      margin: 50px auto;
      padding: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    input {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
    }
    button {
      margin-right: 10px;
    }
  `],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditing = false;
  userId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      this.isEditing = true;
      this.userService.getUser(this.userId).subscribe(data => {
        this.userForm.patchValue(data.data);
      });
    }
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;
    
    if (this.isEditing && this.userId) {
      this.userService.updateUser(this.userId, userData).subscribe(() => {
        this.router.navigate(['/users']);
      });
    } else {
      this.userService.createUser(userData).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}