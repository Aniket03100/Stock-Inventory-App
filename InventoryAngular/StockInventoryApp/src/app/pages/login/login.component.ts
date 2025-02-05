import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {



  username = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const loginData = { username: this.username, password: this.password };
  
    this.http.post<any>('https://localhost:7176/api/StockInventory/LoginUser', loginData).subscribe(
      (response) => {
        // Check the Result property of the API response
        if (response.result) {
          console.log('Login Successful:', response);
  
          // Optionally store user details for session handling
          //localStorage.setItem('user', JSON.stringify(response.data));
  
          // Redirect to the dashboard
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Login Failed:', response.message);
          alert(response.message || 'Invalid username or password!');
        }
      },
      (error) => {
        console.error('Login Failed:', error);
        alert('An error occurred during login. Please try again.');
      }
    );
  }
  





}
