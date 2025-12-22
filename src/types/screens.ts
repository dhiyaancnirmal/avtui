// Screen navigation and state types

export type ScreenName =
  | 'welcome'
  | 'file-select'
  | 'settings'
  | 'converting'
  | 'success'
  | 'error';

export interface NavigationState {
  currentScreen: ScreenName;
  previousScreen: ScreenName | null;
  history: ScreenName[];
}

export interface ScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onBack: () => void;
  onQuit: () => void;
}
