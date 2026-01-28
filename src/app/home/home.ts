import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  contact = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  contactSubmitted = false;

  scrollToContact() {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onSubmitContact() {
    console.log('Contact form submitted:', this.contact);
    this.contactSubmitted = true;

    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      this.contact = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      };
      this.contactSubmitted = false;
    }, 3000);
  }
}

