import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-registracija',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registracija.component.html',
  styleUrl: './registracija.component.scss',
})
export class RegistracijaComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly registrationForm = this.fb.nonNullable.group({
    ime: ['', Validators.required],
    prezime: ['', Validators.required],
    kompanija: [''],
    email: ['', [Validators.required, Validators.email]],
    brojTelefona: [''],
    lozinka: ['', [Validators.required, Validators.minLength(6)]],
    potvrdaLozinke: ['', Validators.required],
  });
  protected errorMessage = '';
  protected loading = false;

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    const { lozinka, potvrdaLozinke } = this.registrationForm.getRawValue();
    if (lozinka !== potvrdaLozinke) {
      this.errorMessage = 'Lozinke se ne podudaraju.';
      return;
    }
    this.errorMessage = '';
    this.loading = true;
    const name =
      [this.registrationForm.controls.ime.value, this.registrationForm.controls.prezime.value]
        .filter(Boolean)
        .join(' ') || undefined;
    this.auth
      .register({
        email: this.registrationForm.controls.email.value,
        password: lozinka,
        name: name || undefined,
      })
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message ?? 'Registracija nije uspjela. Pokušajte ponovo.';
        },
      });
  }
}
