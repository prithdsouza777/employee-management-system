import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/auth-interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { ConfirmationService, MessageService } from 'primeng/api';
import MyPreset from './mypreset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    MessageService,
    ConfirmationService,
    provideAnimationsAsync(),
    providePrimeNG( {
      theme: {
                preset: MyPreset,
                options: {
                    darkModeSelector: false || 'none'
                }
            }
          }
    ),
  ]
};
