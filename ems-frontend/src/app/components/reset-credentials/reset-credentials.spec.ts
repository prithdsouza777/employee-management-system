import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetCredentials } from './reset-credentials';

describe('ResetCredentials', () => {
  let component: ResetCredentials;
  let fixture: ComponentFixture<ResetCredentials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetCredentials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetCredentials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
