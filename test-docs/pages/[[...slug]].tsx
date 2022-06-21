import { GetStaticPaths, GetStaticProps } from 'next';

import Head from 'next/head';
import Heading from '../components/Heading';
import Image from 'next/image';
import Markdoc from '@markdoc/markdoc';
import type { NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import components from '../components';
import config from '../schema';
import fs from 'fs';
import glob from 'glob-promise';
import path from 'path';
import styles from '../styles/Home.module.css';

type Props = {
  source: string;
  content: string;
};

interface Params extends ParsedUrlQuery {
  docPath: string;
  slug: string[];
}

const baseDocsDir = path.join(process.cwd(), '..', 'docs');

function getSlugFromPath(relPath: string) {
  const slug = relPath.replace('.md', '').split('/').slice(1);
  const filename = slug[slug.length - 1];

  // remove index and only keep the directory name
  if (filename === 'index') {
    slug.pop();
  }

  return slug;
}

function getPathFromSlug(slug: string[]) {
  const relPath = slug.join('/');
  let fullPath = path.join(baseDocsDir, relPath);
  if (fs.existsSync(fullPath)) {
    // we know we have a directory, so get the child index.md from that directory
    fullPath += '/index.md';
  } else {
    // we know we have a file
    fullPath += '.md';
  }
  return fullPath;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const docPaths = await glob(path.join(baseDocsDir, '**/*.md'));

  const paths = docPaths.map((docPath: string) => {
    const relPath = docPath.substring(baseDocsDir.length);
    const slug = getSlugFromPath(relPath);
    return { params: { slug } };
  });
  console.log('getStaticPaths paths', JSON.stringify(paths));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const { params } = context;
  console.log('getStaticProps params', params);
  // default slug to be empty for the case where we are in the top level directory's index.md
  const slug = params?.slug || [];
  const fullPath = getPathFromSlug(slug);
  const source = fs.readFileSync(fullPath, 'utf-8');

  const ast = Markdoc.parse(source);
  const content = JSON.stringify(Markdoc.transform(ast, config));

  return {
    props: {
      source,
      content,
    },
  };
};

const Home: NextPage<Props> = (props) => {
  const { source, content } = props;
  const parsedContent = JSON.parse(content);
  console.log('here are the props', props);

  return (
    // <div>{Markdoc.renderers.react(parsedContent, React, { components })}</div>
    <div>
      {Markdoc.renderers.react(parsedContent, React, {
        components: { Heading },
      })}
    </div>
  );
};

export default Home;
