/**
 * Logique métier — statistiques et aperçu pour le tableau de bord
 */
const fileRepository = require('../repositories/file.repository');
const folderRepository = require('../repositories/folder.repository');
const folderShareRepository = require('../repositories/folderShare.repository');
const { serializeFile } = require('./file.service');

const QUOTA_BYTES = 15n * 1024n * 1024n * 1024n; // 15 Go

function categorizeMime(mimeType = '') {
  if (mimeType.startsWith('image/')) return 'images';
  if (mimeType.startsWith('video/')) return 'videos';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('text') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation')
  ) {
    return 'documents';
  }
  return 'other';
}

function buildStorageBreakdown(files) {
  const breakdown = { documents: 0n, images: 0n, videos: 0n, audio: 0n, other: 0n };
  for (const file of files) {
    const cat = categorizeMime(file.mimeType);
    breakdown[cat] += BigInt(file.size);
  }
  return Object.fromEntries(
    Object.entries(breakdown).map(([k, v]) => [k, v.toString()])
  );
}

async function getDashboard(ownerId) {
  const [stats, recentFiles, rootFolders, sharedWithMe, allFiles] = await Promise.all([
    fileRepository.aggregateStats(ownerId),
    fileRepository.findRecent(ownerId, 5),
    folderRepository.findRootFolders(ownerId),
    folderShareRepository.listSharedWithUser(ownerId),
    fileRepository.findAllActive(ownerId),
  ]);

  const folderCount = await folderRepository.countByOwner(ownerId);
  const usedBytes = BigInt(stats.totalSize.toString());
  const quotaBytes = QUOTA_BYTES;
  const availableBytes = quotaBytes > usedBytes ? quotaBytes - usedBytes : 0n;

  return {
    stats: {
      fileCount: stats.fileCount,
      folderCount,
      trashCount: stats.trashCount,
      totalSizeBytes: usedBytes.toString(),
      quotaBytes: quotaBytes.toString(),
      availableBytes: availableBytes.toString(),
      usedPercent: Number((usedBytes * 10000n) / quotaBytes) / 100,
    },
    storageByCategory: buildStorageBreakdown(allFiles),
    recentFiles: recentFiles.map(serializeFile),
    rootFolders,
    sharedWithMe,
  };
}

module.exports = { getDashboard };
