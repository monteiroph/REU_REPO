import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, AlertCircle, Filter, Loader2 } from 'lucide-react';

const CatalogPage = () => {
  const { user } = useAuth();
  const { addReservation, miniatures, categories, loading } = useCart();
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [reservingId, setReservingId] = useState(null);

  const handleReserve = async (miniature) => {
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Você precisa estar logado para fazer reservas",
        variant: "destructive"
      });
      return;
    }

    setReservingId(miniature.id);
    const result = await addReservation(miniature);
    setReservingId(null);
    
    if (result.success) {
      toast({
        title: "Reserva realizada!",
        description: `${miniature.name} foi reservado com sucesso`,
      });
    } else {
      toast({
        title: "Erro ao reservar",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const filteredMiniatures = selectedCategory === 'all' 
    ? miniatures 
    : miniatures.filter(m => m.category_id === selectedCategory);

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : '';
  };

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
           <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
     )
  }

  return (
    <>
      <Helmet>
        <title>Catálogo de Miniaturas - MiniCars Reserve</title>
        <meta name="description" content="Explore nosso catálogo completo de miniaturas de carros colecionáveis. Veja disponibilidade em estoque e reserve suas peças favoritas." />
      </Helmet>

      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Catálogo de Miniaturas
            </h1>
            <p className="text-slate-300 text-lg">
              Descubra nossa coleção exclusiva de miniaturas de carros
            </p>
          </motion.div>

          <div className="mb-8 overflow-x-auto pb-4">
            <div className="flex gap-2 min-w-max px-2 justify-center">
              <Button
                variant={selectedCategory === 'all' ? "default" : "outline"}
                onClick={() => setSelectedCategory('all')}
                className={`rounded-full ${selectedCategory === 'all' ? 'bg-blue-600 hover:bg-blue-700 border-transparent' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
              >
                Todas
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full ${selectedCategory === cat.id ? 'bg-blue-600 hover:bg-blue-700 border-transparent' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMiniatures.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Filter className="h-16 w-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Nenhuma miniatura encontrada nesta categoria.</p>
              </div>
            ) : (
              filteredMiniatures.map((miniature, index) => (
                <motion.div
                  key={miniature.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group flex flex-col"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={miniature.image}
                      alt={miniature.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {miniature.stock === 0 && (
                      <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg px-4 py-2">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Esgotado
                        </Badge>
                      </div>
                    )}
                    {miniature.stock > 0 && miniature.stock <= 3 && (
                      <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600">
                        Últimas unidades!
                      </Badge>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-2">
                      {miniature.category_id && (
                         <Badge variant="secondary" className="bg-slate-700 text-slate-300 hover:bg-slate-600 mb-2">
                           {getCategoryName(miniature.category_id)}
                         </Badge>
                      )}
                      <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {miniature.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-slate-400">Estoque:</span>
                      <Badge variant={miniature.stock > 0 ? "default" : "destructive"}>
                        {miniature.stock > 0 ? `${miniature.stock} unidades` : 'Esgotado'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate-400">Escala:</span>
                      <span className="text-white font-medium">{miniature.scale}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-blue-400">
                          R$ {miniature.price.toFixed(2)}
                        </span>
                      </div>

                      <Button
                        onClick={() => handleReserve(miniature)}
                        disabled={miniature.stock === 0 || reservingId === miniature.id}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                         {reservingId === miniature.id ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                        {miniature.stock === 0 ? 'Esgotado' : 'Reservar'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogPage;
