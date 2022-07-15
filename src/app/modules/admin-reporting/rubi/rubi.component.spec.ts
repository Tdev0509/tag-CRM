import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubiComponent } from './rubi.component';

describe('RubiComponent', () => {
  let component: RubiComponent;
  let fixture: ComponentFixture<RubiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
