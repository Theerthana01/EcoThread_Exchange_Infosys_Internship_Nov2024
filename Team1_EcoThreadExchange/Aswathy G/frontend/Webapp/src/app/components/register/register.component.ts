import { Component, inject, ChangeDetectionStrategy, NgModule, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, NgModel } from '@angular/forms'; // Added FormGroup
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule,CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  formbuilder = inject(FormBuilder);
  authService = inject(AuthService);
  errorMessage:string='';
  router = inject(Router);

  registerForm = this.formbuilder.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(5), Validators.required]],
      confirmpassword: ['', [Validators.minLength(5),Validators.required]],
    },
    {
      validators: this.passwordMatchValidator, // Bind the validator function here
    }
  );

  // Password match validator function
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmpassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }
  constructor(private http: HttpClient, private route: Router){}
  register() {
    let user= this.registerForm.value;
      this.authService.register(user.name!, user.email!, user.password!).subscribe({
        next: (result) => {
          this.router.navigate(['/login'])
        },
        error: (error) => {
          if(error.status===400){
            alert(error.error.message || 'An error occured, Please try again.');
            this.router.navigate(['/login']);
          }
          else{
            alert('Server error. Please try again later.');
          }
        },
      });
    }
}
