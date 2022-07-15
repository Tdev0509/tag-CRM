import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerizonDirectComponent } from './verizon-direct.component';

describe('VerizonDirectComponent', () => {
  let component: VerizonDirectComponent;
  let fixture: ComponentFixture<VerizonDirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerizonDirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerizonDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
