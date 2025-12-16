import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Search, ShieldCheck, DollarSign, Package, Layers, Image as ImageIcon, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    miniatures, 
    addMiniature, 
    updateMiniature, 
    deleteMiniature,
    getAllReservations,
    updateReservationStatus,
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useCart();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("miniatures");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reservationsList, setReservationsList] = useState([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isMiniatureDialogOpen, setIsMiniatureDialogOpen] = useState(false);
  const [editingMiniature, setEditingMiniature] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [miniatureForm, setMiniatureForm] = useState({
    name: '',
    image: '',
    price: '',
    stock: '',
    scale: '1:18',
    categoryId: ''
  });

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (activeTab === 'reservations') {
        setIsLoadingReservations(true);
        const data = await getAllReservations();
        setReservationsList(data);
        setIsLoadingReservations(false);
      }
    };
    loadData();
  }, [activeTab]);

  const handleEditMiniatureClick = (miniature) => {
    setEditingMiniature(miniature);
    setMiniatureForm({
      name: miniature.name,
      image: miniature.image,
      price: miniature.price,
      stock: miniature.stock,
      scale: miniature.scale,
      categoryId: miniature.category_id || ''
    });
    setImagePreview(miniature.image);
    setIsMiniatureDialogOpen(true);
  };

  const handleAddMiniatureClick = () => {
    setEditingMiniature(null);
    setMiniatureForm({
      name: '',
      image: '',
      price: '',
      stock: '',
      scale: '1:18',
      categoryId: ''
    });
    setImagePreview(null);
    setIsMiniatureDialogOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
         toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setMiniatureForm({ ...miniatureForm, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMiniatureSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = editingMiniature
      ? await updateMiniature(editingMiniature.id, miniatureForm)
      : await addMiniature(miniatureForm);

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: editingMiniature ? "Miniatura atualizada" : "Miniatura criada",
        description: "Operação realizada com sucesso.",
      });
      setIsMiniatureDialogOpen(false);
    } else {
      toast({
        title: "Erro",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleDeleteMiniature = async (id) => {
    const result = await deleteMiniature(id);
    if (result.success) {
      toast({
        title: "Miniatura removida",
        description: "O item foi excluído do catálogo.",
      });
    } else {
      toast({
        title: "Erro",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleEditCategoryClick = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name });
    setIsCategoryDialogOpen(true);
  };

  const handleAddCategoryClick = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '' });
    setIsCategoryDialogOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = editingCategory
      ? await updateCategory(editingCategory.id, categoryForm.name)
      : await addCategory(categoryForm.name);

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: editingCategory ? "Categoria atualizada" : "Categoria criada",
        description: "Operação realizada com sucesso.",
      });
      setIsCategoryDialogOpen(false);
    } else {
      toast({
        title: "Erro",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    const result = await deleteCategory(id);
    if (result.success) {
      toast({
        title: "Categoria removida",
        description: "A categoria foi excluída.",
      });
    } else {
      toast({
        title: "Erro",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const result = await updateReservationStatus(id, newStatus);
    if (result.success) {
      toast({
        title: "Status atualizado",
        description: `Reserva marcada como ${newStatus}`,
      });
      const data = await getAllReservations();
      setReservationsList(data);
    }
  };

  const filteredReservations = reservationsList.filter(res => {
    const matchesSearch = 
      res.miniatureName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getReservationCountForMiniature = (miniatureId) => {
    return '?';
  };

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : '-';
  };

  return (
    <>
      <Helmet>
        <title>Painel Administrativo - MiniCars Reserve</title>
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-900/30 rounded-lg">
                <ShieldCheck className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Painel Administrativo</h1>
                <p className="text-slate-400">Gerenciamento de Catálogo e Reservas</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="miniatures" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-900 border border-slate-800 p-1 mb-8">
              <TabsTrigger value="miniatures" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Package className="w-4 h-4 mr-2" />
                Miniaturas
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Layers className="w-4 h-4 mr-2" />
                Categorias
              </TabsTrigger>
              <TabsTrigger value="reservations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Reservas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="miniatures" className="space-y-6">
              <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <h2 className="text-xl font-semibold">Catálogo Atual</h2>
                <Dialog open={isMiniatureDialogOpen} onOpenChange={setIsMiniatureDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddMiniatureClick} className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" /> Nova Miniatura
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingMiniature ? 'Editar Miniatura' : 'Nova Miniatura'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleMiniatureSubmit} className="space-y-4 pt-4">
                      <div className="grid gap-2">
                        <Label>Nome do Modelo</Label>
                        <Input 
                          value={miniatureForm.name}
                          onChange={(e) => setMiniatureForm({...miniatureForm, name: e.target.value})}
                          className="bg-slate-800 border-slate-700" 
                          required 
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Imagem do Produto</Label>
                        <input type="hidden" value={miniatureForm.image} required />

                        <div className="flex flex-col gap-3">
                          <div className={`
                            relative w-full h-48 rounded-md overflow-hidden border-2 border-dashed border-slate-700 
                            flex items-center justify-center bg-slate-950
                            ${!imagePreview ? 'hover:bg-slate-900/50 transition-colors' : ''}
                          `}>
                            {imagePreview ? (
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                              <div className="text-center p-4 text-slate-500">
                                <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Nenhuma imagem selecionada</p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="bg-slate-800 border-slate-700 file:bg-slate-700 file:text-slate-200 file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-4 file:hover:bg-slate-600 cursor-pointer text-slate-300"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Preço (R$)</Label>
                          <Input 
                            type="number" 
                            step="0.01"
                            value={miniatureForm.price}
                            onChange={(e) => setMiniatureForm({...miniatureForm, price: e.target.value})}
                            className="bg-slate-800 border-slate-700" 
                            required 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Estoque</Label>
                          <Input 
                            type="number"
                            value={miniatureForm.stock}
                            onChange={(e) => setMiniatureForm({...miniatureForm, stock: e.target.value})}
                            className="bg-slate-800 border-slate-700" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Categoria</Label>
                        <Select 
                          value={miniatureForm.categoryId} 
                          onValueChange={(value) => setMiniatureForm({...miniatureForm, categoryId: value})}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Escala</Label>
                        <Input 
                          value={miniatureForm.scale}
                          onChange={(e) => setMiniatureForm({...miniatureForm, scale: e.target.value})}
                          className="bg-slate-800 border-slate-700" 
                          required 
                        />
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isSubmitting ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-950">
                    <TableRow className="hover:bg-transparent border-slate-800">
                      <TableHead className="text-slate-400">Imagem</TableHead>
                      <TableHead className="text-slate-400">Nome</TableHead>
                      <TableHead className="text-slate-400">Categoria</TableHead>
                      <TableHead className="text-slate-400">Preço</TableHead>
                      <TableHead className="text-slate-400">Estoque</TableHead>
                      <TableHead className="text-right text-slate-400">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {miniatures.map((miniature) => (
                      <TableRow key={miniature.id} className="hover:bg-slate-800/50 border-slate-800">
                        <TableCell>
                          <img src={miniature.image} alt={miniature.name} className="w-12 h-12 object-cover rounded" />
                        </TableCell>
                        <TableCell className="font-medium">{miniature.name}</TableCell>
                        <TableCell>
                           {miniature.category_id ? (
                             <Badge variant="outline" className="border-slate-700 text-slate-400">
                               {getCategoryName(miniature.category_id)}
                             </Badge>
                           ) : (
                             <span className="text-slate-600">-</span>
                           )}
                        </TableCell>
                        <TableCell>R$ {miniature.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={miniature.stock === 0 ? "destructive" : "secondary"}>
                            {miniature.stock} unid.
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditMiniatureClick(miniature)}
                            className="hover:bg-slate-700 text-blue-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-slate-700 text-red-400">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-900 border-slate-800">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Excluir Miniatura?</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400">
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-slate-800 text-white border-slate-700">Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteMiniature(miniature.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <h2 className="text-xl font-semibold">Gerenciar Categorias</h2>
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddCategoryClick} className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" /> Nova Categoria
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <DialogHeader>
                      <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4 pt-4">
                      <div className="grid gap-2">
                        <Label>Nome da Categoria</Label>
                        <Input 
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                          className="bg-slate-800 border-slate-700" 
                          required 
                        />
                      </div>
                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Salvar
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-950">
                    <TableRow className="hover:bg-transparent border-slate-800">
                      <TableHead className="text-slate-400">Nome</TableHead>
                      <TableHead className="text-slate-400">ID</TableHead>
                      <TableHead className="text-slate-400">Itens Associados</TableHead>
                      <TableHead className="text-right text-slate-400">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id} className="hover:bg-slate-800/50 border-slate-800">
                        <TableCell className="font-medium text-white">{category.name}</TableCell>
                        <TableCell className="text-slate-500 text-xs font-mono">{category.id}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getMiniatureCountForCategory(category.id)} itens
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditCategoryClick(category)}
                            className="hover:bg-slate-700 text-blue-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-slate-700 text-red-400">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-900 border-slate-800">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Excluir Categoria?</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400">
                                  Miniaturas associadas ficarão sem categoria.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-slate-800 text-white border-slate-700">Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="reservations" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Buscar por cliente, miniatura ou ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-slate-900 border-slate-700"
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-slate-900 border-slate-700">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="Reservado">Reservado</SelectItem>
                      <SelectItem value="Entregue">Entregue</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-950">
                    <TableRow className="hover:bg-transparent border-slate-800">
                      <TableHead className="text-slate-400">ID</TableHead>
                      <TableHead className="text-slate-400">Cliente (ID)</TableHead>
                      <TableHead className="text-slate-400">Miniatura</TableHead>
                      <TableHead className="text-slate-400">Data</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-right text-slate-400">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingReservations ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : filteredReservations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                          Nenhuma reserva encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReservations.map((res) => (
                        <TableRow key={res.id} className="hover:bg-slate-800/50 border-slate-800">
                          <TableCell className="font-mono text-xs text-slate-500">#{res.id.slice(-6)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-white text-xs font-mono" title={res.userId}>{res.userId.slice(0, 8)}...</span>
                            </div>
                          </TableCell>
                          <TableCell>{res.miniatureName}</TableCell>
                          <TableCell className="text-slate-400">
                            {new Date(res.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                res.status === 'Entregue' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                                res.status === 'Cancelado' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                                'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                              }
                            >
                              {res.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Select 
                              defaultValue={res.status} 
                              onValueChange={(val) => handleStatusUpdate(res.id, val)}
                            >
                              <SelectTrigger className="w-32 h-8 ml-auto bg-slate-950 border-slate-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="Reservado">Reservado</SelectItem>
                                <SelectItem value="Entregue">Entregue</SelectItem>
                                <SelectItem value="Cancelado">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
