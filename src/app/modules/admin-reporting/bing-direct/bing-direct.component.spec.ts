import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingDirectComponent } from './bing-direct.component';

describe('BingDirectComponent', () => {
  let component: BingDirectComponent;
  let fixture: ComponentFixture<BingDirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingDirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BingDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
