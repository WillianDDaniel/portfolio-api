import { useState, useEffect } from 'react';

export interface Translation {
  language: string;
  name?: string;
  institution?: string;
}

export interface Education {
  id: string;
  type: 'college' | 'course' | 'certification' | 'bootcamp' | string;
  status: 'completed' | 'in_progress' | 'paused' | string;
  imageUrl?: string;
  durationHours?: number;
  startDate?: string;
  endDate?: string;
  certificateUrl?: string;
  translations: Translation[];
}

export function useEducations() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEducations = async () => {
      try {
        const res = await fetch("/api/educations", { credentials: "include" });
        if (!res.ok) throw new Error("Falha ao buscar dados da API");

        const data = await res.json();
        setEducations(data);
      } catch (err) {
        console.error("Erro ao buscar educations:", err);
        setError("Não foi possível carregar as formações.");
      } finally {
        setLoading(false);
      }
    };

    loadEducations();
  }, []);

  const deleteEducation = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja apagar esta formação?")) return;

    try {
      const res = await fetch(`/api/educations/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Erro ao excluir");

      setEducations((prev) => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao tentar excluir a formação.");
    }
  };

  return { educations, loading, error, deleteEducation };
}
