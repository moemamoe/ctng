import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@ctng/auth';
import { Token } from 'src/app/auth/jwt.config';
import { LoggerService } from '@ctng/core';
import { JwtLocalStorageService } from '@ctng/auth-jwt-ls';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  public loginForm: FormGroup;

  public isAuthorized: boolean;
  public expDate: Date;
  public curDate: Date;
  public expDuration: number;

  constructor(
    private formBuilder: FormBuilder,
    private loggerService: LoggerService,
    private authService: AuthService,
    private jwtService: JwtLocalStorageService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.isAuthorized = this.authService.isAuthorized();

    this.expDate = this.jwtService.getTokenExpirationDate('_jwt');
    this.curDate = new Date();

    if (this.expDate) {
      this.expDuration = Math.floor((this.expDate.getTime() - this.curDate.getTime()) / 1000);
    }
  }

  public submit() {
    this.authService.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value).subscribe(
      (res) => {
        this.loggerService.debug('[LoginComponent]', 'Successfully logged in', res);
      },
      (error) => {
        this.loggerService.error('[LoginComponent]', 'Error during login', error);
      },
    );
  }

  public logout() {
    this.authService.logout();
    this.isAuthorized = false;
  }
}
