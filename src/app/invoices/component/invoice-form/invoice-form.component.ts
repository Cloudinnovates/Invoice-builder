import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { InvoiceService } from "src/app/invoices/services/invoice.service";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { Invoice } from "src/app/invoices/models/invoice";

@Component({
  selector: "app-invoice-form",
  templateUrl: "./invoice-form.component.html",
  styleUrls: ["./invoice-form.component.scss"]
})
export class InvoiceFormComponent implements OnInit {
   invoice:Invoice;
  invoiceForm: FormGroup;
  id:string;
  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private snackbar: MatSnackBar,
    private route: Router,
    private activatedRouter:ActivatedRoute
  ) {}

  ngOnInit() {
    this.createForm();
    this.getInvoiceById();
  }
  postData() {
    if(this.invoice){
      this.invoiceService.updateInvoiceById(this.id,this.invoiceForm.value).subscribe(
        data=>{
          this.snackbar.open("Invoice Updated", "Success", {
            duration: 2000
          });
          this.invoiceForm.reset();
          console.log(data);
          this.route.navigate(["dashboard", "invoice"]);
        }, err => {
          this.snackbar.open(err.message, "Failed", {
            duration: 5000
          });
          console.error(err);
        }
      );
    }else{
    this.invoiceService.postInvoices(this.invoiceForm.value).subscribe(
      data => {
        this.snackbar.open("Invoice Created", "Success", {
          duration: 2000
        });
        this.invoiceForm.reset();
        console.log(data);
        this.route.navigate(["dashboard", "invoice"]);
      },
      err => {
        this.snackbar.open(err.message, "Failed", {
          duration: 5000
        });
        console.log(err);
      }
    );
  }
    // console.log(JSON.stringify(this.invoiceForm.value));
  }
  getInvoiceById(){
    this.activatedRouter.params.subscribe(params=>{
      this.id=params.id;
      if(!this.id){
        return;
      }
      this.invoiceService.getInvoiceById(this.id).subscribe(data=>{
        // debugger;
        this.invoice=data;
        this.invoiceForm.patchValue(this.invoice);
      })
    })
  }
  createForm() {
    this.invoiceForm = this.fb.group({
      item: ["", Validators.required],
      date: ["", Validators.required],
      due: ["", Validators.required],
      qty: "",
      rate: "",
      tax: ""
    });
  }
}
