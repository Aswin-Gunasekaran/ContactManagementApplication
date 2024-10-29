import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactListComponent } from './contact-list.component';
import { ContactService } from '../Services/contact.service';
import { of } from 'rxjs';
import { ModalModule } from 'ngx-bootstrap/modal'; // Import ModalModule
import { CreateContactComponent } from '../create-contact/create-contact.component';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const contactServiceSpy = jasmine.createSpyObj('ContactService', ['getContact', 'DeleteContact']);

    await TestBed.configureTestingModule({
      imports: [ModalModule.forRoot()], // Import ModalModule here
      declarations: [ContactListComponent, CreateContactComponent],
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

  
});
