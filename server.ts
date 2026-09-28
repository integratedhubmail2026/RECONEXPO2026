import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import {
  getPublicSmtpConfig,
  updateSmtpConfig,
  testSmtpConnection,
  sendTestEmail,
  sendRegistrationConfirmationEmail,
  sendPaymentReceiptEmail,
  sendBroadcastEmail,
  getEmailLogs,
  clearEmailLogs,
  deleteEmailLog,
  resendLoggedEmail
} from './src/server/smtpMailer';

dotenv.config({ override: true });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.get('/api/smtp/config', (_req: Request, res: Response) => {
    res.json({ success: true, config: getPublicSmtpConfig() });
  });

  app.post('/api/smtp/config/update', (req: Request, res: Response) => {
    updateSmtpConfig(req.body || {});
    res.json({ success: true, message: 'SMTP settings updated', config: getPublicSmtpConfig() });
  });

  app.all('/api/smtp/test-connection', async (_req: Request, res: Response) => {
    const result = await testSmtpConnection();
    res.json(result);
  });

  app.post('/api/smtp/send-test', async (req: Request, res: Response) => {
    const { recipientEmail, customNote } = req.body || {};
    const result = await sendTestEmail(recipientEmail, customNote);
    res.json(result);
  });

  app.post('/api/smtp/send-badge', async (req: Request, res: Response) => {
    const { attendee } = req.body || {};
    const result = await sendRegistrationConfirmationEmail(attendee);
    res.json(result);
  });

  app.post('/api/smtp/send-receipt', async (req: Request, res: Response) => {
    const { attendee, transaction } = req.body || {};
    const result = await sendPaymentReceiptEmail(attendee, transaction);
    res.json(result);
  });

  app.post('/api/smtp/broadcast', async (req: Request, res: Response) => {
    const result = await sendBroadcastEmail(req.body || {});
    res.json(result);
  });

  app.get('/api/smtp/logs', (_req: Request, res: Response) => {
    const logs = getEmailLogs();
    res.json({ success: true, count: logs.length, logs });
  });

  app.post('/api/smtp/logs/clear', (_req: Request, res: Response) => {
    clearEmailLogs();
    res.json({ success: true, message: 'Logs cleared' });
  });

  app.post('/api/smtp/logs/delete/:id', (req: Request, res: Response) => {
    const success = deleteEmailLog(req.params.id);
    res.json({ success, message: success ? 'Deleted' : 'Not found' });
  });

  app.post('/api/smtp/resend/:id', async (req: Request, res: Response) => {
    const result = await resendLoggedEmail(req.params.id);
    res.json(result);
  });

  app.get('/api/smtp/preview/:id', (req: Request, res: Response) => {
    const logs = getEmailLogs();
    const log = logs.find(l => l.id === req.params.id);
    if (!log || !log.renderedHtml) {
      return res.status(404).send('<h3>Email preview not found</h3>');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(log.renderedHtml);
  });

  app.get('/api/smtp/inbox', (_req: Request, res: Response) => {
    const logs = getEmailLogs();
    res.json({ success: true, count: logs.length, inbox: logs });
  });

  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.join(process.cwd(), 'dist');

  if (!isProduction && fs.existsSync(path.join(process.cwd(), 'index.html'))) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite dev server middleware init failed, falling back to static dist:', err);
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (_req: Request, res: Response) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }
  } else if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RECON Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
