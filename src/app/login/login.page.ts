// login.page.ts
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ResetPasswordPage } from '../reset-password/reset-password.page';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const formData = this.loginForm.value;
    this.http.post<any>('http://api.educandus.cl/admision/api/auth/login', formData)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Nombre de usuario o contraseña incorrectos.';
          return throwError(error);
        })
      )
      .subscribe(response => {
      //   {
      //     "message": "Login successful",
      //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJlOTAyMThkMmQwYzA4OTFjMGQxN2QiLCJlbWFpbCI6Im1hcm9zQHV0YWxjYS5jbCIsIm5hbWUiOiJNYW51ZWwiLCJsYXN0TmFtZSI6IkFyb3MiLCJyb2xlIjoicHJ1ZWJhIiwiaWF0IjoxNzE0MzI3NjgzLCJleHAiOjE3MTQzMzEyODN9.kJ-l5-6oozShjw59DUp4TYnzffnNmT8rFuhg6SbHPsI"
      // }
      // const token = response.token;
      // localStorage.setItem('token', token);
        if(response.message === 'Login successful') {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/quiz-list']);
        }
        else {
          this.errorMessage = 'Nombre de usuario o contraseña incorrectos.';
          this.presentAlert();
        }
        // Login exitoso
      });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: this.errorMessage,
      buttons: ['OK']
    });

    await alert.present();
  }
}
