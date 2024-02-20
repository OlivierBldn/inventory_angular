import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; 
import { CommonModule } from '@angular/common';

/**
 * Represents the HomeComponent class.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  /**
   * Represents the item object.
   */
  public item = {
    title: "",
    calculation: "",
    result: "",
    unit: "",
  }

  /**
   * Represents the items array.
   */
  items: { title: string; calculation: string; result: string; unit: string; }[] = [];

  /**
   * Represents the selected file.
   */
  selectedFile: File | null = null;

  /**
   * Represents the current view.
   */
  currentView: string = 'calculator';

  constructor(private http: HttpClient) {
    let storedItems = localStorage.getItem('items');

    if (storedItems) {
      let parsedItems = JSON.parse(storedItems);
      this.items = parsedItems;
    }
  }

  /**
   * Calculates the result based on the item's calculation.
   */
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

  /**
   * Adds the given value to the item's calculation.
   * @param value - The value to be added.
   */
  addToCalcul(value: string) {
    this.item.calculation += value;
  }

  /**
   * Clears the item's calculation and result.
   */
  clearCalcul() {
    this.item.calculation = "";
    this.item.result = "";
  }

  /**
   * Deletes the last character from the item's calculation.
   */
  deleteLastEntry() {
    this.item.calculation = this.item.calculation.slice(0, -1);
  }

  /**
   * Registers the item if all the required fields are filled.
   * Otherwise, displays an alert.
   */
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

  /**
   * Deletes the item at the given index.
   * @param index - The index of the item to be deleted.
   */
  deleteItem(index: number) {
    this.items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(this.items));
  }
  

  /**
   * Handles the file selection event.
   * @param event - The file selection event.
   */
  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  /**
   * Imports data from a CSV file.
   */
  importCsv() {
    if (!this.selectedFile) {
      console.log('No file selected');
      return;
    }
  
    let fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, "UTF-8");

    // Read the file and parse the data
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

  /**
   * Prints the data in a table format.
   */
  printData() {
    let printContents = '<table><tr><th>Désignation</th><th>Quantité</th><th>Unité</th></tr>';
    this.items.forEach(item => {
      printContents += `<tr><td>${item.title}</td><td>${item.result}</td><td>${item.unit}</td></tr>`;
    });
    printContents += '</table>';
  
    // Open a new window and print the data
    let originalContents = document.body.innerHTML;
  
    document.body.innerHTML = printContents;
  
    window.print();
  
    document.body.innerHTML = originalContents;
  }

  /**
   * Exports the data to a CSV file.
   */
  exportCsv() {
    let data = JSON.parse(localStorage.getItem('items') || '[]');
    
    let csvData = this.convertToCSV(data);
    
    this.downloadFile(csvData, 'text/csv', 'data.csv');
  }
  
  /**
   * Converts an array of objects to a CSV string.
   * @param objArray - The array of objects to be converted.
   * @returns The CSV string.
   */
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
  
  /**
   * Downloads a file with the given data, type, and filename.
   * @param data - The file data.
   * @param type - The file type.
   * @param filename - The file name.
   */
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

  /**
   * Checks if the given view is active.
   * @param view - The view to check.
   * @returns True if the view is active, false otherwise.
   */
  isActive(view: string): boolean {
    return this.currentView === view;
  }
}