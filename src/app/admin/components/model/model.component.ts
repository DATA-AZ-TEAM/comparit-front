import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Model} from 'src/app/shared/models/model';
import {ModelProperty} from 'src/app/shared/models/modelProperty';
import {ConfirmationService} from 'primeng/api';


@Component({
  selector: 'app-model',
  templateUrl: './model.component.html'
})
export class ModelComponent implements OnInit {
  submitted = false;
  @Input() model: Model;
  @Input() index: number;
  @Input() modelindex: number;
  @Output() deleteModel = new EventEmitter<Model>();


  constructor(private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    if (this.model.modelProperties.length === 0) {
      this.model.modelProperties.push(this.initializeModelProperty( 'Nom', 'name', true, 'ENUMERATIVE' , true, true, true));
      this.model.modelProperties.push(this.initializeModelProperty( 'Description', 'description', true, 'ENUMERATIVE' , true, true, true));
      this.model.modelProperties.push(this.initializeModelProperty( 'Prix', 'price', true, 'NUMERIC' , true, true, true));
      this.model.modelProperties.push(this.initializeModelProperty( 'Image', 'imgUrl', false, 'ENUMERATIVE' , false, false, false));

    }
  }

  delete(model: Model) {
    this.deleteModel.emit(model);

  }

  createModelProprety(): ModelProperty {
    return new ModelProperty();
  }

  addModelProperty() {
    this.model.modelProperties.push(this.createModelProprety());
  }

  deleteModelProperty(event: ModelProperty) {
    this.confirmationService.confirm({
      message: 'Voulez-vous supprimer cette propriété ?',
      accept: () => {
        this.model.modelProperties = this.model.modelProperties.filter(obj => obj !== event);
      }
    });
  }

  // tslint:disable-next-line:max-line-length
  initializeModelProperty(name: string, technicalName: string, activated: boolean, type: string, filtrable: boolean, filtrableAdvanced: boolean, mandatory: boolean): ModelProperty {
    const modelProprety: ModelProperty = new ModelProperty()
    modelProprety.name = name;
    modelProprety.technicalName = technicalName;
    modelProprety.activated = activated;
    modelProprety.type = type;
    modelProprety.filtrable = filtrable;
    modelProprety.filtrableAdvanced = filtrableAdvanced;
    modelProprety.mandatory = mandatory;
    return modelProprety;
  }

}
