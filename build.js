const fs = require('fs/promises');
const path = require('path');
const { existsSync } = require('fs');
const { execFileSync } = require('child_process');
const CleanCSS = require('clean-css');
const { minify: minifyJs } = require('terser');
const { minify: minifyHtml } = require('html-minifier-terser');
const content = require('./data');

const ROOT = __dirname;
const DIST_DIR = path.join(ROOT, 'dist');
const DIST_CSS_DIR = path.join(DIST_DIR, 'css');
const DIST_JS_DIR = path.join(DIST_DIR, 'js');
const DIST_IMG_DIR = path.join(DIST_DIR, 'img');
const DIST_EN_DIR = path.join(DIST_DIR, 'en');
const TMP_DIR = path.join(ROOT, '.build-tmp');
const TMP_TAILWIND_PATH = path.join(TMP_DIR, 'tailwind.css');
const CANONICAL_CV_NAME = 'CV - Simon BONNIER.pdf';

async function ensureDirs() {
    await fs.rm(DIST_DIR, { recursive: true, force: true });
    await fs.rm(TMP_DIR, { recursive: true, force: true });
    await fs.mkdir(DIST_CSS_DIR, { recursive: true });
    await fs.mkdir(DIST_JS_DIR, { recursive: true });
    await fs.mkdir(DIST_IMG_DIR, { recursive: true });
    await fs.mkdir(DIST_EN_DIR, { recursive: true });
    await fs.mkdir(TMP_DIR, { recursive: true });
}

function buildTailwind() {
    const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    execFileSync(npx, ['tailwindcss', '-c', 'tailwind.config.js', '-i', 'css/tailwind.css', '-o', TMP_TAILWIND_PATH, '--minify'], {
        stdio: 'inherit',
        cwd: ROOT,
    });
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

function applyRelativeAssetPaths(html, prefix) {
    return html
        .replace(/(href|src)="(css|js|img)\//g, `$1="${prefix}$2/`)
        .replace(/href="\/en\//g, `href="${prefix}en/`)
        .replace(/href="\//g, `href="${prefix}`);
}

function rewriteHtmlForProduction(html) {
    let out = html;
    out = out.replace(/\s*<script src="js\/tailwind-config\.js"><\/script>/, '');
    out = out.replace(/\s*<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/, '');
    out = out.replace('href="css/style.css"', 'href="css/app.min.css"');
    out = out.replace('src="js/script.js"', 'src="js/script.min.js"');
    return out;
}

function renderTemplate(template, context) {
    return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => (Object.hasOwn(context, key) ? String(context[key]) : ''));
}

async function buildHtml() {
    const template = await fs.readFile(path.join(ROOT, 'index.html'), 'utf8');
    const prepared = rewriteHtmlForProduction(template);

    const frHtml = renderTemplate(prepared, content.fr);
    const minFr = await minifyHtml(frHtml, { collapseWhitespace: true, removeComments: true, minifyCSS: false, minifyJS: false });
    await fs.writeFile(path.join(DIST_DIR, 'index.html'), minFr, 'utf8');

    const enHtml = renderTemplate(prepared, content.en);
    const enRel = applyRelativeAssetPaths(enHtml, '../');
    const minEn = await minifyHtml(enRel, { collapseWhitespace: true, removeComments: true, minifyCSS: false, minifyJS: false });
    await fs.writeFile(path.join(DIST_EN_DIR, 'index.html'), minEn, 'utf8');
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
    const cvCandidates = [path.join(ROOT, CANONICAL_CV_NAME), path.join(ROOT, 'img', CANONICAL_CV_NAME), path.join(ROOT, 'img', 'CV Bonnier_Simon.pdf')];
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
