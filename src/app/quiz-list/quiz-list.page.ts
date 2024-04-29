import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Route } from '@angular/router';

@Component({
  selector: 'app-quiz-list',
  templateUrl: 'quiz-list.page.html',
  styleUrls: ['quiz-list.page.scss'],
})
export class QuizListPage {
  quizzes: any[] = [];

  constructor(private http: HttpClient) {
    this.fetchQuizzes();
    
  }

  fetchQuizzes() {
    const token = localStorage.getItem('token');
    
    // Verifica si hay un token almacenado
    if (!token) {
      console.error('No hay token almacenado');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // {
    //   "carrera": "EDUC_ADM24",
    //   "ruts": [
    //     "adm24est01",
    //     "adm24est02",
    //     "adm24est03"
    //   ],
    //   "orderBy": "RUT"
    // }
    const body = {
      carrera: 'EDUC_ADM24',
      ruts: ['adm24est01', 'adm24est02', 'adm24est03'],
      orderBy: 'RUT'
    };

    this.http.post<any[]>('http://api.educandus.cl/admision/api/educandus/quizzes', body, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al obtener la lista de quizzes:', error);
          return throwError(error);
        })
      )
      .subscribe(response => {
        this.quizzes = response;
        console.log('Quizzes:', this.quizzes);
      });
      // .subscribe(response => {
      //   this.quizzes = response;
      // }, error => {
      //   console.error('Error al obtener la lista de quizzes:', error);
      //   // Manejo del error al obtener la lista de quizzes
      // });
  }

}
