import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import {
  getKaryakartas,
  addKaryakarta,
  updateKaryakarta,
  deleteKaryakarta,
} from '@/services/storage.service';
import { Karyakarta } from '@/types';
import { Plus, Edit2, Trash2, Search, Users, Calendar, Phone, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Karyakartas = () => {
  const { t } = useTranslation();
  const [karyakartas, setKaryakartas] = useState<Karyakarta[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKaryakarta, setEditingKaryakarta] = useState<Karyakarta | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    dob: '',
    photo: '',
  });
  
  const loadKaryakartas = useCallback(() => {
    setKaryakartas(getKaryakartas());
  }, []);
  
  useEffect(() => {
    loadKaryakartas();
  }, [loadKaryakartas]);
  
  const filteredKaryakartas = karyakartas.filter((k) =>
    k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.whatsapp.includes(searchQuery)
  );
  
  const resetForm = () => {
    setFormData({ name: '', whatsapp: '', dob: '', photo: '' });
    setEditingKaryakarta(null);
  };
  
  const handleOpenModal = (karyakarta?: Karyakarta) => {
    if (karyakarta) {
      setEditingKaryakarta(karyakarta);
      setFormData({
        name: karyakarta.name,
        whatsapp: karyakarta.whatsapp,
        dob: karyakarta.dob,
        photo: karyakarta.photo,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.whatsapp || !formData.dob) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    if (editingKaryakarta) {
      updateKaryakarta(editingKaryakarta.id, formData);
      toast({
        title: t('common.success'),
        description: t('karyakarta.saved'),
      });
    } else {
      addKaryakarta(formData);
      toast({
        title: t('common.success'),
        description: t('karyakarta.saved'),
      });
    }
    
    handleCloseModal();
    loadKaryakartas();
  };
  
  const handleDelete = () => {
    if (deleteId) {
      deleteKaryakarta(deleteId);
      toast({
        title: t('common.success'),
        description: t('karyakarta.deleted'),
      });
      setDeleteId(null);
      loadKaryakartas();
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('karyakarta.title')}</h1>
            <p className="text-muted-foreground">
              {karyakartas.length} {t('common.karyakartas').toLowerCase()}
            </p>
          </div>
          
          <Button onClick={() => handleOpenModal()} className="gradient-saffron text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            {t('karyakarta.addNew')}
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search') + '...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Karyakarta List */}
        {filteredKaryakartas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="font-medium text-foreground mb-1">{t('karyakarta.noKaryakartas')}</h3>
              <p className="text-sm text-muted-foreground">{t('karyakarta.addFirst')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredKaryakartas.map((karyakarta, index) => (
                <motion.div
                  key={karyakarta.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-md transition-all border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {karyakarta.photo ? (
                            <img
                              src={karyakarta.photo}
                              alt={karyakarta.name}
                              className="h-14 w-14 rounded-full object-cover border-2 border-primary/20"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-full gradient-saffron flex items-center justify-center text-xl font-bold text-primary-foreground">
                              {t(`names.karyakartas.${karyakarta.name}`, karyakarta.name).charAt(0)}
                            </div>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{t(`names.karyakartas.${karyakarta.name}`, karyakarta.name)}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Phone className="h-3 w-3" />
                            <span className="truncate">{karyakarta.whatsapp}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(karyakarta.dob)}</span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenModal(karyakarta)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(karyakarta.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingKaryakarta ? t('karyakarta.editKaryakarta') : t('karyakarta.addNew')}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo Upload */}
            <div className="flex justify-center">
              <div className="relative">
                {formData.photo ? (
                  <div className="relative">
                    <img
                      src={formData.photo}
                      alt="Preview"
                      className="h-24 w-24 rounded-full object-cover border-2 border-primary"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => setFormData((prev) => ({ ...prev, photo: '' }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <label className="h-24 w-24 rounded-full bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">{t('karyakarta.photo')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                )}
              </div>
            </div>
            
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('karyakarta.name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
            </div>
            
            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp">{t('karyakarta.whatsapp')} *</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="+91XXXXXXXXXX"
                required
              />
            </div>
            
            {/* DOB */}
            <div className="space-y-2">
              <Label htmlFor="dob">{t('karyakarta.dob')} *</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData((prev) => ({ ...prev, dob: e.target.value }))}
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" className="gradient-saffron text-primary-foreground">
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.delete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('karyakarta.deleteConfirm')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Karyakartas;
