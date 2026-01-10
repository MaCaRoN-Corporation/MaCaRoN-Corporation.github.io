/**
 * Mapping des techniques vers leurs URLs vidéo
 * Format: "attaque-technique": ["url1", "url2", ...]
 * Chaque technique peut avoir plusieurs URLs vidéo
 */
export interface VideosData {
  [key: string]: string[];
}
