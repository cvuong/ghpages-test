import type { RenderableTreeNode, Schema } from '@markdoc/markdoc';

import { Tag } from '@markdoc/markdoc';
import fs from 'fs';
// import readline from 'readline';
import lineByLine from 'n-readlines';
import pathPkg from 'path';

// TODO: do this in a more performant way
// TODO: need to support more languages
const START = '/* start */';
const END = '/* end */';

// function getContentFromPath(path: string) {
//   return async () => {
//     // TODO: switch this out to use the GH actions docs path
//     const baseDocsDir = pathPkg.join(process.cwd(), '..', 'docs');
//     const fullPath = pathPkg.join(baseDocsDir, path);
//     console.log('fullPath');
//     // TODO: switch this out to use the GH actions docs path
//     const stream = fs.createReadStream(fullPath);
//     const lineReader = readline.createInterface({
//       input: stream,
//       crlfDelay: Infinity,
//     });

//     let source = '';
//     let isWriting = false;

//     for await (const line of lineReader) {
//       if (line === END) {
//         isWriting = false;
//       }

//       source += line;

//       if (line === START) {
//         isWriting = true;
//       }
//     }

//     return source;
//   };
// }

function getContentFromPath(path: string) {
  // TODO: switch this out to use the GH actions docs path
  const baseDocsDir = pathPkg.join(process.cwd(), '..', 'docs');
  const fullPath = pathPkg.join(baseDocsDir, path);
  console.log('fullPath', fullPath);
  // TODO: switch this out to use the GH actions docs path
  const stream = fs.createReadStream(fullPath);

  let source = '';
  const liner = new lineByLine(fullPath);
  let line;
  while ((line = liner.next())) {
    source += line + '\n';
  }

  return source;
}

export const snippet: Schema = {
  render: 'Snippet',
  description: 'Import a code snippet from the local filesystem',
  attributes: {
    path: {
      type: String,
      description:
        'Path (relative to the docs folder) to the code snippet file',
    },
  },
  transform(node, config): RenderableTreeNode {
    const attributes = {
      ...node.transformAttributes(config),
    };
    const { path } = attributes;
    const content = getContentFromPath(path);
    return new Tag('Snippet', attributes, [content]);
  },
};
