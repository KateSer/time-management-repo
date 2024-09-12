import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { DataTableComponent } from './data-table/data-table.component';
import { OnboardingModalComponent } from './onboarding-modal/onboarding-modal.component';
import { PriorityViewComponent } from './priority-view/priority-view.component';
import { PriorityViewModule } from './priority-view/priority-view.module';

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    PriorityViewComponent,
    ConfirmationModalComponent,
    OnboardingModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PriorityViewModule,
    DragDropModule,
    RouterModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
