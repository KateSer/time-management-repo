import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

interface Item {
  name: string;
  important: boolean | null;
  urgent: boolean | null;
  dueDate: Date | null;
  priority: number;
  isEditing?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [FormsModule, CommonModule, ConfirmationModalComponent],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  items: Item[] = [];
  newItem: Item = {
    name: '',
    important: null,
    urgent: null,
    dueDate: null,
    priority: 0,
  };

  showOptionalFields: boolean = false; // Toggle state for optional fields
  showError: boolean = false; // Flag to show/hide error message
  showClearConfirmation: boolean = false; // Flag for clear confirmation modal
  showDeleteConfirmation: boolean = false;
  deleteIndex: number | null = null; // Track the index of the item to be deleted
  confirmationMessage: string = ''; // Store the confirmation message

  ngOnInit() {
    this.loadItemsFromLocalStorage(); // Load items on component initialization
  }

  addItem() {
    if (this.newItem.name.trim()) {
      // Calculate priority based on conditions
      this.newItem.priority = this.calculatePriority(this.newItem);
      console.log('Adding item:', this.newItem); // Debugging: Log new item

      this.items.push({ ...this.newItem, isEditing: false });
      console.log('Items array after adding:', this.items); // Debugging: Log items array

      this.saveItemsToLocalStorage(); // Save items after adding a new one
      this.setCookies(); // Set cookies for 24-hour expiry

      // Reset the form and hide optional fields
      this.newItem = {
        name: '',
        important: null,
        urgent: null,
        dueDate: null,
        priority: 0,
      };
      this.showOptionalFields = false; // Reset toggle state after adding item
      this.showError = false; // Hide error message after successful addition
    } else {
      this.showError = true; // Show error message if input is empty
    }
  }

  calculatePriority(item: Item): number {
    console.log('Calculating priority for item:', item);
    console.log(
      `item.important: ${item.important}, item.urgent: ${item.urgent}`
    );

    // Handle null cases first
    if (item.important === null || item.urgent === null) {
      console.log('Default Priority 0: Important or Urgent is null');
      return 0;
    }

    // Boolean checks with strict equality
    const isImportant = item.important === true;
    const isUrgent = item.urgent === true;

    console.log(`isImportant: ${isImportant}, isUrgent: ${isUrgent}`);

    if (isImportant && isUrgent) {
      console.log('Priority 1: Important and Urgent');
      return 1;
    }
    if (isImportant && !isUrgent) {
      console.log('Priority 2: Important and Not Urgent');
      return 2;
    }
    if (!isImportant && isUrgent) {
      console.log('Priority 3: Not Important and Urgent');
      return 3;
    }
    if (!isImportant && !isUrgent) {
      console.log('Priority 4: Not Important and Not Urgent');
      return 4;
    }

    console.log('Default Priority 0');
    return 0; // Default case, though this line is now redundant
  }

  toggleOptionalFields() {
    this.showOptionalFields = !this.showOptionalFields;
  }

  saveItemsToLocalStorage() {
    try {
      localStorage.setItem('items', JSON.stringify(this.items)); // Use localStorage here
      console.log('Saved items to local storage:', this.items); // Debugging: Log items saved
    } catch (error) {
      console.error('Error saving items to local storage:', error); // Debugging: Log errors
    }
  }

  loadItemsFromLocalStorage() {
    const savedItems = localStorage.getItem('items');
    if (savedItems) {
      this.items = JSON.parse(savedItems);
      console.log('Loaded items from local storage:', this.items); // Debugging: Log loaded items
    } else {
      console.log('No items found in local storage.'); // Debugging: Log if nothing is found
    }
  }

  clearItems() {
    this.showClearConfirmation = true; // Show confirmation modal
    this.confirmationMessage = 'Are you sure you want to clear ALL tasks?';
  }

  confirmClearItems() {
    this.items = []; // Clear the array
    this.saveItemsToLocalStorage(); // Save the empty array to Local Storage
    this.clearCookies(); // Clear cookies when items are cleared
    this.showClearConfirmation = false; // Hide confirmation modal
  }

  cancelClearItems() {
    this.showClearConfirmation = false; // Hide confirmation modal
  }

  setCookies() {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24); // Set expiry to 24 hours from now
    document.cookie = `items=${encodeURIComponent(
      JSON.stringify(this.items)
    )}; expires=${expiryDate.toUTCString()}; path=/`;
  }

  clearCookies() {
    document.cookie = 'items=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Clear cookie
  }

  editItem(item: Item) {
    item.isEditing = true; // Enable editing mode for the item
  }

  saveItem(item: Item) {
    // Recalculate priority with updated values
    item.priority = this.calculatePriority(item);
    console.log('Item saved with new priority:', item);
    item.isEditing = false; // Save changes and exit edit mode
    this.saveItemsToLocalStorage(); // Save updated items to Session Storage
    this.setCookies(); // Update cookies after editing
    // Notify the PriorityViewComponent to refresh and sort items
    this.notifyPriorityView();
    console.log('Item saved:', item); // Debugging: Log saved item
  }

  notifyPriorityView() {
    // This function simulates notifying the PriorityViewComponent to refresh
    const currentComponent = document.querySelector('app-priority-view');
    if (currentComponent) {
      (currentComponent as any).filterAndSortItems(); // Trigger sorting and filtering
    }
  }
  cancelEdit(item: Item) {
    item.isEditing = false; // Cancel edit mode without saving
  }

  // Delete Single Task
  deleteItem(index: number) {
    this.deleteIndex = index; // Set the index of the item to be deleted
    this.confirmationMessage = 'Are you sure you want to delete this task?';
    this.showDeleteConfirmation = true; // Show the delete confirmation modal
  }

  confirmDeleteItem() {
    if (this.deleteIndex !== null) {
      this.items.splice(this.deleteIndex, 1); // Remove the item at the specified index
      console.log('Item deleted:', this.deleteIndex);

      this.saveItemsToLocalStorage();
      this.setCookies();
    }
    this.showDeleteConfirmation = false; // Hide the modal after deletion
    this.deleteIndex = null; // Reset the delete index
  }

  cancelDeleteItem() {
    this.showDeleteConfirmation = false;
    this.deleteIndex = null;
  }
}
