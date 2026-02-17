const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class AdminApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(username: string, password: string) {
    return this.request<{ success: boolean; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout() {
    return this.request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async verifyAuth() {
    return this.request<{ valid: boolean; username: string }>('/auth/verify');
  }

  // Content endpoints
  async getContent<T>(type: string): Promise<T> {
    return this.request<T>(`/content/${type}`);
  }

  async updateContent<T>(type: string, data: T): Promise<T> {
    return this.request<T>(`/content/${type}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addItem<T>(type: string, item: T): Promise<T[]> {
    return this.request<T[]>(`/content/${type}/item`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateItem<T>(type: string, index: number, item: T): Promise<T[]> {
    return this.request<T[]>(`/content/${type}/item/${index}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteItem<T>(type: string, index: number): Promise<T[]> {
    return this.request<T[]>(`/content/${type}/item/${index}`, {
      method: 'DELETE',
    });
  }

  // Files endpoints
  async getImages(category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<{ images: ImageMetadata[] }>(`/files/images${query}`);
  }

  async getImageCategories() {
    return this.request<{ categories: string[] }>('/files/images/categories');
  }

  async uploadImage(file: File, category: string): Promise<{ image: ImageMetadata }> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_URL}/files/images/single?category=${encodeURIComponent(category)}`;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  async uploadImages(files: File[], category: string): Promise<{ images: ImageMetadata[] }> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const url = `${API_URL}/files/images?category=${encodeURIComponent(category)}`;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  async deleteImage(imagePath: string) {
    return this.request<{ success: boolean }>(`/files${imagePath}`, {
      method: 'DELETE',
    });
  }

  async getDocuments() {
    return this.request<{ documents: DocumentMetadata[] }>('/files/documents');
  }

  async uploadDocument(file: File): Promise<{ document: DocumentMetadata }> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_URL}/files/documents`;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  async deleteDocument(name: string) {
    return this.request<{ success: boolean }>(`/files/documents/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
  }
}

export interface ImageMetadata {
  path: string;
  name: string;
  size: number;
  dimensions?: { width: number; height: number };
  thumbnail?: string;
  category: string;
}

export interface DocumentMetadata {
  path: string;
  name: string;
  size: number;
}

export const adminApi = new AdminApi();
