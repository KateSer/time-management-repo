import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConsentAlertComponent } from './consent-alert/consent-alert.component';
import { OnboardingModalComponent } from './onboarding-modal/onboarding-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    OnboardingModalComponent,
    CommonModule,
    ConsentAlertComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Time Management App';
  showModal = false;
  toggleModal() {
    this.showModal = !this.showModal;
  }
}
