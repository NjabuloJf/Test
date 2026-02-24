const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve your HTML file (make sure your HTML is named index.html)
app.use(express.static(__dirname));

// Create a folder for deployments if it doesn't exist
const deployDir = path.join(__dirname, 'deployments');
if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir);
}

io.on('connection', (socket) => {
    console.log('New developer connected to dashboard');

    socket.on('start-deploy', (data) => {
        const { botName, repoUrl, sessionId, phoneNumber } = data;
        const botFolder = botName.replace(/\s+/g, '_').toLowerCase() + '_' + Date.now();
        const targetPath = path.join(deployDir, botFolder);

        const sendLog = (message, colorClass = 'log-white') => {
            socket.emit('terminal-log', { msg: message, type: colorClass });
        };

        sendLog(`[SYSTEM] Starting deployment for: ${botName}`, 'log-blue');
        sendLog(`[SYSTEM] Preparing workspace in: /deployments/${botFolder}`, 'log-white');

        // STEP 1: Clone the Repository
        sendLog(`-----> Cloning GitHub Repository: ${repoUrl}`, 'log-purple');
        const gitClone = spawn('git', ['clone', repoUrl, targetPath]);

        gitClone.stdout.on('data', (data) => sendLog(data.toString()));
        gitClone.stderr.on('data', (data) => sendLog(data.toString(), 'log-purple'));

        gitClone.on('close', (code) => {
            if (code !== 0) {
                return sendLog(`[ERROR] Git clone failed with code ${code}`, 'log-red');
            }

            sendLog(`-----> Repository Cloned Successfully`, 'log-green');

            // STEP 2: Create .env file (Injecting Session ID and Owner Number)
            sendLog(`-----> Configuring Environment Variables...`, 'log-purple');
            const envContent = `SESSION_ID=${sessionId}\nOWNER_NUMBER=${phoneNumber}\nBOT_NAME=${botName}\nPREFIX=.\n`;
            fs.writeFileSync(path.join(targetPath, '.env'), envContent);
            sendLog(`       - Added SESSION_ID`, 'log-white');
            sendLog(`       - Added OWNER_NUMBER`, 'log-white');

            // STEP 3: Install Dependencies (npm install)
            sendLog(`-----> Running: npm install (This may take a minute)`, 'log-purple');
            const install = spawn('npm', ['install'], { cwd: targetPath, shell: true });

            install.stdout.on('data', (data) => sendLog(data.toString()));
            install.stderr.on('data', (data) => sendLog(data.toString(), 'log-white')); // Logs warnings usually

            install.on('close', (code) => {
                if (code !== 0) return sendLog(`[ERROR] npm install failed`, 'log-red');
                
                sendLog(`-----> Dependencies installed successfully!`, 'log-green');

                // STEP 4: Start the Bot (npm start)
                sendLog(`-----> Launching ${botName}...`, 'log-green');
                sendLog(`[SYS] Bot is now ONLINE. Check WhatsApp!`, 'log-blue');

                const botProcess = spawn('npm', ['start'], { cwd: targetPath, shell: true });

                botProcess.stdout.on('data', (data) => {
                    // Send actual bot logs to the dashboard terminal
                    socket.emit('terminal-log', { msg: data.toString(), type: 'log-white' });
                });

                botProcess.stderr.on('data', (data) => {
                    socket.emit('terminal-log', { msg: data.toString(), type: 'log-red' });
                });
            });
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`
    ===========================================
    NJABULO JB AI DEPLOYER RUNNING
    URL: http://localhost:${PORT}
    ===========================================
    `);
});

