import { Injectable } from '@angular/core';
import { StorageKey } from '@util/storage-key.enum';

@Injectable({
    providedIn: 'root'
})
export class InstallPromptService {
    // Initialize deferredPrompt for use later to show browser install prompt.
    private deferredPrompt?: BeforeInstallPromptEvent;
    private appInstalled?: boolean;
    private appInstallDeclined: boolean;

    constructor() {
        // Unfortunately a @HostListener('window:beforeinstallprompt', ['$event']) does not work in services
        window.addEventListener(
            'beforeinstallprompt',
            (event: Event) => {
                // Prevent Chrome 67 and earlier from automatically showing the prompt
                event.preventDefault();
                // Stash the event so it can be triggered later.
                this.deferredPrompt = event as BeforeInstallPromptEvent;
            }
        );

        // Unfortunately a @HostListener('window:appinstalled') does not work in services
        window.addEventListener(
            'appinstalled',
            () => {
                this.appInstalled = true;
                this.deferredPrompt = undefined;
            }
        );

        this.appInstallDeclined = localStorage.getItem(StorageKey.AppInstallDeclined) === String(true);
    }

    canBeInstalled(): boolean {
        return !this.appInstalled && this.deferredPrompt !== undefined;
    }

    addToHomeScreen(): void {
        if (this.deferredPrompt && !this.appInstalled && !this.appInstallDeclined) {
            // Show the prompt
            this.deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            this.deferredPrompt.userChoice
                .then((choiceResult: UserChoice) => {
                    if (choiceResult.outcome === 'dismissed') {
                        localStorage.setItem(StorageKey.AppInstallDeclined, String(true));
                    }

                    this.deferredPrompt = undefined;
                });
            return;
        }
    }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<UserChoice>;
    prompt(): Promise<void>;
}

type UserChoice = {
    outcome: 'accepted' | 'dismissed';
};
