import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { EstudiantesComponent } from './estudiantes/estudiantes.component';
import { FormComponent } from './estudiantes/form.component';
import { ProgramasComponent } from './programas/programas.component';
// import { FormPComponent } from './programas/formp.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, 
    ProgramasComponent, EstudiantesComponent, FormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
