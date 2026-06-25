import { useState, useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';

import { UploadService } from '@/services/uploadService';
import { UserService } from '@/services/userService';

import { useImagePreview } from '@/hooks/useImagePreview';

export function useProfile() {
  const { user, setUser } = useAuth();

  const [profileForm, setProfileForm] = useState<ProfileForm>({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    oldPassword: '', newPassword: '', confirmPassword: ''
  });

  const {
    imagePreview, setImagePreview,
    selectedFile, setSelectedFile,
    handleFileChange
  } = useImagePreview();

  const [loading, setLoading] = useState<boolean>(true);
  const [submittingProfile, setSubmittingProfile] = useState<boolean>(false);
  const [submittingPassword, setSubmittingPassword] = useState<boolean>(false);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [successProfile, setSuccessProfile] = useState<boolean>(false);
  const [successPassword, setSuccessPassword] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
      });
      setImagePreview(user.avatarUrl || null);
      setLoading(false);
    }
  }, [user, setImagePreview]);

  const updateProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingProfile(true);
    setErrorProfile(null);
    setSuccessProfile(false);

    try {
      let finalAvatarUrl = user?.avatarUrl;

      if (selectedFile) {
        finalAvatarUrl = await UploadService.uploadImage(selectedFile, 'users', `avatar-${user?.id}`);
      }

      const updatedUser = await UserService.updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        avatarUrl: finalAvatarUrl
      });

      setUser(updatedUser);
      setSuccessProfile(true);
      setSelectedFile(null);
    } catch (err: any) {
      setErrorProfile(err.message);
    } finally {
      setSubmittingProfile(false);
    }
  };

  const updatePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingPassword(true);
    setErrorPassword(null);
    setSuccessPassword(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorPassword('A nova senha e a confirmação não coincidem.');
      setSubmittingPassword(false);
      return;
    }

    try {
      await UserService.updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      setSuccessPassword(true);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setErrorPassword(err.message);
    } finally {
      setSubmittingPassword(false);
    }
  };

  return {
    profileForm, setProfileForm,
    passwordForm, setPasswordForm,
    imagePreview, handleFileChange,
    loading, submittingProfile, submittingPassword,
    errorProfile, errorPassword,
    successProfile, successPassword,
    updateProfileSubmit, updatePasswordSubmit
  };
}
