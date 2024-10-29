import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ContactService } from '../Services/contact.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ValidationHelper } from '../Utility/validation-helper';
import { ContactDto } from '../Modal/ContactDto';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent implements OnInit {
  @Input() selectedContactId: number | null = null;
  @Input() isDeleteMode: boolean = false;
  contactForm!: FormGroup;
  @Output() saveClick = new EventEmitter();
  @Output() closeClick = new EventEmitter();
  @ViewChild('contactModal', { static: true }) contactModal!: ModalDirective;
  submitted = false; // New flag to track form submission
  constructor(private formBuilder: FormBuilder,
    private readonly contactService: ContactService) {
    this.contactForm = this.formBuilder.group({
      contactId: [0],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }
  ngOnInit() {

  }

  openModal() {
    this.contactForm.reset({
      contactId: null,
      email: '',
      firstName: '',
      lastName: ''
    });
    this.contactModal.show();
  }

  saveContactForm() {
    this.submitted = true;
    if (this.contactForm.invalid) {
      ValidationHelper.validateAllFormFields(this.contactForm);
      return;
    }

    const contactDto: ContactDto = {
      ...this.contactForm.value,
      contactId: this.contactForm.value.contactId || 0
    };

    const saveObservable = contactDto.contactId! > 0
      ? this.contactService.UpdateContact(contactDto)
      : this.contactService.createContact(contactDto);

    saveObservable.subscribe(() => {
      this.handleSaveSuccess();
    });
  }

  handleSaveSuccess() {
    this.contactModal.hide();
    this.saveClick.emit(true);
    this.resetForm();
  }

  closeModal() {
    this.contactModal.hide();
    this.resetForm();
    this.closeClick.emit(true);
  }
  resetForm() {
    this.contactForm.reset({
      contactId: null,
      email: '',
      firstName: '',
      lastName: ''
    });
    this.selectedContactId = 0;
    this.isDeleteMode = false;
    this.submitted = false;
  }

  

  ngOnChanges(changes: SimpleChanges) {

    
    if (changes['selectedContactId'] && this.contactModal && !this.isDeleteMode) {
      if (this.selectedContactId! > 0) {
        this.contactService.getContactsById(this.selectedContactId!).subscribe(contact => {
          this.contactForm.patchValue({
            contactId: contact.contactId,
            email: contact.email,
            firstName: contact.firstName,
            lastName: contact.lastName,
          });
          this.contactModal.show();
        });
      }
    }
  }

  

}
