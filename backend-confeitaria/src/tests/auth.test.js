const request = require('supertest');
const app = require('../server');
const { Usuario } = require('../models');

describe('Autenticação', () => {
  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário', async () => {
      const userData = {
        nome_completo: 'João Silva',
        email: 'joao@teste.com',
        senha: '123456',
        termos_aceitos: true
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('deve retornar erro se email já existir', async () => {
      // Cria usuário primeiro
      await Usuario.create({
        nome_completo: 'Usuário Existente',
        email: 'existente@teste.com',
        senha_hash: '123456',
        termos_aceitos: true
      });

      const userData = {
        nome_completo: 'Outro Usuário',
        email: 'existente@teste.com',
        senha: '123456',
        termos_aceitos: true
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email já está cadastrado');
    });

    it('deve retornar erro se dados inválidos', async () => {
      const userData = {
        nome_completo: 'João',
        email: 'email-invalido',
        senha: '123',
        termos_aceitos: false
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Cria usuário para teste
      await Usuario.create({
        nome_completo: 'Usuário Teste',
        email: 'teste@teste.com',
        senha_hash: '123456',
        termos_aceitos: true
      });
    });

    it('deve fazer login com credenciais válidas', async () => {
      const loginData = {
        email: 'teste@teste.com',
        senha: '123456'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      const loginData = {
        email: 'teste@teste.com',
        senha: 'senha-errada'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Credenciais inválidas');
    });
  });
});