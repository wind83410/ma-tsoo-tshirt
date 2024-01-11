import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SHIRT_SIZE_PRICES } from '../../constants/shirt-price.constant';
import { KeyValue, KeyValuePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShirtPurchase } from '../../models/shirt.model';

@Component({
  selector: 'app-shirt-selector',
  standalone: true,
  imports: [KeyValuePipe, ReactiveFormsModule],
  templateUrl: './shirt-selector.component.html',
  styleUrl: './shirt-selector.component.scss'
})
export class ShirtSelectorComponent {

  @Input({ required: true }) trackID?: string;

  @Output() shirtSelectionChange: EventEmitter<ShirtPurchase> = new EventEmitter<ShirtPurchase>();

  shirtSelectorForm = new FormGroup({
    sizePrice: new FormControl<number | null>(null),
    quantity: new FormControl<number | null>(0)
  })

  SHIRT_SIZE_PRICES = SHIRT_SIZE_PRICES;

  ngOnInit(): void {
    this.shirtSelectorForm.valueChanges.subscribe({
      next: ({ sizePrice, quantity }) => {
        if (!sizePrice || typeof quantity !== 'number') return;
        this.shirtSelectionChange.next({
          sizePrice,
          quantity
        })
      }
    });
  }

  noobCompareFunction(a: KeyValue<string, number>, b: KeyValue<string, number>): number {
    return 0
  }
}
