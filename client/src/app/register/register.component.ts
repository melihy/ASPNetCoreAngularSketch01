import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private accountService: AccountService
    , private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  register() {
    let user: User = this.model;
    if (!user) {
      this.toastr.error('invalid user info');
      return;
    }
    this.accountService.register(this.model).subscribe({
      next: () => {
        this.cancel();
      },
      error: error => {
        this.toastr.error(error.error),
        console.log(error)
      }
    });

    console.log(this.model);
  }

  cancel() {
    console.log("cancel buton click!");
    this.cancelRegister.emit(false);
  }
}
