import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactListComponent } from './contact-list.component';
import { ContactService } from '../Services/contact.service';
import { of } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CreateContactComponent } from '../create-contact/create-contact.component';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const contactServiceSpy = jasmine.createSpyObj('ContactService', ['getContact', 'DeleteContact']);

    await TestBed.configureTestingModule({
      declarations: [ContactListComponent, CreateContactComponent, ModalDirective],
      providers: [
        { provide: ContactService, useValue: contactServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch contacts on init', () => {
    const mockContacts = { contacts: [], totalRecords: 0 };
    contactService.getContact.and.returnValue(of(mockContacts));

    component.ngOnInit();

    expect(contactService.getContact).toHaveBeenCalledWith(1, component.pageSize);
    expect(component.contacts).toEqual(mockContacts.contacts);
    expect(component.totalContacts).toEqual(mockContacts.totalRecords);
  });

  it('should create a contact', () => {
    spyOn(component.contactComponent, 'openModal');

    component.createContact();

    expect(component.contactComponent.openModal).toHaveBeenCalled();
  });

  it('should update a contact', () => {
    component.selectedContactId = 1;
    spyOn(component.contactComponent, 'openModal');

    component.updateContact(1);

    expect(component.selectedContactId).toEqual(1);
    expect(component.contactComponent.openModal).toHaveBeenCalled();
  });

  it('should open delete modal', () => {
    component.isDeleteMode = false;
    component.selectedContactId = null;

    component.openDeleteContactModal(1);

    expect(component.isDeleteMode).toBeTrue();
    expect(component.selectedContactId).toEqual(1);
  });

  it('should fetch the next page of contacts', () => {
    component.currentPage = 1;
    component.totalContacts = 20;
    component.pageSize = 10;
    spyOn(component, 'getContacts');

    component.nextPage();

    expect(component.currentPage).toEqual(2);
    expect(component.getContacts).toHaveBeenCalled();
  });

  it('should fetch the previous page of contacts', () => {
    component.currentPage = 2;
    component.pageSize = 10;
    spyOn(component, 'getContacts');

    component.previousPage();

    expect(component.currentPage).toEqual(1);
    expect(component.getContacts).toHaveBeenCalled();
  });

  it('should delete a contact', () => {
    component.selectedContactId = 1;
    spyOn(component, 'closeDeleteModal').and.callThrough();
    contactService.DeleteContact.and.returnValue(of({}));

    component.deleteContact();

    expect(contactService.DeleteContact).toHaveBeenCalledWith(1);
    expect(component.closeDeleteModal).toHaveBeenCalled();
    expect(component.getContacts).toHaveBeenCalled();
  });

  it('should not delete if no contact is selected', () => {
    component.selectedContactId = null;
    spyOn(contactService, 'DeleteContact');

    component.deleteContact();

    expect(contactService.DeleteContact).not.toHaveBeenCalled();
  });

  it('should close delete modal', () => {
    component.resetModal = jasmine.createSpy('resetModal');
    component.closeDeleteModal();

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.deleteContactModal.hide).toHaveBeenCalled();
  });
});
