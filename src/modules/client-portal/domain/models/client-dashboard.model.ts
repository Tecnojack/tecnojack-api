export interface ClientEventSummaryModel {
  id: string;
  code: string;
  name: string;
  slug: string | null;
  lifecycleStatus: string;
  productionPhase: string;
  dateStatus: string;
  priority: string;
  timezone: string;
  estimatedStartAt: Date | null;
  estimatedEndAt: Date | null;
  confirmedStartAt: Date | null;
  confirmedEndAt: Date | null;
  briefSummary: string | null;
  completedAt: Date | null;
}

export interface ClientParticipantSummaryModel {
  id: string;
  displayName: string;
  role: string;
  email?: string | null;
  phone?: string | null;
}

export interface ClientGallerySummaryModel {
  id: string;
  code: string;
  name: string;
  slug: string | null;
  description: string | null;
  coverMediaAssetId: string | null;
  allowDownload: boolean;
  allowFavorites: boolean;
  allowComments: boolean;
  publishedAt: Date | null;
  albumCount: number;
  assetCount: number;
}

export interface ClientDeliverableItemModel {
  id: string;
  title: string;
  description: string | null;
  quantity: number;
  isCompleted: boolean;
}

export interface ClientDeliverableSummaryModel {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  deliveryMethod: string;
  estimatedDeliveryAt: Date | null;
  deliveredAt: Date | null;
  trackingNumber: string | null;
  deliveryNotes: string | null;
  items: ClientDeliverableItemModel[];
}

export interface ClientTimelineItemModel {
  id: string;
  title: string;
  type: string;
  status: string;
  date: Date | null;
  description: string | null;
}

export interface ClientNextActionModel {
  id: string;
  title: string;
  description: string;
  category: 'GALLERY' | 'DELIVERABLE' | 'EVENT_SESSION' | 'GENERAL';
  actionUrl?: string;
}

export interface ClientDashboardModel {
  event: ClientEventSummaryModel;
  progressPercentage: number;
  participants: ClientParticipantSummaryModel[];
  publishedGalleries: ClientGallerySummaryModel[];
  deliverables: ClientDeliverableSummaryModel[];
  timeline: ClientTimelineItemModel[];
  nextActions: ClientNextActionModel[];
}
