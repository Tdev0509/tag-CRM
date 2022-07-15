import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualUpdateComponent } from './manual-update.component';

describe('ManualUpdateComponent', () => {
  let component: ManualUpdateComponent;
  let fixture: ComponentFixture<ManualUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
