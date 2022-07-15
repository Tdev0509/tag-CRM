import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSuperadminComponent } from './new-superadmin.component';

describe('NewSuperadminComponent', () => {
  let component: NewSuperadminComponent;
  let fixture: ComponentFixture<NewSuperadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSuperadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
