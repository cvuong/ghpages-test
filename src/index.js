import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

import fs, { readdir } from 'fs';

import axios from 'axios';
import { context } from '../dist';
import { execSync } from 'child_process';
import fse from 'fs-extra';
import path from 'path';
import tempDir from 'temp-dir';

// import ghpages from 'gh-pages';

// (async function () {
//   function ghPagesPromise() {
//     return new Promise((resolve, reject) => {
//       ghpages.publish(
//         'static',
//         {
//           repo: 'https://github.com/cvuong/ghpages-test.git',
//           user: {
//             name: 'github-actions-bot',
//             email: 'test@test.com',
//           },
//           dest: 'blah1',
//         },
//         (err) => {
//           if (err) {
//             reject(err);
//             return;
//           }
//           resolve();
//         }
//       );
//     });
//   }

//   const res = await ghPagesPromise();
//   if (!res) {
//     console.log('Success');
//   } else {
//     console.log('Error');
//   }
// })();

const userEmail = 'test@test.com';
const userName = 'docs-bot';
const { CI } = process.env;
// TODO: make sure we automatically generate this
const docsRootUrl = 'https://cvuong.github.io/ghpages-test';
const timeout = 30 * 1000; // 10 s

(async function () {
  // const token = core.getInput('token');
  // const context = github.context;
  // const shortSha = context.sha;
  const shortSha = execSync('git rev-parse --short HEAD').toString().trim();
  console.log('shortSha', shortSha);
  const sourceDir = path.join(__dirname, '..', '/static');
  // console.log(path.join(__dirname, '..', '..', 'aaaa'));
  // console.log(path.join(__dirname, '..', '/static'));

  const tempShaDir = path.join(tempDir, shortSha);
  console.log('tempShaDir', tempShaDir);

  try {
    await fse.mkdirp(tempShaDir);
  } catch (e) {
    console.error(e);
  }

  try {
    const copyOutput = await fse.copy(sourceDir, tempShaDir);
    console.log('copyOutput', copyOutput);
  } catch (e) {
    console.error(e);
  }

  try {
    const readdirOutput = await fs.promises.readdir(tempShaDir);
    console.log('readdirOutput', readdirOutput);
  } catch (e) {
    console.error(e);
  }

  if (CI) {
    execSync(`git config --global user.email "${userEmail}"`);
    execSync(`git config --global user.name "${userName}"`);
  }

  // git fetch
  execSync('git fetch');

  // git switch
  // TODO: need to be able to pass in a branch name
  execSync('git switch -f gh-pages');

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
    console.log('waiting on url', docsUrl);
    const res = await axios.get(docsUrl);
    if (res.status === 200) {
      console.log('we have a success');
      clearInterval(timer);
    }

    if (Date.now() > endTime) {
      console.log('failure');
      clearInterval(timer);
    }
  }, 3000);

  // remove node modules by cleaning everything

  // add new folder with commit

  // copy static to the temp directory
  // const octokit = github.getOctokit(token);
  // const newIssue = await octokit.rest.issues.create({
  //   ...context.repo,
  //   title: 'new issue',
  //   body: 'hi there',
  // });
  // const ref = await octokit.rest.git.createRef({
  //   ...context.repo,
  //   ref: 'refs/heads/blah',
  //   sha: '1234'
  // });
})();
