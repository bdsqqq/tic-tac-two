import { DevTool } from '@hookform/devtools';

export const FormDevTool: typeof DevTool = (props) => {
  if (process.env.NODE_ENV === 'production') return null;

  return <DevTool {...props} />;
};
