import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  standalone: true,
})
export class ConfirmationModalComponent {
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() visible: boolean = false; // for visibility control
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    this.visible = false; // Hide modal after confirmation
  }

  onCancel() {
    this.cancel.emit();
    this.visible = false; // Hide modal after cancel
  }
}
