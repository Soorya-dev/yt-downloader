const { execSync } = require('child_process');
const path = require('path');
const inquirer = require('inquirer');
const cliProgress = require('cli-progress');
const os = require('os');
const fs = require('fs');

// Get downloads folder path
const downloadsFolder = path.join(os.homedir(), 'Downloads');

// Banner
const banner = `
╔════════════════════════════════════════════╗
║        YouTube Video Downloader CLI        ║
║        Created by Sooryadev Anikkat       ║
╚════════════════════════════════════════════╝
`;

// Progress bar
const progressBar = new cliProgress.SingleBar({
    format: 'Downloading |{bar}| {percentage}% || {value}/{total} MB',
    barCompleteChar: '█',
    barIncompleteChar: '░',
    hideCursor: true
});

async function getVideoFormats(url) {
    try {
        // Get available formats
        const formatList = execSync(`yt-dlp.exe -F "${url}"`, { encoding: 'utf8' });
        
        // Parse formats into structured array
        const formats = formatList
            .split('\n')
            .filter(line => line.match(/^\d+/)) // Only lines starting with numbers
            .map(line => {
                const [id, format] = line.split(' ').filter(Boolean);
                return {
                    value: id,
                    name: line.trim()
                };
            });

        // Add some common format combinations
        formats.unshift(
            { value: 'best', name: '🔥 Best Quality (Automatic Selection)' },
            { value: 'bestvideo+bestaudio', name: '✨ Best Video + Best Audio (Recommended)' }
        );

        return formats;
    } catch (error) {
        console.error('Error fetching video formats:', error.message);
        process.exit(1);
    }
}

async function downloadVideo() {
    console.log(banner);
    console.log('To paste URL: Right-click or use Shift + Insert or Ctrl + V\n');

    const { url } = await inquirer.prompt([
        {
            type: 'input',
            name: 'url',
            message: 'Enter YouTube URL:',
            validate: input => {
                if (input.includes('youtube.com') || input.includes('youtu.be')) {
                    return true;
                }
                return 'Please enter a valid YouTube URL';
            }
        }
    ]);

    console.log('\nFetching available formats...');
    const formats = await getVideoFormats(url);

    const { format } = await inquirer.prompt([
        {
            type: 'list',
            name: 'format',
            message: 'Select video quality:',
            choices: formats,
            pageSize: 15
        }
    ]);

    const outputPath = path.join(downloadsFolder, '%(title)s.%(ext)s');

    try {
        console.log('\nStarting download...\n');
        progressBar.start(100, 0);

        execSync(
            `yt-dlp.exe "${url}" -f ${format} -o "${outputPath}" --newline`,
            {
                stdio: ['pipe', 'pipe', 'pipe'],
                encoding: 'utf8',
                maxBuffer: 1024 * 1024 * 10,
                cwd: __dirname
            }
        );

        progressBar.stop();
        console.log('\n✨ Download completed successfully!');
        console.log(`\nVideo saved in: ${downloadsFolder}`);

    } catch (error) {
        progressBar.stop();
        console.error('\nError during download:', error.message);
    }
}

// Check for required files
if (!fs.existsSync(path.join(__dirname, 'yt-dlp.exe'))) {
    console.error('Error: yt-dlp.exe not found in the current directory');
    process.exit(1);
}

try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
} catch (error) {
    console.error('Error: FFmpeg is not installed. Please install FFmpeg to use this tool.');
    process.exit(1);
}

// Start the download process
downloadVideo();