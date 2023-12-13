import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewcomentPage } from './reviewcoment.page';

describe('ReviewcomentPage', () => {
  let component: ReviewcomentPage;
  let fixture: ComponentFixture<ReviewcomentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReviewcomentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
