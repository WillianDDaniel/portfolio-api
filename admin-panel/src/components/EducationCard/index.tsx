import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { type Education } from '@/hooks/useEducations';

import { getEducationData, getStatusColor, formatDate } from '@/helpers/educationHelpers';

interface EducationCardProps {
  edu: Education;
  onDelete: (id: string) => void;
}

export default function EducationCard({ edu, onDelete }: EducationCardProps) {
  const { t, i18n } = useTranslation();

  const institutionName = getEducationData(edu, 'institution', i18n.language) || t('educations.card.not_defined');
  const courseName = getEducationData(edu, 'name', i18n.language) || t('educations.card.not_defined');

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100">

      <div className="relative h-40 bg-gray-100 overflow-hidden border-b border-gray-100">
        {edu.imageUrl ? (
          <img
            src={edu.imageUrl}
            alt="Capa da formação"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-3xl mb-2">🏫</span>
            <span className="text-sm">{t('educations.card.no_image')}</span>
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-white/90 shadow-sm text-gray-700">
            {t(`educations.type.${edu.type}`, { defaultValue: edu.type })}
          </span>
        </div>

        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/educations/edit/${edu.id}`}
            className="bg-white p-2 rounded-full shadow text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
            title="Editar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </Link>
          <button
            onClick={() => onDelete(edu.id)}
            className="bg-white p-2 rounded-full shadow text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
            title="Excluir"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <span className="text-xs font-semibold text-blue-600 mb-1 tracking-wide uppercase">
          {institutionName}
        </span>
        <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2" title={courseName}>
          {courseName}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 mt-1">
          <span className={`px-2 py-0.5 rounded-full font-medium border ${getStatusColor(edu.status)}`}>
            {t(`educations.status.${edu.status}`, { defaultValue: edu.status })}
          </span>
          {edu.durationHours && (
            <span className="flex items-center gap-1">
              ⏱️ {edu.durationHours}h
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            {/* Passando o idioma para formatar a data corretamente ("abr de 2026" vs "Apr 2026") */}
            {formatDate(edu.startDate, i18n.language)}
            {edu.endDate && <span> - {formatDate(edu.endDate, i18n.language)}</span>}
          </div>

          {edu.certificateUrl ? (
            <a
              href={edu.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
            >
              {t('educations.card.certificate')}
            </a>
          ) : (
            <span className="text-xs text-gray-400 italic">{t('educations.card.no_link')}</span>
          )}
        </div>
      </div>
    </div>
  );
}