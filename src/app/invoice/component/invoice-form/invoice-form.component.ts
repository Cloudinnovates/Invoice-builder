import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-invoice-form",
  templateUrl: "./invoice-form.component.html",
  styleUrls: ["./invoice-form.component.scss"]
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }
  validate() {
    console.log(JSON.stringify(this.invoiceForm.value));
  }
  createForm() {
    this.invoiceForm = this.fb.group({
      item: "",
      date: "",
      due: "",
      qty: "",
      rate: "",
      tax: ""
    });
  }
}
