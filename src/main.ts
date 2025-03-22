import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { provideRouter, RouterOutlet, RouterLink } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { AuthService } from './app/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './app/components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <nav class="navbar" *ngIf="authService.currentUser | async">
        <div class="navbar-brand">
          <a routerLink="/" class="brand">SPACES</a>
        </div>
        <button class="mobile-menu-btn" (click)="toggleMenu()">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
        <div class="navbar-menu" [class.active]="isMenuOpen">
          <a routerLink="/" class="nav-link">HOME</a>
          <a routerLink="/about" class="nav-link">ABOUT</a>
          <a routerLink="/contact" class="nav-link">CONTACT</a>
          <button class="logout-btn" (click)="logout()">LOGOUT</button>
        </div>
      </nav>
      <app-notifications></app-notifications>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    .navbar-brand {
      flex-shrink: 0;
    }

    .brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: #6b46c1;
      text-decoration: none;
      letter-spacing: 0.05em;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-link {
      color: #4a5568;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }

    .nav-link:hover {
      color: #6b46c1;
    }

    .logout-btn {
      background-color: transparent;
      color: #6b46c1;
      border: 1px solid #6b46c1;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .logout-btn:hover {
      background-color: #6b46c1;
      color: white;
    }

    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 21px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 10;
    }

    .bar {
      width: 100%;
      height: 3px;
      background-color: #6b46c1;
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: flex;
      }

      .navbar-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background-color: white;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        gap: 1rem;
      }

      .navbar-menu.active {
        display: flex;
      }

      .nav-link {
        width: 100%;
        text-align: center;
        padding: 0.5rem 0;
      }

      .logout-btn {
        width: 100%;
      }
    }
  `],
  imports: [RouterOutlet, RouterLink, CommonModule, NotificationsComponent],
  standalone: true
})
export class App {
  isMenuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
}).catch(err => console.error(err));