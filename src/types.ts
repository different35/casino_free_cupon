export interface CollectedCoupon {
  id: string;
  code: string;
  source: string;
  chatId: number;
  messageId: number;
  fullText: string;
  collectedAt: Date;
  status: 'new' | 'used' | 'expired' | 'saved';
  copied: boolean;
}

export interface BotConfig {
  token: string;
  botUsername: string;
  monitoredChannels: string[];
}

export interface CollectorStats {
  messagesScanned: number;
  codesFound: number;
}
