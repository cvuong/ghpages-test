import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

import { context } from '../dist';
import fs from 'fs';
import fse from 'fs-extra';
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
  const token = core.getInput('token');
  const context = github.context;
  const shortSha = context.sha;
  console.log('context', context);

  const sourceDir = 'static/';

  try {
    const copyOutput = await fse.copySync(sourceDir, tempDir);
    console.log('copyOutput', copyOutput);
  } catch (e) {
    console.error(e);
  }

  try {
    const readdirOutput = await fs.promises.readdir(tempDir);
    console.log('dir output', readdirOutput);
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
