import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

import { context } from '../dist';

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
  console.log('context', context);
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
