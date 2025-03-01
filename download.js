const { execSync } = require('child_process');
const path = require('path');
const inquirer = require('inquirer');
const cliProgress = require('cli-progress');
const os = require('os');
const fs = require('fs');
//! To start node download.js

// Get downloads folder path
const downloadsFolder = path.join(os.homedir(), 'Downloads');

// Create a specific folder in Downloads for YouTube videos
const ytDownloadFolder = path.join(downloadsFolder, 'YouTube Downloads');
if (!fs.existsSync(ytDownloadFolder)) {
    fs.mkdirSync(ytDownloadFolder, { recursive: true });
}

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
        console.log('Fetching available formats...');
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
        console.log('\nTrying to update yt-dlp.exe...');
        try {
            execSync('yt-dlp.exe -U', { stdio: 'inherit' });
            console.log('yt-dlp.exe updated successfully! Please try again.');
        } catch (updateError) {
            console.error('Failed to update yt-dlp.exe:', updateError.message);
        }
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

    // Get expected filename
    let expectedFilename;
    try {
        expectedFilename = execSync(`yt-dlp.exe --get-filename -o "%(title)s.%(ext)s" "${url}"`, { encoding: 'utf8' }).trim();
        console.log(`\nVideo will be saved as: ${expectedFilename}`);
    } catch (error) {
        console.log('\nCould not determine filename in advance.');
    }

    const outputPath = path.join(ytDownloadFolder, '%(title)s.%(ext)s');

    try {
        console.log('\nStarting download...\n');
        progressBar.start(100, 0);

        // Use verbose output and inherit stdio to see real-time progress
        const child = require('child_process').spawn(
            'yt-dlp.exe',
            [
                url,
                '-f', format,
                '-o', outputPath,
                '--newline',
                '--progress',
                '--console-title'
            ],
            {
                stdio: 'pipe',
                cwd: __dirname
            }
        );

        // Handle real-time output 
        let downloadedMB = 0;
        let totalMB = 100; // Default value

        child.stdout.on('data', (data) => {
            const output = data.toString();
            
            // Update progress based on output
            const sizeMatch = output.match(/(\d+\.\d+)MiB\s+\/\s+(\d+\.\d+)MiB/);
            if (sizeMatch && sizeMatch.length >= 3) {
                downloadedMB = parseFloat(sizeMatch[1]);
                totalMB = parseFloat(sizeMatch[2]);
                progressBar.setTotal(totalMB);
                progressBar.update(downloadedMB);
            }
        });

        // Wait for the process to complete
        await new Promise((resolve, reject) => {
            child.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Process exited with code ${code}`));
            });
            child.on('error', reject);
        });

        progressBar.stop();
        console.log('\n✨ Download completed successfully!');
        
        // Verify the file exists
        const files = fs.readdirSync(ytDownloadFolder);
        const downloadedFile = files.find(file => 
            file.includes(expectedFilename?.split('.')[0] || '') || 
            file.endsWith(expectedFilename?.split('.').pop() || '')
        );

        if (downloadedFile) {
            const finalPath = path.join(ytDownloadFolder, downloadedFile);
            console.log(`\nVideo saved at: ${finalPath}`);
        } else {
            console.log(`\nVideo should be saved in: ${ytDownloadFolder}`);
            console.log('Files in download folder:', files.join(', '));
        }

    } catch (error) {
        progressBar.stop();
        console.error('\nError during download:', error.message);
        
        console.log('\nTrying to update yt-dlp.exe...');
        try {
            execSync('yt-dlp.exe -U', { stdio: 'inherit' });
            console.log('yt-dlp.exe updated successfully! Please try again.');
        } catch (updateError) {
            console.error('Failed to update yt-dlp.exe:', updateError.message);
        }
    }
}

// Check for required files
if (!fs.existsSync(path.join(__dirname, 'yt-dlp.exe'))) {
    console.error('Error: yt-dlp.exe not found in the current directory');
    console.log('Please download yt-dlp.exe from https://github.com/yt-dlp/yt-dlp/releases');
    process.exit(1);
}

// Auto-update yt-dlp on startup
try {
    console.log('Checking for yt-dlp updates...');
    execSync('yt-dlp.exe -U', { stdio: 'inherit' });
} catch (error) {
    console.log('Could not update yt-dlp.exe:', error.message);
}

try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
} catch (error) {
    console.error('Error: FFmpeg is not installed. Please install FFmpeg to use this tool.');
    process.exit(1);
}

// Start the download process
downloadVideo();