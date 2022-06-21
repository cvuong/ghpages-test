import { Tag, nodes } from '@markdoc/markdoc';

import type { Schema } from '@markdoc/markdoc';

const headingClass: Record<string, any> = {
  h1: 'font-bold mt-24 text-6xl',
  h2: 'font-bold mt-24 text-2xl',
  h3: 'mt-4 text-slate-500 text-xl',
};

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

const config = {
  nodes: {
    heading,
  },
};

export default config;
