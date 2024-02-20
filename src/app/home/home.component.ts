import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; 
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  public item = {
    title: "",
    calculation: "",
    result: "",
    unit: "",
  }

  items: { title: string; calculation: string; result: string; unit: string; }[] = [];

  selectedFile: File | null = null;


  constructor(private http: HttpClient) {
    let storedItems = localStorage.getItem('items');

    if (storedItems) {
      let parsedItems = JSON.parse(storedItems);
      this.items = parsedItems;
    }
  }

  calculate() {
    let floatResult;
    let result;
    try {
      floatResult = eval(this.item.calculation);

      result = parseFloat(floatResult).toFixed(3);

      this.item.result = result;
    }
    catch (e) {
      result = "Error";
    }
  }

  addToCalcul(value: string) {
    this.item.calculation += value;
  }

  clearCalcul() {
    this.item.calculation = "";
    this.item.result = "";
  }

  deleteLastEntry() {
    this.item.calculation = this.item.calculation.slice(0, -1);
  }

  registerItem() {
    if (this.item.title) {
      this.items.push({
        title: this.item.title,
        calculation: this.item.calculation,
        result: this.item.result,
        unit: this.item.unit
      });
      localStorage.setItem('items', JSON.stringify(this.items));
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  importCsv() {
    if (!this.selectedFile) {
      console.log('No file selected');
      return;
    }
  
    let fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, "UTF-8");
    fileReader.onload = () => {
      let csvData = <string>fileReader.result;
      let csvToRowArray = csvData.split("\n");
      for (let index = 1; index < csvToRowArray.length - 1; index++) {
        let row = csvToRowArray[index].split(",");
        this.items.push({
          title: row[0],
          calculation: row[1],
          result: row[2],
          unit: row[3]
        });
      }
      localStorage.setItem('items', JSON.stringify(this.items));
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }

  exportAsCsv() {
    let csvData = 'Title,Calculation,Result,Unit\n';
    this.items.forEach(item => {
      csvData += `${item.title},${item.calculation},${item.result},${item.unit}\n`;
    });
  
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
  
    let link = document.createElement('a');
    link.setAttribute('hidden', '');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}