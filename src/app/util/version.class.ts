import dayjs, { Dayjs } from 'dayjs';

export class DndVersion {
    private appVersion: string;
    private buildNo: number;
    private buildTime: Dayjs;

    constructor(
        appVersion: string,
        buildNo: number,
        buildTime: number
    ) {
        this.appVersion = appVersion;
        this.buildNo = buildNo;
        this.buildTime = dayjs.unix(buildTime);
    }

    toString(): string {
        return `${this.appVersion}+${this.buildNo} (${this.buildTime.format()})`;
    }
}
