import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTrafficComponent } from './daily-traffic.component';

describe('DailyTrafficComponent', () => {
  let component: DailyTrafficComponent;
  let fixture: ComponentFixture<DailyTrafficComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyTrafficComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTrafficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
