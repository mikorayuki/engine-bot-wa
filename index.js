import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from 'baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import chalk from 'chalk';
import readline from 'readline';
import config from './config.js';

process.on('uncaughtException', (err) => {
    console.error(chalk.red('[!] Uncaught Exception:'), err.message || err);
});

process.on('unhandledRejection', (reason) => {
    console.error(chalk.yellow('[!] Unhandled Rejection:'), reason);
});

const logger = pino({ level: 'silent' });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startEngine() {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const socket = makeWASocket({
        version,
        logger,
        printQRInTerminal: !config.usePairingCode,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false
    });

    if (config.usePairingCode && !socket.authState.creds.registered) {
        const phoneNumber = await question(chalk.yellow('[?] Enter WhatsApp Number (e.g. 628xxx): '));
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        if (cleanNumber.length > 5) {
            setTimeout(async () => {
                const code = await socket.requestPairingCode(cleanNumber);
                console.log(chalk.green(`[+] Pairing Code: `) + chalk.bgGreen.black.bold(` ${code} `));
            }, 3000);
        }
    }

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const statusCode = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output?.statusCode
                : null;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.log(chalk.red(`[!] Connection status closed (${statusCode || 'Unknown'}). Reconnecting: ${shouldReconnect}`));
            if (shouldReconnect) {
                setTimeout(startEngine, 3000);
            }
        } else if (connection === 'open') {
            console.log(chalk.green(`[+] ${config.botName} Engine Connected Successfully!`));
        }
    });

    socket.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const msg = chatUpdate.messages[0];
            if (!msg || !msg.message || msg.key.fromMe) return;

            const from = msg.key.remoteJid;
            const messageType = Object.keys(msg.message)[0];

            let body = '';
            if (messageType === 'conversation') {
                body = msg.message.conversation;
            } else if (messageType === 'extendedTextMessage') {
                body = msg.message.extendedTextMessage.text;
            }

            if (!body) return;

            const isCmd = config.prefix.some(p => body.startsWith(p));
            if (!isCmd) return;

            const prefix = config.prefix.find(p => body.startsWith(p));
            const args = body.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            if (command === 'ping') {
                const startTime = Date.now();
                const sentMsg = await socket.sendMessage(from, { text: '🏓 Testing ping...' }, { quoted: msg });
                const speed = Date.now() - startTime;

                if (sentMsg) {
                    await socket.sendMessage(from, { text: `Pong! 🏓\nSpeed: *${speed} ms*` }, { quoted: msg });
                }
            }
        } catch (err) {
            console.error(chalk.red('[!] Error handling message:'), err.message || err);
        }
    });
}

startEngine();