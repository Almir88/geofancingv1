import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    lozinka: ['', [Validators.required, Validators.minLength(6)]],
    zaboravljenaLozinka: [false],
  });
  protected errorMessage = '';
  protected loading = false;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.loading = true;
    this.auth
      .login({
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.lozinka.value,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          if (this.auth.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Prijava nije uspjela. Pokušajte ponovo.';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message ?? 'Prijava nije uspjela. Pokušajte ponovo.';
        },
      });
  }
}
