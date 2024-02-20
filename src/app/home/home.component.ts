import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  item = {
    title: "Titre",
    calcul: "2 * 5 + 3",
    result: "63",
    unit: "m",
  }

}