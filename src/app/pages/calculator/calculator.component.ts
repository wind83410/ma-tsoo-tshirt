import { Component, Signal, WritableSignal, computed, signal } from '@angular/core';
import { ShirtPurchase } from '../../models/shirt.model';
import { ShirtSelectorComponent } from '../../components/shirt-selector/shirt-selector.component';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [ShirtSelectorComponent],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {

  shirtPurchases: WritableSignal<ShirtPurchase[]> = signal([
    { sizePrice: 1100, quantity: 0 }
  ]);

  totalAmount = computed(() => this.calculateTotalAmount(this.shirtPurchases()));

  constructor(
  ) {
    return;
  }

  updateShirtPurchase(newValue: ShirtPurchase, currentValue: ShirtPurchase): void {
    currentValue.quantity = newValue.quantity;
    currentValue.sizePrice = newValue.sizePrice;
    this.shirtPurchases.set([...this.shirtPurchases()]);
  }

  removeShirtPurchase(index: number): void {
    const array = this.shirtPurchases();
    array.splice(index, 1);
    this.shirtPurchases.set([...array])
  }

  addShirtPurchase(index: number): void {
    const array = this.shirtPurchases();
    array.splice(index + 1, 0, this.generateNewShirtPurchase());
    this.shirtPurchases.set([...array]);
  }

  private generateNewShirtPurchase(): ShirtPurchase {
    return { sizePrice: 1100, quantity: 0 }
  }

  private calculateTotalAmount(purchases: ShirtPurchase[]): number {
    const { priceOfAllShirts, totalNumberOfShirts } = purchases.reduce<{ priceOfAllShirts: number; totalNumberOfShirts: number }>((acc, onePurchase) => {
      const { quantity, sizePrice } = onePurchase
      acc.priceOfAllShirts += quantity * sizePrice;
      acc.totalNumberOfShirts += quantity
      return acc
    }, {
      priceOfAllShirts: 0,
      totalNumberOfShirts: 0
    });
    return priceOfAllShirts + (totalNumberOfShirts > 3 || totalNumberOfShirts === 0 ? 0 : 90);
  }
}
