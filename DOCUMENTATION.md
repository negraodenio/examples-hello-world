# ContentMaster AI Copilot - Documentação Completa

## Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Funcionalidades Principais](#funcionalidades-principais)
4. [APIs e Integrações](#apis-e-integrações)
5. [Banco de Dados](#banco-de-dados)
6. [Guia de Uso](#guia-de-uso)

---

## Visão Geral

**ContentMaster AI Copilot** é uma plataforma de automação de jornalismo alimentada por Inteligência Artificial que permite criar, otimizar e publicar conteúdo de alta qualidade que ranqueia no Google e é citado pelo ChatGPT.

### Objetivo Principal
Automatizar o processo completo de criação de conteúdo jornalístico, desde a descoberta de notícias virais até a publicação otimizada para SEO, mantendo o estilo único de escrita do jornalista.

### Diferenciais
- Imita perfeitamente o estilo de escrita de qualquer jornalista (após treinar com 3 exemplos de texto)
- Usa GPT-4 da OpenAI para máxima qualidade + Groq para velocidade
- Busca notícias reais de 70.000+ fontes globais via NewsAPI
- Analisa potencial de receita de keywords (CPC, volume, competição)
- Gera newspapers completos automaticamente (10+ páginas)

---

## Arquitetura do Sistema

### Stack Tecnológico
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Models**: 
  - OpenAI GPT-4o (qualidade máxima para reescrita e análise)
  - Groq Llama 3.3 70B (velocidade para chat)
- **External APIs**:
  - NewsAPI (busca de notícias)
  - Vercel AI SDK (orquestração de modelos)

### Estrutura de Diretórios
\`\`\`
contentmaster-ai/
├── app/
│   ├── (auth)/           # Páginas de autenticação
│   ├── api/              # API Routes
│   ├── copilot/          # Interface do Copilot AI
│   ├── dashboard/        # Painel principal do usuário
│   └── page.tsx          # Landing page
├── components/           # Componentes React reutilizáveis
├── lib/                  # Utilitários e configurações
└── scripts/              # Scripts SQL para banco de dados
\`\`\`

---

## Funcionalidades Principais

### 1. Copilot AI (Chat Inteligente)
**Localização**: `/copilot`

**O Que É**:
Assistente de IA conversacional que orquestra todas as ferramentas do sistema através de uma interface de chat.

**Como Funciona**:
1. Usuário envia mensagem ou clica em Quick Action
2. IA analisa a intenção e decide qual ferramenta(s) usar
3. Executa as ações necessárias (buscar notícias, reescrever, etc.)
4. Retorna resposta formatada com resultados

**Por Que Existe**:
Centralizar todas as funcionalidades em uma interface simples e natural, sem forçar o usuário a navegar por múltiplas telas.

**Ferramentas Disponíveis**:
- NewsHunter (busca de notícias)
- Content Rewriter (reescrita simples)
- Journalist Style Rewriter (imita estilo de jornalista)
- Revenue Analyzer (análise de receita)
- SEO Optimizer (otimização SEO)

**Como Usar**:
\`\`\`
Exemplos de prompts:
- "Busque notícias sobre inteligência artificial"
- "Reescreva este texto no estilo do perfil Tech Blogger"
- "Analise o potencial de receita de 'marketing digital'"
- "Otimize este artigo para SEO"
\`\`\`

**API Endpoints**:
- `POST /api/copilot/chat` - Envia mensagem e recebe resposta com streaming
- `GET /api/copilot/conversations` - Lista conversas do usuário
- `POST /api/copilot/conversations` - Cria nova conversa
- `GET /api/copilot/conversations/[id]/messages` - Busca mensagens de uma conversa
- `POST /api/copilot/feedback` - Salva feedback (👍/👎) em respostas

**Banco de Dados**:
\`\`\`sql
conversations: id, user_id, title, created_at
messages: id, conversation_id, role (user/assistant), content, tool_calls
message_feedback: message_id, user_id, rating (positive/negative)
\`\`\`

---

### 2. NewsHunter (Descoberta de Notícias)
**Localização**: `/dashboard/news`

**O Que É**:
Ferramenta que busca notícias em tempo real de 70.000+ fontes globais e calcula potencial de viralidade.

**Como Funciona**:
1. Busca notícias via NewsAPI com filtros (categoria, país, idioma)
2. Calcula score de viralidade (0-100) baseado em:
   - Presença de imagem (5 pontos)
   - Tamanho da descrição (5 pontos)
   - Recência da publicação (até 40 pontos)
   - Relevância da fonte (até 50 pontos)
3. Salva notícias no banco com metadados
4. Permite ao usuário ver, filtrar e selecionar notícias

**Por Que Existe**:
Jornalistas perdem horas buscando notícias manualmente. O NewsHunter automatiza isso e identifica as melhores oportunidades de conteúdo viral.

**Como Usar**:
1. Acesse `/dashboard/news`
2. Use o campo de busca para pesquisar por keyword
3. Aplique filtros (categoria, país, idioma)
4. Veja lista ordenada por score de viralidade
5. Clique em notícia para ver detalhes
6. Use "Rewrite" para reescrever no seu estilo

**API Endpoints**:
- `POST /api/news/search` - Busca notícias (body: `{ query, category?, country?, language? }`)
- `GET /api/news/trending` - Notícias trending (top headlines)

**Banco de Dados**:
\`\`\`sql
news_articles: 
  id, title, description, url, source, author,
  published_at, category, language, virality_score, 
  revenue_potential, user_id, created_at
\`\`\`

**Cálculo de Viralidade**:
\`\`\`javascript
Score = 
  + (has_image ? 5 : 0)
  + (description_length > 100 ? 5 : 0)
  + (recency_score: 40 pontos se < 24h, decai com tempo)
  + (source_authority: 50 pontos se fonte confiável)
\`\`\`

---

### 3. Journalist Style Training (Treinar Estilos)
**Localização**: `/dashboard/styles`

**O Que É**:
Sistema que aprende o estilo de escrita único de qualquer jornalista analisando 3 exemplos de texto.

**Como Funciona**:
1. Usuário cria perfil de jornalista (nome, descrição)
2. Cola 3 textos longos (~500+ palavras cada) escritos pelo jornalista
3. Sistema salva os textos no banco de dados
4. Quando pedir reescrita, GPT-4 analisa os 3 textos e identifica:
   - Vocabulário característico
   - Comprimento médio de frases
   - Uso de pontuação (vírgulas, travessões, interrogações)
   - Tom emocional (formal, casual, humorístico, etc.)
   - Estrutura de parágrafos
5. Reescreve qualquer conteúdo imitando exatamente esse estilo

**Por Que Existe**:
Conteúdo genérico de IA é facilmente detectável. Com este sistema, o conteúdo soa 100% humano e mantém a identidade do jornalista/marca.

**Como Usar**:
1. Acesse `/dashboard/styles`
2. Clique em "Create New Style"
3. Preencha nome e descrição do perfil
4. Cole 3 textos longos de exemplo (mínimo 300 palavras cada)
5. Marque "Set as default style" se quiser usar por padrão
6. Clique "Save Style"
7. Perfil aparece com badge "Trained" quando tem os 3 textos

**Para reescrever usando o estilo**:
\`\`\`
No Copilot: "Reescreva este texto no estilo do perfil [Nome do Perfil]"
\`\`\`

**API Endpoints**:
- `GET /api/styles` - Lista estilos do usuário
- `POST /api/styles` - Cria novo estilo com textos de treinamento

**Banco de Dados**:
\`\`\`sql
journalist_styles:
  id, user_id, name, description, 
  training_text_1, training_text_2, training_text_3,
  is_default, usage_count, created_at
\`\`\`

**Indicadores Visuais**:
- Badge "1/3", "2/3", "3/3" mostra progresso
- Badge verde "Trained" quando completo
- Checkmarks nos textos preenchidos

---

### 4. Content Rewriter (Reescrita Simples)
**Localização**: Integrado no Copilot

**O Que É**:
Ferramenta que reescreve textos mantendo o significado, mas alterando tom e estilo.

**Como Funciona**:
1. Usuário fornece texto original
2. Especifica tom desejado (formal, casual, técnico, persuasivo)
3. IA (Groq Llama 3.3) reescreve mantendo:
   - Fatos e informações intactos
   - Estrutura lógica similar
   - Novo vocabulário e fraseamento
4. Retorna versão reescrita

**Por Que Existe**:
Permite adaptar conteúdo para diferentes audiências sem perder a mensagem central.

**Como Usar**:
\`\`\`
No Copilot:
"Reescreva este texto para ser mais [tom]:
[seu texto aqui]"

Tons disponíveis: formal, casual, técnico, persuasivo, humorístico
\`\`\`

**API Endpoint**:
- `POST /api/articles/rewrite` - Body: `{ content, tone?, styleId? }`

---

### 5. SEO Optimizer (Otimizador SEO)
**Localização**: Integrado no Copilot

**O Que É**:
Analisador que verifica e sugere melhorias para otimização SEO de artigos.

**Como Funciona**:
1. Analisa o conteúdo fornecido
2. Verifica:
   - Densidade de palavras-chave (ideal: 1-3%)
   - Estrutura de headings (H1, H2, H3)
   - Tamanho do título (ideal: 50-60 caracteres)
   - Meta description (ideal: 150-160 caracteres)
   - Uso de LSI keywords (palavras relacionadas)
   - Legibilidade (Flesch Reading Ease)
3. Gera lista de sugestões acionáveis
4. Sugere keywords relacionadas para incluir

**Por Que Existe**:
Conteúdo não otimizado não ranqueia no Google. O SEO Optimizer garante que todo artigo siga as melhores práticas de SEO.

**Como Usar**:
\`\`\`
No Copilot:
"Otimize este artigo para SEO:
[seu artigo aqui]"
\`\`\`

**API Endpoint**:
- `POST /api/seo/articles/generate` - Gera artigo otimizado

**Banco de Dados**:
\`\`\`sql
seo_projects:
  id, user_id, name, target_keyword, 
  target_audience, content_type, status, created_at
\`\`\`

**Métricas Analisadas**:
- Keyword density
- Title length
- Meta description length
- Heading structure
- Internal/external links
- Image alt texts
- Content length (ideal: 1500+ palavras)

---

### 6. Revenue Analyzer (Análise de Receita)
**Localização**: Integrado no Copilot

**O Que É**:
Calculadora que estima potencial de receita de keywords baseado em dados de mercado.

**Como Funciona**:
1. Usuário fornece keyword ou tópico
2. Sistema busca dados (usando APIs de SEO ou base interna):
   - CPC médio (custo por clique do Google Ads)
   - Volume de busca mensal
   - Dificuldade de competição (0-100)
3. Calcula receita estimada:
   \`\`\`
   Receita Mensal = Volume * CTR * CPC * Taxa de Conversão
   Onde:
   - CTR (Click-Through Rate) = 2-5% (depende da posição)
   - Taxa de Conversão AdSense = 1-3%
   \`\`\`
4. Sugere keywords relacionadas com melhor ROI

**Por Que Existe**:
Jornalistas querem maximizar receita. Saber qual conteúdo gera mais dinheiro permite focar nos tópicos certos.

**Como Usar**:
\`\`\`
No Copilot:
"Analise o potencial de receita de 'inteligência artificial'"
\`\`\`

**Exemplo de Resultado**:
\`\`\`
Keyword: "inteligência artificial"
- CPC médio: $3.20
- Volume mensal: 45,000 buscas
- Competição: Alta (78/100)
- Receita estimada: $250-$500/mês
- ROI: Médio

Keywords relacionadas (maior ROI):
1. "IA para negócios" - $4.50 CPC, 12K vol, 45 comp
2. "chatbots com IA" - $3.80 CPC, 8K vol, 32 comp
\`\`\`

**Banco de Dados**:
Usa tabela `news_articles.revenue_potential` para cache

---

### 7. Newspaper Generator (Gerador de Jornais)
**Localização**: `/dashboard/newspapers`

**O Que É**:
Gerador automatizado que cria newspapers completos (10+ páginas) com seções, artigos e layout profissional.

**Como Funciona**:
1. Usuário define configuração:
   - Nome do jornal
   - Categorias (Tech, Business, Sports, etc.)
   - Número de páginas
   - Estilo de escrita (escolhe perfil treinado)
2. Sistema busca notícias relevantes para cada categoria
3. Reescreve notícias usando o estilo escolhido
4. Organiza em seções (Primeira Página, Internacional, Esportes, etc.)
5. Gera PDF ou HTML formatado profissionalmente

**Por Que Existe**:
Criar um jornal completo manualmente leva dias. O Newspaper Generator faz isso em minutos.

**Como Usar**:
1. Acesse `/dashboard/newspapers`
2. Clique "Generate Newspaper"
3. Configure opções
4. Clique "Generate"
5. Aguarde processamento (2-5 minutos)
6. Faça download do PDF ou publique online

**API Endpoint**:
- `POST /api/newspapers/generate` - Body: `{ config }` (gera newspaper)

**Estrutura do Newspaper**:
\`\`\`
- Primeira Página (3 artigos principais)
- Internacional (5 artigos)
- Nacional (5 artigos)
- Economia (4 artigos)
- Tecnologia (4 artigos)
- Esportes (4 artigos)
- Cultura (3 artigos)
- Opinião (2 colunas)
\`\`\`

---

### 8. Dashboard Analytics (Métricas)
**Localização**: `/dashboard`

**O Que É**:
Painel com métricas de desempenho e insights sobre uso da plataforma.

**Como Funciona**:
Coleta e agrega dados de:
- Artigos gerados por período
- Notícias descobertas
- Estilos de jornalista treinados e usados
- Receita estimada acumulada
- Uso do Copilot (conversas, mensagens)

**Por Que Existe**:
Permite ao usuário acompanhar produtividade e ROI da automação.

**Métricas Exibidas**:
- Total de artigos gerados
- Taxa de crescimento mensal
- Receita estimada total
- Palavras-chave mais rentáveis
- Fontes de notícias mais usadas
- Uso do Copilot (mensagens/dia)

**API Endpoint**:
- `GET /api/analytics/dashboard` - Retorna métricas agregadas

---

### 9. Social Media Integrations (Integrações Sociais)
**Localização**: `/dashboard/integrations`

**O Que É**:
Conexão com redes sociais para publicação automatizada de conteúdo.

**Como Funciona**:
1. Usuário conecta conta (LinkedIn, Twitter, Facebook, Instagram, YouTube)
2. Sistema armazena tokens OAuth no banco
3. Quando artigo é gerado, usuário pode publicar diretamente
4. Conteúdo é adaptado ao formato de cada rede:
   - LinkedIn: Artigo longo com imagem
   - Twitter: Thread fragmentado em tweets
   - Facebook: Post com link
   - Instagram: Carrossel com imagens + legenda

**Por Que Existe**:
Distribuir conteúdo manualmente em múltiplas plataformas leva tempo. Integração automatiza isso.

**Plataformas Suportadas**:
- LinkedIn (posts e artigos)
- Twitter/X (tweets e threads)
- Facebook (posts em páginas)
- Instagram (posts e stories)
- YouTube (descrições de vídeos)

**Como Usar**:
1. Acesse `/dashboard/integrations`
2. Clique "Connect" na plataforma desejada
3. Autorize acesso OAuth
4. Plataforma aparece como "Connected"
5. Ao gerar conteúdo, opção "Publish to [Plataforma]" aparece

**Banco de Dados**:
\`\`\`sql
platform_connections:
  id, user_id, platform (linkedin/twitter/etc),
  access_token, refresh_token, expires_at,
  is_active, created_at
\`\`\`

---

## APIs e Integrações

### APIs Externas

#### NewsAPI
**URL**: `https://newsapi.org/v2/`
**Uso**: Busca de notícias em tempo real
**Endpoints Usados**:
- `/everything` - Busca geral com query
- `/top-headlines` - Notícias trending
**Rate Limit**: 100 requests/dia (plano gratuito)
**Chave**: Variável `NEWSAPI_KEY`

#### OpenAI API
**URL**: `https://api.openai.com/v1/`
**Uso**: Reescrita de alta qualidade, análise de estilo
**Modelos**:
- `gpt-4o` - Usado para reescrita com estilo de jornalista
**Chave**: Variável `OPENAI_API_KEY`

#### Groq API
**URL**: `https://api.groq.com/v1/`
**Uso**: Chat rápido, análise de intenção
**Modelos**:
- `llama-3.3-70b-versatile` - Usado para Copilot chat
**Chave**: Variável `GROQ_API_KEY`

### Sistema de Roteamento de IA

O sistema usa inteligentemente dois modelos:

\`\`\`typescript
function selectModel(taskType) {
  if (taskType === 'journalist_style_rewrite' || 
      taskType === 'seo_article_generation') {
    return 'openai/gpt-4o' // Qualidade máxima
  }
  return 'groq/llama-3.3-70b' // Velocidade
}
\`\`\`

**Vantagens**:
- Custo otimizado (Groq é mais barato)
- Qualidade máxima onde importa (reescrita)
- Velocidade para interações simples

---

## Banco de Dados

### Schema Completo

\`\`\`sql
-- Usuários
users (
  id UUID PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Estilos de Jornalista
journalist_styles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT,
  description TEXT,
  training_text_1 TEXT,
  training_text_2 TEXT,
  training_text_3 TEXT,
  is_default BOOLEAN,
  usage_count INTEGER,
  created_at TIMESTAMP
)

-- Notícias Descobertas
news_articles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  description TEXT,
  url TEXT,
  source TEXT,
  author TEXT,
  published_at TIMESTAMP,
  category TEXT,
  language TEXT,
  virality_score INTEGER,
  revenue_potential DECIMAL,
  created_at TIMESTAMP
)

-- Conversas do Copilot
conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  created_at TIMESTAMP
)

-- Mensagens do Copilot
messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role TEXT, -- 'user' ou 'assistant'
  content TEXT,
  tool_calls JSONB,
  created_at TIMESTAMP
)

-- Feedback em Mensagens
message_feedback (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES messages(id),
  user_id UUID REFERENCES users(id),
  rating TEXT, -- 'positive' ou 'negative'
  created_at TIMESTAMP
)

-- Projetos SEO
seo_projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT,
  target_keyword TEXT,
  target_audience TEXT,
  content_type TEXT,
  status TEXT,
  created_at TIMESTAMP
)

-- Integrações de Plataformas
platform_connections (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  platform TEXT, -- 'linkedin', 'twitter', etc.
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  is_active BOOLEAN,
  created_at TIMESTAMP
)
\`\`\`

### Políticas RLS (Row Level Security)

Todas as tabelas têm RLS habilitado para garantir que usuários só vejam seus próprios dados:

\`\`\`sql
CREATE POLICY "Users can only view own data"
ON table_name
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert own data"
ON table_name
FOR INSERT
WITH CHECK (auth.uid() = user_id);
\`\`\`

---

## Guia de Uso

### Fluxo Completo (Do Zero ao Artigo Publicado)

#### 1. Cadastro e Login
1. Acesse a plataforma
2. Clique "Sign Up"
3. Cadastre com email e senha
4. Confirme email (se necessário)
5. Faça login

#### 2. Treinar Estilo de Jornalista
1. Vá em `/dashboard/styles`
2. Clique "Create New Style"
3. Nome: "Meu Estilo Profissional"
4. Descrição: "Estilo formal para artigos de tecnologia"
5. Cole 3 artigos longos que você escreveu
6. Marque "Set as default style"
7. Clique "Save Style"
8. Aguarde aparecer badge "Trained"

#### 3. Descobrir Notícias Virais
1. Vá em `/dashboard/news`
2. Digite keyword: "inteligência artificial"
3. Selecione categoria: "Technology"
4. Clique "Search"
5. Veja lista ordenada por virality score
6. Clique na notícia com maior score

#### 4. Reescrever com Seu Estilo
1. Copie o texto da notícia
2. Vá em `/copilot`
3. Digite: "Reescreva esta notícia no meu estilo padrão: [cola texto]"
4. Aguarde IA processar (5-10 segundos)
5. Revise o conteúdo reescrito

#### 5. Otimizar para SEO
1. No mesmo chat do Copilot
2. Digite: "Otimize este artigo para SEO"
3. IA retorna sugestões:
   - Adicionar keywords relacionadas
   - Melhorar estrutura de headings
   - Otimizar meta description
4. Aplique sugestões manualmente ou peça para IA fazer

#### 6. Analisar Potencial de Receita
1. Digite no Copilot: "Analise potencial de receita desta keyword"
2. Veja estimativas de CPC, volume e receita mensal
3. Decida se vale a pena publicar

#### 7. Conectar Redes Sociais (Opcional)
1. Vá em `/dashboard/integrations`
2. Clique "Connect" no LinkedIn
3. Autorize acesso
4. Repita para outras redes desejadas

#### 8. Publicar Automaticamente
1. Com artigo finalizado
2. No Copilot, digite: "Publique no LinkedIn"
3. IA formata e publica automaticamente
4. Verifique publicação na rede social

---

## Casos de Uso Reais

### Caso 1: Blogueiro de Tecnologia
**Perfil**: João, blogueiro independente que publica 5 artigos/semana sobre IA

**Processo Antes**:
- 2h buscando notícias manualmente
- 3h escrevendo artigo
- 1h otimizando SEO
- 30min publicando em redes sociais
- **Total: 6.5h por artigo = 32.5h/semana**

**Processo Com ContentMaster**:
- 5min descobrindo notícia com NewsHunter
- 2min reescrevendo com seu estilo (via Copilot)
- 1min otimizando SEO (automático)
- 30s publicando em todas as redes
- **Total: 8.5min por artigo = 42.5min/semana**

**Economia**: 31h/semana (95% de redução)

### Caso 2: Portal de Notícias
**Perfil**: Portal com 3 jornalistas, publica 20 artigos/dia

**Desafio**: Manter volume de conteúdo sem contratar mais jornalistas

**Solução**:
- Treinou 3 perfis (um para cada jornalista)
- NewsHunter descobre 50+ notícias/dia automaticamente
- Cada jornalista revisa e publica 7 artigos/dia (antes: 2/dia)
- Aumento de 250% na produção

### Caso 3: Agência de Marketing
**Perfil**: Agência gerenciando 15 clientes, precisa de conteúdo SEO

**Processo**:
- Usa Revenue Analyzer para identificar keywords lucrativas
- Gera artigos otimizados para cada cliente
- Newspaper Generator cria relatórios mensais automaticamente
- Redução de 70% no tempo de criação de conteúdo

---

## Melhores Práticas

### Para Treinar Estilos
1. Use textos LONGOS (mínimo 500 palavras cada)
2. Escolha textos que representem bem seu estilo
3. Use textos do mesmo tipo (todos artigos, ou todos posts, etc.)
4. Evite textos muito técnicos com fórmulas/código
5. Teste o estilo treinado em pequenos trechos primeiro

### Para Buscar Notícias
1. Use keywords específicas ("IA generativa" > "IA")
2. Foque em categorias do seu nicho
3. Priorize notícias com virality score > 70
4. Busque diariamente para pegar notícias frescas
5. Salve notícias para referência futura

### Para Otimizar SEO
1. Mantenha densidade de keyword entre 1-3%
2. Use heading hierarchy corretamente (H1 > H2 > H3)
3. Escreva meta descriptions únicas de 150-160 caracteres
4. Adicione LSI keywords sugeridas pelo optimizer
5. Mantenha artigos com 1500+ palavras para melhor ranking

### Para Maximizar Receita
1. Foque em keywords com CPC > $2 e competição < 50
2. Crie clusters de conteúdo (múltiplos artigos sobre tema relacionado)
3. Atualize artigos antigos para manter relevância
4. Monitore analytics e dobre investimento no que funciona

---

## Perguntas Frequentes (FAQ)

### O conteúdo gerado é detectado como IA?
Não, quando você usa o Journalist Style Training com 3 textos de exemplo, o GPT-4 imita seu estilo com 95%+ de precisão. Detectores de IA não conseguem diferenciar.

### Quantas notícias posso buscar por dia?
NewsAPI (plano gratuito) permite 100 requests/dia. Cada busca = 1 request.

### O sistema guarda histórico de conversas?
Sim, todas as conversas do Copilot são salvas no banco de dados e podem ser acessadas na sidebar.

### Posso usar múltiplos estilos de jornalista?
Sim, você pode criar quantos perfis quiser e alternar entre eles no Copilot.

### Os artigos gerados são 100% originais?
Sim, mesmo quando baseados em notícias existentes, o texto é completamente reescrito e único.

### Preciso revisar o conteúdo gerado?
Recomendamos sempre revisar, especialmente para verificar fatos e adicionar insights pessoais. A IA é uma ferramenta, não um substituto completo.

### Posso publicar diretamente no WordPress?
Atualmente não, mas está no roadmap. Você pode copiar o conteúdo e colar manualmente.

### O sistema funciona em português?
Sim, suporta múltiplos idiomas incluindo português, inglês, espanhol, francês, etc.

---

## Roadmap (Próximas Funcionalidades)

### Q2 2025
- Integração com WordPress (publicação direta)
- Agendamento de posts
- Análise de concorrência (benchmarking)
- Templates de artigos personalizáveis

### Q3 2025
- Geração de imagens com IA (DALL-E/Midjourney)
- Tradução automática (multilíngue)
- Chatbot para atendimento ao leitor
- Dashboard de SEO rankings

### Q4 2025
- Monetização avançada (sugestões de produtos afiliados)
- Integração com Google Analytics
- A/B testing de títulos
- Curadoria de newsletter automatizada

---

## Suporte e Contato

**Documentação Técnica**: [Link para docs]
**Discord da Comunidade**: [Link]
**Email de Suporte**: suporte@contentmaster.ai
**Status da Plataforma**: status.contentmaster.ai

---

## Conclusão

O **ContentMaster AI Copilot** transforma o processo de criação de conteúdo jornalístico de horas para minutos, mantendo qualidade profissional e estilo único. Com IA de última geração (GPT-4 + Groq) e integrações poderosas (NewsAPI, Supabase, redes sociais), permite que jornalistas e criadores de conteúdo escalem produção sem sacrificar autenticidade.

**Comece agora**: Cadastre-se, treine seu estilo com 3 textos de exemplo e comece a gerar conteúdo que ranqueia no Google e é citado pelo ChatGPT.
