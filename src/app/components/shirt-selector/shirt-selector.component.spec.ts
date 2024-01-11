import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShirtSelectorComponent } from './shirt-selector.component';

describe('ShirtSelectorComponent', () => {
  let component: ShirtSelectorComponent;
  let fixture: ComponentFixture<ShirtSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShirtSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShirtSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
