import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit {
  title = 'StockInventoryApp';
  isLoginPage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is the login page
        this.isLoginPage = event.urlAfterRedirects === '/login';
      }
    });
  }




  onLogoutClick(event: Event): void {
    event.preventDefault(); // Prevent the default anchor click behavior

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your session!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Navigate to the login page
        this.router.navigate(['/login']);
        Swal.fire('Logged Out', 'You have been logged out successfully.', 'success');
      }
    });
  }
}