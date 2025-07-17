import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UiComponents {
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  success(summary: string, detail?: string, life = 3000) {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life
    });
  }

  error(summary: string, detail?: string, life = 4000) {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life
    });
  }

  confirmDelete(
    event: Event,
    message: string = 'Do you want to delete this record?',
    header: string = 'Danger Zone'
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message,
        header,
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Delete',
          severity: 'danger',
        },
        accept: () => resolve(true),
        reject: () => resolve(false)
      });
    });
  }
}
