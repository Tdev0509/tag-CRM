import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgageAdvantageComponent } from './imgage-advantage.component';

describe('ImgageAdvantageComponent', () => {
  let component: ImgageAdvantageComponent;
  let fixture: ComponentFixture<ImgageAdvantageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgageAdvantageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgageAdvantageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
