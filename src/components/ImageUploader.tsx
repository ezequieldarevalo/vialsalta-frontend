import React, { useState } from 'react';
import {
  Button,
  Box,
  CircularProgress,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Alert,
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import api from '../services/api';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  currentImageUrl?: string;
  maxSizeMB?: number;
  label?: string;
  disabled?: boolean;
}

/**
 * Componente reutilizable para subir imágenes
 * 
 * @example
 * ```tsx
 * <ImageUploader
 *   onUploadSuccess={(url) => setFotoUrl(url)}
 *   currentImageUrl={fotoUrl}
 *   label="Foto del vehículo"
 * />
 * ```
 */
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  currentImageUrl,
  maxSizeMB = 5,
  label = 'Subir imagen',
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Solo se permiten archivos de imagen';
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      return;
    }

    // Validar tamaño
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const errorMsg = `El archivo es demasiado grande. Máximo ${maxSizeMB}MB`;
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload/test', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.url;
      onUploadSuccess(imageUrl);
      setPreview(imageUrl);
    } catch (err) {
      const errorMsg = 'Error al subir la imagen';
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      console.error('Error uploading image:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    onUploadSuccess('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {preview ? (
        <Card sx={{ position: 'relative', maxWidth: 400 }}>
          <CardMedia
            component="img"
            image={preview}
            alt="Preview"
            sx={{ maxHeight: 300, objectFit: 'contain' }}
          />
          <IconButton
            onClick={handleClear}
            disabled={disabled}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              },
            }}
          >
            <Close />
          </IconButton>
        </Card>
      ) : (
        <Box>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload-input"
            type="file"
            onChange={handleFileSelect}
            disabled={disabled || uploading}
          />
          <label htmlFor="image-upload-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
              disabled={disabled || uploading}
              fullWidth
            >
              {uploading ? 'Subiendo...' : label}
            </Button>
          </label>
          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
            Máximo {maxSizeMB}MB. Formatos: JPG, PNG, WEBP
          </Typography>
        </Box>
      )}
    </Box>
  );
};
