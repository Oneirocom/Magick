// WelcomeScreen.jsx
import { IWatermarkPanelProps } from 'dockview';
import Logo from './blue-gradient-lm.svg'

const WelcomeScreen = (props: IWatermarkPanelProps) => {
  const isGroup = props.containerApi.groups.length > 0;

  if (isGroup) return null;

  return (
    <div className="flex items-center justify-center h-screen [background:var(--gradient-5)]">
      <div className="text-center text-white">
        {/* Circle logo */}
        <img src={Logo} alt="Magick Logo" className="w-40 h-40 mx-auto mb-4" />

        {/* Welcome Text */}
        <h1 className="text-5xl mb-5">Welcome to Magick!</h1>
        <p className="max-w-lg mx-auto">
          Magick is a visual programming environment designed to help you build applications and agents on top of AI models. Magick is still in its infancy and can only improve through feedback and participation by people like you!
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;