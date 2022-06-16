import * as core from '@actions/core';
import * as github from '@actions/github';

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
// TODO: make sure we automatically generate this
const docsRootUrl = 'https://cvuong.github.io/ghpages-test';

(async function () {
  const username = core.getInput('username') || DEFAULTS.USERNAME;
  const email = core.getInput('email') || DEFAULTS.EMAIL;
  const timeout = parseInt(core.getInput('timeout')) || DEFAULTS.TIMEOUT;
  const pagesBranch = core.getInput('pagesBranch') || DEFAULTS.PAGES_BRANCH;

  const context = github.context;
  console.log('context', context);
  const {
    repo: { owner, repo },
  } = context;

  console.log('owner', owner);
  console.log('repo', repo);

  // const [organization, branch] = full_name.split('/');

  const docsRootUrl = `https://${organization}.github.io/${branch}`;
  console.log('doc roots url', docsRootUrl);

  process.exit(1);

  const shortSha = execSync('git rev-parse --short HEAD').toString().trim();
  const sourceDir = path.join(__dirname, '..', '/static');
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
  const endTime = startTime + timeout;

  const docsUrl = docsRootUrl + '/' + shortSha;

  const timer = setInterval(async () => {
    let res;

    try {
      res = await axios.get(docsUrl);
    } catch (e) {
      console.log('Waiting for docs to be deployed on', docsUrl);
      // console.log('here is the res', res);
      // console.error(e);
    }

    if (res && res.status === 200) {
      console.log('We successfully deployed the docs.');
      clearInterval(timer);
    }

    if (Date.now() > endTime) {
      console.error('We were unable to deploy the docs.');
      process.exit(1);
    }
  }, 3000);
})();
