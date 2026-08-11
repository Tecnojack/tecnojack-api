export interface GallerySettingsProps {
  allowDownload?: boolean;
  allowFavorites?: boolean;
  allowComments?: boolean;
  password?: string | null;
}

export class GallerySettings {
  readonly allowDownload: boolean;
  readonly allowFavorites: boolean;
  readonly allowComments: boolean;
  readonly password: string | null;

  constructor(props: GallerySettingsProps = {}) {
    this.allowDownload = props.allowDownload ?? false;
    this.allowFavorites = props.allowFavorites ?? false;
    this.allowComments = props.allowComments ?? false;
    this.password = props.password?.trim() ?? null;
  }
}
