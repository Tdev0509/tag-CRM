import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerionComponent } from './perion.component';

describe('PerionComponent', () => {
  let component: PerionComponent;
  let fixture: ComponentFixture<PerionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
