🎥 YouTube Video Downloader CLI
A powerful command-line tool to download YouTube videos with quality selection and progress tracking. Download your favorite videos effortlessly!
Show Image
Show Image
Show Image
<div align="center">
  <img src="https://user-images.githubusercontent.com/65505330/189722764-b35f2ca4-f2c6-43ce-b6f6-3f1875ea3a46.png" alt="CLI Screenshot" width="600">
</div>
✨ Features

🎯 Simple and intuitive command-line interface
📊 Real-time download progress tracking
🔍 Quality selection for videos
📂 Automatic download folder organization
🔄 Automatic video and audio merging
🚀 Fast download speeds

🛠️ Prerequisites
Before running the project, ensure you have the following installed:
1. Node.js

Download and install from nodejs.org (Version 18 or later)
Verify installation: node --version

2. FFmpeg
Choose your operating system:
Windows (Using Chocolatey)
bashCopychoco install ffmpeg
Linux
bashCopysudo apt install ffmpeg
Mac
bashCopybrew install ffmpeg
3. yt-dlp

Download the latest version from yt-dlp releases
Place yt-dlp.exe in the project's root folder

📥 Installation
1️⃣ Clone the Repository
bashCopygit clone https://github.com/Soorya-dev/yt-downloader.git
cd yt-downloader
2️⃣ Install Dependencies
bashCopynpm install
3️⃣ Start the Application
bashCopynpm start
# or
node download.js
💻 Usage
<div align="center">
  <img src="https://user-images.githubusercontent.com/65505330/189722764-b35f2ca4-f2c6-43ce-b6f6-3f1875ea3a46.png" alt="Usage Demo" width="600">
</div>

Run the application using npm start
Enter a YouTube URL when prompted

To paste: Right-click or use Shift + Insert or Ctrl + V


Select video quality from the available options
Wait for the download to complete
Find your video in the Downloads folder

🤝 Contributing
Contributions are welcome! Feel free to:

Open issues
Submit pull requests
Suggest new features
Improve documentation

📝 License
This project is open source and available under the MIT License.
👨‍💻 Author
Sooryadev Anikkat

LinkedIn: Sooryadev Anikkat
GitHub: @Soorya-dev

🚀 Quick Start Example
bashCopy# Clone the repository
git clone https://github.com/Soorya-dev/yt-downloader.git

# Navigate to project directory
cd yt-downloader

# Install dependencies
npm install

# Run the application
npm start
⚠️ Troubleshooting

Pasting Issues: Use right-click or Shift + Insert to paste URLs
FFmpeg not found: Ensure FFmpeg is installed and in your system PATH
yt-dlp errors: Make sure yt-dlp.exe is in the project root folder
Quality selection not working: Check your internet connection and try again

💡 Tips

Use high-quality internet connection for better download speeds
Keep yt-dlp updated for the best compatibility
Check your Downloads folder for completed videos