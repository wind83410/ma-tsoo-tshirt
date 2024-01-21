import { Component, WritableSignal, computed, signal } from '@angular/core';
import { ShirtPurchase, ShirtSizes } from '../../models/shirt.model';
import { ShirtSelectorComponent } from '../../components/shirt-selector/shirt-selector.component';
import { ActivatedRoute } from '@angular/router';
import { SHIRT_SIZE_PRICES } from '../../constants/shirt-price.constant';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [ShirtSelectorComponent],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {

  shirtPurchases: WritableSignal<ShirtPurchase[]> = signal<ShirtPurchase[]>([]);

  totalNumberOfShirts = computed(() => this.calculateTotalNumberOfShirts(this.shirtPurchases()));
  totalPricesForShirts = computed(() => this.calculateTotalAmountForShirtsOnly(this.shirtPurchases()));
  deliveryFee = computed(() => {
    const numberOfShirts = this.totalNumberOfShirts();
    return numberOfShirts > 0 && numberOfShirts < 3 ? 90 : 0
  })
  totalAmount = computed(() => this.totalPricesForShirts() + this.deliveryFee());

  constructor(
    private route: ActivatedRoute
  ) {
    return;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.initializeShirtPurchases();
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

  private extractShirtQuantityFromRoute(): ShirtPurchase[] {
    const queries = this.route.snapshot.queryParams;
    const shirtSizeArray: ShirtSizes[] = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
    return shirtSizeArray.reduce<ShirtPurchase[]>((acc, size) => {
      if (size in queries && !Number.isNaN(parseInt(queries[size]))) {
        acc.push({
          size,
          sizePrice: SHIRT_SIZE_PRICES[size],
          quantity: parseInt(queries[size])
        })
      }
      return acc
    }, [])
  }

  private initializeShirtPurchases(): void {
    const shirtPurchases = this.extractShirtQuantityFromRoute();
    if (shirtPurchases.length === 0) {
      this.shirtPurchases.set([this.generateNewShirtPurchase()]);
      return;
    }
    this.shirtPurchases.set(shirtPurchases);
  }

  private generateNewShirtPurchase(): ShirtPurchase {
    return { size: 'S', sizePrice: 1100, quantity: 0 }
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
