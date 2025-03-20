import { Component, EventEmitter, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';
type ButtonType = 'button' | 'submit' | 'reset';
type ButtonSize = 'sm' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {

  type = input<ButtonType>('button');
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>();
  disabled = input<boolean>(false);

  onClick = output<MouseEvent>();
}
