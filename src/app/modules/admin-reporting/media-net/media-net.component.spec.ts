import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaNetComponent } from './media-net.component';

describe('MediaNetComponent', () => {
  let component: MediaNetComponent;
  let fixture: ComponentFixture<MediaNetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaNetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaNetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
