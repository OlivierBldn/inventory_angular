import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public item = {
    title: "",
    calcul: "",
    result: "",
    unit: "",
  }

  calculate() {
    let result
    try {
      result = eval(this.item.calcul);
    }
    catch (e) {
      result = "Error";
    }
    this.item.result = result;
  }

  addToCalcul(value: string) {
    this.item.calcul += value;
  }

  clearCalcul() {
    this.item.calcul = "";
    this.item.result = "";
  }

  deleteLastEntry() {
    this.item.calcul = this.item.calcul.slice(0, -1);
  }
}