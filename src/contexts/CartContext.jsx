import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [miniatures, setMiniatures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) console.error('Error fetching categories:', error);
    else setCategories(data || []);
  };

  const fetchMiniatures = async () => {
    const { data, error } = await supabase
      .from('miniatures')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching miniatures:', error);
    else setMiniatures(data || []);
  };

  const fetchUserReservations = async () => {
    if (!user) return;
    if (user.role === 'admin') return;

    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        miniatures (
          name,
          image,
          price
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reservations:', error);
    } else {
      const formatted = data.map(res => ({
        id: res.id,
        status: res.status,
        createdAt: res.created_at,
        miniatureId: res.miniature_id,
        miniatureName: res.miniature_snapshot?.name || res.miniatures?.name || 'Item indisponível',
        miniatureImage: res.miniature_snapshot?.image || res.miniatures?.image,
        miniaturePrice: res.miniature_snapshot?.price || res.miniatures?.price
      }));
      setReservations(formatted);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCategories(), fetchMiniatures()]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUserReservations();
  }, [user]);

  const uploadImage = async (base64OrFile) => {
    if (!base64OrFile) return null;
    if (typeof base64OrFile === 'string' && base64OrFile.startsWith('http')) {
      return base64OrFile;
    }

    try {
      const matches = base64OrFile.match(/^data:(.+);base64,(.+)$/);
      if (!matches) return null;

      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${contentType.split('/')[1]}`;

      const { data, error } = await supabase.storage
        .from('miniatures')
        .upload(fileName, buffer, {
          contentType,
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('miniatures')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const getAllReservations = async () => {
    if (user?.role !== 'admin') return [];

    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        miniatures (name),
        profiles:user_id (email) 
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all reservations:', error);
      return [];
    }
    
    return data.map(res => ({
      id: res.id,
      userId: res.user_id,
      userName: 'Cliente',
      userEmail: res.user_id,
      miniatureId: res.miniature_id,
      miniatureName: res.miniature_snapshot?.name || res.miniatures?.name || 'Item excluído',
      status: res.status,
      createdAt: res.created_at
    }));
  };

  const addMiniature = async (data) => {
    try {
      const imageUrl = await uploadImage(data.image);
      
      const { error } = await supabase
        .from('miniatures')
        .insert([{
          name: data.name,
          image: imageUrl,
          price: parseFloat(data.price),
          stock: parseInt(data.stock, 10),
          scale: data.scale,
          category_id: data.categoryId
        }]);

      if (error) throw error;
      
      await fetchMiniatures();
      return { success: true };
    } catch (error) {
      console.error("Error adding miniature:", error);
      return { success: false, error: error.message };
    }
  };

  const updateMiniature = async (id, data) => {
    try {
      let imageUrl = data.image;
      if (data.image.startsWith('data:')) {
        imageUrl = await uploadImage(data.image);
      }

      const { error } = await supabase
        .from('miniatures')
        .update({
          name: data.name,
          image: imageUrl,
          price: parseFloat(data.price),
          stock: parseInt(data.stock, 10),
          scale: data.scale,
          category_id: data.categoryId
        })
        .eq('id', id);

      if (error) throw error;

      await fetchMiniatures();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteMiniature = async (id) => {
    try {
      const { error } = await supabase
        .from('miniatures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchMiniatures();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addCategory = async (name) => {
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{ name }]);

      if (error) throw error;

      await fetchCategories();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateCategory = async (id, name) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id);

      if (error) throw error;

      await fetchCategories();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCategories();
      await fetchMiniatures();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      if (status === 'Cancelado') {
        const { data: resData } = await supabase.from('reservations').select('miniature_id, status').eq('id', id).single();
        
        if (resData && resData.status !== 'Cancelado' && resData.miniature_id) {
             const { data: minData } = await supabase.from('miniatures').select('stock').eq('id', resData.miniature_id).single();
             if (minData) {
               await supabase.from('miniatures').update({ stock: minData.stock + 1 }).eq('id', resData.miniature_id);
             }
        }
      }

      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addReservation = async (miniature) => {
    if (!user) {
      return { success: false, error: 'Você precisa estar logado' };
    }

    try {
      const { data: currentMini, error: fetchError } = await supabase
        .from('miniatures')
        .select('stock')
        .eq('id', miniature.id)
        .single();
      
      if (fetchError || !currentMini) return { success: false, error: 'Erro ao verificar estoque' };
      if (currentMini.stock <= 0) return { success: false, error: 'Miniatura esgotada' };

      const { error: updateError } = await supabase
        .from('miniatures')
        .update({ stock: currentMini.stock - 1 })
        .eq('id', miniature.id);

      if (updateError) return { success: false, error: 'Erro ao atualizar estoque' };

      const { error: insertError } = await supabase
        .from('reservations')
        .insert([{
          user_id: user.id,
          miniature_id: miniature.id,
          status: 'Reservado',
          miniature_snapshot: {
            name: miniature.name,
            image: miniature.image,
            price: miniature.price
          }
        }]);

      if (insertError) {
        await supabase.from('miniatures').update({ stock: currentMini.stock }).eq('id', miniature.id);
        throw insertError;
      }

      await fetchUserReservations();
      await fetchMiniatures();
      return { success: true };

    } catch (error) {
      console.error("Reservation failed:", error);
      return { success: false, error: error.message || 'Falha na reserva' };
    }
  };

  const cancelReservation = async (reservationId) => {
    try {
      const { data: res, error: fetchError } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', reservationId)
        .single();
        
      if (fetchError || !res) throw new Error("Reserva não encontrada");

      if (res.miniature_id) {
         const { data: minData } = await supabase.from('miniatures').select('stock').eq('id', res.miniature_id).single();
         if (minData) {
            await supabase.from('miniatures').update({ stock: minData.stock + 1 }).eq('id', res.miniature_id);
         }
      }

      const { error: deleteError } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);

      if (deleteError) throw deleteError;

      await fetchUserReservations();
      await fetchMiniatures();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    reservations,
    miniatures,
    categories,
    loading,
    addReservation,
    cancelReservation,
    addMiniature,
    updateMiniature,
    deleteMiniature,
    addCategory,
    updateCategory,
    deleteCategory,
    getAllReservations,
    updateReservationStatus
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
