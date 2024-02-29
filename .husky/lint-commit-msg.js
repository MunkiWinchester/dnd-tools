const process = require('process');
const fs = require('fs');

main(process.argv[2]);

function main(commitMsgFilePath) {
    try {
        const commitMsgContent = fs.readFileSync(commitMsgFilePath, 'utf-8');
        lint(commitMsgContent);
    } catch (err) {
        console.error('Linting commit message failed!');
        console.error(err.message);
        process.exit(1);
    }
}

function lint(commitMsgContent) {
    const isMergeOrRelease = mergeOrReleaseMsg(commitMsgContent);
    const isConventional = conventionalMsg(commitMsgContent);
    if (isMergeOrRelease || isConventional) {
        return true;
    }

    throw new Error(
        'Your commit message must be conventional.\nHave a look at https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines'
    );
}

function mergeOrReleaseMsg(commitMsgContent) {
    return !!commitMsgContent.match(/^(merge|(chore\(release\)\:))/gm);
}

function conventionalMsg(commitMsgContent) {
    return !!commitMsgContent.match(/^(build|chore|ci|docs|feat|fix|perf|refactor|style|test|improvement)(?:\((.+)\))*(!?)?:\s(.*)\n*((?:.*\n*))((?:#\d+\s*)*)+$/gm);
}
