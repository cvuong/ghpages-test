import { Tag, nodes } from '@markdoc/markdoc';

import type { Schema } from '@markdoc/markdoc';

const heading: Schema = {
  render: 'Heading',
  transform(node, config) {
    return new Tag(
      'Heading',
      { ...node.transformAttributes(config), level: node.attributes['level'] },
      node.transformChildren(config)
    );
  },
};

const paragraph: Schema = {
  render: 'Paragraph',
};

const blockquote: Schema = {
  render: 'Blockquote',
};

const link: Schema = {
  render: 'Link',
};

const config = {
  nodes: {
    blockquote,
    heading,
    link,
    paragraph,
  },
};

export default config;
