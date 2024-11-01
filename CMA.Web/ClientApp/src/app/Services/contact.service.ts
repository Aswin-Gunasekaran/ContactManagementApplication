import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, catchError, map, throwError as observableThrowError } from "rxjs";
import { ContactDto } from "../Modal/ContactDto";
import { DataService } from "./data.service";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class ContactService extends DataService {
  constructor(public http: HttpClient, @Inject('BASE_URL') public baseUrl: string, public token: TokenService) {
    super(http, baseUrl, token);
  }
  getContact(page = 1, pageSize = 10): Observable<ContactDto[]> {
    let getContactURL = "Contact/GetContacts?page=" + page + "&pageSize=" + pageSize;
    return this.get(getContactURL);
  }
  getContactsById(contactId: number): Observable<ContactDto> {
    let getContactByIdUrl = "Contact/GetContactById?contactId=" + contactId;
    return this.get(getContactByIdUrl);
  }
  createContact(data: ContactDto) {
    let createContactURL = "Contact/AddContact/"
    return this.post(createContactURL, data);
  }
  UpdateContact(data: ContactDto) {
    let updateContactURL = "Contact/UpdateContact/"
    return this.put(updateContactURL, data);
  }
  DeleteContact(contactId: number) {
    let deleteContactUrl = "Contact/DeleteContact?id=" + contactId;
    return this.delete(deleteContactUrl);
  }
  validateUserAndGetToken(userCredential: any): Observable<any> {
    return this.post("Contact/ValidateUserAndGetToken", userCredential);
  }

  
}
