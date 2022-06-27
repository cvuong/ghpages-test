import 'prismjs/themes/prism-okaidia.css';
import 'prismjs';

import Prism from 'react-prism';

type Props = {
  children: React.ReactNode;
  path: string;
};

// function Snippet({ code, path }: Props) {
function Snippet(props: Props) {
  const { children, path } = props;
  console.log('snippet props', props);
  // TODO: parse the path to get the language
  const language = 'javascript';
  return (
    <Prism
      key={language}
      component="pre"
      className={`language-${language} rounded-md`}
    >
      {children}
    </Prism>
  );
}

export default Snippet;
