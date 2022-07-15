import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedMediaComponent } from './protected-media.component';

describe('ProtectedMediaComponent', () => {
  let component: ProtectedMediaComponent;
  let fixture: ComponentFixture<ProtectedMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtectedMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectedMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
