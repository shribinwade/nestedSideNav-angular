import { TestBed } from '@angular/core/testing';
import { DialogModelService } from './dialog-model.service';



describe('DialogModelService', () => {
  let service: DialogModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
