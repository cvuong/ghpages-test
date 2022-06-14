import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

import fs, { readdir } from 'fs';

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

  // git fetch
  execSync('git fetch');

  // git switch
  // TODO: need to be able to pass in a branch name
  execSync('git switch -f gh-pages');

  // move files from temp directory to the root
  try {
    await fse.move(tempShaDir, path.resolve('./'));
  } catch (e) {
    console.error(e);
  }

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
