import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GlobalConfigurationService} from '../../shared/services/globalConfiguration.service';
import {SelectItem} from 'primeng/api';
import {Model} from '../../shared/models/model';
import {ModelProperty} from '../../shared/models/modelProperty';
import {AuthenticationService} from '../../shared/services/authentification.service';

@Component({
  selector: 'app-top-filter',
  templateUrl: './top-filter.component.html'
})
export class TopFilterComponent implements OnInit {

  constructor(public config: GlobalConfigurationService, public authenticationService: AuthenticationService) { }

  @Input() model: Model;
  @Output() searchEvent = new EventEmitter();
  @Output() saveFilterEvent = new EventEmitter();

  order: string;
  orderOptions: SelectItem[];

  ngOnInit() {
    this.orderOptions =  this.model.filterableProperties.filter((p) => p.isNumeric)
      .map((p) => {
          return  [
            {label: p.name + ' croissant', value: p.technicalName},
            {label: p.name + ' décroissant', value: '-' + p.technicalName}
          ];
        }
      )
      .reduceRight((previousValue, currentValue) => previousValue.concat(currentValue));
    this.orderOptions.unshift({label: 'Trier par :', value: null});
  }

  get filterableProperties(): ModelProperty[] {
    return this.model.modelProperties.filter((p: ModelProperty) => p.activated && p.filtrable);
  }

  search() {
    this.searchEvent.emit({order: this.order});
  }

  save() {
    this.saveFilterEvent.emit({order: this.order});
  }

}
