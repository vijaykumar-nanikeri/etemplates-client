import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements OnInit {
  @Output() outputEmitter = new EventEmitter();

  title?: string;
  text?: string;
  cancelButton?: string;
  cancelButtonClass = 'btn-link';
  confirmButton?: string;
  confirmButtonClass = 'btn-primary';

  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  cancel() {
    this.modalRef.hide();
  }

  confirm() {
    this.outputEmitter.emit(true);
  }
}
