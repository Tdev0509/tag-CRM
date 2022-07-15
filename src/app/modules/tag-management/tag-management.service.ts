import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TagsService } from './../../shared/service/tags.service';
import { TagInterface } from './../../shared/models/tag.interface';
import { TemplateInterface } from './../../shared/models/template.interface';

@Injectable({
  providedIn: 'root'
})
export class TagManagementService {

  constructor(
    private tagsService: TagsService,
  ) { }

  // Get all Chrome objects
  getChromeBrowserVersion() {
    return this.tagsService.getChrome();
  }
  // Get all Chrome objects
  getFirefoxBrowserVersion() {
    return this.tagsService.getFirefox();
  }
  addTag(tag: TagInterface): Observable<TagInterface> {
    return this.tagsService.add(tag);
  }
  getAllTags(): Observable<TagInterface[]> {
    return this.tagsService.getAllTags();
  }
  getCompanyTags(companyKey: any) {
    return this.tagsService.getCompanyTags(companyKey);
  }
  
  deleteTag(tagKey: any) {
    return this.tagsService.deleteTag(tagKey);
  }

  getOneTag(tag: TagInterface): Observable<TagInterface> {
    return this.tagsService.getOneTag(tag);
  }
  updateOneTag(tag: TagInterface): Observable<TagInterface> {
    return this.tagsService.updateOneTag(tag);
  }
  addTemplate(template: TemplateInterface): Observable<TemplateInterface> {
    return this.tagsService.addTemplate(template);
  }
  getAllTemplates(): Observable<TagInterface[]> {
    return this.tagsService.getAllTemplates();
  }
  deleteTemplate(templateKey: any) {
    return this.tagsService.deleteTemplate(templateKey);
  }
  getOneTemplate(template: TemplateInterface): Observable<TemplateInterface> {
    return this.tagsService.getOneTemplate(template);
  }
}
