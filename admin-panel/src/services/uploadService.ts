export const UploadService = {
  /**
   * Faz o upload direto para o Cloudinary de forma segura.
   * @param file O arquivo selecionado pelo usuário
   * @param folder A pasta de destino permitida no backend (ex: 'users', 'projects')
   * @param identifier Um identificador único para o arquivo (ex: 'avatar', titulo do projeto)
   * @returns A URL segura (https) da imagem salva no Cloudinary
   */
  async uploadImage(file: File, folder: string, identifier: string): Promise<string> {
    const sigRes = await fetch(`/api/uploads/cloudinary-signature?folder=${folder}&identifier=${identifier}`, {
      credentials: 'include'
    });

    if (!sigRes.ok) {
      const errorData = await sigRes.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao gerar assinatura de upload.');
    }

    const { cloudName, apiKey, timestamp, signature, publicId } = await sigRes.json();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
    formData.append('public_id', publicId);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      throw new Error('Falha ao enviar imagem para o Cloudinary.');
    }

    const uploadData = await uploadRes.json();
    return uploadData.secure_url;
  }
};
