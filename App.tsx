
import React, { useState } from 'react';
import { 
  ChakraProvider, Box as ChakraBox, Container as ChakraContainer, 
  Tabs as ChakraTabs, Flex as ChakraFlex, Heading as ChakraHeading, 
  Text as ChakraText, Button as ChakraButton, VStack as ChakraVStack, 
  Spinner as ChakraSpinner, HStack as ChakraHStack, 
  Textarea as ChakraTextarea, Image as ChakraImage,
  Input as ChakraInput, Separator as ChakraSeparator,
  defaultSystem 
} from '@chakra-ui/react';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { generateLegislativeMinute } from './services/openai.ts';
import { MinutesDisplay } from './components/MinutesDisplay.tsx';

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

const Navbar = () => {
  const { signOut, user } = useAuth();
  return (
    <Box bg="blue.900" py={{ base: 3, md: 4 }} color="white" shadow="xl" borderBottomWidth="4px" borderColor="blue.700" position="sticky" top="0" zIndex="100">
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center">
          <HStack gap={{ base: 2, md: 3 }}>
            <Box bg="white" p={{ base: 1, md: 1.5 }} borderRadius="lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </Box>
            <VStack align="start" gap={0}>
              <Heading size={{ base: "xs", md: "md" }} letterSpacing="tight">AtaLegis IA</Heading>
              <Text fontSize="9px" textTransform="uppercase" fontWeight="bold" opacity={0.8} display={{ base: 'none', sm: 'block' }}>Gestão Legislativa</Text>
            </VStack>
          </HStack>
          <HStack gap={{ base: 2, md: 4 }}>
            {user?.picture && <Image src={user.picture} w={{ base: "24px", md: "32px" }} h={{ base: "24px", md: "32px" }} borderRadius="full" border="2px solid white" />}
            <VStack align="end" gap={0} display={{ base: 'none', lg: 'flex' }}>
              <Text fontSize="xs" fontWeight="bold">{user?.name || user?.email}</Text>
              <Text fontSize="10px" color="blue.200">Acesso Autorizado</Text>
            </VStack>
            <Button size={{ base: "xs", md: "sm" }} colorPalette="whiteAlpha" variant="ghost" onClick={signOut}>Sair</Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

const GeneratorTab = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await generateLegislativeMinute(inputText);
      setResult(data);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack gap={{ base: 4, md: 8 }} py={{ base: 4, md: 6 }} align="stretch">
      <Box bg="white" p={{ base: 4, md: 8 }} borderRadius="2xl" shadow="2xl" border="1px" borderColor="gray.100">
        <VStack gap={4} align="stretch">
          <Heading size="sm" color="gray.700">Relato ou Link da Sessão</Heading>
          <Textarea 
            placeholder="Ex: 15ª Sessão Ordinária. Vereador Carlos propôs PL 12/24. Aprovado por unanimidade..." 
            value={inputText} 
            minH={{ base: "180px", md: "220px" }}
            onChange={(e: any) => setInputText(e.target.value)}
            bg="gray.50"
            _focus={{ bg: "white", borderColor: "blue.500" }}
            borderRadius="xl"
            p={4}
            fontSize={{ base: "sm", md: "md" }}
          />
          <Button 
            colorPalette="blue" 
            h={{ base: "12", md: "14" }} 
            loading={loading} 
            loadingText="Processando..."
            onClick={handleGenerate}
            disabled={!inputText.trim()}
            borderRadius="xl"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
            shadow="lg"
            w="full"
          >
            GERAR DOCUMENTO OFICIAL
          </Button>
        </VStack>
      </Box>

      {loading && (
        <VStack py={12} bg="white" borderRadius="2xl" shadow="md" className="animate-fade-in">
          <Spinner size="xl" color="blue.600" thickness="4px" />
          <Text mt={4} color="gray.600" fontWeight="bold" textAlign="center" px={4}>Analisando quórum e pautas...</Text>
        </VStack>
      )}

      {result && <MinutesDisplay minutes={result} />}
    </VStack>
  );
};

const MainApp = () => (
  <Box minH="100vh" bg="gray.50" pb={{ base: 16, md: 20 }}>
    <Navbar />
    <Container maxW="container.lg" pt={{ base: 4, md: 8 }}>
      <Tabs.Root defaultValue="generator" colorPalette="blue">
        <Tabs.List mb={{ base: 4, md: 8 }} borderBottom="2px solid" borderColor="gray.200" overflowX="auto" whiteSpace="nowrap" className="custom-scrollbar">
          <Tabs.Trigger value="generator" px={{ base: 4, md: 8 }} fontSize={{ base: "sm", md: "md" }} fontWeight="bold">📝 Gerador</Tabs.Trigger>
          <Tabs.Trigger value="history" px={{ base: 4, md: 8 }} fontSize={{ base: "sm", md: "md" }} fontWeight="bold">📅 Histórico</Tabs.Trigger>
          <Tabs.Trigger value="help" px={{ base: 4, md: 8 }} fontSize={{ base: "sm", md: "md" }} fontWeight="bold">❓ Ajuda</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="generator"><GeneratorTab /></Tabs.Content>
        <Tabs.Content value="history">
          <Box bg="white" p={{ base: 6, md: 10 }} borderRadius="2xl" textAlign="center" shadow="sm">
            <Text color="gray.400">Nenhum documento salvo localmente ainda.</Text>
          </Box>
        </Tabs.Content>
        <Tabs.Content value="help">
          <Box bg="white" p={{ base: 6, md: 8 }} borderRadius="2xl" shadow="md">
            <Heading size="md" mb={4}>Guia Rápido</Heading>
            <Text color="gray.600" fontSize="sm">Para melhores resultados, insira os nomes dos vereadores presentes e o resultado de cada votação de forma clara. Se usar um link de vídeo, descreva brevemente o contexto da reunião.</Text>
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Container>
    <Box as="footer" position="fixed" bottom="0" w="full" bg="white" py={3} borderTopWidth="1px" textAlign="center" zIndex={10}>
      <Text fontSize={{ base: "10px", md: "xs" }} color="gray.400" px={4}>AtaLegis IA &bull; Sistema de Documentação Parlamentar Inteligente</Text>
    </Box>
  </Box>
);

const FeatureItem = ({ icon, title, description }: any) => (
  <HStack gap={4} align="start" w="full">
    <Box p={2} bg="blue.800" borderRadius="lg" color="blue.200">
      {icon}
    </Box>
    <VStack align="start" gap={0}>
      <Text fontWeight="bold" fontSize="sm">{title}</Text>
      <Text fontSize="xs" opacity={0.7}>{description}</Text>
    </VStack>
  </HStack>
);

const LoginPage = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLocalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signIn();
  };

  return (
    <Flex minH="100vh" direction={{ base: 'column', md: 'row' }}>
      {/* Área Azul */}
      <Flex 
        flex={{ base: 'none', md: 1.2 }} 
        bg="blue.900" 
        color="white" 
        p={{ base: 8, md: 16 }} 
        direction="column" 
        justify="center" 
        position="relative"
        textAlign={{ base: 'center', md: 'left' }}
      >
        <VStack align={{ base: 'center', md: 'start' }} gap={10} zIndex={1} maxW="500px">
          <VStack align={{ base: 'center', md: 'start' }} gap={4}>
            <HStack gap={4}>
              <Box bg="white" p={2} borderRadius="xl">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </Box>
              <Heading size="2xl" letterSpacing="tight">AtaLegis IA</Heading>
            </HStack>
            <Box px={3} py={1} bg="blue.700" borderRadius="full">
              <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">
                Powered by Gemini 3 Flash
              </Text>
            </Box>
            <Heading size="lg" fontWeight="medium" lineHeight="tall">
              Transforme sessões parlamentares em <strong>atas oficiais</strong> em segundos.
            </Heading>
          </VStack>

          <VStack align="start" gap={6} w="full" display={{ base: 'none', lg: 'flex' }}>
            <FeatureItem 
              title="Redação Jurídica" 
              description="Linguagem formal automatizada em conformidade com o regimento interno."
              icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            />
            <FeatureItem 
              title="Exportação Versátil" 
              description="Gere arquivos em PDF timbrado ou documentos Word (.docx) editáveis."
              icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6m-3 3l3 3 3-3"/></svg>}
            />
            <FeatureItem 
              title="Segurança Avançada" 
              description="Acesso via e-mail institucional com criptografia de ponta a ponta."
              icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
            />
          </VStack>
        </VStack>
      </Flex>

      {/* Área de Login */}
      <Flex flex={1} align="center" justify="center" p={{ base: 6, md: 8 }} bg="white">
        <VStack gap={8} w="full" maxW="380px">
          <VStack gap={2} textAlign="center">
            <Heading color="gray.800" size="lg">Bem-vindo ao AtaLegis IA</Heading>
            <Text color="gray.500" fontSize="sm">Acesse o portal administrativo</Text>
          </VStack>
          
          <VStack as="form" onSubmit={handleLocalLogin} gap={4} w="full">
            <VStack align="start" gap={1} w="full">
              <Text fontSize="xs" fontWeight="bold" color="gray.600" textTransform="uppercase">E-mail</Text>
              <Input 
                placeholder="exemplo@camara.gov.br" 
                type="email" 
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                h="12"
                bg="gray.50"
                _focus={{ bg: 'white', borderColor: 'blue.500', shadow: 'sm' }}
              />
            </VStack>
            <VStack align="start" gap={1} w="full">
              <Text fontSize="xs" fontWeight="bold" color="gray.600" textTransform="uppercase">Senha</Text>
              <Input 
                placeholder="••••••••" 
                type="password" 
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                h="12"
                bg="gray.50"
                _focus={{ bg: 'white', borderColor: 'blue.500', shadow: 'sm' }}
              />
            </VStack>
            <Button w="full" colorPalette="blue" h="12" type="submit" shadow="lg" fontWeight="bold">
              ENTRAR NO SISTEMA
            </Button>
          </VStack>

          <HStack w="full">
            <Separator flex={1} />
            <Text fontSize="xs" color="gray.400" fontWeight="bold">OU</Text>
            <Separator flex={1} />
          </HStack>

          <Button 
            w="full" colorPalette="gray" variant="outline" h="12" shadow="sm" borderRadius="md"
            onClick={signIn}
            fontSize="sm"
            fontWeight="bold"
            leftIcon={<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
          >
            Entrar com o Google
          </Button>
          
          <Text fontSize="10px" color="gray.400" textAlign="center" px={4} textTransform="uppercase" letterSpacing="widest">
            Acesso Restrito &bull; Gabinetes e Secretarias
          </Text>
        </VStack>
      </Flex>
    </Flex>
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
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <VStack gap={4}>
        <Spinner size="xl" color="blue.600" />
        <Text fontWeight="bold" color="blue.800">Sincronizando...</Text>
      </VStack>
    </Flex>
  );
  return isAuthenticated ? <MainApp /> : <LoginPage />;
};
