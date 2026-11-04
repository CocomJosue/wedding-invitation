import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormArray,
  FormBuilder,
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

import { Guest } from '../../core/models/guest';
import { Rsvp } from '../../core/models/rsvp';
import { CommonModule } from '@angular/common';

import { GuestService } from '../../core/services/guest.service';
import { RsvpService } from '../../core/services/rsvp.service';

@Component({
  selector: 'app-rsvp',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './rsvp.component.html',
  styleUrl: './rsvp.component.scss'
})
export class RsvpComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly guestService = inject(GuestService);
  private readonly rsvpService = inject(RsvpService);

  guest: Guest | null = null;
  loading = true;
  errorMessage = '';
  submitted = false;

  form = this.fb.group({
    attending: [true, Validators.required],
    companions: this.fb.array<string>([])
  });

  get companions(): FormArray {
    return this.form.controls.companions;
  }

  ngOnInit(): void {
  const token = this.route.snapshot.paramMap.get('token');

  if (!token) {
    this.errorMessage = 'Invitación no válida.';
    this.loading = false;
    return;
  }

  this.guestService.getByToken(token).subscribe({
    next: guest => {
      this.guest = guest;
      this.loading = false;
    },
    error: () => {
      this.errorMessage = 'No encontramos tu invitación.';
      this.loading = false;
    }
  });
}

  updateCompanions(count: number): void {
    this.companions.clear();

    for (let i = 0; i < count; i++) {
      this.companions.push(
        this.fb.control('', {
          validators: [Validators.required]
        })
      );
    }
  }

  confirmAttendance(): void {
    if (this.form.invalid || !this.guest) {
      this.form.markAllAsTouched();
      return;
    }

    const response: Rsvp = {
      guestId: this.guest.id,
      attending: this.form.controls.attending.value!,
      companions: this.companions.getRawValue()
    };

    this.rsvpService.save(response).subscribe({
      next: () => {
        this.submitted = true;
      },
      error: () => {
        this.errorMessage = 'No fue posible guardar tu respuesta.';
      }
    });
  }
}
