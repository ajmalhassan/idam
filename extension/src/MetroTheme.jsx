import { Theme } from '@pane-ui/react';
// Pane has no teal preset; our CSS supplies its tokens on the green base.
export function MetroTheme({ accent, children }) {
  return (
    <Theme
      mode="dark"
      accent={accent === 'teal' ? 'green' : accent}
      data-metro-accent={accent}
      className="metro-start"
    >
      {children}
    </Theme>
  );
}
