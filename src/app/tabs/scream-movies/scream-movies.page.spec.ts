import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreamMoviesPage } from './scream-movies.page';

describe('ScreamMoviesPage', () => {
  let component: ScreamMoviesPage;
  let fixture: ComponentFixture<ScreamMoviesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ScreamMoviesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
