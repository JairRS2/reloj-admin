import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecadasComponent } from './checadas.component';

describe('ChecadasComponent', () => {
  let component: ChecadasComponent;
  let fixture: ComponentFixture<ChecadasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChecadasComponent]
    });
    fixture = TestBed.createComponent(ChecadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
