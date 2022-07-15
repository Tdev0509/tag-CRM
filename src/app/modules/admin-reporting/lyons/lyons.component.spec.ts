import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LyonsComponent } from './lyons.component';

describe('LyonsComponent', () => {
  let component: LyonsComponent;
  let fixture: ComponentFixture<LyonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LyonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LyonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
