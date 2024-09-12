import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consent-alert',
  templateUrl: './consent-alert.component.html',
  styleUrls: ['./consent-alert.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ConsentAlertComponent implements OnInit {
  showBanner = false; // Controls the visibility of the banner

  ngOnInit(): void {
    // Check local storage for consent
    const consentGiven = localStorage.getItem('userConsent');

    // If consent is not given, show the banner
    if (!consentGiven) {
      this.showBanner = true;
    }
  }

  // Accept the consent and hide the banner
  acceptConsent(): void {
    // Store consent in localStorage
    localStorage.setItem('userConsent', 'true');
    this.showBanner = false; // Hide the banner
  }

  // Dismiss the banner, but it will show on reload
  dismissBanner(): void {
    this.showBanner = false; // Hide the banner without storing consent
  }
}
