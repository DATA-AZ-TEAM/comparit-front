import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ModelProperty } from 'src/app/shared/models/model-property';
import {GlobalConfigurationService} from 'src/app/shared/services/globalConfiguration.service';

@Component({
  selector: 'app-model-property',
  templateUrl: './model-property.component.html',
  styleUrls: ['./model-property.component.scss']
})
export class ModelpropertyComponent implements OnInit {
    dynamicForm: FormGroup;
    @Input() modelProperty: ModelProperty;


  constructor(
    private formBuilder: FormBuilder,
    private globalconfigurationService: GlobalConfigurationService
    ) {}

  ngOnInit() {
    this.dynamicForm = this.formBuilder.group({
      numberOfModels: ['', Validators.required],
      Models: new FormArray([])
  });
  }

  // convenience getters for easy access to form fields
get f() { return this.dynamicForm.controls; }
get t() { return this.f.Models as FormArray; }

onChangeModels(e) {
    const numberOfModels = e.target.value || 0;
    if (this.t.length < numberOfModels) {
        for (let i = this.t.length; i < numberOfModels; i++) {
            this.t.push(this.formBuilder.group({   
            }));
            //let mp:ModelProperty = new ModelProperty;
            //this.globalconfigurationService.model.push(mp);
            
        }
    } else {
        for (let i = this.t.length; i >= numberOfModels; i--) {
            this.t.removeAt(i);
        }
    }
}

}
