# 🔐 Guia de Integração Auth0 - AtaLegis IA

Este documento contém as configurações obrigatórias aplicadas no painel administrativo do [Auth0](https://manage.auth0.com/).

## 📋 Informações do Aplicativo
- **Nome do Projeto:** AtaLegis IA
- **Domínio (Domain):** `dev-xnsnqu63ecslm3eo.us.auth0.com`
- **ID do Cliente (Client ID):** `6TYrF3bj3qbNvb5QNOQvfz4zfZ5m89xn`
- **Tipo de Aplicativo:** Single Page Application (SPA)

---

## ⚙️ Configurações de URL (Application Settings)

No painel do Auth0, acesse **Applications > AtaLegis IA > Settings**:

### 1. Allowed Callback URLs
`http://localhost:5173/, https://atalegis.netlify.app/`

### 2. Allowed Logout URLs
`http://localhost:5173/, https://atalegis.netlify.app/`

### 3. Allowed Web Origins & CORS
`http://localhost:5173/, https://atalegis.netlify.app/`

---

## 🛰️ Addon: SAML2 Web App (Configuração Corporativa)

Para integrações com Provedores de Identidade (IdP) externos via SAML 2.0:

- **Versão SAML:** 2.0
- **Issuer:** `urn:dev-xnsnqu63ecslm3eo.us.auth0.com`
- **Identity Provider SHA1 Fingerprint:** `9A:08:75:5D:8E:79:01:5E:13:68:13:FC:F5:E0:59:37:FD:DC:E9:3E`
- **Login URL:** `https://dev-xnsnqu63ecslm3eo.us.auth0.com/samlp/6TYrF3bj3qbNvb5QNOQvfz4zfZ5m89xn`

---

## 🖥️ Addon: WS-Fed (Active Directory / .NET Integration)

Para sistemas baseados em Windows Identity Foundation (WIF) ou Active Directory Federation Services (ADFS):

### Parâmetros de Protocolo
- **SAML Version:** 1.1
- **Issuer:** `urn:auth0dev-xnsnqu63ecslm3eo`
- **Signing Certificate Thumbprint:** `9A08755D8E79015E136813FCF5E05937FDDCE93E`
- **Federation Metadata URL:** `https://dev-xnsnqu63ecslm3eo.us.auth0.com/wsfed/FederationMetadata/2007-06/FederationMetadata.xml`
- **Identity Provider Login URL:** `https://dev-xnsnqu63ecslm3eo.us.auth0.com/wsfed/6TYrF3bj3qbNvb5QNOQvfz4zfZ5m89xn`

### Exemplo de Configuração Web.config (.NET 4.5+)
```xml
<system.identityModel.services>
  <federationConfiguration>
    <wsFederation 
      passiveRedirectEnabled="true" 
      issuer="https://dev-xnsnqu63ecslm3eo.us.auth0.com/wsfed" 
      realm="YOUR_REALM" 
      requireHttps="false" />
  </federationConfiguration>
</system.identityModel.services>
```

---

## 🚀 URLs de Ambiente
- **Desenvolvimento:** `http://localhost:5173/`
- **Produção:** `https://atalegis.netlify.app/`
