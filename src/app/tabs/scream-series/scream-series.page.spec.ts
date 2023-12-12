import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreamSeriesPage } from './scream-series.page';

describe('ScreamSeriesPage', () => {
  let component: ScreamSeriesPage;
  let fixture: ComponentFixture<ScreamSeriesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ScreamSeriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
