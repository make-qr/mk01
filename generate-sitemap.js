const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

// Configuration
const config = {
    baseUrl: 'https://monkeymart.one',
    outputFile: 'sitemap.xml',
    // Add file extensions to scan
    extensions: ['.html', '.htm'],
    // Directories to exclude
    excludeDirs: ['node_modules', '.git', 'private', 'admin'],
    // Priority and change frequency for different types of pages
    priorities: {
        home: 1.0,
        games: 0.8,
        categories: 0.7,
        blog: 0.6,
        other: 0.5
    },
    frequencies: {
        home: 'daily',
        games: 'weekly',
        categories: 'weekly',
        blog: 'weekly',
        other: 'monthly'
    }
};

// Function to get all HTML files
function getFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip excluded directories
        if (config.excludeDirs.includes(entry.name)) continue;

        if (entry.isDirectory()) {
            getFiles(fullPath, files);
        } else if (config.extensions.includes(path.extname(entry.name))) {
            files.push(fullPath);
        }
    }

    return files;
}

// Function to determine priority and frequency
function getPageProperties(filePath) {
    const relativePath = filePath.replace(process.cwd(), '').replace(/\\/g, '/');
    
    if (relativePath === '/index.html') {
        return {
            priority: config.priorities.home,
            frequency: config.frequencies.home
        };
    } else if (relativePath.includes('/game/')) {
        return {
            priority: config.priorities.games,
            frequency: config.frequencies.games
        };
    } else if (relativePath.includes('/category/')) {
        return {
            priority: config.priorities.categories,
            frequency: config.frequencies.categories
        };
    } else if (relativePath.includes('/blog/')) {
        return {
            priority: config.priorities.blog,
            frequency: config.frequencies.blog
        };
    }

    return {
        priority: config.priorities.other,
        frequency: config.frequencies.other
    };
}

// Generate sitemap
function generateSitemap() {
    const files = getFiles(process.cwd());
    
    // Create XML structure
    const root = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8' })
        .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

    // Add URLs to sitemap
    files.forEach(file => {
        const relativePath = file.replace(process.cwd(), '').replace(/\\/g, '/');
        const { priority, frequency } = getPageProperties(file);
        const stats = fs.statSync(file);
        
        const url = root.ele('url');
        url.ele('loc', config.baseUrl + relativePath.replace('index.html', ''));
        url.ele('lastmod', stats.mtime.toISOString());
        url.ele('changefreq', frequency);
        url.ele('priority', priority);
    });

    // Write sitemap to file
    const xml = root.end({ pretty: true });
    fs.writeFileSync(config.outputFile, xml);
    
    console.log(`Sitemap generated at ${config.outputFile}`);
}

// Run the generator
generateSitemap(); 