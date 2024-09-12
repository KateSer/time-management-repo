import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

interface Item {
  name: string;
  important: boolean | null;
  urgent: boolean | null;
  dueDate: Date | null;
  priority: number;
}

@Component({
  selector: 'app-priority-view',
  standalone: true,
  imports: [CommonModule, DatePipe, DragDropModule, ConfirmationModalComponent],
  templateUrl: './priority-view.component.html',
  styleUrls: ['./priority-view.component.scss'],
})
export class PriorityViewComponent implements OnInit {
  items: Item[] = [];
  filteredItems: Item[] = [];
  priority: number = 0;
  showDeleteConfirmation: boolean = false; // Control modal visibility
  itemToDelete: Item | null = null; // Store the item to be deleted
  confirmationMessage: string = ''; // Store the confirmation message
  randomMessage: string = ''; // Store the random message

  // Define messages for each priority
  priorityMessages: { [key: number]: string[] } = {
    1: [
      "Don't delay, tackle these tasks now!",
      'High urgency tasks: Get them done immediately!',
      'These tasks require your immediate attention!',
    ],
    2: [
      'Focus on these important tasks next.',
      'These tasks are important but not urgent.',
      'Plan to complete these tasks soon.',
    ],
    3: [
      'Handle these tasks at your convenience.',
      "These tasks can wait, but don't forget them.",
      'Schedule time for these less urgent tasks.',
    ],
    4: [
      'Consider delegating or revisiting these tasks.',
      'Low priority tasks: Assess their necessity.',
      'Think about whether these tasks need attention.',
    ],
  };

  defaultOrder: Item[] = []; // Store the default order of items

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadItemsFromLocalStorage(); // Load items on component initialization
    this.route.data.subscribe((data) => {
      this.priority = data['priority'];
      this.filterAndSortItems();
      this.randomMessage = this.getRandomMessage(); // Get a random message for the current priority
      this.defaultOrder = [...this.filteredItems]; // Store the default order
    });
  }

  loadItemsFromLocalStorage() {
    const savedItems = localStorage.getItem('items');
    if (savedItems) {
      this.items = JSON.parse(savedItems);
    }
  }

  filterAndSortItems() {
    this.filteredItems = this.items
      .filter((item) => item.priority === this.priority)
      .sort(this.compareDates);
  }

  compareDates(a: Item, b: Item): number {
    if (a.dueDate === null && b.dueDate === null) return 0;
    if (a.dueDate === null) return 1;
    if (b.dueDate === null) return -1;

    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  }

  getRandomMessage(): string {
    const messages = this.priorityMessages[this.priority];
    if (messages && messages.length > 0) {
      const randomIndex = Math.floor(Math.random() * messages.length);
      return messages[randomIndex];
    }
    return ''; // Return an empty string if no messages are available
  }

  drop(event: CdkDragDrop<Item[]>) {
    moveItemInArray(
      this.filteredItems,
      event.previousIndex,
      event.currentIndex
    );
    this.saveItemsToLocalStorage(); // Save the new order
  }

  saveItemsToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  refreshTasks() {
    // Reset to default order
    this.filteredItems = [...this.defaultOrder];
  }

  // **Method to show delete confirmation**
  confirmDeleteItem(item: Item) {
    this.itemToDelete = item; // Store the item reference
    this.confirmationMessage = 'Are you sure you want to delete this task?'; // Set the message
    this.showDeleteConfirmation = true; // Show modal
  }

  // **Method to execute upon confirming delete**
  deleteConfirmed() {
    if (this.itemToDelete) {
      this.items = this.items.filter((i) => i !== this.itemToDelete);
      this.filterAndSortItems(); // Update filtered items
      this.saveItemsToLocalStorage(); // Save updated items
      this.itemToDelete = null; // Reset the item to delete
    }
    this.showDeleteConfirmation = false; // Hide modal after action
  }

  // **Method to cancel delete action**
  cancelDelete() {
    this.itemToDelete = null; // Clear the item to delete
    this.showDeleteConfirmation = false; // Hide modal
  }
}
