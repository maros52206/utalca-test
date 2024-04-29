import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: 'reset-password.page.html',
  styleUrls: ['reset-password.page.scss'],
})
export class ResetPasswordPage {
  resetPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(12), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{12,}$/)]]
    });
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      const formData = {
        username: this.resetPasswordForm.value.username,
        password: this.resetPasswordForm.value.password,
        newPassword: this.resetPasswordForm.value.newPassword
      };

      this.http.post('http://api.educandus.cl/admision/api/auth/reset', formData)
        .subscribe(response => {
          console.log('Respuesta del servidor:', response);
          // Aquí puedes manejar la respuesta del servidor según tus necesidades
        }, error => {
          console.error('Error al enviar los datos:', error);
          // Aquí puedes manejar el error según tus necesidades
        });
    }
  }


  async showRegisterSuccess(username: string) {
    const alert = await this.alertController.create({
      header: 'Cambio de contraseña exitoso',
      message: `Cambio de contraseña exitoso ${username}!`,
      buttons: [
        {
          text: 'Vamos!',
          handler: () => {-
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
    this.router.navigate(['/login']); // Puedes cambiar la ruta según necesites
  }
}
