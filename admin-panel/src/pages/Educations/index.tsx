import { Link } from 'react-router-dom';

import { useEducations } from '@/hooks/useEducations';

import Header from '@/components/Header';
import EducationCard from '@/components/EducationCard';

export default function Educations() {
  const { educations, loading, error, deleteEducation } = useEducations();

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Link to="/panel" className="text-sm text-gray-500 hover:text-blue-600 mb-2 inline-flex items-center gap-1 transition-colors">
              ← Voltar ao Painel
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🎓</span> Minhas Formações
            </h1>
          </div>

          <Link
            to="/educations/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>➕ Nova Formação</span>
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-r">
            <p className="font-bold">Erro</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {educations.length === 0 && !error ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-400 text-5xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900">Nenhuma formação encontrada</h3>
                <p className="text-gray-500 mt-1">Comece adicionando seus cursos e faculdades.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {educations.map((edu) => (
                  <EducationCard key={edu.id} edu={edu} onDelete={deleteEducation} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
