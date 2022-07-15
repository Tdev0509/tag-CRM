import { reportingProvider } from './reportingProvider';

export interface CompanyInterface {
  name: string;
  reportingProviders: reportingProvider[];
  adServerUrls: [];
  created: string;
  active?: boolean;
  _id: string;
  _key: string;
  _rev: string;
}
