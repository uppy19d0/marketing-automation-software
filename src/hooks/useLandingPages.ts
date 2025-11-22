import { useState, useEffect } from 'react';
import { landingPageService, LandingPage } from '../services/landingPageService';
import { toast } from 'sonner';

export interface LandingPageWithStats extends LandingPage {
  id?: string;
  visits?: number;
  submissions?: number;
  conversionRate?: number;
  bounceRate?: number;
  avgTimeOnPage?: number;
}

export function useLandingPages() {
  const [landingPages, setLandingPages] = useState<LandingPageWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLandingPages = async () => {
    try {
      setLoading(true);
      console.log('🔄 [useLandingPages] Fetching landing pages...');
      const response = await landingPageService.getLandingPages();
      const payload = (response as any) || {};
      const list = payload.data || payload;
      console.log('✅ [useLandingPages] Landing pages fetched:', list);

      // Transform data to match component interface
      const transformedPages: LandingPageWithStats[] = (list || []).map((page: any) => ({
        _id: page._id,
        id: page._id || page.id,
        name: page.name,
        slug: page.slug,
        title: page.title,
        subtitle: page.subtitle,
        description: page.description,
        content: page.description || '',
        buttonText: page.buttonText,
        successMessage: page.successMessage,
        benefits: page.benefits || [],
        formFields: page.formFields,
        gdprConsent: page.gdprConsent,
        styling: page.styling,
        seo: page.seo,
        status: page.status,
        visits: page.stats?.visits || 0,
        submissions: page.stats?.submissions || 0,
        conversionRate: page.stats?.conversionRate || 0,
        bounceRate: page.stats?.bounceRate || 0,
        avgTimeOnPage: page.stats?.avgTimeOnPage || 0,
        publishedAt: page.publishedAt,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      })) || [];

      setLandingPages(transformedPages);
      setError(null);
    } catch (err) {
      console.error('❌ [useLandingPages] Error fetching landing pages:', err);
      setError('Error al cargar las landing pages');
      toast.error('Error al cargar las landing pages');
    } finally {
      setLoading(false);
    }
  };

  const createLandingPage = async (data: Partial<LandingPage>) => {
    try {
      console.log('🔄 [useLandingPages] Creating landing page:', data);
      const response = await landingPageService.createLandingPage(data as any);
      console.log('✅ [useLandingPages] Landing page created:', response);
      toast.success('Landing page creada exitosamente');
      await fetchLandingPages(); // Refresh list
      return response;
    } catch (err) {
      console.error('❌ [useLandingPages] Error creating landing page:', err);
      toast.error('Error al crear la landing page');
      throw err;
    }
  };

  const updateLandingPage = async (id: string, data: Partial<LandingPage>) => {
    try {
      console.log('🔄 [useLandingPages] Updating landing page:', id, data);
      const response = await landingPageService.updateLandingPage(id, data);
      console.log('✅ [useLandingPages] Landing page updated:', response);
      toast.success('Landing page actualizada exitosamente');
      await fetchLandingPages(); // Refresh list
      return response;
    } catch (err) {
      console.error('❌ [useLandingPages] Error updating landing page:', err);
      toast.error('Error al actualizar la landing page');
      throw err;
    }
  };

  const deleteLandingPage = async (id: string) => {
    try {
      console.log('🔄 [useLandingPages] Deleting landing page:', id);
      await landingPageService.deleteLandingPage(id);
      console.log('✅ [useLandingPages] Landing page deleted');
      toast.success('Landing page eliminada exitosamente');
      await fetchLandingPages(); // Refresh list
    } catch (err) {
      console.error('❌ [useLandingPages] Error deleting landing page:', err);
      toast.error('Error al eliminar la landing page');
      throw err;
    }
  };

  const publishLandingPage = async (id: string) => {
    try {
      console.log('🔄 [useLandingPages] Publishing landing page:', id);
      const response = await landingPageService.publishLandingPage(id);
      console.log('✅ [useLandingPages] Landing page published:', response);
      toast.success('Landing page publicada exitosamente');
      await fetchLandingPages(); // Refresh list
      return response;
    } catch (err) {
      console.error('❌ [useLandingPages] Error publishing landing page:', err);
      toast.error('Error al publicar la landing page');
      throw err;
    }
  };

  useEffect(() => {
    fetchLandingPages();
  }, []);

  return {
    landingPages,
    loading,
    error,
    refresh: fetchLandingPages,
    createLandingPage,
    updateLandingPage,
    deleteLandingPage,
    publishLandingPage,
  };
}
