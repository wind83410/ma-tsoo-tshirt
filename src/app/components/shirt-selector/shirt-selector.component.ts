import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SHIRT_SIZE_PRICES } from '../../constants/shirt-price.constant';
import { KeyValue, KeyValuePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShirtPurchase, ShirtSizes } from '../../models/shirt.model';

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
    size: new FormControl<ShirtSizes | null>('S'),
    quantity: new FormControl<number | null>(0)
  })

  SHIRT_SIZE_PRICES = SHIRT_SIZE_PRICES;

  ngOnInit(): void {
    this.shirtSelectorForm.valueChanges.subscribe({
      next: ({ size, quantity }) => {
        if (!size) return;
        if (typeof quantity !== 'number') {

          this.shirtSelectionChange.next({
            sizePrice: SHIRT_SIZE_PRICES[size],
            quantity: 0
          });
          return;
        }
        if (quantity < 0) {
          this.shirtSelectorForm.controls.quantity.setValue(0, { emitEvent: false });
          return;
        }

        let modifiedQuantity = quantity;
        if (quantity !== Math.floor(quantity)) {
          modifiedQuantity = Math.floor(quantity)
          this.shirtSelectorForm.controls.quantity.setValue(modifiedQuantity, { emitEvent: false });
        }

        this.shirtSelectionChange.next({
          sizePrice: SHIRT_SIZE_PRICES[size],
          quantity: modifiedQuantity
        })
      }
    });
  }

  noobCompareFunction(a: KeyValue<string, number>, b: KeyValue<string, number>): number {
    return 0
  }
}
