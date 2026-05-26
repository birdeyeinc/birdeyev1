/**
 * IcoMoon Sync Script
 *
 * Downloads icomoon font files from cdn.icomoon.io into src/assets/icomoon/.
 * Run this whenever designers publish updated icons in the IcoMoon app.
 *
 * Usage:
 *   node scripts/sync-icomoon.js             # Sync all projects
 *   node scripts/sync-icomoon.js phoenix     # Sync only phoenix
 *
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const HOST_ID = '101518';
const BASE_URL = `https://cdn.icomoon.io/${HOST_ID}`;
const MAX_REDIRECTS = 5;
const ALLOWED_HOSTS = new Set(['cdn.icomoon.io']);

const PROJECTS = {
    phoenix: {
        name: 'phoenix',
        targetDir: path.join(__dirname, '../src/assets/icomoon/phoenix'),
        // style.css is saved as _style.scss so Sass inlines it at build time
        // instead of emitting a CSS @import that breaks in consuming apps.
        files: [
            { src: 'selection.json', dest: 'selection.json' },
            { src: 'style.css',      dest: '_style.scss'    },
            { src: 'icomoon.eot',    dest: 'icomoon.eot'    },
            { src: 'icomoon.svg',    dest: 'icomoon.svg'    },
            { src: 'icomoon.ttf',    dest: 'icomoon.ttf'    },
            { src: 'icomoon.woff',   dest: 'icomoon.woff'   },
            { src: 'icomoon.woff2',  dest: 'icomoon.woff2'  },
        ]
    }
};

function get(url, redirectsLeft = MAX_REDIRECTS) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
                if (redirectsLeft === 0) {
                    return reject(new Error(`Too many redirects for ${url}`));
                }
                const location = res.headers.location;
                let redirectUrl;
                try {
                    redirectUrl = new URL(location, url);
                } catch {
                    res.resume();
                    return reject(new Error(`Invalid redirect location: ${location}`));
                }
                if (redirectUrl.protocol !== 'https:' || !ALLOWED_HOSTS.has(redirectUrl.hostname)) {
                    res.resume();
                    return reject(new Error(`Redirect to disallowed host blocked: ${redirectUrl.hostname}`));
                }
                res.resume(); // discard body
                return get(redirectUrl.href, redirectsLeft - 1).then(resolve, reject);
            }
            resolve(res);
        }).on('error', reject);
    });
}

function downloadFile(projectName, srcFile, destPath) {
    const fileUrl = `${BASE_URL}/${projectName}/${srcFile}`;

    return new Promise((resolve, reject) => {
        get(fileUrl)
            .then((res) => {
                if (res.statusCode !== 200) {
                    res.resume();
                    return reject(new Error(`HTTP ${res.statusCode} for ${srcFile}`));
                }

                const fileStream = fs.createWriteStream(destPath);

                res.on('error', (err) => {
                    fileStream.destroy();
                    fs.unlink(destPath, () => {});
                    reject(new Error(`Stream error for ${srcFile}: ${err.message}`));
                });

                fileStream.on('error', (err) => {
                    fs.unlink(destPath, () => {});
                    reject(new Error(`Write error for ${srcFile}: ${err.message}`));
                });

                fileStream.on('finish', () => {
                    console.log(`  ✓ ${srcFile}${destPath.endsWith('_style.scss') ? ' → _style.scss' : ''}`);
                    resolve();
                });

                res.pipe(fileStream);
            })
            .catch((err) => reject(new Error(`Network error for ${srcFile}: ${err.message}`)));
    });
}

/**
 * Post-process the downloaded style CSS (saved as _style.scss):
 * - Replace absolute CDN URLs with relative filenames
 * - Strip version query strings, preserving #iefix fragments (needed for EOT in IE)
 */
function fixStylePaths(targetDir) {
    const stylePath = path.join(targetDir, '_style.scss');
    if (!fs.existsSync(stylePath)) return;

    let content = fs.readFileSync(stylePath, 'utf8');

    // url('https://cdn.icomoon.io/.../icomoon.woff2?abc') -> url('icomoon.woff2?abc')
    content = content.replace(
        /url\(['"]?https?:\/\/[^'")\s]+\/([^'")\s]+)['"]?\)/g,
        "url('$1')"
    );

    // url('icomoon.woff2?abc') -> url('icomoon.woff2')
    // url('icomoon.eot?abc#iefix') -> url('icomoon.eot#iefix')  (preserve #iefix)
    content = content.replace(
        /url\(['"]?([^?'")\s]+)\?[^#'")\s]*([^'")\s]*)['"]?\)/gi,
        "url('$1$2')"
    );

    fs.writeFileSync(stylePath, content, 'utf8');
    console.log(`  ✓ Fixed font paths in _style.scss`);
}

async function syncProject(projectKey) {
    const project = PROJECTS[projectKey];
    if (!project) {
        throw new Error(`Unknown project: ${projectKey}. Available: ${Object.keys(PROJECTS).join(', ')}`);
    }

    console.log(`\n📦 Syncing project: ${project.name}`);
    console.log(`   Source: ${BASE_URL}/${project.name}/`);
    console.log(`   Target: ${project.targetDir}`);

    if (!fs.existsSync(project.targetDir)) {
        fs.mkdirSync(project.targetDir, { recursive: true });
        console.log(`   Created directory: ${project.targetDir}`);
    }

    const results = await Promise.allSettled(
        project.files.map(({ src, dest }) =>
            downloadFile(project.name, src, path.join(project.targetDir, dest))
        )
    );

    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
        console.log(`\n   ⚠️  ${failures.length} file(s) failed:`);
        failures.forEach(f => console.log(`      - ${f.reason.message}`));
    }

    return failures.length === 0;
}

async function main() {
    const args = process.argv.slice(2);
    const projectsToSync = args.length > 0 ? args : Object.keys(PROJECTS);

    console.log('🚀 IcoMoon Sync Script');
    console.log('='.repeat(50));

    let allSuccess = true;

    for (const projectKey of projectsToSync) {
        try {
            const success = await syncProject(projectKey);
            if (success) {
                fixStylePaths(PROJECTS[projectKey].targetDir);
            }
            allSuccess = allSuccess && success;
        } catch (err) {
            console.error(`\n❌ Error syncing ${projectKey}: ${err.message}`);
            allSuccess = false;
        }
    }

    console.log('\n' + '='.repeat(50));
    if (allSuccess) {
        console.log('✅ Sync complete!');
    } else {
        console.log('⚠️  Sync completed with some errors');
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
