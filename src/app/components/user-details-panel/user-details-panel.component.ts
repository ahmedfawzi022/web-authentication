import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-user-details-panel',
  templateUrl: './user-details-panel.component.html',
  styleUrls: ['./user-details-panel.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class UserDetailsPanelComponent {
  @Input() userData: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}