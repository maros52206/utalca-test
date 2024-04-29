import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {
    this.checkToken();
  }
  checkToken() {
    return;
    const token = localStorage.getItem('token');
    if (token) {
      // Redirigir al usuario a la página de listado de quizzes si existe un token
      this.router.navigateByUrl('/quiz-list');
    } else {
      // Redirigir al usuario a la página de inicio de sesión si no hay token
      this.router.navigateByUrl('/login');
    }
  }
}

