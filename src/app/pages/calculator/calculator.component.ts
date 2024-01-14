import { Component, WritableSignal, computed, signal } from '@angular/core';
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

  totalNumberOfShirts = computed(() => this.calculateTotalNumberOfShirts(this.shirtPurchases()));
  totalPricesForShirts = computed(() => this.calculateTotalAmountForShirtsOnly(this.shirtPurchases()));
  deliveryFee = computed(() => {
    const numberOfShirts = this.totalNumberOfShirts();
    return numberOfShirts > 0 && numberOfShirts < 3 ? 90 : 0
  })
  totalAmount = computed(() => this.totalPricesForShirts() + this.deliveryFee());

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

  private calculateTotalNumberOfShirts(purchases: ShirtPurchase[]): number {
    return purchases.reduce<number>((acc, purchase) => {
      const { quantity } = purchase;
      acc += quantity;
      return acc
    }, 0);
  }

  private calculateTotalAmountForShirtsOnly(purchases: ShirtPurchase[]): number {
    return purchases.reduce<number>((acc, purchase) => {
      const { quantity, sizePrice } = purchase
      acc += quantity * sizePrice;
      return acc
    }, 0);
  }
}
