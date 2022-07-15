import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TagInterface } from '../models/tag.interface';
import { TemplateInterface } from '../models/template.interface';

const API_TAGS_URL = `${environment.apiUrl}/tags`;
const API_TEMPLATES_URL = `${environment.apiUrl}/templates`;

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<TagInterface[]> {
    return this.http.get<TagInterface[]>(API_TAGS_URL);
  }

  add(tag:TagInterface): Observable<TagInterface> {
    return this.http.post<TagInterface>(API_TAGS_URL,tag);
  }
  
  getChrome() {
    return this.http.get<any>(API_TAGS_URL + "/chrome/browser");
  }
  getFirefox(){
    return this.http.get<any>(API_TAGS_URL + "/firefox/browser");
  }
  getAllTags(): Observable<TagInterface[]> {
    return this.http.get<TagInterface[]>(API_TAGS_URL + '/');
  }
  deleteTag(tagKey:any) {
    return this.http.delete(API_TAGS_URL + `/${tagKey}`);
  }
  getCompanyTags(companyKey:any) {
    return this.http.get(API_TAGS_URL + `/get_tag_company/${companyKey}`);
  }
  getOneTag(tag: TagInterface): Observable<TagInterface> {
    return this.http.get<TagInterface>(
      API_TAGS_URL + `/get_tag/${tag}`
    );
  }
  updateOneTag(tag: TagInterface): Observable<TagInterface> {
    return this.http.post<TagInterface>(
      API_TAGS_URL + `/update/${tag._key}`,
      tag
    );
  }
  addTemplate(template:TemplateInterface): Observable<TemplateInterface> {
    return this.http.post<TemplateInterface>(API_TEMPLATES_URL, template);
  }
  getAllTemplates(): Observable<TemplateInterface[]> {
    return this.http.get<TemplateInterface[]>(API_TEMPLATES_URL);
  }
  deleteTemplate(templateKey:any) {
    return this.http.delete(API_TEMPLATES_URL + `/${templateKey}`);
  }
  getOneTemplate(template: TemplateInterface): Observable<TemplateInterface> {
    return this.http.get<TemplateInterface>(
      API_TEMPLATES_URL + `/get_template/${template}`
    );
  }

  getUserTags(tags: string[]): Observable<TagInterface[]> {
    let params = new HttpParams();
    params = params.append('tags', JSON.stringify(tags));
    return this.http.get<TagInterface[]>(
      API_TAGS_URL + `/get_many_tags`,
      { params: params }
    );
  }
}
