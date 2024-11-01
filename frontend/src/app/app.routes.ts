import { Routes } from '@angular/router';
import { ExamComponent } from './views/exam/exam.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ListExamComponent } from './views/list-exam/list-exam.component';
import { LoginComponent } from './views/acceso/login/login.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: DashboardComponent, /*canActivate: [AuthGuard]*/ },
    { path: 'list-exam', component: ListExamComponent },
    { path: 'exam', component: ExamComponent },
    { path: 'login', component: LoginComponent },
];
