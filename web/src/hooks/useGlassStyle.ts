import { useConfig } from '../providers/ConfigProvider';

export type GlassStyle = {
  mainBackground: string;
  lightBackground: string;
  border: string;
  shadow: string;
  textureOverlay: string;
  isDarkMode: boolean;
};

export const useGlassStyle = () => {
  const { config } = useConfig();

  const getMainBackground = () => {
    if (config.darkMode) {
      return `
        linear-gradient(135deg, 
          rgba(45, 45, 45, 0.85) 0%,
          rgba(35, 35, 35, 0.75) 25%,
          rgba(40, 40, 40, 0.90) 50%,
          rgba(30, 30, 30, 0.95) 75%,
          rgba(38, 38, 38, 0.80) 100%
        ),
        linear-gradient(45deg,
          rgba(50, 50, 50, 0.7) 0%,
          rgba(42, 42, 42, 0.8) 50%,
          rgba(35, 35, 35, 0.9) 100%
        )
      `;
    }
    return `
      linear-gradient(160deg, 
        rgba(255, 255, 255, 0.18) 0%,
        rgba(255, 255, 255, 0.12) 50%,
        rgba(255, 255, 255, 0.15) 100%
      ),
      linear-gradient(20deg,
        rgba(255, 255, 255, 0.20) 0%,
        rgba(255, 255, 255, 0.25) 50%,
        rgba(255, 255, 255, 0.22) 100%
      )
    `;
  };

  const getLightBackground = () => {
    if (config.darkMode) {
      return `
        linear-gradient(135deg, 
          rgba(0, 0, 0, 0.45) 0%,
          rgba(20, 20, 20, 0.35) 25%,
          rgba(10, 10, 10, 0.55) 50%,
          rgba(0, 0, 0, 0.65) 75%,
          rgba(5, 5, 5, 0.50) 100%
        ),
        linear-gradient(45deg,
          rgba(30, 30, 30, 0.4) 0%,
          rgba(15, 15, 15, 0.5) 50%,
          rgba(0, 0, 0, 0.6) 100%
        )
      `;
    }
    return `
      linear-gradient(160deg, 
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 255, 255, 0.05) 50%,
        rgba(255, 255, 255, 0.06) 100%
      ),
      linear-gradient(20deg,
        rgba(255, 255, 255, 0.10) 0%,
        rgba(255, 255, 255, 0.12) 50%,
        rgba(255, 255, 255, 0.11) 100%
      )
    `;
  };

  const getBorder = () => {
    return config.darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.18)';
  };

  const getShadow = () => {
    if (config.darkMode) {
      return `
        0 12px 40px rgba(0, 0, 0, 0.8),
        0 6px 20px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(0, 0, 0, 0.4)
      `;
    }
    return `
      0 12px 40px rgba(0, 0, 0, 0.5),
      0 6px 20px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2)
    `;
  };

  const getTextureOverlay = () => {
    if (config.darkMode) {
      return `
        radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.04) 0%, transparent 30%)
      `;
    }
    return `
      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.06) 0%, transparent 40%)
    `;
  };

  return {
    mainBackground: getMainBackground(),
    lightBackground: getLightBackground(),
    border: getBorder(),
    shadow: getShadow(),
    textureOverlay: getTextureOverlay(),
    isDarkMode: config.darkMode,
  };
};