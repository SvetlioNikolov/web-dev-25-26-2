import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    InputTextModule,
    ButtonModule,
    MessageModule,
    ReactiveFormsModule,
    TableModule,
    Select,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  registrationForm: FormGroup;
  users: Array<{ firstName: string; lastName: string; email: string; university: string }> = [];
  universities = [
    { label: 'Harvard University', value: 'Harvard University' },
    { label: 'Stanford University', value: 'Stanford University' },
    { label: 'MIT', value: 'MIT' },
    { label: 'Oxford University', value: 'Oxford University' },
    { label: 'Cambridge University', value: 'Cambridge University' },
    { label: 'Yale University', value: 'Yale University' },
    { label: 'Princeton University', value: 'Princeton University' }
  ];
  domains = ['@edu.com', '@university.edu'];
  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      university: ['', [Validators.required]]
    });
  }
  
  onSubmit() {
    if (this.registrationForm.valid) {
      if(this.domains.findIndex((el) => this.registrationForm.value.email.includes(el)) != -1) {
        if(this.users.findIndex((el) => this.registrationForm.value.email == el.email) == -1) {
          this.users.push(this.registrationForm.value);
          console.log('User added:', this.registrationForm.value);
          console.log('All users:', this.users);
          this.registrationForm.reset();
        } else {
          this.registrationForm.get('email')?.setErrors({ duplicate: true })
        }
      } else {
        this.registrationForm.get('email')?.setErrors({ domain: true })
      }
    }else {
      this.registrationForm.markAllAsTouched();
    }
  }

  removeUser(delEmail: string) {
    if(confirm('Are you sure you want to delete?')){
      var index = this.users.findIndex(u =>u.email ===delEmail);
      this.users.splice(index,1);
    }
  }
  
  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    console.log(field?.errors)
    if (field?.touched && field?.invalid) {
      if (field.errors?.['required']) {
        return 'This field is required';
      }
      if (field.errors?.['minlength']) {
        return 'Minimum length is 2 characters';
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email';
      }
      if (field.errors?.['domain']) {
        return 'The domain is not allowed!';
      }
      if (field.errors?.['duplicate']) {
        return 'This email already exists!';
      }
    }
    return '';
  }
}
