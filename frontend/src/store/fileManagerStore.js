/**
 * État UI de l'explorateur — dossier courant, fil d'Ariane, mode d'affichage
 */
import { create } from 'zustand';

export const useFileManagerStore = create((set, get) => ({
  currentFolderId: null,
  breadcrumbs: [{ label: 'Mes fichiers', folderId: null }],
  viewMode: 'grid',

  setViewMode: (viewMode) => set({ viewMode }),

  openFolder: (folder) => {
    const crumbs = [...get().breadcrumbs];
    if (!crumbs.some((c) => c.folderId === folder.id)) {
      crumbs.push({ label: folder.name, folderId: folder.id });
    }
    set({ currentFolderId: folder.id, breadcrumbs: crumbs });
  },

  navigateToBreadcrumb: (index) => {
    const crumbs = get().breadcrumbs.slice(0, index + 1);
    const target = crumbs[crumbs.length - 1];
    set({
      breadcrumbs: crumbs,
      currentFolderId: target.folderId,
    });
  },

  resetToRoot: () =>
    set({
      currentFolderId: null,
      breadcrumbs: [{ label: 'Mes fichiers', folderId: null }],
    }),
}));
