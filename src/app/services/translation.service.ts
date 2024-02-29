import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en-gb'; // dayjs: en is default
import _ from 'lodash';
import { AsyncSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private afterInit$: AsyncSubject<void> = new AsyncSubject<void>();
    private language!: ILanguageFlag;
    private languages: Array<ILanguageFlag> = SUPPORTED_LANGUAGES;
    private langChange$: Subject<ILanguageFlag> = new Subject();

    /**
     * Service Constructor
     */
    constructor(
        private translateService: TranslateService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.init();
    }

    public init(): void {
        // Sets the default language to english if user have not select any language
        // should check the browser language and use that instead
        const key: string = this.loadSavedLangKey() ?? this.getDefaultBrowserLanguage();
        this.setLanguage(key);

        this.afterInit$.next(undefined);
        this.afterInit$.complete();
    }

    onLangChange(): Observable<ILanguageFlag> {
        return this.langChange$.asObservable();
    }

    getAllLanguages(): Array<ILanguageFlag> {
        return this.languages;
    }

    /**
     * Setup language
     *
     *
     * @param langKey: string
     */
    // Sets the language to the desired language if it is supported or is set to english
    setLanguage(langKey?: string): ILanguageFlag {
        let lang: ILanguageFlag | false;
        if (langKey && (lang = this.isLanguageSupported(langKey))) {
            this.language = lang;
        }
        else {
            this.language = this.returnFallbackLanguage();
        }

        this.language.active = true;

        this.document.documentElement.lang = this.language.key;
        this.translateService.use(this.language.key);
        this.langChange$.next(this.language);
        this.translateService.setDefaultLang(this.language.key);

        this.setDayjsLocale(this.language.dateLocale);

        this.saveSelectedLangKey();

        return this.language;
    }

    getCurrentLanguage(): ILanguageFlag {
        return { ...this.language };
    }

    getDefaultBrowserLanguage(): string {
        let browserLang: string | undefined = this.translateService.getBrowserLang();
        if (!browserLang) {
            browserLang = this.returnFallbackLanguage().key;
        }
        return browserLang;
    }

    private returnFallbackLanguage(): ILanguageFlag {
        return SUPPORTED_LANGUAGE_EN;
    }

    private setDayjsLocale(locale: string): void {
        dayjs.locale(locale);
    }

    private loadSavedLangKey(): string | null {
        const savedKey: string | null = localStorage.getItem('language');
        return savedKey;
    }

    private saveSelectedLangKey(): void {
        localStorage.setItem('language', this.language.key);
    }

    private isLanguageSupported(languageKeyOrFlag: string | ILanguageFlag): false | ILanguageFlag {
        if (_.isString(languageKeyOrFlag)) {
            return SUPPORTED_LANGUAGES.find((item: ILanguageFlag) => item.key === languageKeyOrFlag) ?? false;
        }
        return SUPPORTED_LANGUAGES.find((item: ILanguageFlag) => _.isEqual(languageKeyOrFlag, item)) ?? false;
    }
}

export interface ILanguageFlag {
    key: string;
    name: string;
    nativeName: string;
    fullLocale: string;
    dateLocale: string;
    active?: boolean;
}

export const SUPPORTED_LANGUAGE_EN: ILanguageFlag = {
    key: 'en',
    name: 'English',
    nativeName: 'English',
    fullLocale: 'en-GB',
    dateLocale: 'en-gb'
};

export const SUPPORTED_LANGUAGE_DE: ILanguageFlag = {
    key: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    fullLocale: 'de-DE',
    dateLocale: 'de'
};

export const SUPPORTED_LANGUAGES: Array<ILanguageFlag> = [
    SUPPORTED_LANGUAGE_EN,
    SUPPORTED_LANGUAGE_DE
];
