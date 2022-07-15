import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/service/snackbar.service';
import { TagManagementService } from '../tag-management.service';
import { TagInterface } from 'src/app/shared/models/tag.interface';
import { CompanyService } from 'src/app/shared/service/companies.service';
import { CompanyInterface } from 'src/app/shared/models/company.interface';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { UsersService } from 'src/app/shared/service/users.service';
import { NotificationService } from 'src/app/shared/service/notification.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormGroupDirective,
} from '@angular/forms';

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss']
})
export class EditTagComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  updateTagFG: FormGroup;
  //User Companies
  userCompanies: Array<CompanyInterface>;
  companyList: any = []
  adServerUrlList: any = []
  publisherList: any = []
  publishertempList: any = []
  advertiserList: any = []
  companySelected = "";
  statTypes: any;
  rotationTypes: any;
  paramTypes: any;
  url: String;
  initialURL: URL;
  company: String;
  countries: any;
  versions: any;
  versionList: any = [];
  edgeVersions : any;
  operaVersions: any;
  browserVersions: any;
  internetExplorers: any;
  tag: TagInterface;
  selectBrowserStatus: any;
  selectDeviceTypeStatus: any;
  selectVersionStatus: any;
  selectCountryStatus: any;
  hidden = false;

  constructor(
    private route: ActivatedRoute,
    private tagManagementService: TagManagementService,
    private fb: FormBuilder, 
    private _snackBarService: SnackbarService,
    private notification: NotificationService,
    router: Router,
    private auth: AuthService,
    private userService: UsersService,
    private companyService: CompanyService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    
  }

  ngOnInit(): void {
    
    this.updateTagFG = this.fb.group({
      name: ['', Validators.required],
      publisher: ['', Validators.required],
      advertiser: ['', Validators.required],
      browserStatus: ['', Validators.required],
      browser: ['', Validators.required],
      deviceTypeStatus: ['', Validators.required],
      deviceType: ['', Validators.required],
      versionStatus: ['', Validators.required],
      version: ['', Validators.required],
      countryStatus: ['', Validators.required],
      country: ['', Validators.required],
      company: ['', Validators.required],
      adServerUrl: ['', Validators.required],
      statType: ['', Validators.required],
      numFilterTag: ['ExactValue', Validators.required],
      numLimit: ['1000', Validators.required],
      numSubid: [''],
      numSplit: ['70', Validators.required],
      subids: this.fb.array([]),
      rotationType: ['', Validators.required],
      url: new FormControl('', [Validators.required]),
      params: this.fb.array([]),
    });
    this.statTypes = this.getStatTypes();
    this.rotationTypes = this.getRotationTypes();
    this.paramTypes = this.getParamTypes();
    this.countries = this.getCountries();
    
    this.browserVersions = this.getVersions();
    
    this.getPublisherAll();
    //get Company
    this.companySelected = this.getSelectedCompanyFromLocalStorage();
    //access page part
    if(!this.companySelected){
      this.hidden = true;
      this.notification.showError("Please select your Company!", "")
    } else {
      this.hidden = false;
    }
    const currentUserInfo = this.auth.currentUserValue;
    this.companyService.getUserCompanies(currentUserInfo.companies).subscribe(companyResult => {
      companyResult.map(company => {
        this.companyList.push({
          value: company._id,
          viewValue: company.name
        });
        if(company._id == this.companySelected) {
          company.adServerUrls.map(url => {
            this.adServerUrlList.push({
              value: url['adServerUrl'],
              viewValue: url['adServerUrl']
            });
          });
          //advertiser GET
          company.reportingProviders.map(reporting => {
            this.advertiserList.push({
              value: reporting.reportingProvider,
              viewValue: reporting.reportingProvider
            });
          });
        }
      })
    });
    
    //Get the current tag to edit
    if (this.route.snapshot.params.id) {
      this.tagManagementService.getOneTag(this.route.snapshot.params.id).subscribe(x => {
        this.tag = x;
        // console.log(x);
        var browserVal = [];
        var deviceTypeVal = [];
        var versionVal = [];
        var countryVal = [];
        this.url = x['url'];
        this.initialURL = new URL('https://adserver.com/search');
        for(var bval of x['browser'].toString().split(",")){
          browserVal.push(bval)
        }
        
        for(var dval of x['deviceType'].toString().split(",")){
          deviceTypeVal.push(dval)
        }
        for(var vval of x['version'].toString().split(",")){
          versionVal.push(vval)
        }
        for(var cval of x['country'].toString().split(",")){
          countryVal.push(cval)
        }
        x['subids'].map((item) => {
          this.subids.push(this.fb.group(item));
        });
        x['params'].map((param) => {
          this.params.push(this.fb.group(param));
        });
        // this.updateTagFG.patchValue(x);
        this.updateTagFG.setValue({
          name: x['name'],
          company: x['company'],
          advertiser: x['advertiser'],
          publisher: x['publisher'].length ? x['publisher'][0]['_key'] : '',
          browserStatus: x['browserStatus'],
          browser: browserVal,
          deviceTypeStatus: x['deviceTypeStatus'],
          deviceType: deviceTypeVal,
          countryStatus: x['countryStatus'],
          country: countryVal,
          versionStatus: x['versionStatus'],
          version: versionVal,
          adServerUrl: x['adServerUrl'],
          statType: x['statType'],
          numFilterTag: 'ExactValue',
          numLimit: '1000',
          numSubid: '',
          numSplit: '70',
          subids: x['subids'],
          rotationType: x['rotationType'],
          url: x['url'],
          params: x['params'],
          
        });
      });
    }
    this.changeDetectorRefs.detectChanges();
  }

  getPublisherAll() {
    this.userService.getPublisherAll().subscribe(data => {
      // console.log(data);
      if(this.companySelected) {
        this.publishertempList = data.filter(userData => userData.companies.includes(this.companySelected));
      } else {
        this.publishertempList = data;
      }
      this.publishertempList.map(publisher => {
        this.publisherList.push({
          value: publisher._key,
          viewValue: publisher.fullname
        })
      })
    });
  }
  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }
  //Update the tag onto the database
  updateTag() {
    this.updateTagFG.markAllAsTouched();
    if (this.updateTagFG.valid) {
      this.tag = {...this.tag, ...this.updateTagFG.value};
      this.tagManagementService.updateOneTag(this.tag).subscribe(res => {
        this._snackBarService.info('Updated a  tag');
      }, (err) => {
        this._snackBarService.info(err.error);
      },
      )
    }
  }
  get subids() {
    return this.updateTagFG.controls['subids'] as FormArray;
  }
  newSubids(): FormGroup {
    return this.fb.group({
      subid: ['', Validators.required],
      limit: ['', Validators.required],
      split: ['', Validators.required],
      filterTag: ['', Validators.required],
    })
  }
   
  addSubid(event) {
    this.subids.push(this.newSubids());
  }
  removeSubid(i:number) {
    this.subids.removeAt(i);
  }
  //Detects when URL is pasted into the field
  //https://us.search.yahoo.com/yhs/search?hspart=brandclick&hsimp=yhs-calm&p=flowers
  getUrlParams(url) {
    //Resets the URL params on every change
    this.deleteValueOfFormControl('params');
    if (this.isValidURL(url)) {
      url = new URL(url);
      for (var key of url.searchParams.keys()) {
        let value = url.searchParams.get(key);
        this.addParamsToUrlForm(key, value);
      }
    } else {
      return;
    }
  }
  
  //Gets the value of any form Array
  //Returns a form array
  get params() {
    return this.updateTagFG.controls['params'] as FormArray;
  }

  //Deletes value of any given form control
  deleteValueOfFormControl(controlName) {
    this.params.clear();
  }

  //Updates the original parameters that will be received and sent on the first server request
  //Example: domain.com/search?subid={{dynamic}}&q={{dynamic}}&search=[bing]
  updateInitialParams(param, index) {
    console.log('Updating Initial Params');
    console.log(param, index);
    if (param.value === 'static') {
      console.log('static!');
      this.params.controls[index]
        .get('initialParam')
        .setValue(this.params.controls[index].get('value').value);
      this.createInitialURL();
    } else {
      // this.params.controls[index]
      //   .get('initialParam')
      //   .setValue(this.params.controls[index].get('key').value);
    }
  }

  //Checks to see if initialParam mat input field has been touched and updates initial URL
  updateInitialParamURL(value, index) {
    if (this.params.controls[index].get('paramType').value === 'dynamic') {
      this.createInitialURL();
    }
  }

  //Builds the initial URL from the paramaters
  createInitialURL() {
    console.log('Updating URL');
    this.initialURL = new URL('https://adserver.com/search');
    this.params.controls.forEach((element, index) => {
      if (element.value.paramType === 'dynamic') {
        this.initialURL.searchParams.append(
          element.value.key,
          '{{' + element.value.initialParam + '}}'
        );
      } else if (element.value.paramType === 'static') {
        // this.initialURL.searchParams.append(
        //   element.value.key,
        //   element.value.value
        // );
      } else {
      }
    });
  }

  //Decodes the URL for the Angular Template
  decodeURL(url) {
    return decodeURI(url);
  }

  //Adds key/valuew to FormArray 'Params'
  addParamsToUrlForm(key, value) {
    let paramForm = this.fb.group({
      key: [key, Validators.required],
      value: [value, Validators.required],
      paramType: ['', Validators.required],
      initialParam: ['', Validators.required],
    });
    this.params.push(paramForm);
  }

  //Checks to see if URL entered is valid
  //If URL is valid return true
  //Else if URL is invalid return false and throw mat-error
  private isValidURL(url) {
    try {
      let finalUrl = new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }
  getBrowers(event) {
    if (event.value.length > 0) {
      let vTemp: any[] = [];
      if(event.value.includes('Any')) {
        this.browserVersions = this.versionList
      } else {
        for(var e of event.value) {
          let filterdata = this.versionList.filter(function(version: any) {
            return version.value.includes(e)
          })
          filterdata.map((filter: any) => {
              vTemp.push(filter);
          })
        }
        this.browserVersions = vTemp;
      }
      
    } else {
      this.browserVersions = []
    }
  }
  //update the tag as a template
  updateTemplate() {}

  //Gets different ways a tag can display stats
  private getStatTypes() {
    return [
      { value: 'rpm', viewValue: 'RPM Based' },
      { value: 'subid', viewValue: 'Sub-ID Based' },
    ];
  }

  //Gets Country List
  private getCountries() {
    return [
      {value: 'Afghanistan', viewValue: 'Afghanistan'}, 
      {value: 'Åland Islands', viewValue: 'Åland Islands'}, 
      {value: 'Albania', viewValue: 'Albania'}, 
      {value: 'Algeria', viewValue: 'Algeria'}, 
      {value: 'American Samoa', viewValue: 'American Samoa'}, 
      {value: 'Andorra', viewValue: 'Andorra'}, 
      {value: 'Angola', viewValue: 'Angola'}, 
      {value: 'Anguilla', viewValue: 'Anguilla'}, 
      {value: 'Antarctica', viewValue: 'Antarctica'}, 
      {value: 'Antigua and Barbuda', viewValue: 'Antigua and Barbuda'}, 
      {value: 'Argentina', viewValue: 'Argentina'}, 
      {value: 'Armenia', viewValue: 'Armenia'}, 
      {value: 'Aruba', viewValue: 'Aruba'}, 
      {value: 'Australia', viewValue: 'Australia'}, 
      {value: 'Austria', viewValue: 'Austria'}, 
      {value: 'Azerbaijan', viewValue: 'Azerbaijan'}, 
      {value: 'Bahamas', viewValue: 'Bahamas'}, 
      {value: 'Bahrain', viewValue: 'Bahrain'}, 
      {value: 'Bangladesh', viewValue: 'Bangladesh'}, 
      {value: 'Barbados', viewValue: 'Barbados'}, 
      {value: 'Belarus', viewValue: 'Belarus'}, 
      {value: 'Belgium', viewValue: 'Belgium'}, 
      {value: 'Belize', viewValue: 'Belize'}, 
      {value: 'Benin', viewValue: 'Benin'}, 
      {value: 'Bermuda', viewValue: 'Bermuda'}, 
      {value: 'Bhutan', viewValue: 'Bhutan'}, 
      {value: 'Bolivia', viewValue: 'Bolivia'}, 
      {value: 'Bosnia and Herzegovina', viewValue: 'Bosnia and Herzegovina'}, 
      {value: 'Botswana', viewValue: 'Botswana'}, 
      {value: 'Bouvet Island', viewValue: 'Bouvet Island'}, 
      {value: 'Brazil', viewValue: 'Brazil'}, 
      {value: 'British Indian Ocean Territory', viewValue: 'British Indian Ocean Territory'}, 
      {value: 'Brunei Darussalam', viewValue: 'Brunei Darussala'}, 
      {value: 'Bulgaria', viewValue: 'Bulgaria'}, 
      {value: 'Burkina Faso', viewValue: 'Burkina Faso'}, 
      {value: 'Burundi', viewValue: 'Burundi'}, 
      {value: 'Cambodia', viewValue: 'Cambodia'}, 
      {value: 'Cameroon', viewValue: 'Cameroon'}, 
      {value: 'Canada', viewValue: 'Canada'}, 
      {value: 'Cape Verde', viewValue: 'Cape Verde'}, 
      {value: 'Cayman Islands', viewValue: 'Cayman Islands'}, 
      {value: 'Central African Republic', viewValue: 'Central African Republic'}, 
      {value: 'Chad', viewValue: 'Chad'}, 
      {value: 'Chile', viewValue: 'Chile'}, 
      {value: 'China', viewValue: 'China'}, 
      {value: 'Christmas Island', viewValue: 'Christmas Island'}, 
      {value: 'Cocos (Keeling) Islands', viewValue: 'Cocos (Keeling) Islands'}, 
      {value: 'Colombia', viewValue: 'Colombia'}, 
      {value: 'Comoros', viewValue: 'Comoros'}, 
      {value: 'Congo', viewValue: 'Congo'}, 
      {value: 'Congo, The Democratic Republic of the', viewValue: 'Congo, The Democratic Republic of the'}, 
      {value: 'Cook Islands', viewValue: 'Cook Islands'}, 
      {value: 'Costa Rica', viewValue: 'Costa Rica'}, 
      {value: 'Cote D\'Ivoire', viewValue: 'Cote D\'Ivoire'}, 
      {value: 'Croatia', viewValue: 'Croatia'}, 
      {value: 'Cuba', viewValue: 'Cuba'}, 
      {value: 'Cyprus', viewValue: 'Cyprus'}, 
      {value: 'Czech Republic', viewValue: 'Czech Republic'}, 
      {value: 'Denmark', viewValue: 'Denmark'}, 
      {value: 'Djibouti', viewValue: 'Djibouti'}, 
      {value: 'Dominica', viewValue: 'Dominica'}, 
      {value: 'Dominican Republic', viewValue: 'Dominican Republic'}, 
      {value: 'Ecuador', viewValue: 'Ecuador'}, 
      {value: 'Egypt', viewValue: 'Egypt'}, 
      {value: 'El Salvador', viewValue: 'El Salvador'}, 
      {value: 'Equatorial Guinea', viewValue: 'Equatorial Guinea'}, 
      {value: 'Eritrea', viewValue: 'Eritrea'}, 
      {value: 'Estonia', viewValue: 'Estonia'}, 
      {value: 'Ethiopia', viewValue: 'Ethiopia'}, 
      {value: 'Falkland Islands (Malvinas)', viewValue: 'Falkland Islands (Malvinas)'}, 
      {value: 'Faroe Islands', viewValue: 'Faroe Islands'}, 
      {value: 'Fiji', viewValue: 'Fiji'}, 
      {value: 'Finland', viewValue: 'Finland'}, 
      {value: 'France', viewValue: 'France'}, 
      {value: 'French Guiana', viewValue: 'French Guiana'}, 
      {value: 'French Polynesia', viewValue: 'French Polynesia'}, 
      {value: 'French Southern Territories', viewValue: 'French Southern Territories'}, 
      {value: 'Gabon', viewValue: 'Gabon'}, 
      {value: 'Gambia', viewValue: 'Gambia'}, 
      {value: 'Georgia', viewValue: 'Georgia'}, 
      {value: 'Germany', viewValue: 'Germany'}, 
      {value: 'Ghana', viewValue: 'Ghana'}, 
      {value: 'Gibraltar', viewValue: 'Gibraltar'}, 
      {value: 'Greece', viewValue: 'Greece'}, 
      {value: 'Greenland', viewValue: 'Greenland'}, 
      {value: 'Grenada', viewValue: 'Grenada'}, 
      {value: 'Guadeloupe', viewValue: 'Guadeloupe'}, 
      {value: 'Guam', viewValue: 'Guam'}, 
      {value: 'Guatemala', viewValue: 'Guatemala'}, 
      {value: 'Guernsey', viewValue: 'Guernsey'}, 
      {value: 'Guinea', viewValue: 'Guinea'}, 
      {value: 'Guinea-Bissau', viewValue: 'Guinea-Bissau'}, 
      {value: 'Guyana', viewValue: 'Guyana'}, 
      {value: 'Haiti', viewValue: 'Haiti'}, 
      {value: 'Heard Island and Mcdonald Islands', viewValue: 'Heard Island and Mcdonald Islands'}, 
      {value: 'Holy See (Vatican City State)', viewValue: 'Holy See (Vatican City State)'}, 
      {value: 'Honduras', viewValue: 'Honduras'}, 
      {value: 'Hong Kong', viewValue: 'Hong Kong'}, 
      {value: 'Hungary', viewValue: 'Hungary'}, 
      {value: 'Iceland', viewValue: 'Iceland'}, 
      {value: 'India', viewValue: 'India'}, 
      {value: 'Indonesia', viewValue: 'Indonesia'}, 
      {value: 'Iran, Islamic Republic Of', viewValue: 'Iran, Islamic Republic Of'}, 
      {value: 'Iraq', viewValue: 'Iraq'}, 
      {value: 'Ireland', viewValue: 'Ireland'}, 
      {value: 'Isle of Man', viewValue: 'Isle of Man'}, 
      {value: 'Israel', viewValue: 'Israel'}, 
      {value: 'Italy', viewValue: 'Italy'}, 
      {value: 'Jamaica', viewValue: 'Jamaica'}, 
      {value: 'Japan', viewValue: 'Japan'}, 
      {value: 'Jersey', viewValue: 'Jersey'}, 
      {value: 'Jordan', viewValue: 'Jordan'}, 
      {value: 'Kazakhstan', viewValue: 'Kazakhstan'}, 
      {value: 'Kenya', viewValue: 'Kenya'}, 
      {value: 'Kiribati', viewValue: 'Kiribati'}, 
      {value: 'Korea, Democratic People\'S Republic of', viewValue: 'Korea, Democratic People\'S Republic o'}, 
      {value: 'Korea, Republic of', viewValue: 'Korea, Republic of'}, 
      {value: 'Kuwait', viewValue: 'Kuwait'}, 
      {value: 'Kyrgyzstan', viewValue: 'Kyrgyzstan'}, 
      {value: 'Lao People\'S Democratic Republic', viewValue: 'Lao People\'S Democratic Republic'}, 
      {value: 'Latvia', viewValue: 'Latvia'}, 
      {value: 'Lebanon', viewValue: 'Lebanon'}, 
      {value: 'Lesotho', viewValue: 'Lesotho'}, 
      {value: 'Liberia', viewValue: 'Liberia'}, 
      {value: 'Libyan Arab Jamahiriya', viewValue: 'Libyan Arab Jamahiriya'}, 
      {value: 'Liechtenstein', viewValue: 'Liechtenstein'}, 
      {value: 'Lithuania', viewValue: 'Lithuania'}, 
      {value: 'Luxembourg', viewValue: 'Luxembourg'}, 
      {value: 'Macao', viewValue: 'Macao'}, 
      {value: 'Macedonia, The Former Yugoslav Republic of', viewValue: 'Macedonia, The Former Yugoslav Republic of'}, 
      {value: 'Madagascar', viewValue: 'Madagascar'}, 
      {value: 'Malawi', viewValue: 'Malawi'}, 
      {value: 'Malaysia', viewValue: 'Malaysia'}, 
      {value: 'Maldives', viewValue: 'Maldives'}, 
      {value: 'Mali', viewValue: 'Mali'}, 
      {value: 'Malta', viewValue: 'Malta'}, 
      {value: 'Marshall Islands', viewValue: 'Marshall Islands'}, 
      {value: 'Martinique', viewValue: 'Martinique'}, 
      {value: 'Mauritania', viewValue: 'Mauritania'}, 
      {value: 'Mauritius', viewValue: 'Mauritius'}, 
      {value: 'Mayotte', viewValue: 'Mayotte'}, 
      {value: 'Mexico', viewValue: 'Mexico'}, 
      {value: 'Micronesia, Federated States of', viewValue: 'Micronesia, Federated States of'}, 
      {value: 'Moldova, Republic of', viewValue: 'Moldova, Republic of'}, 
      {value: 'Monaco', viewValue: 'Monaco'}, 
      {value: 'Mongolia', viewValue: 'Mongolia'}, 
      {value: 'Montserrat', viewValue: 'Montserrat'}, 
      {value: 'Morocco', viewValue: 'Morocco'}, 
      {value: 'Mozambique', viewValue: 'Mozambique'}, 
      {value: 'Myanmar', viewValue: 'Myanmar'}, 
      {value: 'Namibia', viewValue: 'Namibia'}, 
      {value: 'Nauru', viewValue: 'Nauru'}, 
      {value: 'Nepal', viewValue: 'Nepal'}, 
      {value: 'Netherlands', viewValue: 'Netherlands'}, 
      {value: 'Netherlands Antilles', viewValue: 'Netherlands Antilles'}, 
      {value: 'New Caledonia', viewValue: 'New Caledonia'}, 
      {value: 'New Zealand', viewValue: 'New Zealand'}, 
      {value: 'Nicaragua', viewValue: 'Nicaragua'}, 
      {value: 'Niger', viewValue: 'Niger'}, 
      {value: 'Nigeria', viewValue: 'Nigeria'}, 
      {value: 'Niue', viewValue: 'Niue'}, 
      {value: 'Norfolk Island', viewValue: 'Norfolk Island'}, 
      {value: 'Northern Mariana Islands', viewValue: 'Northern Mariana Islands'}, 
      {value: 'Norway', viewValue: 'Norway'}, 
      {value: 'Oman', viewValue: 'Oman'}, 
      {value: 'Pakistan', viewValue: 'Pakistan'}, 
      {value: 'Palau', viewValue: 'Palau'}, 
      {value: 'Palestinian Territory, Occupied', viewValue: 'Palestinian Territory, Occupied'}, 
      {value: 'Panama', viewValue: 'Panama'}, 
      {value: 'Papua New Guinea', viewValue: 'Papua New Guinea'}, 
      {value: 'Paraguay', viewValue: 'Paraguay'}, 
      {value: 'Peru', viewValue: 'Peru'}, 
      {value: 'Philippines', viewValue: 'Philippines'}, 
      {value: 'Pitcairn', viewValue: 'Pitcairn'}, 
      {value: 'Poland', viewValue: 'Poland'}, 
      {value: 'Portugal', viewValue: 'Portugal'}, 
      {value: 'Puerto Rico', viewValue: 'Puerto Rico'}, 
      {value: 'Qatar', viewValue: 'Qatar'}, 
      {value: 'Reunion', viewValue: 'Reunion'}, 
      {value: 'Romania', viewValue: 'Romania'}, 
      {value: 'Russian Federation', viewValue: 'Russian Federatio'}, 
      {value: 'RWANDA', viewValue: 'RWANDA'}, 
      {value: 'Saint Helena', viewValue: 'Saint Helena'}, 
      {value: 'Saint Kitts and Nevis', viewValue: 'Saint Kitts and Nevis'}, 
      {value: 'Saint Lucia', viewValue: 'Saint Lucia'}, 
      {value: 'Saint Pierre and Miquelon', viewValue: 'Saint Pierre and Miquelon'}, 
      {value: 'Saint Vincent and the Grenadines', viewValue: 'Saint Vincent and the Grenadines'}, 
      {value: 'Samoa', viewValue: 'Samoa'}, 
      {value: 'San Marino', viewValue: 'San Marino'}, 
      {value: 'Sao Tome and Principe', viewValue: 'Sao Tome and Principe'}, 
      {value: 'Saudi Arabia', viewValue: 'Saudi Arabia'}, 
      {value: 'Senegal', viewValue: 'Senegal'}, 
      {value: 'Serbia and Montenegro', viewValue: 'Serbia and Montenegro'}, 
      {value: 'Seychelles', viewValue: 'Seychelles'}, 
      {value: 'Sierra Leone', viewValue: 'Sierra Leone'}, 
      {value: 'Singapore', viewValue: 'Singapore'}, 
      {value: 'Slovakia', viewValue: 'Slovakia'}, 
      {value: 'Slovenia', viewValue: 'Slovenia'}, 
      {value: 'Solomon Islands', viewValue: 'Solomon Islands'}, 
      {value: 'Somalia', viewValue: 'Somalia'}, 
      {value: 'South Africa', viewValue: 'South Africa'}, 
      {value: 'South Georgia and the South Sandwich Islands', viewValue: 'South Georgia and the South Sandwich Isla'}, 
      {value: 'Spain', viewValue: 'Spain'}, 
      {value: 'Sri Lanka', viewValue: 'Sri Lanka'}, 
      {value: 'Sudan', viewValue: 'Sudan'}, 
      {value: 'Surivalue', viewValue: 'Surivalue'}, 
      {value: 'Svalbard and Jan Mayen', viewValue: 'Svalbard and Jan Mayen'}, 
      {value: 'Swaziland', viewValue: 'Swaziland'}, 
      {value: 'Sweden', viewValue: 'Sweden'}, 
      {value: 'Switzerland', viewValue: 'Switzerland'}, 
      {value: 'Syrian Arab Republic', viewValue: 'Syrian Arab Republic'}, 
      {value: 'Taiwan, Province of China', viewValue: 'Taiwan, Province of China'}, 
      {value: 'Tajikistan', viewValue: 'Tajikistan'}, 
      {value: 'Tanzania, United Republic of', viewValue: 'Tanzania, United Republic of'}, 
      {value: 'Thailand', viewValue: 'Thailand'}, 
      {value: 'Timor-Leste', viewValue: 'Timor-Leste'}, 
      {value: 'Togo', viewValue: 'Togo'}, 
      {value: 'Tokelau', viewValue: 'Tokelau'}, 
      {value: 'Tonga', viewValue: 'Tonga'}, 
      {value: 'TrinviewValuead and Tobago', viewValue: 'TrinviewValuead and Tobago'}, 
      {value: 'Tunisia', viewValue: 'Tunisia'}, 
      {value: 'Turkey', viewValue: 'Turkey'}, 
      {value: 'Turkmenistan', viewValue: 'Turkmenistan'}, 
      {value: 'Turks and Caicos Islands', viewValue: 'Turks and Caicos Islands'}, 
      {value: 'Tuvalu', viewValue: 'Tuvalu'}, 
      {value: 'Uganda', viewValue: 'Uganda'}, 
      {value: 'Ukraine', viewValue: 'Ukraine'}, 
      {value: 'United Arab Emirates', viewValue: 'United Arab Emirates'}, 
      {value: 'United Kingdom', viewValue: 'United Kingdom'}, 
      {value: 'United States', viewValue: 'United States'}, 
      {value: 'United States Minor Outlying Islands', viewValue: 'United States Minor Outlying Islands'}, 
      {value: 'Uruguay', viewValue: 'Uruguay'}, 
      {value: 'Uzbekistan', viewValue: 'Uzbekistan'}, 
      {value: 'Vanuatu', viewValue: 'Vanuatu'}, 
      {value: 'Venezuela', viewValue: 'Venezuela'}, 
      {value: 'Viet Nam', viewValue: 'Viet Nam'}, 
      {value: 'Virgin Islands, British', viewValue: 'Virgin Islands, British'}, 
      {value: 'Virgin Islands, U.S.', viewValue: 'Virgin Islands, U.S.'}, 
      {value: 'Wallis and Futuna', viewValue: 'Wallis and Futuna'}, 
      {value: 'Western Sahara', viewValue: 'Western Sahara'}, 
      {value: 'Yemen', viewValue: 'Yemen'}, 
      {value: 'Zambia', viewValue: 'Zambia'}, 
      {value: 'Zimbabwe', viewValue: 'Zimbabwe'} 
    ]
  }
  //Gets Browser Versions
  private getVersions() {
    this.edgeVersions = [
      {value: "Edge - 102.0.1245.7", viewValue: "Edge - 102.0.1245.7"},
      {value: "Edge - 101.0.1210.10", viewValue: "Edge - 101.0.1210.10"},
      {value: "Edge - 100.0.1185.10", viewValue: "Edge - 100.0.1185.10"},
      {value: "Edge - 99.0.1150.11", viewValue: "Edge - 99.0.1150.11"},
      {value: "Edge - 98.0.1108.23", viewValue: "Edge - 98.0.1108.23"},
      {value: "Edge - 97.0.1072.21", viewValue: "Edge - 97.0.1072.21"},
      {value: "Edge - 96.0.1054.8", viewValue: "Edge - 96.0.1054.8"},
      {value: "Edge - 95.0.1020.9", viewValue: "Edge - 95.0.1020.9"},
      {value: "Edge - 94.0.992.9", viewValue: "Edge - 94.0.992.9"},
      {value: "Edge - 93.0.961.11", viewValue: "Edge - 93.0.961.11"},
      {value: "Edge - 92.0.902.9", viewValue: "Edge - 92.0.902.9"},
      {value: "Edge - 91.0.864.11", viewValue: "Edge - 91.0.864.11"},
      {value: "Edge - 90.0.818.8", viewValue: "Edge - 90.0.818.8"},
      {value: "Edge - 89.0.774.18", viewValue: "Edge - 89.0.774.18"},
      {value: "Edge - 88.0.705.18", viewValue: "Edge - 88.0.705.18"},
    ];
    this.operaVersions = [
      {value: "Opera - 12.15", viewValue: "Opera - 12.15"},
      {value: "Opera - 12.14", viewValue: "Opera - 12.14"},
      {value: "Opera - 12.13", viewValue: "Opera - 12.13"},
      {value: "Opera - 12.12", viewValue: "Opera - 12.12"},
      {value: "Opera - 12.11", viewValue: "Opera - 12.11"},
      {value: "Opera - 12.10", viewValue: "Opera - 12.10"},
      {value: "Opera - 12.10b", viewValue: "Opera - 12.10b"},
      {value: "Opera - 12.02",  viewValue: "Opera - 12.02"},
      {value: "Opera - 12.01",  viewValue: "Opera - 12.01"},
      {value: "Opera - 12.00",  viewValue: "Opera - 12.00"},
      {value: "Opera - 12.00b", viewValue: "Opera - 12.00b"},
      {value: "Opera - 12.00a", viewValue: "Opera - 12.00a"},
      {value: "Opera - 11.64",  viewValue: "Opera - 11.64"},
      {value: "Opera - 11.62", viewValue: "Opera - 11.62"},
      {value: "Opera - 11.61", viewValue: "Opera - 11.61"},
      {value: "Opera - 11.60", viewValue: "Opera - 11.60"},
      {value: "Opera - 11.60b", viewValue: "Opera - 11.60b"},
      {value: "Opera - 11.52", viewValue: "Opera - 11.52"},
      {value: "Opera - 11.51", viewValue: "Opera - 11.51"},
      {value: "Opera - 11.50", viewValue: "Opera - 11.50"},
    ];
    this.internetExplorers = [
      {value: "Internet Explorer - 11.0.220", viewValue: "Internet Explorer - 11.0.220"},
      {value: "Internet Explorer - 9.0.195", viewValue: "Internet Explorer - 9.0.195"},
      {value: "Internet Explorer - 8.0.6001.18702", viewValue: "Internet Explorer - 8.0.6001.18702"},
      {value: "Internet Explorer - 6.0 SP1", viewValue: "Internet Explorer - 6.0 SP1"},
      {value: "Internet Explorer - 5.5 SP2", viewValue: "Internet Explorer - 5.5 SP2"},
      {value: "Internet Explorer - 5.01 SP2", viewValue: "Internet Explorer - 5.01 SP2"},
      {value: "Internet Explorer - 5.2.3", viewValue: "Internet Explorer - 5.2.3"},
      {value: "Internet Explorer - 5.1.7", viewValue: "Internet Explorer - 5.1.7"},
      {value: "Internet Explorer - 4.0.1", viewValue: "Internet Explorer - 4.0.1"},
      {value: "Internet Explorer - 2.0.1", viewValue: "Internet Explorer - 2.0.1"},
    ]
    this.versionList.push(
      {value: "Any", viewValue: "Any"}
    );
    //Chrome Version List Get
    this.tagManagementService.getChromeBrowserVersion().subscribe((res: any) => {
      let versionsChromeData = res.slice(0, 30);
      versionsChromeData.map((version: { version: string; }) => {
        this.versionList.push(
            {
                value: "Chrome - " + version.version,
                viewValue: "Chrome - " + version.version
            }
        )
      });    
    }); 
    this.edgeVersions.map((edge: any) => {
      this.versionList.push(edge);
    });

    //FireFox Version List Get
    this.tagManagementService.getFirefoxBrowserVersion().subscribe(res => {
      var firefoxList = [];
      for(var i in res){
        firefoxList.push(
            {
                value: "Firefox - " + i,
                viewValue: "Firefox - " + i
            }
        )
      }
      firefoxList.slice(firefoxList['length'] - 30, firefoxList['length']).map((version: { version: string; }) => {
        this.versionList.push(
            {
                value: version['value'],
                viewValue: version['viewValue']
            }
        )
      });
    });  
    
    
    this.internetExplorers.map((internet: any) => {
      this.versionList.push(internet);
    });
    this.operaVersions.map((opera: any) => {
      this.versionList.push(opera);
    });

    return this.versionList;
  }
  //Gets different ways a tag can display stats
  private getRotationTypes() {
    return [
      { value: 'roundRobin', viewValue: 'Round Robin' },
      { value: 'percentage', viewValue: 'Percentage' },
    ];
  }

  private getParamTypes() {
    return [
      { value: 'static', viewValue: 'Static' },
      { value: 'dynamic', viewValue: 'Dynamic' },
    ];
  }
  handleBrowserStatus(event) {
  }
  handleDeviceTypeStatus(event) {
  }
  handleVersionStatus(event) {
  }
  handleCountryStatus(event) {
  }

  addRange() {
    var subList = [];
    var numericId = this.updateTagFG.value['numSubid'];
    if(numericId) {
      if(numericId.includes("-") || numericId.includes("~")) {
        var startNum = parseInt(numericId.split('-')[0] || numericId.split('~')[0]);
        var endNum = parseInt(numericId.split('-')[1] || numericId.split('~')[1]);
        console.log("======", startNum, endNum)
        if(startNum < endNum) {
          for(var i=startNum; i<= endNum;i++) {
            subList.push({
              "filterTag": this.updateTagFG.value.numFilterTag,
              "subid": i.toString(),
              "limit": this.updateTagFG.value.numLimit,
              "split": this.updateTagFG.value.numSplit,
            })
          }
        } else if (startNum == endNum) {
          subList.push({
            "filterTag": this.updateTagFG.value.numFilterTag,
            "subid": i.toString(),
            "limit": this.updateTagFG.value.numLimit,
            "split": this.updateTagFG.value.numSplit,
          })
        } else if(startNum > endNum) {
          for(var i=endNum; i<= startNum;i++) {
            subList.push({
              "filterTag": this.updateTagFG.value.numFilterTag,
              "subid": i.toString(),
              "limit": this.updateTagFG.value.numLimit,
              "split": this.updateTagFG.value.numSplit,
            })
          }
        }
      }
  
      subList.map((sub) => {
        var subidsArr = this.fb.group({
          subid: [sub.subid, Validators.required],
          limit: [sub.limit, Validators.required],
          split: [sub.split, Validators.required],
          filterTag: [sub.filterTag, Validators.required],
        })
        this.subids.push(subidsArr);
      });
    }
    else {
      this.notification.showError("Please fill valid Subid range!", "")
    }
    
  }
}
