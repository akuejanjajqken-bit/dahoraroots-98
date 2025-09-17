const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

/**
 * Serviço de Email
 * Gerencia o envio de emails transacionais
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = new Map();
    this.initializeTransporter();
    this.loadTemplates();
  }

  /**
   * Inicializa o transporter do nodemailer
   */
  initializeTransporter() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true para 465, false para outras portas
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verifica conexão
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Erro na configuração do email:', error);
      } else {
        console.log('✅ Servidor de email configurado com sucesso!');
      }
    });
  }

  /**
   * Carrega templates de email
   */
  async loadTemplates() {
    try {
      const templatesDir = path.join(__dirname, '../templates/email');
      
      // Templates básicos
      const templates = {
        'welcome': this.getWelcomeTemplate(),
        'password-reset': this.getPasswordResetTemplate(),
        'password-reset-confirmation': this.getPasswordResetConfirmationTemplate(),
        'password-change-confirmation': this.getPasswordChangeConfirmationTemplate(),
        'order-confirmation': this.getOrderConfirmationTemplate(),
        'order-status-update': this.getOrderStatusUpdateTemplate(),
        'order-cancellation': this.getOrderCancellationTemplate(),
        'newsletter': this.getNewsletterTemplate()
      };

      for (const [name, template] of Object.entries(templates)) {
        this.templates.set(name, template);
      }
    } catch (error) {
      console.error('Erro ao carregar templates de email:', error);
    }
  }

  /**
   * Envia email
   * @param {object} options - Opções do email
   */
  async sendEmail(options) {
    try {
      const { to, subject, template, data = {}, html, text } = options;

      let emailHtml = html;
      let emailText = text;

      // Se template foi especificado, renderiza o template
      if (template && this.templates.has(template)) {
        const templateContent = this.templates.get(template);
        emailHtml = this.renderTemplate(templateContent, data);
        emailText = this.stripHtml(emailHtml);
      }

      const mailOptions = {
        from: {
          name: 'Dahora Roots Confeitaria',
          address: process.env.SMTP_USER
        },
        to: to,
        subject: subject,
        html: emailHtml,
        text: emailText
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado:', result.messageId);
      return result;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  }

  /**
   * Renderiza template com dados
   * @param {string} template - Template HTML
   * @param {object} data - Dados para substituição
   */
  renderTemplate(template, data) {
    let rendered = template;

    // Substitui variáveis no formato {{variavel}}
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, value || '');
    }

    // Substitui variáveis globais
    const globalVars = {
      site_name: 'Dahora Roots Confeitaria',
      site_url: process.env.FRONTEND_URL || 'http://localhost:3001',
      api_url: process.env.API_URL || 'http://localhost:3000',
      support_email: 'contato@dahoraroots.com',
      current_year: new Date().getFullYear(),
      primary_color: process.env.COLOR_PRIMARY || '#E16A3D',
      secondary_color: process.env.COLOR_SECONDARY || '#FEA450',
      accent_color: process.env.COLOR_ACCENT || '#016A6D',
      dark_color: process.env.COLOR_DARK || '#043E52'
    };

    for (const [key, value] of Object.entries(globalVars)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, value);
    }

    return rendered;
  }

  /**
   * Remove tags HTML para versão texto
   * @param {string} html - HTML para converter
   */
  stripHtml(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  /**
   * Template de boas-vindas
   */
  getWelcomeTemplate() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo à {{site_name}}!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, {{primary_color}}, {{secondary_color}}); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: {{primary_color}}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍰 Bem-vindo à {{site_name}}!</h1>
            <p>Seu cadastro foi realizado com sucesso!</p>
          </div>
          <div class="content">
            <h2>Olá, {{nome}}!</h2>
            <p>É um prazer tê-lo conosco! Agora você pode:</p>
            <ul>
              <li>🍪 Explorar nossa seleção de doces artesanais</li>
              <li>🎂 Fazer pedidos personalizados</li>
              <li>📱 Acompanhar seus pedidos em tempo real</li>
              <li>💌 Receber ofertas exclusivas por email</li>
            </ul>
            <p>Comece sua jornada doce conosco!</p>
            <a href="{{site_url}}" class="button">Explorar Produtos</a>
            <p><strong>Email cadastrado:</strong> {{email}}</p>
          </div>
          <div class="footer">
            <p>{{site_name}} - {{current_year}}</p>
            <p>Dúvidas? Entre em contato: {{support_email}}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template de redefinição de senha
   */
  getPasswordResetTemplate() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinir Senha - {{site_name}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, {{primary_color}}, {{secondary_color}}); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: {{primary_color}}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Redefinir Senha</h1>
            <p>{{site_name}}</p>
          </div>
          <div class="content">
            <h2>Olá, {{nome}}!</h2>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            <a href="{{resetUrl}}" class="button">Redefinir Senha</a>
            <div class="warning">
              <p><strong>⚠️ Importante:</strong></p>
              <ul>
                <li>Este link é válido por apenas 1 hora</li>
                <li>Se você não solicitou esta redefinição, ignore este email</li>
                <li>Nunca compartilhe este link com outras pessoas</li>
              </ul>
            </div>
            <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">{{resetUrl}}</p>
          </div>
          <div class="footer">
            <p>{{site_name}} - {{current_year}}</p>
            <p>Dúvidas? Entre em contato: {{support_email}}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template de confirmação de redefinição de senha
   */
  getPasswordResetConfirmationTemplate() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Senha Redefinida - {{site_name}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, {{primary_color}}, {{secondary_color}}); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Senha Redefinida</h1>
            <p>{{site_name}}</p>
          </div>
          <div class="content">
            <h2>Olá, {{nome}}!</h2>
            <div class="success">
              <p><strong>🎉 Sua senha foi redefinida com sucesso!</strong></p>
            </div>
            <p>Agora você pode fazer login com sua nova senha.</p>
            <p>Se você não fez esta alteração, entre em contato conosco imediatamente.</p>
          </div>
          <div class="footer">
            <p>{{site_name}} - {{current_year}}</p>
            <p>Dúvidas? Entre em contato: {{support_email}}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template de confirmação de alteração de senha
   */
  getPasswordChangeConfirmationTemplate() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Senha Alterada - {{site_name}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, {{primary_color}}, {{secondary_color}}); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Senha Alterada</h1>
            <p>{{site_name}}</p>
          </div>
          <div class="content">
            <h2>Olá, {{nome}}!</h2>
            <div class="success">
              <p><strong>✅ Sua senha foi alterada com sucesso!</strong></p>
            </div>
            <p>Esta é uma confirmação de que a senha da sua conta foi alterada.</p>
            <p>Se você não fez esta alteração, entre em contato conosco imediatamente.</p>
          </div>
          <div class="footer">
            <p>{{site_name}} - {{current_year}}</p>
            <p>Dúvidas? Entre em contato: {{support_email}}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template de confirmação de pedido
   */
  getOrderConfirmationTemplate() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pedido Confirmado - {{site_name}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, {{primary_color}}, {{secondary_color}}); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-weight: bold; font-size: 18px; color: {{primary_color}}; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Pedido Confirmado!</h1>
            <p>{{site_name}}</p>
          </div>
          <div class="content">
            <h2>Olá, {{pedido.usuario.nome_completo}}!</h2>
            <p>Seu pedido foi confirmado e está sendo preparado com carinho!</p>
            
            <div class="order-info">
              <h3>📋 Detalhes do Pedido</h3>
              <p><strong>Número:</strong> {{pedido.numero_pedido}}</p>
              <p><strong>Data:</strong> {{pedido.data_pedido}}</p>
              <p><strong>Status:</strong> {{pedido.status}}</p>
              <p><strong>Método de Pagamento:</strong> {{pedido.metodo_pagamento}}</p>
            </div>

            <div class="order-info">
              <h3>🛍️ Itens do Pedido</h3>
              {{#each itens}}
              <div class="item">
                <p><strong>{{nome_produto}}</strong></p>
                <p>Quantidade: {{quantidade}} | Preço: R$ {{preco_unitario}}</p>
                <p>Subtotal: R$ {{subtotal}}</p>
              </div>
              {{/each}}
              <div class="total">
                <p>Total: R$ {{pedido.valor_total}}</p>
              </div>
            </div>

            <div class="order-info">
              <h3>📍 Endereço de Entrega</h3>
              <p>{{pedido.endereco_entrega.logradouro}}, {{pedido.endereco_entrega.numero}}</p>
              <p>{{pedido.endereco_entrega.bairro}}, {{pedido.endereco_entrega.cidade}} - {{pedido.endereco_entrega.estado}}</p>
              <p>CEP: {{pedido.endereco_entrega.cep}}</p>
            </div>
          </div>
          <div class="footer">
            <p>{{site_name}} - {{current_year}}</p>
            <p>Dúvidas? Entre em contato: {{support_email}}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template de atualização de status do pedido
   */
  getOrderStatusUpdateTemplate() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Atualização do Pedido - {{site_name}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, {{primary_color}}, {{secondary_color}}); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-update { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Atualização do Pedido</h1>
            <p>{{site_name}}</p>
          </div>
          <div class="content">
            <h2>Olá, {{pedido.usuario.nome_completo}}!</h2>
            <p>Seu pedido teve uma atualização de status!</p>
            
            <div class="status-update">
              <h3>🔄 Status Atualizado</h3>
              <p><strong>Pedido:</strong> {{pedido.numero_pedido}}</p>
              <p><strong>Novo Status:</strong> {{novo_status}}</p>
              {{#if observacoes}}
              <p><strong>Observações:</strong> {{observacoes}}</p>
              {{/if}}
            </div>
          </div>
          <div class="footer">
            <p>{{site_name}} - {{current_year}}</p>
            <p>Dúvidas? Entre em contato: {{support_email}}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template de cancelamento de pedido
   */
  getOrderCancellationTemplate() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pedido Cancelado - {{site_name}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, {{primary_color}}, {{secondary_color}}); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .cancellation-info { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Pedido Cancelado</h1>
            <p>{{site_name}}</p>
          </div>
          <div class="content">
            <h2>Olá, {{pedido.usuario.nome_completo}}!</h2>
            <p>Seu pedido foi cancelado conforme solicitado.</p>
            
            <div class="cancellation-info">
              <h3>📋 Detalhes do Cancelamento</h3>
              <p><strong>Pedido:</strong> {{pedido.numero_pedido}}</p>
              <p><strong>Data do Cancelamento:</strong> {{pedido.data_cancelamento}}</p>
              {{#if motivo}}
              <p><strong>Motivo:</strong> {{motivo}}</p>
              {{/if}}
            </div>

            <p>Se você tiver dúvidas sobre o cancelamento ou precisar de ajuda, entre em contato conosco.</p>
          </div>
          <div class="footer">
            <p>{{site_name}} - {{current_year}}</p>
            <p>Dúvidas? Entre em contato: {{support_email}}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template de newsletter
   */
  getNewsletterTemplate() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Newsletter - {{site_name}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, {{primary_color}}, {{secondary_color}}); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .product { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍰 Newsletter {{site_name}}</h1>
            <p>Novidades e ofertas especiais!</p>
          </div>
          <div class="content">
            <h2>Olá, {{nome}}!</h2>
            <p>Confira as novidades e ofertas especiais desta semana!</p>
            
            <div class="product">
              <h3>🆕 Novidades</h3>
              <p>Novos sabores e produtos chegaram na nossa confeitaria!</p>
            </div>

            <div class="product">
              <h3>🎯 Ofertas Especiais</h3>
              <p>Descontos exclusivos para nossos assinantes!</p>
            </div>
          </div>
          <div class="footer">
            <p>{{site_name}} - {{current_year}}</p>
            <p>Dúvidas? Entre em contato: {{support_email}}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Instância singleton do serviço
const emailService = new EmailService();

// Função de conveniência para enviar emails
const sendEmail = async (options) => {
  return await emailService.sendEmail(options);
};

module.exports = {
  EmailService,
  sendEmail
};