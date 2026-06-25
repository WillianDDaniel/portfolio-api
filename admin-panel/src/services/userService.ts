export const UserService = {
  async updateProfile(payload: { name: string; email: string; avatarUrl?: string | null }) {
    const res = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao atualizar perfil.');
    }

    return data;
  },

  async updatePassword(payload: { oldPassword: string; newPassword: string }) {
    const res = await fetch('/api/users/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao alterar a senha.');
    }

    return data;
  }
};
