import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';

// Test server oluştur
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  const collectedCodes = [];
  
  app.get('/api/status', (req, res) => {
    res.json({
      success: true,
      bot: {
        username: 'test_bot',
        id: 1234567890,
        firstName: 'Test Bot'
      },
      codesCollected: collectedCodes.length,
      uptime: process.uptime()
    });
  });
  
  app.get('/api/codes', (req, res) => {
    res.json({
      success: true,
      count: collectedCodes.length,
      codes: collectedCodes
    });
  });
  
  app.post('/api/codes', (req, res) => {
    const code = {
      id: `${Date.now()}-${req.body.code}`,
      code: req.body.code,
      source: req.body.source || 'Test',
      chatId: req.body.chatId || 123,
      messageId: req.body.messageId || 456,
      fullText: req.body.fullText || '',
      collectedAt: new Date(),
      status: 'new'
    };
    collectedCodes.push(code);
    res.json({ success: true, code });
  });
  
  app.delete('/api/codes/:id', (req, res) => {
    const index = collectedCodes.findIndex(c => c.id === req.params.id);
    if (index !== -1) {
      collectedCodes.splice(index, 1);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  });
  
  app.delete('/api/codes', (req, res) => {
    collectedCodes.length = 0;
    res.json({ success: true });
  });
  
  return app;
};

// Mock fetch fonksiyonu
const mockFetch = async (app, method, path, body = null) => {
  return new Promise((resolve) => {
    const req = {
      method,
      path,
      body,
      headers: {},
      query: {}
    };
    
    const res = {
      status: (code) => {
        res.statusCode = code;
        return res;
      },
      json: (data) => {
        resolve({ status: res.statusCode || 200, body: data });
      }
    };
    
    // Route matching
    if (method === 'GET' && path === '/api/status') {
      app._router.stack.find(layer => layer.route && layer.route.path === '/api/status')
        .route.stack[0].handle(req, res);
    } else if (method === 'GET' && path === '/api/codes') {
      app._router.stack.find(layer => layer.route && layer.route.path === '/api/codes')
        .route.stack[0].handle(req, res);
    }
  });
};

describe('Backend API Tests', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp();
  });
  
  describe('GET /api/status', () => {
    it('bot durumunu döndürmeli', async () => {
      const response = await mockFetch(app, 'GET', '/api/status');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.bot).toBeDefined();
      expect(response.body.bot.username).toBe('test_bot');
      expect(response.body.bot.id).toBe(1234567890);
      expect(response.body.codesCollected).toBe(0);
      expect(response.body.uptime).toBeDefined();
    });
  });
  
  describe('GET /api/codes', () => {
    it('boş kod listesi döndürmeli', async () => {
      const response = await mockFetch(app, 'GET', '/api/codes');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.codes).toEqual([]);
    });
  });
});
