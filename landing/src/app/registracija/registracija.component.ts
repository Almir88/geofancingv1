import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registracija',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registracija.component.html',
  styleUrl: './registracija.component.scss',
})
export class RegistracijaComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly registrationForm = this.fb.nonNullable.group({
    ime: ['', Validators.required],
    prezime: ['', Validators.required],
    kompanija: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    brojTelefona: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    console.log('Registracija:', this.registrationForm.getRawValue());
  }
}
