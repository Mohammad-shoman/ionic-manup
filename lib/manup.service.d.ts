import { ManUpConfig } from './manup.config';
import { HttpClient } from "@angular/common/http";
import { AlertController, Platform } from "@ionic/angular";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Storage } from '@ionic/storage';
import { AppVersion } from "@ionic-native/app-version/ngx";
/**
 * DI InjectionToken for optional ngx-translate
 */
export declare const TRANSLATE_SERVICE: any;
/**
 * The types of alerts we may present
 */
export declare enum AlertType {
    /**
     * A mandatory update is required
     */
    MANDATORY = 0,
    /**
     * An optional update is available
     */
    OPTIONAL = 1,
    /**
     * The app is disabled
     */
    MAINTENANCE = 2,
    /**
     * Nothing to see here
     */
    NOP = 3
}
export interface PlatformData {
    minimum: string;
    latest: string;
    url: string;
    enabled: boolean;
}
/**
 * What the metadata object should look like
 */
export interface ManUpData {
    ios?: PlatformData;
    android?: PlatformData;
    windows?: PlatformData;
}
export declare class ManUpService {
    private config;
    private http;
    private alert;
    private platform;
    private iab;
    private AppVersion;
    private translate;
    private storage;
    constructor(config: ManUpConfig, http: HttpClient, alert: AlertController, platform: Platform, iab: InAppBrowser, AppVersion: AppVersion, translate: any, storage: Storage);
    /**
     * Loads the translations into the translation service.
     *
     * * Loads the language requested, if available
     * * Loads the default lang, if we have it
     * * Loads english into the default lang as a last resort
     */
    loadTranslations(): void;
    /**
     * True if there is an alert already displayed. Used to prevent multiple alerts
     * being presented on top of one another
     */
    private inProgress;
    /**
     * A reference to the current unresolved promise
     */
    private currentPromise;
    /**
     * Begins the manup check process.
     *
     * @Returns a promise that resolves if the app is able to continue.
     */
    validate(): Promise<any>;
    /**
     * Evaluates what kind of update is required, if any.
     *
     * Returns a promise that resolves with an alert type.
     */
    evaluate(metadata: PlatformData): Promise<AlertType>;
    /**
     * Fetches the remote metadata and returns an observable with the json
     */
    metadata(): Promise<ManUpData>;
    /**
     * Gets the version metadata from storage, if available.
     *
     * @private
     * @throws An error if the service was instantiated without a Storage component.
     * @returns {Promise<any>} That resolves with the metadata
     *
     * @memberOf ManUpService
     */
    metadataFromStorage(): Promise<ManUpData>;
    /**
     *
     * Saves the metadata to storage.
     *
     * @private
     * @param {ManUpData} metadata The metadata to store
     * @throws {Error} if storage if not configured
     * @returns {Promise<any>} A promise that resolves when the save succeeds
     *
     * @memberOf ManUpService
     */
    saveMetadata(metadata: ManUpData): Promise<any>;
    /**
     * Returns the branch of the metadata relevant to this platform
     */
    getPlatformData(metadata: ManUpData): PlatformData;
    /**
     * Presents an update alert.
     *
     * @param type The type of alert to show
     * @param platformData The metadata for the platform
     *
     * @returns A promise that resolves when this whole thing is over.
     */
    presentAlert(type: AlertType, platformData: any): Promise<any>;
    /**
     * Displays a maintenance mode alert.
     *
     * @returns a promise that will never resolve, because the app should not continue
     */
    presentMaintenanceMode(): Promise<any>;
    /**
     * Displays a mandatory update alert.
     *
     * @returns a promise that will never resolve, because the app should not continue
     */
    presentMandatoryUpdate(platformData: any): Promise<any>;
    /**
     * Displays an optional update alert.
     *
     * @returns a promise that will resolves if the user selects 'not now'
     */
    presentOptionalUpdate(platformData: any): Promise<any>;
}
