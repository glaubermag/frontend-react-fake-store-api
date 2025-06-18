import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Store } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: 'https://picsum.photos/150/150',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [checkboxError, setCheckboxError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCheckboxError('');
    if (formData.password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!termsAccepted || !privacyAccepted) {
      setCheckboxError('Você deve aceitar os termos e a política de privacidade.');
      return;
    }
    setIsSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login', { 
        state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
      });
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'name') {
      setNameError('');
    }
  };

  const handleNameBlur = () => {
    if (!formData.name.trim()) {
      setNameError('Nome é obrigatório');
    }
  };

  const handleEmailBlur = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordBlur = () => {
    if (formData.password.length < 6) {
      setPasswordError('Senha deve ter pelo menos 6 caracteres');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (formData.password !== confirmPassword) {
      setConfirmPasswordError('Senhas não coincidem');
    } else {
      setConfirmPasswordError('');
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Store className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cadastro
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Junte-se à nossa comunidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" role="form">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleNameBlur}
                  required
                  className="h-12 border-slate-300 focus:border-blue-500"
                />
                {nameError && (
                  <span className="text-red-600 text-sm">{nameError}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleEmailBlur}
                  required
                  className="h-12 border-slate-300 focus:border-blue-500"
                />
                {emailError && (
                  <span className="text-red-600 text-sm">{emailError}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handlePasswordBlur}
                  required
                  className="h-12 border-slate-300 focus:border-blue-500"
                  aria-label="Senha"
                />
                {passwordError && (
                  <span className="text-red-600 text-sm">{passwordError}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirmação</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onBlur={handleConfirmPasswordBlur}
                  required
                  className="h-12 border-slate-300 focus:border-blue-500"
                  aria-label="Confirmação"
                />
                {confirmPasswordError && (
                  <span className="text-red-600 text-sm">{confirmPasswordError}</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    required
                    aria-label="Aceito os termos"
                  />
                  Aceito os termos
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={e => setPrivacyAccepted(e.target.checked)}
                    required
                    aria-label="Aceito a política"
                  />
                  Aceito a política
                </label>
                {checkboxError && (
                  <span className="text-red-600 text-sm">{checkboxError}</span>
                )}
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium" role="link">
                Já tem uma conta? Faça login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
