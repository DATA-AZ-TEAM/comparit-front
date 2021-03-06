import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from '../../shared/models/product';
import {GlobalConfigurationService} from '../../shared/services/globalConfiguration.service';
import {Router} from '@angular/router';
import {Model} from '../../shared/models/model';
import {NgxHotjarService} from 'ngx-hotjar';
import {MatomoService} from '../../shared/services/Matomo.service';
import {ModelProperty} from '../../shared/models/modelProperty';
import {CompareItAPIService} from '../../shared/services/compareItAPI.service';

@Component({
  selector: 'app-resume-product',
  templateUrl: './resume-product.component.html'
})
export class ResumeProductComponent implements OnInit {

  @Input() product: Product;
  @Input() model: Model;
  @Output() selectForComparison = new EventEmitter();
  properties: {key: ModelProperty, value: string}[];
  productRate: number;

  constructor(
    protected $hotjar: NgxHotjarService,
    private matomoTracker: MatomoService,
    private router: Router,
    private api: CompareItAPIService,
    public config: GlobalConfigurationService) { }


  ngOnInit() {
    this.$hotjar.virtualPageView('/products/one');
    this.matomoTracker.trackPageView(this.constructor.name);
    this.properties = Object.keys(this.product.properties).map((key: string) => {
      return {key: this.config.propertyByModelAndName(this.model.technicalName, key), value: this.product.properties[key]};
    });
    this.api.getAvgByProductId(this.product.id).then((reviewrate: number) => {
      this.productRate = reviewrate;
    });
  }


  goToProduct(idProduct: string) {
    this.router.navigate(['/products/' + this.model.technicalName + '/' + idProduct]);
    // Analytics Tracking
    this.matomoTracker.trackEvent('Product',  'goToProduct', this.product.name );
  }

  get visibleProperties() {
    return this.properties.filter((p: {key: ModelProperty, value: string}) => p.key.activated);
  }
}
