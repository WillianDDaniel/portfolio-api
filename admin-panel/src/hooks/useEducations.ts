import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { EducationService } from '@/services/educationService';
import { UploadService } from '@/services/uploadService';

import { useImagePreview } from '@/hooks/useImagePreview';

const initialForm: Education = {
  type: 'college',
  status: 'completed',
  startDate: '',
  endDate: '',
  durationHours: '',
  certificateUrl: '',
  translations: [{ language: 'pt', institution: '', name: '', description: '' }]
};

export function useEducations(options?: { fetchList?: boolean; editId?: string }) {
  const navigate = useNavigate();

  const [educations, setEducations] = useState<Education[]>([]);
  const [form, setForm] = useState<Education>(initialForm);

  const {
    imagePreview, setImagePreview,
    selectedFile, setSelectedFile,
    handleFileChange
  } = useImagePreview();

  const [loading, setLoading] = useState<boolean>(!!options?.fetchList || !!options?.editId);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadEducations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await EducationService.getAll();
      setEducations(data);
    } catch (err: any) {
      setError(err.message || "Não foi possível carregar as formações.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEducationForEdit = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await EducationService.getById(id);
      setForm({
        ...initialForm,
        ...data,
        startDate: data.startDate?.split('T')[0],
        endDate: data.endDate?.split('T')[0],
      });
      setImagePreview(data.imageUrl || null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [setImagePreview]);

  useEffect(() => {
    if (options?.fetchList) loadEducations();
    if (options?.editId) loadEducationForEdit(options.editId);
  }, [options?.fetchList, options?.editId, loadEducations, loadEducationForEdit]);

  const deleteEducation = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja apagar?")) return;
    try {
      await EducationService.delete(id);
      setEducations(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      alert(err.message || "Erro ao excluir.");
    }
  };


  const getPayload = (finalImageUrl?: string) => {
    if (!form.translations[0]?.name?.trim()) throw new Error('O nome em Português é obrigatório.');

    const { id, createdAt, updatedAt, ...restOfForm } = form as any;

    return {
      ...restOfForm,
      durationHours: form.durationHours ? Number(form.durationHours) : undefined,
      imageUrl: finalImageUrl ?? undefined
    };
  };

  const createEducation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (!selectedFile && !imagePreview) throw new Error('Selecione uma imagem.');

      let finalImageUrl = imagePreview || undefined;

      if (selectedFile) {
        finalImageUrl = await UploadService.uploadImage(selectedFile, 'educations', `edu-${Date.now()}`);
      }

      await EducationService.create(getPayload(finalImageUrl));

      setSelectedFile(null);
      navigate('/educations');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateEducation = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let finalImageUrl = imagePreview || undefined;
      if (selectedFile) {
        finalImageUrl = await UploadService.uploadImage(selectedFile, 'educations', `edu-${id}`);
      }

      await EducationService.update(id, getPayload(finalImageUrl));

      setSelectedFile(null);
      navigate('/educations');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateTranslation = (index: number, field: keyof EducationTranslation, value: string) => {
    const newTranslations = [...form.translations];
    newTranslations[index] = { ...newTranslations[index], [field]: value };
    setForm({ ...form, translations: newTranslations });
  };

  const addTranslation = () => {
    setForm({ ...form, translations: [...form.translations, { language: 'en', institution: '', name: '', description: '' }] });
  };

  const removeTranslation = (index: number) => {
    setForm({ ...form, translations: form.translations.filter((_, i) => i !== index) });
  };

  return {
    educations, form, setForm, imagePreview, selectedFile, loading, submitting, error,
    deleteEducation, createEducation, updateEducation,
    updateTranslation, addTranslation, removeTranslation, handleFileChange
  };
}
