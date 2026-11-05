import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Guest } from '../../core/models/guest';
import { Rsvp } from '../../core/models/rsvp';
import { CommonModule } from '@angular/common';

import { GuestService } from '../../core/services/guest.service';
import { RsvpService } from '../../core/services/rsvp.service';

import { Location } from '@angular/common';

type RsvpForm = FormGroup<{
  attending: FormControl<boolean>;
  companionCount: FormControl<number>;
  companions: FormArray<FormControl<string>>;
}>;

@Component({
  selector: 'app-rsvp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './rsvp.component.html',
  styleUrl: './rsvp.component.scss'
})
export class RsvpComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly guestService = inject(GuestService);
  private readonly rsvpService = inject(RsvpService);
  private readonly location = inject(Location);

  guest: Guest | null = null;
  previousRsvp: Rsvp | null = null;

  loading = true;
  submitting = false;
  hasPreviousResponse = false;

  errorMessage = '';
  successMessage = '';

  readonly form: RsvpForm = new FormGroup({
    attending: new FormControl(false, { nonNullable: true }),
    companionCount: new FormControl(0, { nonNullable: true }),
    companions: new FormArray<FormControl<string>>([])
  });

  get companions(): FormArray<FormControl<string>> {
    return this.form.controls.companions;
  }

  get companionOptions(): number[] {
    if (!this.guest) {
      return [];
    }

    return Array.from(
      { length: this.guest.maxCompanions + 1 },
      (_, index) => index
    );
  }

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.errorMessage = 'No se encontró el token de la invitación.';
      this.loading = false;
      return;
    }

    try {
      const response = await this.guestService.getInvitation(token);

      this.guest = response.guest;
      this.previousRsvp = response.rsvp;
      this.hasPreviousResponse = !!response.rsvp;

      if (response.rsvp) {
        this.loadPreviousResponse(response.rsvp);
      }
    } catch (error) {
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'No fue posible cargar la invitación.';
    } finally {
      this.loading = false;
    }
  }

  onAttendanceChange(attending: boolean): void {
    if (!attending) {
      this.updateCompanions(0);
    }
  }

  updateCompanions(count: number): void {
    this.companions.clear();

    for (let index = 0; index < count; index++) {
      this.companions.push(
        new FormControl('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.maxLength(150)
          ]
        })
      );
    }

    this.form.controls.companionCount.setValue(count);
  }

  private loadPreviousResponse(rsvp: Rsvp): void {
    this.form.controls.attending.setValue(rsvp.attending);

    if (rsvp.attending) {
      this.updateCompanions(rsvp.companions.length);

      rsvp.companions.forEach((companion, index) => {
        this.companions.at(index).setValue(companion.name);
      });
    }
  }

  async submit(): Promise<void> {
    if (!this.guest) {
      return;
    }

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.errorMessage = 'No se encontró el token de la invitación.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const attending = this.form.controls.attending.value;

      const companions = attending
        ? this.companions.getRawValue()
        : [];

      const response = await this.rsvpService.submit({
        token,
        attending,
        companions
      });

      this.previousRsvp = response.rsvp;
      this.hasPreviousResponse = true;

      this.successMessage = '¡Tu respuesta se registró correctamente!';
    } catch (error) {
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'No fue posible registrar tu respuesta.';
    } finally {
      this.submitting = false;
    }
  }

  goBack() {
    this.location.back();
  }
}
