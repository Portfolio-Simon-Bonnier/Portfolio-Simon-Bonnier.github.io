const fs = require('fs/promises');
const path = require('path');
const { existsSync } = require('fs');
const { execFileSync } = require('child_process');
const CleanCSS = require('clean-css');
const { minify: minifyJs } = require('terser');
const { minify: minifyHtml } = require('html-minifier-terser');
const i18nData = require('./data');

const ROOT = __dirname;
const DIST_DIR = path.join(ROOT, 'dist');
const DIST_CSS_DIR = path.join(DIST_DIR, 'css');
const DIST_JS_DIR = path.join(DIST_DIR, 'js');
const DIST_IMG_DIR = path.join(DIST_DIR, 'img');
const TMP_DIR = path.join(ROOT, '.build-tmp');
const TMP_TAILWIND_PATH = path.join(TMP_DIR, 'tailwind.css');
const CANONICAL_CV_NAME = 'CV - Simon BONNIER.pdf';

async function ensureDirs() {
    await fs.rm(DIST_DIR, { recursive: true, force: true });
    await fs.rm(TMP_DIR, { recursive: true, force: true });
    await fs.mkdir(DIST_CSS_DIR, { recursive: true });
    await fs.mkdir(DIST_JS_DIR, { recursive: true });
    await fs.mkdir(DIST_IMG_DIR, { recursive: true });
    await fs.mkdir(TMP_DIR, { recursive: true });
}

function buildTailwind() {
    const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    execFileSync(
        npx,
        [
            'tailwindcss',
            '-c',
            'tailwind.config.js',
            '-i',
            'css/tailwind.css',
            '-o',
            TMP_TAILWIND_PATH,
            '--minify',
        ],
        { stdio: 'inherit', cwd: ROOT }
    );
}

async function buildCss() {
    const [tailwindCss, customCss] = await Promise.all([
        fs.readFile(TMP_TAILWIND_PATH, 'utf8'),
        fs.readFile(path.join(ROOT, 'css', 'style.css'), 'utf8'),
    ]);

    const cssMinified = new CleanCSS().minify(`${tailwindCss}\n${customCss}`);
    if (cssMinified.errors.length > 0) {
        throw new Error(cssMinified.errors.join('\n'));
    }

    await fs.writeFile(path.join(DIST_CSS_DIR, 'app.min.css'), cssMinified.styles, 'utf8');
}

async function buildJs() {
    const sourceJs = await fs.readFile(path.join(ROOT, 'js', 'script.js'), 'utf8');
    const result = await minifyJs(sourceJs, { compress: true, mangle: true });
    if (!result.code) {
        throw new Error('JS minification failed.');
    }
    await fs.writeFile(path.join(DIST_JS_DIR, 'script.min.js'), result.code, 'utf8');
}

function rewriteHtmlForProduction(html) {
    let out = html;
    out = out.replace(/^\s*<script src="js\/tailwind-config\.js"><\/script>\r?\n?/m, '');
    out = out.replace(
        /^\s*<!-- Tailwind CSS \(CDN pour un fichier unique\) -->\r?\n?\s*<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\r?\n?/m,
        ''
    );
    out = out.replace('href="css/style.css"', 'href="css/app.min.css"');
    out = out.replace('src="js/script.js"', 'src="js/script.min.js"');
    return out;
}

function renderTemplate(template, dictionary) {
    return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (match, key) => {
        if (!(key in dictionary)) {
            throw new Error(`Missing i18n key "${key}" in language dictionary.`);
        }
        return String(dictionary[key]);
    });
}

async function buildHtml() {
    const template = await fs.readFile(path.join(ROOT, 'index.html'), 'utf8');
    const preparedTemplate = rewriteHtmlForProduction(template);
    const frRendered = renderTemplate(preparedTemplate, i18nData.fr);
    const frMinified = await minifyHtml(frRendered, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: false,
        minifyJS: false,
    });
    await fs.writeFile(path.join(DIST_DIR, 'index.html'), frMinified, 'utf8');

    const enRendered = renderTemplate(preparedTemplate, i18nData.en);
    const enMinified = await minifyHtml(enRendered, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: false,
        minifyJS: false,
    });
    const enDir = path.join(DIST_DIR, 'en');
    await fs.mkdir(enDir, { recursive: true });
    await fs.writeFile(path.join(enDir, 'index.html'), enMinified, 'utf8');
}

async function copyStaticAssets() {
    const assetsToCopy = ['img'];
    for (const asset of assetsToCopy) {
        const src = path.join(ROOT, asset);
        if (existsSync(src)) {
            const dest = path.join(DIST_DIR, asset);
            await fs.cp(src, dest, { recursive: true });
        }
    }
}

async function copyCvPdf() {
    const cvCandidates = [
        path.join(ROOT, CANONICAL_CV_NAME),
        path.join(ROOT, 'img', CANONICAL_CV_NAME),
        path.join(ROOT, 'img', 'CV Bonnier_Simon.pdf'),
    ];

    const sourceCvPath = cvCandidates.find((candidate) => existsSync(candidate));
    if (!sourceCvPath) {
        process.stdout.write('Warning: CV PDF not found, skipping copy.\n');
        return;
    }

    await fs.copyFile(sourceCvPath, path.join(DIST_IMG_DIR, CANONICAL_CV_NAME));
}

async function run() {
    await ensureDirs();
    buildTailwind();
    await Promise.all([buildCss(), buildJs(), buildHtml(), copyStaticAssets(), copyCvPdf()]);
    await fs.rm(TMP_DIR, { recursive: true, force: true });
    process.stdout.write('Build complete: dist/index.html and dist/en/index.html\n');
}

run().catch(async (error) => {
    process.stderr.write(`Build failed: ${error.message}\n`);
    await fs.rm(TMP_DIR, { recursive: true, force: true });
    process.exit(1);
});
