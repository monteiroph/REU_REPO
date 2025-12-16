import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, ShoppingCart, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
const HomePage = () => {
  const features = [{
    icon: Car,
    title: 'Catálogo Exclusivo',
    description: 'Miniaturas raras e colecionáveis de alta qualidade'
  }, {
    icon: ShoppingCart,
    title: 'Sistema de Reservas',
    description: 'Reserve suas miniaturas favoritas com facilidade'
  }, {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Seus dados protegidos e transações seguras'
  }, {
    icon: Clock,
    title: 'Atualização em Tempo Real',
    description: 'Veja a disponibilidade de estoque instantaneamente'
  }];
  return <>
      <Helmet>
        <title>MiniCars Reserve - Reserva de Miniaturas de Carros Colecionáveis</title>
        <meta name="description" content="Reserve miniaturas de carros exclusivas e colecionáveis. Sistema moderno de reservas com catálogo atualizado e controle de estoque em tempo real." />
      </Helmet>

      <div className="min-h-screen">
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent" />
          
          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{
              opacity: 0,
              x: -50
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.8
            }}>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Colecione Miniaturas Exclusivas
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-8">
                  Descubra e reserve as miniaturas de carros mais raras e cobiçadas do mercado. 
                  Controle de estoque em tempo real e sistema de reservas inteligente.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/catalogo">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8">
                      Ver Catálogo
                    </Button>
                  </Link>
                  <Link to="/cadastro">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-600 text-slate-200 hover:bg-slate-800 text-lg px-8">
                      Criar Conta
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              x: 50
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }} className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img className="w-full h-auto object-cover rounded-2xl" alt="Coleção de miniaturas de carros clássicos" src="https://images.unsplash.com/photo-1566137966241-b713866d24ea" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-800/50">
          <div className="container mx-auto px-4">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Por Que Escolher a        JG Minis?</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Oferecemos a melhor experiência em reservas de miniaturas colecionáveis
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.div>)}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
              <motion.div initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6
            }}>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Pronto para Começar sua Coleção?
                </h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  Cadastre-se agora e tenha acesso ao nosso catálogo exclusivo de miniaturas
                </p>
                <Link to="/cadastro">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8">
                    Criar Conta Grátis
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>;
};
export default HomePage;
