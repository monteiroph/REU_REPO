import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast({ title: 'Desconectado', description: 'Você saiu da sua conta.' });
    } else {
      toast({ variant: 'destructive', title: 'Erro', description: result.error || 'Não foi possível sair.' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Minha Conta - MiniCars Reserve</title>
        <meta name="description" content="Gerencie sua conta MiniCars Reserve e veja suas reservas." />
      </Helmet>

      <div className="min-h-[calc(100vh-4rem)] flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-3xl">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Minha Conta</h1>

            {user ? (
              <div className="space-y-4 text-slate-200">
                <div>
                  <p className="text-sm text-slate-400">Nome</p>
                  <p className="text-lg font-medium">{user.name || user.email}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-lg font-medium">{user.email}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Papel</p>
                  <p className="text-lg font-medium">{user.role || 'user'}</p>
                </div>

                <div className="pt-4">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600" onClick={handleLogout}>
                    Sair
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Você não está logado.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
