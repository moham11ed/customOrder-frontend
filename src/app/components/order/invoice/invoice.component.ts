import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../services/order.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: [],
  providers: [DatePipe]
})
export class InvoiceComponent implements OnInit {
  orderData: Partial<Order> = {};
  invoiceDate: string;
  
  invoiceNumber: string = 'INV-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
 

  constructor(
    private orderService: OrderService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    const today = new Date();
    this.invoiceDate = this.datePipe.transform(today, 'yyyy-MM-dd') || '';
    
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15);
  }

  ngOnInit(): void {
    this.orderData = this.orderService.getCurrentOrder();
  }

  

  
  printInvoice(): void {
  window.print();
}
makeNewOrder() {
 
    this.router.navigate(['/']);
  }
}