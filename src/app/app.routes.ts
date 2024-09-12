import { Routes } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { PriorityViewComponent } from './priority-view/priority-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/add-items', pathMatch: 'full' },
  {
    path: 'priority-1',
    component: PriorityViewComponent,
    data: { priority: 1 },
  },
  {
    path: 'priority-2',
    component: PriorityViewComponent,
    data: { priority: 2 },
  },
  {
    path: 'priority-3',
    component: PriorityViewComponent,
    data: { priority: 3 },
  },
  {
    path: 'priority-4',
    component: PriorityViewComponent,
    data: { priority: 4 },
  },
  { path: 'add-items', component: DataTableComponent },
];
