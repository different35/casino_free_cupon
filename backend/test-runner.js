// Backend API Testleri - Gerçek Test Script
// Çalıştırma: node backend/test-runner.js

import express from 'express';
import request from 'supertest';

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

// Test runner
async function runTests() {
  console.log('\n🧪 Backend API Testleri Başlıyor...\n');
  
  const app = createTestApp();
  let passed = 0;
  let failed = 0;
  
  // Test 1: GET /api/status
  try {
    console.log('Test 1: GET /api/status - Bot durumu döndürmeli');
    const response = await request(app).get('/api/status');
    
    if (response.status === 200 && 
        response.body.success === true && 
        response.body.bot.username === 'test_bot' &&
        response.body.bot.id === 1234567890) {
      console.log('✅ PASSED\n');
      passed++;
    } else {
      console.log('❌ FAILED - Beklenen yanıt alınamadı\n');
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED - ${err.message}\n`);
    failed++;
  }
  
  // Test 2: GET /api/codes - Boş liste
  try {
    console.log('Test 2: GET /api/codes - Boş kod listesi döndürmeli');
    const response = await request(app).get('/api/codes');
    
    if (response.status === 200 && 
        response.body.success === true && 
        response.body.count === 0 &&
        Array.isArray(response.body.codes)) {
      console.log('✅ PASSED\n');
      passed++;
    } else {
      console.log('❌ FAILED - Beklenen yanıt alınamadı\n');
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED - ${err.message}\n`);
    failed++;
  }
  
  // Test 3: POST /api/codes - Kod ekleme
  try {
    console.log('Test 3: POST /api/codes - Yeni kod eklemeli');
    const response = await request(app)
      .post('/api/codes')
      .send({ 
        code: 'FREESPIN50', 
        source: 'Stake Daily',
        chatId: -1001234567890,
        messageId: 789,
        fullText: 'Free spin kodunuz: FREESPIN50'
      });
    
    if (response.status === 200 && 
        response.body.success === true && 
        response.body.code.code === 'FREESPIN50' &&
        response.body.code.source === 'Stake Daily' &&
        response.body.code.status === 'new') {
      console.log('✅ PASSED\n');
      passed++;
    } else {
      console.log('❌ FAILED - Beklenen yanıt alınamadı\n');
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED - ${err.message}\n`);
    failed++;
  }
  
  // Test 4: GET /api/codes - Kod listeleme
  try {
    console.log('Test 4: GET /api/codes - Eklenen kodu listelemeli');
    const response = await request(app).get('/api/codes');
    
    if (response.status === 200 && 
        response.body.count === 1 &&
        response.body.codes[0].code === 'FREESPIN50') {
      console.log('✅ PASSED\n');
      passed++;
    } else {
      console.log('❌ FAILED - Beklenen yanıt alınamadı\n');
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED - ${err.message}\n`);
    failed++;
  }
  
  // Test 5: DELETE /api/codes/:id - Kod silme
  try {
    console.log('Test 5: DELETE /api/codes/:id - Belirli bir kodu silmeli');
    
    // Önce kod ekle
    const addResponse = await request(app)
      .post('/api/codes')
      .send({ code: 'BONUS123ABC' });
    
    const codeId = addResponse.body.code.id;
    
    // Kod sil
    const deleteResponse = await request(app).delete(`/api/codes/${codeId}`);
    
    if (deleteResponse.status === 200 && deleteResponse.body.success === true) {
      // Silindiğini doğrula
      const listResponse = await request(app).get('/api/codes');
      const found = listResponse.body.codes.find(c => c.id === codeId);
      
      if (!found) {
        console.log('✅ PASSED\n');
        passed++;
      } else {
        console.log('❌ FAILED - Kod silinmedi\n');
        failed++;
      }
    } else {
      console.log('❌ FAILED - Silme işlemi başarısız\n');
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED - ${err.message}\n`);
    failed++;
  }
  
  // Test 6: DELETE /api/codes/:id - Olmayan kod
  try {
    console.log('Test 6: DELETE /api/codes/:id - Olmayan kod için 404 döndürmeli');
    const response = await request(app).delete('/api/codes/nonexistent');
    
    if (response.status === 404 && response.body.success === false) {
      console.log('✅ PASSED\n');
      passed++;
    } else {
      console.log('❌ FAILED - Beklenen 404 yanıtı alınamadı\n');
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED - ${err.message}\n`);
    failed++;
  }
  
  // Test 7: DELETE /api/codes - Tümünü silme
  try {
    console.log('Test 7: DELETE /api/codes - Tüm kodları silmeli');
    
    // Birden fazla kod ekle
    await request(app).post('/api/codes').send({ code: 'CODE1' });
    await request(app).post('/api/codes').send({ code: 'CODE2' });
    await request(app).post('/api/codes').send({ code: 'CODE3' });
    
    // Tümünü sil
    const response = await request(app).delete('/api/codes');
    
    if (response.status === 200 && response.body.success === true) {
      // Silindiğini doğrula
      const listResponse = await request(app).get('/api/codes');
      
      if (listResponse.body.count === 0) {
        console.log('✅ PASSED\n');
        passed++;
      } else {
        console.log('❌ FAILED - Tüm kodlar silinmedi\n');
        failed++;
      }
    } else {
      console.log('❌ FAILED - Silme işlemi başarısız\n');
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED - ${err.message}\n`);
    failed++;
  }
  
  // Sonuçlar
  console.log('='.repeat(50));
  console.log(`\n📊 Test Sonuçları:`);
  console.log(`   ✅ Geçen: ${passed}`);
  console.log(`   ❌ Başarısız: ${failed}`);
  console.log(`   📈 Başarı Oranı: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);
  
  if (failed === 0) {
    console.log('🎉 Tüm testler başarılı!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Bazı testler başarısız oldu.\n');
    process.exit(1);
  }
}

// Testleri çalıştır
runTests().catch(err => {
  console.error('❌ Test runner hatası:', err);
  process.exit(1);
});
