
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  ChakraProvider, Box as ChakraBox, Container as ChakraContainer, 
  Tabs as ChakraTabs, Flex as ChakraFlex, Heading as ChakraHeading, 
  Text as ChakraText, Button as ChakraButton, VStack as ChakraVStack, 
  Spinner as ChakraSpinner, HStack as ChakraHStack, 
  Textarea as ChakraTextarea, Image as ChakraImage,
  Input as ChakraInput, Separator as ChakraSeparator,
  defaultSystem 
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { generateLegislativeMinute } from './services/openai.ts';
import { MinutesDisplay } from './components/MinutesDisplay.tsx';
import { youtubeService } from './services/youtube.service.ts';

const Box = ChakraBox as any;
const Container = ChakraContainer as any;
const Tabs = ChakraTabs as any;
const Flex = ChakraFlex as any;
const Heading = ChakraHeading as any;
const Text = ChakraText as any;
const Button = ChakraButton as any;
const VStack = ChakraVStack as any;
const Spinner = ChakraSpinner as any;
const HStack = ChakraHStack as any;
const Textarea = ChakraTextarea as any;
const Image = ChakraImage as any;
const Input = ChakraInput as any;
const Separator = ChakraSeparator as any;

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionVStack = motion(VStack);

// --- Ícones Customizados ---

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// --- Componentes UI ---

const FeatureItem = ({ icon: Icon, title, description }: any) => (
  <HStack gap={4} align="flex-start" w="full">
    <Box 
      w="40px" h="40px" bg="whiteAlpha.100" borderRadius="10px" 
      display="flex" align="center" justify="center" flexShrink={0}
      color="blue.300"
    >
      <Icon />
    </Box>
    <VStack align="start" gap={0}>
      <Text fontSize="15px" fontWeight="700" color="white">{title}</Text>
      <Text fontSize="13px" color="whiteAlpha.700" lineHeight="1.5">{description}</Text>
    </VStack>
  </HStack>
);

const YouTubeSection = ({ onTranscriptionGenerated }: { onTranscriptionGenerated: (text: string) => void }) => {
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);

  const handleValidate = async () => {
    setIsValidating(true);
    setVideoInfo(null);
    try {
      const info = await youtubeService.validateVideo(url);
      setVideoInfo(info);
    } catch (e: any) {
      alert(e.message || "Erro ao validar vídeo.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleProcessVideo = async () => {
    if (!url) return;
    setIsProcessing(true);
    try {
      const transcription = await youtubeService.extractTranscription(url);
      onTranscriptionGenerated(transcription);
    } catch (e: any) {
      alert(e.message || "Erro ao processar transcrição via Supadata.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <VStack gap={6} align="stretch" w="full">
      <VStack gap={2} align="start">
        <Text fontSize="sm" fontWeight="bold" color="gray.600">URL do Vídeo (YouTube)</Text>
        <HStack w="full" gap={3}>
          <Input 
            flex={1} 
            placeholder="https://youtube.com/watch?v=..." 
            value={url}
            onChange={(e: any) => setUrl(e.target.value)}
            borderRadius="xl"
            bg="gray.50"
            h="12"
          />
          <Button 
            colorPalette="blue" 
            h="12" 
            px={8} 
            borderRadius="xl"
            loading={isValidating}
            onClick={handleValidate}
            disabled={!url || isProcessing}
          >
            Analisar
          </Button>
        </HStack>
      </VStack>

      {videoInfo && (
        <MotionBox 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          p={5} bg="blue.50" borderRadius="2xl" border="1px solid" borderColor="blue.100"
        >
          <HStack gap={6} align="start" direction={{ base: 'column', md: 'row' }}>
            <Box position="relative" w={{ base: 'full', md: '180px' }}>
              <Image src={videoInfo.thumbnail} borderRadius="xl" shadow="lg" w="full" />
              <Box position="absolute" top="2" right="2" bg="red.600" color="white" px={2} py={0.5} borderRadius="md" fontSize="10px" fontWeight="bold">SESSÃO LEGISLATIVA</Box>
            </Box>
            <VStack align="start" gap={3} flex={1}>
              <Box>
                <Text fontWeight="800" fontSize="md" color="blue.900" noOfLines={2}>{videoInfo.title}</Text>
                <Text fontSize="xs" color="blue.600" mt={1}>Plataforma: YouTube &bull; Transcrição Supadata AI Ativa</Text>
              </Box>
              <Separator />
              <HStack gap={4} w="full">
                <Button 
                  size="md" 
                  colorPalette="blue" 
                  w="full"
                  borderRadius="xl"
                  fontWeight="bold"
                  loading={isProcessing}
                  loadingText="Analisando Áudio..."
                  onClick={handleProcessVideo}
                >
                  Processar e Gerar Ata
                </Button>
              </HStack>
              <Text fontSize="10px" color="gray.500">
                {isProcessing 
                  ? "A Supadata está convertendo o áudio em texto. Para vídeos longos, isso pode levar até 2 minutos."
                  : "A transcrição será processada e enviada automaticamente para o Gemini IA para redação da ata."}
              </Text>
            </VStack>
          </HStack>
        </MotionBox>
      )}
    </VStack>
  );
};

// --- Telas Principais ---

const LoginPage = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !email.endsWith('.gov.br')) {
      setError('Apenas e-mails institucionais (.gov.br) são permitidos');
      return;
    }
    setError(null);
    setIsLoading(true);
    // Simulação de login local redirecionando para Auth0
    setTimeout(() => signIn(), 800);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn();
    } catch (err: any) {
      setError('Falha ao iniciar autenticação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotionFlex className="login-page-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* HERO SECTION (Left) */}
      <MotionFlex 
        className="hero-section" 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <VStack align="start" gap={10} maxW="440px" zIndex={2}>
          {/* Logo Area */}
          <VStack align="start" gap={2}>
            <Box p={2.5} bg="white" borderRadius="12px" color="blue.900" shadow="lg">
              <DocumentIcon />
            </Box>
            <VStack align="start" gap={0}>
              <Heading fontSize="36px" fontWeight="700" color="white" letterSpacing="-0.5px">AtaLegis IA</Heading>
              <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="1.5px" color="whiteAlpha.800">Gestão Legislativa</Text>
            </VStack>
          </VStack>

          {/* Badge */}
          <Box className="tech-badge">Powered by Gemini 3 Pro</Box>

          {/* Headline */}
          <Heading fontSize="28px" fontWeight="500" lineHeight="1.4" color="white">
            Transforme sessões parlamentares em <span className="highlight-gold">atas oficiais</span> em segundos.
          </Heading>

          {/* Features */}
          <VStack align="start" gap={8} w="full" display={{ base: 'none', lg: 'flex' }}>
            <FeatureItem icon={ShieldIcon} title="Redação Jurídica" description="Linguagem formal automatizada com IA" />
            <FeatureItem icon={DocumentIcon} title="Exportação Versátil" description="PDF timbrado ou Word editável para gabinetes" />
            <FeatureItem icon={LockIcon} title="Segurança Avançada" description="Criptografia ponta a ponta e conformidade LGPD" />
          </VStack>
        </VStack>
      </MotionFlex>

      {/* FORM SECTION (Right) */}
      <MotionFlex 
        className="form-section" 
        initial={{ x: 100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      >
        <VStack w="full" maxW="420px" gap={10} align="stretch">
          <VStack gap={2} textAlign="center">
            <Heading fontSize="28px" fontWeight="700" color="gray.900" letterSpacing="-0.5px">Bem-vindo ao AtaLegis IA</Heading>
            <Text fontSize="15px" color="gray.500">Acesse o portal administrativo institucional</Text>
          </VStack>

          <AnimatePresence>
            {error && (
              <MotionBox initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <Box p={4} bg="red.50" border="1px solid" borderColor="red.100" borderRadius="10px" color="red.600" fontSize="13px" fontWeight="600" display="flex" align="center" gap={3}>
                  <span>⚠️</span> {error}
                </Box>
              </MotionBox>
            )}
          </AnimatePresence>

          <VStack as="form" onSubmit={handleLogin} gap={6}>
            <VStack align="start" gap={2} w="full">
              <Text as="label" fontSize="12px" fontWeight="700" color="gray.600" textTransform="uppercase" letterSpacing="0.5px">E-mail</Text>
              <input 
                type="email" 
                placeholder="exemplo@camara.gov.br" 
                className="custom-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </VStack>

            <VStack align="start" gap={2} w="full">
              <Text as="label" fontSize="12px" fontWeight="700" color="gray.600" textTransform="uppercase" letterSpacing="0.5px">Senha</Text>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="custom-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </VStack>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Autenticando...' : 'ENTRAR NO SISTEMA'}
            </button>
          </VStack>

          <HStack gap={4} w="full">
            <Box flex={1} h="1px" bg="gray.100" />
            <Text fontSize="12px" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="1px">OU</Text>
            <Box flex={1} h="1px" bg="gray.100" />
          </HStack>

          <button type="button" className="google-btn" onClick={handleGoogleLogin} disabled={isLoading}>
            <GoogleIcon />
            Entrar com o Google
          </button>

          <VStack gap={4} pt={4} borderTop="1px solid" borderColor="gray.50">
            <Text fontSize="11px" fontWeight="600" color="gray.400" textTransform="uppercase" letterSpacing="1.2px">Acesso Restrito • Gabinetes e Secretarias</Text>
          </VStack>
        </VStack>
      </MotionFlex>
    </MotionFlex>
  );
};

const Dashboard = () => {
  const { signOut, user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerateFromTranscription = async (transcription: string) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await generateLegislativeMinute(transcription);
      setResult(data);
    } catch (e: any) {
      alert(e.message || "Erro ao gerar ata a partir da transcrição.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await generateLegislativeMinute(inputText);
      setResult(data);
    } catch (e) {
      alert("Erro ao processar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="blue.900" py={4} shadow="xl" borderBottom="4px solid" borderColor="blue.700">
        <Container maxW="container.lg">
          <Flex justify="space-between" align="center">
            <HStack gap={4}>
              <Box bg="white" p={2} borderRadius="xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#001a33" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </Box>
              <VStack align="start" gap={0}>
                <Heading color="white" size="md">AtaLegis IA</Heading>
                <Text color="blue.200" fontSize="9px" fontWeight="bold" textTransform="uppercase">Módulo Administrativo</Text>
              </VStack>
            </HStack>
            <HStack gap={4}>
              <VStack align="end" gap={0} display={{ base: 'none', md: 'flex' }}>
                <Text color="white" fontSize="xs" fontWeight="bold">{user?.name || user?.email}</Text>
                <Text color="blue.300" fontSize="10px">ID: {user?.sub?.slice(0,8)}</Text>
              </VStack>
              {user?.picture && <Image src={user.picture} w="40px" h="40px" borderRadius="full" border="2px solid white" />}
              <Button size="sm" variant="outline" colorPalette="whiteAlpha" onClick={signOut}>Sair</Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.lg" py={10}>
        <VStack gap={8} align="stretch">
          <Box bg="white" borderRadius="3xl" shadow="2xl" overflow="hidden">
            <Tabs.Root defaultValue="manual" colorPalette="blue">
              <Tabs.List bg="gray.50" px={8} pt={4}>
                <Tabs.Trigger value="manual" fontWeight="800" py={4}>📝 Texto Manual</Tabs.Trigger>
                <Tabs.Trigger value="youtube" fontWeight="800" py={4}>📺 Importar do YouTube (Supadata)</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="manual" p={8}>
                <VStack gap={6} align="stretch">
                  <Textarea 
                    placeholder="Descreva aqui os pontos principais da sessão legislativa..." 
                    minH="250px"
                    value={inputText}
                    onChange={(e: any) => setInputText(e.target.value)}
                    borderRadius="2xl"
                    bg="gray.50"
                    _focus={{ bg: "white", borderColor: "blue.500" }}
                  />
                  <Button 
                    size="lg" colorPalette="blue" h="16" borderRadius="2xl" fontWeight="800"
                    loading={loading} onClick={handleManualGenerate}
                    disabled={!inputText.trim()}
                  >
                    GERAR ATA OFICIAL COM GEMINI IA
                  </Button>
                </VStack>
              </Tabs.Content>
              <Tabs.Content value="youtube" p={8}>
                <YouTubeSection onTranscriptionGenerated={handleGenerateFromTranscription} />
              </Tabs.Content>
            </Tabs.Root>
          </Box>

          <AnimatePresence>
            {loading && (
              <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} py={12} textAlign="center">
                <Spinner size="xl" color="blue.600" thickness="4px" />
                <Text mt={4} fontWeight="800" color="blue.900">IA processando conteúdo e regimentos...</Text>
                <Text fontSize="xs" color="gray.500">Isso pode levar alguns instantes para transcrições longas (Supadata + Gemini 3 Pro).</Text>
              </MotionBox>
            )}
          </AnimatePresence>

          {result && <MinutesDisplay minutes={result} />}
        </VStack>
      </Container>
      
      <Box as="footer" py={6} textAlign="center" borderTop="1px solid" borderColor="gray.100" bg="white">
        <Text fontSize="xs" color="gray.400" fontWeight="bold">© 2025 AtaLegis IA - Soluções Legislativas Inteligentes &bull; Supadata & Gemini Integrated</Text>
      </Box>
    </Box>
  );
};

export const App = () => (
  <ChakraProvider value={defaultSystem}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </ChakraProvider>
);

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return (
    <Flex minH="100vh" align="center" justify="center" bg="brand-primary-900" className="animated-gradient">
      <VStack gap={6}>
        <Spinner size="xl" color="white" thickness="4px" />
        <Text color="white" fontWeight="900" letterSpacing="widest">ATALEGIS IA</Text>
      </VStack>
    </Flex>
  );

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
};
