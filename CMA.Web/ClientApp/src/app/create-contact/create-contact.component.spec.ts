import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateContactComponent } from './create-contact.component';
import { ContactService } from '../Services/contact.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateContactComponent', () => {
  let component: CreateContactComponent;
  let fixture: ComponentFixture<CreateContactComponent>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    contactService = jasmine.createSpyObj('ContactService', ['createContact', 'UpdateContact', 'getContactsById']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ModalModule.forRoot() // Import the ModalModule here
      ],
      declarations: [CreateContactComponent],
      providers: [
        { provide: ContactService, useValue: contactService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Prevent Angular from throwing errors for unknown elements
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on init', () => {
    component.ngOnInit();
    expect(component.contactForm).toBeTruthy();
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



  it('should reset form fields', () => {
    component.resetForm();

    expect(component.contactForm.get('email')!.value).toBe('');
    expect(component.selectedContactId).toBe(0);
    expect(component.isDeleteMode).toBe(false);
  });


});
