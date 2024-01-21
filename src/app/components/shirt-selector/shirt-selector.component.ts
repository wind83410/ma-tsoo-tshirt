import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  @Input() size?: ShirtSizes;
  @Input() quantity?: number;

  @Output() shirtSelectionChange: EventEmitter<ShirtPurchase> = new EventEmitter<ShirtPurchase>();

  shirtSelectorForm = new FormGroup({
    size: new FormControl<ShirtSizes | null>('S'),
    quantity: new FormControl<number | null>(0)
  })

  SHIRT_SIZE_PRICES = SHIRT_SIZE_PRICES;

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if ('size' in changes || 'quantity' in changes) {
      this.updateShirtInfo()
    }
  }

  ngOnInit(): void {
    this.shirtSelectorForm.valueChanges.subscribe({
      next: ({ size, quantity }) => {
        if (!size) return;
        if (typeof quantity !== 'number') {
          this.shirtSelectionChange.next({
            size,
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
          size,
          sizePrice: SHIRT_SIZE_PRICES[size],
          quantity: modifiedQuantity
        })
      }
    });
  }

  noobCompareFunction(a: KeyValue<string, number>, b: KeyValue<string, number>): number {
    return 0
  }

  private updateShirtInfo() {
    this.shirtSelectorForm.setValue({
      size: this.size || 'S',
      quantity: this.quantity || 0
    });
  }
}
