import { CompanyInterface } from './company.interface';
import { TagInterface } from './tag.interface';

export interface UserInterface {
  email: string;
  fullname: string;
  role: number;
  tags: TagInterface[];
  companies: string[];
  companiesId?: string[];
  tagsId?: string[];
  _key: string;
}
