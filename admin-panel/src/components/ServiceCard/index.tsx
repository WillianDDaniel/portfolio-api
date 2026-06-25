import { useTranslation } from 'react-i18next';

import { getServiceData } from '@/helpers/serviceHelpers';

import DeleteButton from '@/components/DeleteButton';
import EditButton from '@/components/EditButton';

interface ServiceCardProps {
  service: Service;
  onDelete: (id: string) => void;
}

export default function ServiceCard({ service, onDelete }: ServiceCardProps) {
  const { t, i18n } = useTranslation();

  const title = getServiceData(service, 'title', i18n.language) || t('services.card.not_defined', { defaultValue: 'Título não definido' });
  const description = getServiceData(service, 'description', i18n.language) || t('services.card.no_description', { defaultValue: 'Sem descrição' });

  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-3 flex flex-col group rounded-lg">

      <div className="relative w-full bg-gray-100 overflow-hidden mb-4 flex items-center justify-center aspect-16/10">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={t('services.card.image_alt', { defaultValue: 'Imagem do serviço' })}
            className="w-full h-full object-contain block group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
            <span className="text-3xl mb-2">🖼️</span>
            <span className="text-sm">{t('services.card.no_image', { defaultValue: 'Sem imagem' })}</span>
          </div>
        )}

        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <EditButton
            to={{ pathname: `/services/edit/${service.id}` }}
            title={t('buttons.edit', { defaultValue: 'Editar' })}
          />

          <DeleteButton
            onDelete={() => onDelete(service.id!)}
            title={t('buttons.delete', { defaultValue: 'Excluir' })}
          />
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate" title={title}>
        {title}
      </h3>

      <p className="text-xs text-gray-500 line-clamp-2 mb-4" title={description}>
        {description}
      </p>

      <div className="mt-auto pt-2 border-t border-gray-50">
        {service.link ? (
          <a href={service.link} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg w-full">
            🔗 {t('services.card.link', { defaultValue: 'Acessar Serviço' })}
          </a>
        ) : (
          <span className="flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-400 bg-gray-100 cursor-not-allowed rounded-lg w-full">
            {t('services.card.no_link', { defaultValue: 'Link indisponível' })}
          </span>
        )}
      </div>

    </div>
  );
}
