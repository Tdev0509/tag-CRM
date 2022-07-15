import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';
import { TagInterface } from 'src/app/shared/models/tag.interface';

export class UserModel extends AuthModel {
  id: number;
  username: string;
  password: string;
  fullname: string;
  email: string;
  pic: string;
  roles: number[];
  occupation: string;
  companyName: string;
  test: string[];
  phone: string;
  address?: AddressModel;
  socialNetworks?: SocialNetworksModel;
  role: number;
  tags: TagInterface[];
  companies: string[];
  permission: string;
  tagsId?: string[];
  _key: string;

  setUser(user: any) {
    this.id = user.id;
    this.username = user.username || '';
    this.password = user.password || '';
    this.fullname = user.fullname || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/users/default.jpg';
    this.roles = user.roles || [];
    this.test = ['hello', 'world'];
    this.occupation = user.occupation || '';
    this.companyName = user.companyName || '';
    this.phone = user.phone || '';
    this.address = user.address;
    this.socialNetworks = user.socialNetworks;
    this.role = 0;
    this.companies = [];
    this.tagsId = [];
    this._key = user._key;
  }
}
