import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User, CreateUserDto } from '../../models/user.interface';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class EditUserModalComponent {
  userData = input<User | null>()
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateUserDto>();
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      job: ['', [Validators.required, Validators.minLength(2)]]
    });

        // 👇 Effect to react to userData changes
        effect(() => {
          const user = this.userData();
          if (user) {
            this.userForm.patchValue(user);
          }
        });
    
  }

  

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['userData'] && this.userData) {
  //     this.userForm.patchValue(this.userData);
  //   }
  // }

  onClose() {
    this.userForm.reset();
    this.close.emit();
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.save.emit(this.userForm.value);
    }
  }
}