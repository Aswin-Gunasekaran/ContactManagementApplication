import { Component, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ContactDto } from '../Modal/ContactDto';
import { ContactService } from '../Services/contact.service';
import { CreateContactComponent } from '../create-contact/create-contact.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html'  
})
export class ContactListComponent {
  public contacts: ContactDto[] = [];
  selectedContactId: number | null = null;
  @ViewChild('deleteContactModal', { static: true }) deleteContactModal!: ModalDirective;
  @ViewChild('contactComponent', { static: true }) contactComponent!: CreateContactComponent;
  @ViewChild('scrollableContainer', { static: false }) scrollableContainer!: ElementRef;
  isDeleteMode: boolean = false;
  loading = true;
  currentPage = 1;
  pageSize = 10;
  totalContacts = 0;
  hasMoreContacts = true;

  constructor(private readonly contactService: ContactService) { }

  ngOnInit() {
    
    this.getContacts();
  }

  createContact() {
    if (this.contactComponent != undefined) {
      this.contactComponent.openModal();
    }
  }

  updateContact(contactId: number) {
    this.selectedContactId = contactId;
    if (this.contactComponent != undefined) {
      this.contactComponent.openModal();
    }
  }

  openDeleteContactModal(contactId: number) {
    this.isDeleteMode = true;
    this.selectedContactId = contactId;
    this.deleteContactModal.show();
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.totalContacts) {
      this.currentPage++;
      this.getContacts();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getContacts();
    }
  }

  getContacts() {
    this.loading = true;
    this.contactService.getContact(this.currentPage, this.pageSize).subscribe((data: any) => {
      this.contacts = data.contacts; 
      this.totalContacts = data.totalRecords; 
      this.loading = false;
    });
  }

  closeDeleteModal() {
    this.resetModal();
    this.deleteContactModal.hide();
  }

  resetModal() {
    this.isDeleteMode = false;
    this.selectedContactId = 0;
  }

  

  deleteContact() {
    if (this.selectedContactId! > 0) {
      this.contactService.DeleteContact(this.selectedContactId!).subscribe(x => {
        this.closeDeleteModal();
        this.getContacts();
      });
    }
  }

 

 
}
