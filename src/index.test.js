import plugin from './index.js';
import pluginTester from 'babel-plugin-tester';

pluginTester({
    plugin,
    pluginOptions: {
        source: '@foo/path-utils',
        findName: 'join',
        replaceName: 'joinPath',
    },
    snapshot: true,
    tests: [
        `import {join} from '@foo/path-utils';
join('a','b');
notJoin();
`,
        `import {join as joinPath} from '@foo/path-utils';
joinPath('a','b');
`,
        `import * as pathUtils from '@foo/path-utils';
pathUtils.join('a','b');
pathUtils.notJoin();
`,
        `import {join as pathJoiner} from '@foo/path-utils';
pathJoiner('a','b');
`,
        `import {join} from 'not-path-utils';
join('a','b');
`,
        {
            title: 'codemod-should be configurable',
            pluginOptions: {
                source: 'baz',
                findName: 'foo',
                replaceName: 'bar',
            },
            code: `import {foo} from 'baz';
    foo('thing', true, 1234);
    `,
        },
        {
            title: 'Throws error with missing options',
            pluginOptions: {
                source: null,
                findName: null,
                replaceName: null,
            },
            snapshot: false,
            code: `import foo from 'bar';`,
            error: 'Error: babel-plugin-rename-imports - missing options',
        },
    ],
});
