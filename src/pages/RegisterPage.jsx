import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, User, Mail, Lock } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro no cadastro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      toast({
        title: "Cadastro realizado!",
        description: "Sua conta foi criada com sucesso",
      });
      navigate('/catalogo');
    } else {
      toast({
        title: "Erro ao cadastrar",
        description: result.error,
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>Cadastro - MiniCars Reserve</title>
        <meta name="description" content="Crie sua conta na MiniCars Reserve e comece a reservar miniaturas de carros exclusivas e colecionáveis." />
      </Helmet>

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Car className="h-8 w-8 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-2 text-white">
              Criar Conta
            </h1>
            <p className="text-slate-400 text-center mb-8">
              Junte-se à comunidade de colecionadores
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">
                  Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repita sua senha"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg h-12"
              >
                {loading ? 'Cadastrando...' : 'Criar Conta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                  Fazer login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
