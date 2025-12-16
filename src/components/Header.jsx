import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, User, LogOut, Menu, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
const Header = () => {
  const {
    user,
    logout
  } = useAuth();
  const location = useLocation();
  const isActive = path => location.pathname === path;
  return <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{
          rotate: 360
        }} transition={{
          duration: 0.6
        }} className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Car className="h-6 w-6 text-white" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">JG Minis</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/catalogo" className={`text-sm font-medium transition-colors hover:text-blue-400 ${isActive('/catalogo') ? 'text-blue-400' : 'text-slate-300'}`}>
            Catálogo
          </Link>
          
          {user ? <div className="flex items-center gap-4">
              {user.role === 'admin' ? <Link to="/admin/dashboard">
                   <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Painel Admin
                  </Button>
                </Link> : <Link to="/conta" className={`text-sm font-medium transition-colors hover:text-blue-400 ${isActive('/conta') ? 'text-blue-400' : 'text-slate-300'}`}>
                  Minha Conta
                </Link>}
              
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-slate-300 hover:text-red-400">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div> : <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-blue-400">
                  Entrar
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Cadastrar
                </Button>
              </Link>
            </div>}
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-300">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-700">
              <DropdownMenuItem asChild>
                <Link to="/catalogo" className="cursor-pointer">
                  Catálogo
                </Link>
              </DropdownMenuItem>
              {user ? <>
                   {user.role === 'admin' ? <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer text-red-400">
                        Painel Admin
                      </Link>
                    </DropdownMenuItem> : <DropdownMenuItem asChild>
                      <Link to="/conta" className="cursor-pointer">
                        Minha Conta
                      </Link>
                    </DropdownMenuItem>}
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </> : <>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="cursor-pointer">
                      Entrar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/cadastro" className="cursor-pointer">
                      Cadastrar
                    </Link>
                  </DropdownMenuItem>
                </>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>;
};
export default Header;
