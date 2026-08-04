import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from 'baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import chalk from 'chalk';
import readline from 'readline';
import config from './config.js';

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
        browser: ['Ubuntu', 'Chrome', '20.0.04']
    });

    if (config.usePairingCode && !socket.authState.creds.registered) {
        const phoneNumber = await question(chalk.yellow('[?] Enter WhatsApp Number (e.g. 628xxx): '));
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        const code = await socket.requestPairingCode(cleanNumber);
        console.log(chalk.green(`[+] Pairing Code: `) + chalk.bgGreen.black.bold(` ${code} `));
    }

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut
                : true;
            console.log(chalk.red('[!] Connection closed. Reconnecting:'), shouldReconnect);
            if (shouldReconnect) {
                startEngine();
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
            const body = (messageType === 'conversation')
                ? msg.message.conversation
                : (messageType === 'extendedTextMessage')
                    ? msg.message.extendedTextMessage.text
                    : '';

            if (!body) return;

            const isCmd = config.prefix.some(p => body.startsWith(p));
            if (!isCmd) return;

            const prefix = config.prefix.find(p => body.startsWith(p));
            const args = body.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            if (command === 'ping') {
                const startTime = Date.now();
                await socket.sendMessage(from, { text: '🏓 Testing ping...' }, { quoted: msg });
                const speed = Date.now() - startTime;
                await socket.sendMessage(from, { text: ` Pong! 🏓\n Speed: *${speed} ms*` }, { quoted: msg });
            }
        } catch (err) {
            console.error(chalk.red('[!] Error handling message:'), err);
        }
    });
}

startEngine();