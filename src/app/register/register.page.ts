// register.page.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;
  errorMessage: string = ''; // Define la propiedad errorMessage aquí

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
  ) {
    console.log("RegisterPage constructor")
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern(/^\+\d{11}$/)], // Se asume que el formato del teléfono es correcto: +56912345678
      password: ['', Validators.required],
      // passwordConfirmation: ['', Validators.required],
    });
  }

  get form() {
    return this.registerForm.controls;
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }

    const formData = this.registerForm.value;
    this.http.post<any>('http://api.educandus.cl/admision/api/auth/register', formData)
      .pipe(
        catchError(error => {
          //401
          this.errorMessage = 'Ocurrió un error al registrar el usuario.';
          return throwError(error);
        })
      )
      .subscribe(response => {
        //201
        if(response.message === 'User already exists') {
          this.errorMessage = 'El usuario ya existe.';
          // TODO: Usuarios y correos ya existentes
          return;
        }
        else if(response.message === 'User registered successfully') {
          console.log("User registered successfully");
          this.http.post<any>('http://api.educandus.cl/admision/api/auth/reset', 
            { 
              username: response.username, 
              password: response.password, 
              newPassword: this.registerForm.value.password 
            }).
            pipe(
              catchError(error => {
                this.errorMessage = 'Ocurrió un error al registrar el usuario.';
                return throwError(error);
              })
            ).subscribe(response => {
              console.log("Password set successfully" + response);
              this.showRegisterSuccess(response.username);
            });
          
        }
      });
  }

  async showRegisterSuccess(username: string) {
    const alert = await this.alertController.create({
      header: 'Registro Exitoso',
      message: `Registro exitoso ${username}!`,
      buttons: [
        {
          text: 'Vamos!',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ],
      keyboardClose: false, 
      backdropDismiss: false
    });

    await alert.present();
  }

  goBack() {
    this.router.navigate(['/login']); // Puedes cambiar '/' por la ruta que desees
  }
}
