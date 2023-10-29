import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  hide = true;

  public loginForm = this.fb.group({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  public submit(): void {
    if (!this.loginForm.value.email || !this.loginForm.value.password) {
      return;
    }
    this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password,
    );
  }
}
