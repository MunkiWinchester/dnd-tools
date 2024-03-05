import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import packageJson from '../package.json';
import { IData } from '../src/app/util/data.interface';
import dataJson from '../src/assets/data/data.json';

function run(): void {
    const data: IData = {
        // Load with values from data.json
        ...dataJson
    };

    data.BUILD_NO = data.BUILD_NO + 1;
    data.BUILD_TIME = dayjs()
        .unix();
    data.BUILD_VERSION = packageJson.version;

    fs.writeFileSync(
        path.resolve(__dirname, '../src/assets/data/data.json'),
        JSON.stringify(data, undefined, 4)
    );

    // eslint-disable-next-line no-console
    console.log('Successfully bumped the version.');
}

run();
