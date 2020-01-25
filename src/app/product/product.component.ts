import {Component, OnInit} from '@angular/core';
import {CompareItAPIService} from '../shared/services/compareItAPI.service';
import {ActivatedRoute, ParamMap, Params} from '@angular/router';
import {GlobalConfigurationService} from '../shared/services/globalConfiguration.service';
import {Model} from '../shared/models/model';
import {FilterMappingService} from '../shared/services/filterMapping.service';
import {ProductPagineDTO} from '../shared/models/productPagineDTO';
import {MessageService} from 'primeng/api';
import {NgxHotjarService} from 'ngx-hotjar';
import {MatomoTracker} from 'ngx-matomo';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  model: Model;
  productPagineDTO: ProductPagineDTO = new ProductPagineDTO({});

  constructor(
    protected $hotjar: NgxHotjarService,
    private matomoTracker: MatomoTracker,
    private api: CompareItAPIService,
    private route: ActivatedRoute,
    private conf: GlobalConfigurationService,
    private filterService: FilterMappingService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.model = this.conf.modelByType(params.type);
      this.route.queryParamMap.subscribe(queryParams => {
        this.initFilters(queryParams);
      });
      this.search({});
    });
    this.$hotjar.virtualPageView('/product');
    this.matomoTracker.trackPageView(this.constructor.name);
  }

  initFilters(params: ParamMap) {
    params.keys.map(value => {
      this.model.modelProperties.find(p => p.technicalName === value).initFilter(params.get(value));
    });
  }

  search(event) {
    this.productPagineDTO = undefined;
    this.api.getProducts(this.filterService.filterToApi(this.model, event.order, undefined, undefined)).then(
      (productPagineDTO: ProductPagineDTO) => {
        this.productPagineDTO = new ProductPagineDTO(productPagineDTO);
        // Analytics Tracking
        this.matomoTracker.trackEvent('Product', 'getProducts');
      }
    ).catch(() => {
        this.productPagineDTO = new ProductPagineDTO({});
      }
    );

  }

  saveFilter(event) {
    this.api.createFilter(this.filterService.filterToSavedFilter(this.model, event.order, event.alert))
      .then(() => {
        this.messageService.add({severity: 'success', summary: 'Filtre', detail: 'Enregistrement réussi', life: 1000});
      }).catch(() => {
        this.messageService.add({severity: 'error', summary: 'Filtre', detail: 'Echec de l\'enregirstrement', life: 1000});
      }
    );
  }

  paginate(event: any) {
    this.productPagineDTO.pageActuelle = event.page;
    this.productPagineDTO.productsPerPage = event.rows;
  }
}
