/**
 * Analytics Action Types
 * 
 * Replaces the Prisma enum which is not available in SQLite
 */
export enum ActionType {
    PAGE_VIEW = 'PAGE_VIEW',
    BUTTON_CLICK = 'BUTTON_CLICK',
    FORM_SUBMIT = 'FORM_SUBMIT',
    SHARE = 'SHARE',
    DOWNLOAD = 'DOWNLOAD'
}
