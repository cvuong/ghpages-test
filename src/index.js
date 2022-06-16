import * as core from '@actions/core';
import * as github from '@actions/github';

import Markdoc from '@markdoc/markdoc';
import axios from 'axios';
import { execSync } from 'child_process';
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import tempDir from 'temp-dir';

const DEFAULTS = {
  USERNAME: 'docs-bot',
  EMAIL: 'test@test.com',
  TIMEOUT: 60,
  PAGES_BRANCH: 'gh-pages',
};

const { CI } = process.env;

(async function () {
  // TODO: Need to programmatically read all docs
  const mdPath = path.resolve(__dirname, '..', 'docs', 'index.md');
  console.log('mdPath', mdPath);
  const source = await fs.promises.readFile(mdPath, { encoding: 'utf-8' });
  console.log('source', source);
  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast);
  const html = Markdoc.renderers.html(content);
  console.log('html', html);
  const writeDirPath = path.resolve(__dirname, '..', 'static', 'docs');
  console.log('writeDirPath', writeDirPath);
  const writePath = path.join(writeDirPath, 'index.html');
  console.log('writePath', writePath);
  try {
    await fse.mkdirp(writeDirPath);
  } catch (e) {
    console.error(e);
  }

  try {
    await fs.promises.writeFile(writePath, html, { flag: 'a' });
  } catch (e) {
    console.error(e);
  }
  console.log('html', html);

  const username = core.getInput('username') || DEFAULTS.USERNAME;
  const email = core.getInput('email') || DEFAULTS.EMAIL;
  const timeout = parseInt(core.getInput('timeout')) || DEFAULTS.TIMEOUT;
  const pagesBranch = core.getInput('pagesBranch') || DEFAULTS.PAGES_BRANCH;

  const context = github.context;
  const {
    repo: { owner, repo },
  } = context;

  const docsRootUrl = `https://${owner}.github.io/${repo}`;

  const shortSha = execSync('git rev-parse --short HEAD').toString().trim();
  const sourceDir = path.join(__dirname, '..', 'static', 'docs');
  console.log('sourceDir', sourceDir);
  const tempShaDir = path.join(tempDir, shortSha);

  try {
    await fse.mkdirp(tempShaDir);
  } catch (e) {
    console.error(e);
  }

  try {
    await fse.copy(sourceDir, tempShaDir);
  } catch (e) {
    console.error(e);
  }

  try {
    await fs.promises.readdir(tempShaDir);
  } catch (e) {
    console.error(e);
  }

  if (CI) {
    execSync(`git config --global user.email "${email}"`);
    execSync(`git config --global user.name "${username}"`);
  }

  // git fetch
  execSync('git fetch');

  // git switch
  execSync(`git switch -f ${pagesBranch}`);

  execSync('git clean -f -d');

  // move files from temp directory to the root
  const newDir = path.join('.', shortSha);
  try {
    await fse.move(tempShaDir, newDir);
  } catch (e) {
    console.error(e);
  }

  execSync('git add .');

  execSync(`git commit -m ${shortSha}`);

  execSync('git push');

  const startTime = Date.now();
  const endTime = startTime + timeout * 1000;

  const docsUrl = docsRootUrl + '/' + shortSha;

  const timer = setInterval(async () => {
    let res;

    try {
      res = await axios.get(docsUrl);
    } catch (e) {
      console.log(`Waiting for docs(${docsUrl}) to be deployed...`);
    }

    if (res && res.status === 200) {
      console.log('We successfully deployed the docs on', docsUrl);
      clearInterval(timer);
    }

    if (Date.now() > endTime) {
      console.error('We were unable to deploy the docs.');
      process.exit(1);
    }
  }, 3000);
})();
