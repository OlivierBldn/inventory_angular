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
    if (this.item.title && this.item.calculation && this.item.result && this.item.unit) {
      this.items.push({
        title: this.item.title,
        calculation: this.item.calculation,
        result: this.item.result,
        unit: this.item.unit
      });
      localStorage.setItem('items', JSON.stringify(this.items));
    } else {
      alert('Complétez tous les champs');
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

  printData() {
    let printContents = '<table><tr><th>Désignation</th><th>Quantité</th><th>Unité</th></tr>';
    this.items.forEach(item => {
      printContents += `<tr><td>${item.title}</td><td>${item.result}</td><td>${item.unit}</td></tr>`;
    });
    printContents += '</table>';
  
    let originalContents = document.body.innerHTML;
  
    document.body.innerHTML = printContents;
  
    window.print();
  
    document.body.innerHTML = originalContents;
  }

  exportCsv() {
    let data = JSON.parse(localStorage.getItem('items') || '[]');
    
    let csvData = this.convertToCSV(data);
    
    this.downloadFile(csvData, 'text/csv', 'data.csv');
  }
  
  convertToCSV(objArray: string) {
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';
  
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line != '') line += ','
        line += `"${array[i][index]}"`;
      }
      str += line + '\r\n';
    }
    return str;
  }
  
  downloadFile(data: any, type: string, filename: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let a = window.document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}