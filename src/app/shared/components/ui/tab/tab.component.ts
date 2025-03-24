import { Component, Input } from '@angular/core';
import { Step } from '@core/domain/models/workflow.model';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss'
})
export class TabComponent {
  @Input() steps: Step[] = [];
  @Input() currentStep = 0;
}
