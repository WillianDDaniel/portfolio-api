import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProjectService } from '@/services/projectService';
import { UploadService } from '@/services/uploadService';

import { useImagePreview } from '@/hooks/useImagePreview';

const initialForm: Project = {
  liveUrl: '',
  repoUrl: '',
  translations: [{ language: 'pt', title: '', description: '' }]
};

export function useProjects(options?: { fetchList?: boolean; editId?: string }) {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>(initialForm);

  const {
    imagePreview,
    setImagePreview,
    selectedFile,
    setSelectedFile,
    handleFileChange
  } = useImagePreview();

  const [loading, setLoading] = useState<boolean>(!!options?.fetchList || !!options?.editId);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ProjectService.getAll();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Não foi possível carregar os projetos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProjectForEdit = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await ProjectService.getById(id);
      setForm({
        ...initialForm,
        ...data,
      });
      // Seta a imagem que veio do banco no preview
      setImagePreview(data.imageUrl || null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [setImagePreview]);

  useEffect(() => {
    if (options?.fetchList) loadProjects();
    if (options?.editId) loadProjectForEdit(options.editId);
  }, [options?.fetchList, options?.editId, loadProjects, loadProjectForEdit]);

  const deleteProject = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja apagar este projeto?")) return;
    try {
      await ProjectService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Erro ao excluir.");
    }
  };

  const getPayload = (finalImageUrl?: string) => {
    if (!form.translations[0]?.title?.trim()) throw new Error('O título em Português é obrigatório.');

    return {
      liveUrl: form.liveUrl,
      repoUrl: form.repoUrl,
      translations: form.translations,
      imageUrl: finalImageUrl ?? undefined,
    };
  };

  const createProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let finalImageUrl = imagePreview || undefined;

      if (selectedFile) {
        finalImageUrl = await UploadService.uploadImage(selectedFile, 'projects', `proj-${Date.now()}`);
      }

      await ProjectService.create(getPayload(finalImageUrl));

      setSelectedFile(null);
      navigate('/projects');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateProject = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let finalImageUrl = imagePreview || undefined;

      if (selectedFile) {
        finalImageUrl = await UploadService.uploadImage(selectedFile, 'projects', `proj-${id}`);
      }

      await ProjectService.update(id, getPayload(finalImageUrl));

      setSelectedFile(null);
      navigate('/projects');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateTranslation = (index: number, field: keyof ProjectTranslation, value: string) => {
    const newTranslations = [...form.translations];
    newTranslations[index] = { ...newTranslations[index], [field]: value };
    setForm({ ...form, translations: newTranslations });
  };

  const addTranslation = () => {
    setForm({ ...form, translations: [...form.translations, { language: 'en', title: '', description: '' }] });
  };

  const removeTranslation = (index: number) => {
    setForm({ ...form, translations: form.translations.filter((_, i) => i !== index) });
  };

  return {
    projects, form, setForm, imagePreview, selectedFile, loading, submitting, error,
    deleteProject, createProject, updateProject,
    updateTranslation, addTranslation, removeTranslation, handleFileChange
  };
}
