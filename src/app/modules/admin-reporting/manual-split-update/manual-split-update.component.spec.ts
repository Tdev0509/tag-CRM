import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualSplitUpdateComponent } from './manual-split-update.component';

describe('ManualSplitUpdateComponent', () => {
  let component: ManualSplitUpdateComponent;
  let fixture: ComponentFixture<ManualSplitUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualSplitUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualSplitUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
