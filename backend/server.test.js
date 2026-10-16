// Backend API Testleri - Jest + Supertest
// Çalıştırma: npm test

const request = require('supertest');
const express = require('express');

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

describe('Backend API Tests', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp();
  });
  
  describe('GET /api/status', () => {
    it('bot durumunu döndürmeli', async () => {
      const response = await request(app).get('/api/status');
      
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
      const response = await request(app).get('/api/codes');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.codes).toEqual([]);
    });
    
    it('kod eklendikten sonra listelemeli', async () => {
      // Kod ekle
      await request(app)
        .post('/api/codes')
        .send({ code: 'NEXT4P7QX2MLRV8K', source: 'Test Channel' });
      
      const response = await request(app).get('/api/codes');
      
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      expect(response.body.codes[0].code).toBe('NEXT4P7QX2MLRV8K');
    });
  });
  
  describe('POST /api/codes', () => {
    it('yeni kod eklemeli', async () => {
      const response = await request(app)
        .post('/api/codes')
        .send({ 
          code: 'FREESPIN50', 
          source: 'Stake Daily',
          chatId: -1001234567890,
          messageId: 789,
          fullText: 'Free spin kodunuz: FREESPIN50'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.code.code).toBe('FREESPIN50');
      expect(response.body.code.source).toBe('Stake Daily');
      expect(response.body.code.status).toBe('new');
    });
  });
  
  describe('DELETE /api/codes/:id', () => {
    it('belirli bir kodu silmeli', async () => {
      // Kod ekle
      const addResponse = await request(app)
        .post('/api/codes')
        .send({ code: 'BONUS123ABC' });
      
      const codeId = addResponse.body.code.id;
      
      // Kod sil
      const deleteResponse = await request(app).delete(`/api/codes/${codeId}`);
      
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
      
      // Silindiğini doğrula
      const listResponse = await request(app).get('/api/codes');
      expect(listResponse.body.count).toBe(0);
    });
    
    it('olmayan kod için 404 döndürmeli', async () => {
      const response = await request(app).delete('/api/codes/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('DELETE /api/codes', () => {
    it('tüm kodları silmeli', async () => {
      // Birden fazla kod ekle
      await request(app).post('/api/codes').send({ code: 'CODE1' });
      await request(app).post('/api/codes').send({ code: 'CODE2' });
      await request(app).post('/api/codes').send({ code: 'CODE3' });
      
      // Tümünü sil
      const response = await request(app).delete('/api/codes');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Silindiğini doğrula
      const listResponse = await request(app).get('/api/codes');
      expect(listResponse.body.count).toBe(0);
    });
  });
});
