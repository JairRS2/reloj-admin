import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  username: string | null = null; // Store the user's name

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username'); // Retrieve the name from localStorage
  }

  logout() {
    localStorage.removeItem('authToken'); // Remove auth token
    localStorage.removeItem('username'); // Remove username
    this.router.navigate(['/login']); // Redirect to login
  }
}
