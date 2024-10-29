import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateContactComponent } from './create-contact.component';
import { ContactService } from '../Services/contact.service';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';

describe('CreateContactComponent', () => {
  let component: CreateContactComponent;
  let fixture: ComponentFixture<CreateContactComponent>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const contactServiceSpy = jasmine.createSpyObj('ContactService', ['createContact', 'UpdateContact', 'getContactsById']);

    await TestBed.configureTestingModule({
      declarations: [CreateContactComponent, ModalDirective],
      providers: [
        FormBuilder,
        { provide: ContactService, useValue: contactServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateContactComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on init', () => {
    component.ngOnInit();
    expect(component.contactForm).toBeTruthy();
    expect(component.contactForm.get('email')!.value).toBe('');
  });

  it('should open modal and reset form', () => {
    component.openModal();
    expect(component.contactModal.show).toHaveBeenCalled();
    expect(component.contactForm.get('email')!.value).toBe('');
  });

  it('should save contact form successfully', () => {
    component.contactForm.setValue({
      contactId: 0,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    });
    contactService.createContact.and.returnValue(of({}));

    spyOn(component, 'handleSaveSuccess');

    component.saveContactForm();

    expect(contactService.createContact).toHaveBeenCalledWith(component.contactForm.value);
    expect(component.handleSaveSuccess).toHaveBeenCalled();
  });

  it('should handle update contact form successfully', () => {
    component.selectedContactId = 1;
    component.contactForm.setValue({
      contactId: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    });
    contactService.UpdateContact.and.returnValue(of({}));

    spyOn(component, 'handleSaveSuccess');

    component.saveContactForm();

    expect(contactService.UpdateContact).toHaveBeenCalledWith(component.contactForm.value);
    expect(component.handleSaveSuccess).toHaveBeenCalled();
  });

  it('should handle save failure', () => {
    component.contactForm.setValue({
      contactId: 0,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    });
    contactService.createContact.and.returnValue(throwError('Error'));

    component.saveContactForm();

    expect(contactService.createContact).toHaveBeenCalled();
    // You may want to add more specific failure handling based on your implementation
  });

  it('should close modal and reset form', () => {
    spyOn(component.contactModal, 'hide');
    component.closeModal();

    expect(component.contactModal.hide).toHaveBeenCalled();
    expect(component.contactForm.get('email')!.value).toBe('');
    expect(component.closeClick.emit).toHaveBeenCalledWith(true);
  });

  it('should reset form fields', () => {
    component.resetForm();

    expect(component.contactForm.get('email')!.value).toBe('');
    expect(component.selectedContactId).toBe(0);
    expect(component.isDeleteMode).toBe(false);
  });

  it('should load contact data on selectedContactId change', () => {
    const mockContact = {
      contactId: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    };

    contactService.getContactsById.and.returnValue(of(mockContact));
    component.selectedContactId = 1;

    component.ngOnChanges({ selectedContactId: { currentValue: 1, previousValue: null } });

    expect(contactService.getContactsById).toHaveBeenCalledWith(1);
    expect(component.contactForm.get('email')!.value).toBe('test@example.com');
    expect(component.contactModal.show).toHaveBeenCalled();
  });

  it('should not load contact data if isDeleteMode is true', () => {
    component.isDeleteMode = true;
    component.selectedContactId = 1;

    component.ngOnChanges({ selectedContactId: { currentValue: 1, previousValue: null } });

    expect(contactService.getContactsById).not.toHaveBeenCalled();
  });
});
